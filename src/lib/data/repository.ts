import type {
  AuthUser,
  Lesson,
  LessonProgress,
  MilestoneStatus,
  Mission,
  MissionProgress,
  MissionProgressStatus,
  Module,
  Phase,
  Profile,
  Project,
  ProjectInput,
  Skill,
  SkillCategory,
  UserSkillProgress,
} from "@/lib/types";

export interface ProfileInput {
  fullName: string;
  headline: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  avatarUrl: string;
  dailyGoalMinutes: number;
}

export interface MissionProgressPatch {
  status?: MissionProgressStatus;
  notes?: string;
  submissionUrl?: string;
  score?: number | null;
}

export interface DataRepository {
  /** Crée le profil s'il n'existe pas encore. */
  ensureProfile(user: AuthUser): Promise<Profile>;
  updateProfile(userId: string, input: ProfileInput): Promise<Profile>;

  getPhases(): Promise<Phase[]>;
  getModules(): Promise<Module[]>;
  getModule(slug: string): Promise<Module | null>;
  getLessons(moduleSlug: string): Promise<Lesson[]>;
  getLessonIndex(): Promise<Lesson[]>;
  getLesson(slug: string): Promise<Lesson | null>;
  getMissions(): Promise<Mission[]>;
  getMission(slug: string): Promise<Mission | null>;
  getSkillCategories(): Promise<SkillCategory[]>;
  getSkills(): Promise<Skill[]>;

  getLessonProgress(userId: string): Promise<LessonProgress[]>;
  markLessonStarted(userId: string, lessonSlug: string): Promise<void>;
  completeLesson(userId: string, lessonSlug: string): Promise<void>;
  resetLesson(userId: string, lessonSlug: string): Promise<void>;

  getMissionProgress(userId: string): Promise<MissionProgress[]>;
  updateMissionProgress(
    userId: string,
    missionSlug: string,
    patch: MissionProgressPatch,
  ): Promise<void>;

  getSkillProgress(userId: string): Promise<UserSkillProgress[]>;
  syncSkills(userId: string): Promise<UserSkillProgress[]>;

  listProjects(userId: string): Promise<Project[]>;
  getProject(userId: string, projectId: string): Promise<Project | null>;
  createProject(userId: string, input: ProjectInput): Promise<Project>;
  updateProject(userId: string, projectId: string, input: ProjectInput): Promise<Project>;
  deleteProject(userId: string, projectId: string): Promise<void>;
  setMilestoneStatus(
    userId: string,
    projectId: string,
    milestoneId: string,
    status: MilestoneStatus,
  ): Promise<void>;
}
