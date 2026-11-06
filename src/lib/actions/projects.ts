"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/data";
import type { MilestoneStatus } from "@/lib/types";
import { parseCommaList } from "@/lib/utils";
import { fieldErrorsFromZod, projectSchema, type FormState } from "@/lib/validation";

function readProjectForm(formData: FormData) {
  const titles = formData.getAll("milestoneTitle").map((value) => String(value));
  const descriptions = formData
    .getAll("milestoneDescription")
    .map((value) => String(value));

  return {
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "idea"),
    technologies: parseCommaList(String(formData.get("technologies") ?? "")),
    githubUrl: String(formData.get("githubUrl") ?? ""),
    demoUrl: String(formData.get("demoUrl") ?? ""),
    results: String(formData.get("results") ?? ""),
    milestones: titles
      .map((title, index) => ({
        title: title.trim(),
        description: (descriptions[index] ?? "").trim(),
      }))
      .filter((milestone) => milestone.title.length > 0),
  };
}

function revalidateProjectSurfaces(projectId?: string) {
  revalidatePath("/projets");
  revalidatePath("/portfolio");
  revalidatePath("/dashboard");
  if (projectId) revalidatePath(`/projets/${projectId}`);
}

export async function createProjectAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = projectSchema.safeParse(readProjectForm(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "Session expirée. Reconnectez-vous." };

  let projectId: string;
  try {
    const project = await repository.createProject(user.id, parsed.data);
    projectId = project.id;
  } catch {
    return { error: "La création du projet a échoué. Réessayez." };
  }

  revalidateProjectSurfaces(projectId);
  redirect(`/projets/${projectId}`);
}

export async function updateProjectAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return { error: "Projet introuvable." };

  const parsed = projectSchema.safeParse(readProjectForm(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez les champs du formulaire.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "Session expirée. Reconnectez-vous." };

  try {
    await repository.updateProject(user.id, projectId, parsed.data);
  } catch {
    return { error: "La mise à jour du projet a échoué. Vérifiez qu'il vous appartient." };
  }

  revalidateProjectSurfaces(projectId);
  redirect(`/projets/${projectId}`);
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return;

  await repository.deleteProject(user.id, projectId);
  revalidateProjectSurfaces(projectId);
  redirect("/projets");
}

export async function setMilestoneStatusAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const projectId = String(formData.get("projectId") ?? "");
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const status = String(formData.get("status") ?? "") as MilestoneStatus;

  if (!projectId || !milestoneId) return;
  if (!["todo", "in_progress", "done"].includes(status)) return;

  const project = await repository.getProject(user.id, projectId);
  if (!project) return;

  await repository.setMilestoneStatus(user.id, projectId, milestoneId, status);
  revalidateProjectSurfaces(projectId);
}
