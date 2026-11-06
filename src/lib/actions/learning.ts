"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/data";

function revalidateLearningPaths(moduleSlug?: string, lessonSlug?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/parcours");
  revalidatePath("/modules");
  if (moduleSlug) revalidatePath(`/modules/${moduleSlug}`);
  if (lessonSlug) revalidatePath(`/lecons/${lessonSlug}`);
}

/** Enregistre l'ouverture d'une leçon (reprise + dernière consultation). */
export async function markLessonViewedAction(lessonSlug: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  try {
    await repository.markLessonStarted(user.id, lessonSlug);
  } catch {
    // L'ouverture d'une leçon ne doit jamais bloquer la lecture.
  }
}

export async function completeLessonAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const lessonSlug = String(formData.get("lessonSlug") ?? "");
  if (!lessonSlug) return;

  const lesson = await repository.getLesson(lessonSlug);
  if (!lesson) return;

  await repository.completeLesson(user.id, lessonSlug);
  revalidateLearningPaths(lesson.moduleSlug, lessonSlug);

  const redirectTo = formData.get("redirectTo");
  if (typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
    redirect(redirectTo);
  }
}

export async function resetLessonAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const lessonSlug = String(formData.get("lessonSlug") ?? "");
  if (!lessonSlug) return;

  const lesson = await repository.getLesson(lessonSlug);
  await repository.resetLesson(user.id, lessonSlug);
  revalidateLearningPaths(lesson?.moduleSlug, lessonSlug);
}
