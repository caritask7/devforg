"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/data";
import {
  fieldErrorsFromZod,
  missionSubmissionSchema,
  type FormState,
} from "@/lib/validation";
import type { MissionProgressStatus } from "@/lib/types";

function revalidateMission(missionSlug: string) {
  revalidatePath("/dashboard");
  revalidatePath("/missions");
  revalidatePath(`/missions/${missionSlug}`);
  revalidatePath("/competences");
  revalidatePath("/portfolio");
}

function readMissionForm(formData: FormData) {
  return {
    missionSlug: String(formData.get("missionSlug") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    submissionUrl: String(formData.get("submissionUrl") ?? ""),
  };
}

async function persistMissionSubmission(
  mode: "draft" | "submit",
  formData: FormData,
): Promise<FormState> {
  const parsed = missionSubmissionSchema.safeParse(readMissionForm(formData));
  if (!parsed.success) {
    return {
      error: "Vérifiez les champs.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  if (mode === "submit" && !parsed.data.submissionUrl) {
    return {
      error: "Ajoutez le lien de votre travail avant de soumettre la mission.",
      fieldErrors: { submissionUrl: ["Un lien est requis pour la soumission."] },
    };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "Session expirée. Reconnectez-vous." };

  const mission = await repository.getMission(parsed.data.missionSlug);
  if (!mission) return { error: "Mission introuvable." };

  try {
    await repository.updateMissionProgress(user.id, mission.slug, {
      ...(mode === "submit" ? { status: "submitted" as const } : {}),
      notes: parsed.data.notes,
      submissionUrl: parsed.data.submissionUrl,
    });
  } catch {
    return {
      error:
        mode === "submit"
          ? "La soumission a échoué. Réessayez."
          : "L'enregistrement du brouillon a échoué.",
    };
  }

  revalidateMission(mission.slug);
  return {
    success:
      mode === "submit"
        ? "Mission soumise. Elle peut maintenant être marquée comme terminée."
        : "Brouillon enregistré.",
  };
}

export async function saveMissionDraftAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  return persistMissionSubmission("draft", formData);
}

export async function submitMissionAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  return persistMissionSubmission("submit", formData);
}

/** Action unique du formulaire de mission : brouillon ou soumission. */
export async function missionWorkspaceAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const intent = String(formData.get("intent") ?? "draft");
  return persistMissionSubmission(intent === "submit" ? "submit" : "draft", formData);
}

export async function setMissionStatusAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const missionSlug = String(formData.get("missionSlug") ?? "");
  const status = String(formData.get("status") ?? "") as MissionProgressStatus;
  const allowed: MissionProgressStatus[] = [
    "todo",
    "in_progress",
    "submitted",
    "completed",
  ];
  if (!missionSlug || !allowed.includes(status)) return;

  const mission = await repository.getMission(missionSlug);
  if (!mission) return;

  await repository.updateMissionProgress(user.id, missionSlug, { status });
  revalidateMission(missionSlug);
}
