import type {
  Difficulty,
  LessonProgressStatus,
  MilestoneStatus,
  MissionCategory,
  MissionProgressStatus,
  ProjectStatus,
  SkillLevel,
} from "@/lib/types";

export const difficultyLabels: Record<Difficulty, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export const lessonStatusLabels: Record<LessonProgressStatus, string> = {
  not_started: "À commencer",
  in_progress: "En cours",
  completed: "Terminée",
};

export const missionCategoryLabels: Record<MissionCategory, string> = {
  exercice: "Exercice pratique",
  defi: "Défi technique",
  evaluation: "Évaluation",
};

export const missionStatusLabels: Record<MissionProgressStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  submitted: "Soumise",
  completed: "Terminée",
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  idea: "Idée",
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
};

export const milestoneStatusLabels: Record<MilestoneStatus, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
};

export const skillLevelLabels: Record<SkillLevel, string> = {
  not_started: "Non commencé",
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export const skillLevelValues: SkillLevel[] = [
  "not_started",
  "beginner",
  "intermediate",
  "advanced",
];

/** Niveau atteint selon le nombre de validations concrètes (missions terminées). */
export function levelFromValidations(count: number): SkillLevel {
  if (count >= 4) return "advanced";
  if (count >= 2) return "intermediate";
  if (count >= 1) return "beginner";
  return "not_started";
}

export function progressFromLevel(level: SkillLevel): number {
  switch (level) {
    case "advanced":
      return 90;
    case "intermediate":
      return 65;
    case "beginner":
      return 35;
    default:
      return 0;
  }
}

export const missionCategoryOrder: MissionCategory[] = [
  "exercice",
  "defi",
  "evaluation",
];

export const difficultyOrder: Difficulty[] = [
  "debutant",
  "intermediaire",
  "avance",
];

export const projectStatusOrder: ProjectStatus[] = [
  "idea",
  "todo",
  "in_progress",
  "done",
];

export const missionStatusOrder: MissionProgressStatus[] = [
  "todo",
  "in_progress",
  "submitted",
  "completed",
];
