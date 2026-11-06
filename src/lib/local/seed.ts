import type {
  LessonProgress,
  MissionProgress,
  Profile,
  Project,
  UserSkillProgress,
} from "@/lib/types";

export interface LocalUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface LocalSession {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface LocalResetToken {
  token: string;
  userId: string;
  expiresAt: string;
}

export type LocalLessonProgress = LessonProgress & { userId: string };
export type LocalMissionProgress = MissionProgress & { userId: string };
export type LocalProject = Project & { userId: string };
export type LocalSkillProgress = UserSkillProgress & { userId: string };

export interface LocalDatabase {
  version: 1;
  users: LocalUser[];
  sessions: LocalSession[];
  resetTokens: LocalResetToken[];
  profiles: Profile[];
  lessonProgress: LocalLessonProgress[];
  missionProgress: LocalMissionProgress[];
  projects: LocalProject[];
  skillProgress: LocalSkillProgress[];
}

/**
 * Base locale vide : aucun compte, aucune progression et aucun projet pré-installés.
 * Chaque compte est créé par l'inscription réelle de l'apprenant.
 */
export function createEmptyDatabase(): LocalDatabase {
  return {
    version: 1,
    users: [],
    sessions: [],
    resetTokens: [],
    profiles: [],
    lessonProgress: [],
    missionProgress: [],
    projects: [],
    skillProgress: [],
  };
}
