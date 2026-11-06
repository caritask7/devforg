/** Types métier partagés entre le dépôt Supabase et le stockage local. */

export type Difficulty = "debutant" | "intermediaire" | "avance";

export type PhaseStatus = "available" | "coming_soon";
export type ModuleStatus = "available" | "coming_soon";

export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type MissionCategory = "exercice" | "defi" | "evaluation";
export type MissionProgressStatus = "todo" | "in_progress" | "submitted" | "completed";

export type ProjectStatus = "idea" | "todo" | "in_progress" | "done";
export type MilestoneStatus = "todo" | "in_progress" | "done";

export type SkillLevel = "not_started" | "beginner" | "intermediate" | "advanced";

export interface AuthUser {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  headline: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  avatarUrl: string;
  level: number;
  dailyGoalMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Phase {
  slug: string;
  position: number;
  title: string;
  tagline: string;
  description: string;
  status: PhaseStatus;
  estimatedHours: number;
}

export interface Module {
  slug: string;
  phaseSlug: string;
  position: number;
  title: string;
  description: string;
  level: Difficulty;
  estimatedMinutes: number;
  status: ModuleStatus;
  objectives: string[];
}

export interface Lesson {
  slug: string;
  moduleSlug: string;
  position: number;
  title: string;
  summary: string;
  contentMd: string;
  estimatedMinutes: number;
  codeLanguage: string;
  keyPoints: string[];
}

export interface LessonProgress {
  lessonSlug: string;
  status: LessonProgressStatus;
  startedAt: string | null;
  completedAt: string | null;
  lastViewedAt: string | null;
}

export interface LessonWithProgress extends Lesson {
  progress: LessonProgress;
}

export interface ModuleProgressSummary {
  module: Module;
  lessonCount: number;
  completedLessons: number;
  percent: number;
  estimatedMinutes: number;
  remainingMinutes: number;
}

export interface PhaseProgressSummary {
  phase: Phase;
  modules: ModuleProgressSummary[];
  moduleCount: number;
  completedModules: number;
  lessonCount: number;
  completedLessons: number;
  percent: number;
}

export interface Mission {
  slug: string;
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  context: string;
  objective: string;
  instructionsMd: string;
  requirements: string[];
  successCriteria: string[];
  moduleSlug: string | null;
  tags: string[];
  skills: string[];
}

export interface MissionProgress {
  missionSlug: string;
  status: MissionProgressStatus;
  notes: string;
  submissionUrl: string;
  score: number | null;
  startedAt: string | null;
  submittedAt: string | null;
  completedAt: string | null;
}

export interface MissionWithProgress extends Mission {
  progress: MissionProgress;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  position: number;
  title: string;
  description: string;
  status: MilestoneStatus;
  completedAt: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  results: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  milestones: ProjectMilestone[];
}

export interface ProjectInput {
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  technologies: string[];
  githubUrl: string;
  demoUrl: string;
  results: string;
  milestones: Array<{ title: string; description: string }>;
}

export interface SkillCategory {
  slug: string;
  position: number;
  title: string;
  description: string;
}

export interface Skill {
  slug: string;
  categorySlug: string;
  position: number;
  title: string;
  description: string;
  technique: string;
}

export interface UserSkillProgress {
  skillSlug: string;
  level: SkillLevel;
  progress: number;
  validatedBy: string;
  updatedAt: string;
}

export interface SkillWithProgress extends Skill {
  level: SkillLevel;
  progress: number;
  validatedMissions: number;
  validationLabel: string;
}

export interface SkillCategoryWithSkills extends SkillCategory {
  skills: SkillWithProgress[];
}

export interface DashboardData {
  profile: Profile;
  date: string;
  missionOfTheDay: MissionWithProgress | null;
  lastLesson: {
    lesson: Lesson;
    module: Module;
    progress: LessonProgress;
    percent: number;
  } | null;
  nextLesson: {
    lesson: Lesson;
    module: Module;
  } | null;
  globalPercent: number;
  completedLessons: number;
  totalLessons: number;
  weeklyMinutes: number;
  weeklyGoalMinutes: number;
  completedMissions: number;
  totalMissions: number;
  phases: PhaseProgressSummary[];
  lastCompletedMission: MissionWithProgress | null;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: SkillWithProgress[];
  completedMissions: number;
  technologies: Array<{ name: string; count: number }>;
}

export interface SearchItem {
  type: "module" | "lecon" | "mission" | "projet";
  title: string;
  subtitle: string;
  href: string;
}
