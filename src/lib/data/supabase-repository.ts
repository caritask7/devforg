import { randomUUID } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AuthUser,
  Difficulty,
  Lesson,
  LessonProgress,
  LessonProgressStatus,
  MilestoneStatus,
  Mission,
  MissionCategory,
  MissionProgress,
  MissionProgressStatus,
  Module,
  ModuleStatus,
  Phase,
  PhaseStatus,
  Profile,
  Project,
  ProjectInput,
  ProjectStatus,
  Skill,
  SkillCategory,
  SkillLevel,
  UserSkillProgress,
} from "@/lib/types";
import { levelFromValidations, progressFromLevel } from "@/lib/labels";
import { slugify } from "@/lib/utils";
import type { DataRepository, MissionProgressPatch, ProfileInput } from "./repository";

interface PhaseRow {
  slug: string;
  position: number;
  title: string;
  tagline: string;
  description: string;
  status: PhaseStatus;
  estimated_hours: number;
}

interface ModuleRow {
  slug: string;
  phase_slug: string;
  position: number;
  title: string;
  description: string;
  level: Difficulty;
  estimated_minutes: number;
  status: ModuleStatus;
  objectives: string[] | null;
}

interface LessonRow {
  slug: string;
  module_slug: string;
  position: number;
  title: string;
  summary: string;
  content_md: string;
  estimated_minutes: number;
  code_language: string;
  key_points: string[] | null;
}

interface MissionRow {
  slug: string;
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: Difficulty;
  estimated_minutes: number;
  context: string;
  objective: string;
  instructions_md: string;
  requirements: string[] | null;
  success_criteria: string[] | null;
  module_slug: string | null;
  tags: string[] | null;
  mission_skills?: Array<{ skill_slug: string }> | null;
}

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  avatar_url: string | null;
  level: number;
  daily_goal_minutes: number;
  created_at: string;
  updated_at: string;
}

interface LessonProgressRow {
  lesson_slug: string;
  status: LessonProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  last_viewed_at: string | null;
}

interface MissionProgressRow {
  mission_slug: string;
  status: MissionProgressStatus;
  notes: string | null;
  submission_url: string | null;
  score: number | null;
  started_at: string | null;
  submitted_at: string | null;
  completed_at: string | null;
}

interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  status: ProjectStatus;
  technologies: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  results: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  project_milestones?: MilestoneRow[] | null;
}

interface MilestoneRow {
  id: string;
  project_id: string;
  position: number;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  completed_at: string | null;
}

interface SkillRow {
  slug: string;
  category_slug: string;
  position: number;
  title: string;
  description: string;
  technique: string;
}

interface SkillProgressRow {
  skill_slug: string;
  level: SkillLevel;
  progress: number;
  validated_by: string | null;
  updated_at: string;
}

function fail(context: string, message: string): never {
  throw new Error(`${context} : ${message}`);
}

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email ?? "",
    fullName: row.full_name ?? "Apprenant DEVFORGE",
    headline: row.headline ?? "",
    bio: row.bio ?? "",
    githubUrl: row.github_url ?? "",
    linkedinUrl: row.linkedin_url ?? "",
    websiteUrl: row.website_url ?? "",
    avatarUrl: row.avatar_url ?? "",
    level: row.level ?? 1,
    dailyGoalMinutes: row.daily_goal_minutes ?? 45,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPhase(row: PhaseRow): Phase {
  return {
    slug: row.slug,
    position: row.position,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    status: row.status,
    estimatedHours: row.estimated_hours,
  };
}

function mapModule(row: ModuleRow): Module {
  return {
    slug: row.slug,
    phaseSlug: row.phase_slug,
    position: row.position,
    title: row.title,
    description: row.description,
    level: row.level,
    estimatedMinutes: row.estimated_minutes,
    status: row.status,
    objectives: row.objectives ?? [],
  };
}

function mapLesson(row: LessonRow): Lesson {
  return {
    slug: row.slug,
    moduleSlug: row.module_slug,
    position: row.position,
    title: row.title,
    summary: row.summary,
    contentMd: row.content_md,
    estimatedMinutes: row.estimated_minutes,
    codeLanguage: row.code_language,
    keyPoints: row.key_points ?? [],
  };
}

function mapMission(row: MissionRow): Mission {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty,
    estimatedMinutes: row.estimated_minutes,
    context: row.context,
    objective: row.objective,
    instructionsMd: row.instructions_md,
    requirements: row.requirements ?? [],
    successCriteria: row.success_criteria ?? [],
    moduleSlug: row.module_slug,
    tags: row.tags ?? [],
    skills: row.mission_skills?.map((item) => item.skill_slug) ?? [],
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary ?? "",
    description: row.description ?? "",
    status: row.status,
    technologies: row.technologies ?? [],
    githubUrl: row.github_url ?? "",
    demoUrl: row.demo_url ?? "",
    results: row.results ?? "",
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    milestones: (row.project_milestones ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((milestone) => ({
        id: milestone.id,
        projectId: milestone.project_id,
        position: milestone.position,
        title: milestone.title,
        description: milestone.description ?? "",
        status: milestone.status,
        completedAt: milestone.completed_at,
      })),
  };
}

export class SupabaseRepository implements DataRepository {
  private async client() {
    return createSupabaseServerClient();
  }

  async ensureProfile(user: AuthUser): Promise<Profile> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    if (error) fail("Lecture du profil impossible", error.message);
    if (data) return mapProfile(data);

    const fallbackName =
      user.email.split("@")[0]?.replace(/[._-]/g, " ") ?? "Apprenant DEVFORGE";
    const { data: created, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: fallbackName,
      })
      .select("*")
      .single<ProfileRow>();

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: retry } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single<ProfileRow>();
        if (retry) return mapProfile(retry);
      }
      fail("Création du profil impossible", insertError.message);
    }
    return mapProfile(created);
  }

  async updateProfile(userId: string, input: ProfileInput): Promise<Profile> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: input.fullName,
        headline: input.headline,
        bio: input.bio,
        github_url: input.githubUrl,
        linkedin_url: input.linkedinUrl,
        website_url: input.websiteUrl,
        avatar_url: input.avatarUrl,
        daily_goal_minutes: input.dailyGoalMinutes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single<ProfileRow>();

    if (error) fail("Mise à jour du profil impossible", error.message);
    return mapProfile(data);
  }

  async getPhases(): Promise<Phase[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("learning_phases")
      .select("*")
      .order("position", { ascending: true });
    if (error) fail("Chargement des phases impossible", error.message);
    return ((data ?? []) as PhaseRow[]).map(mapPhase);
  }

  async getModules(): Promise<Module[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .order("position", { ascending: true });
    if (error) fail("Chargement des modules impossible", error.message);
    return ((data ?? []) as ModuleRow[]).map(mapModule);
  }

  async getModule(slug: string): Promise<Module | null> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("slug", slug)
      .maybeSingle<ModuleRow>();
    if (error) fail("Chargement du module impossible", error.message);
    return data ? mapModule(data) : null;
  }

  async getLessons(moduleSlug: string): Promise<Lesson[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("lessons")
      .select(
        "slug, module_slug, position, title, summary, estimated_minutes, code_language, key_points",
      )
      .eq("module_slug", moduleSlug)
      .order("position", { ascending: true });
    if (error) fail("Chargement des leçons impossible", error.message);
    return ((data ?? []) as LessonRow[]).map((row) =>
      mapLesson({ ...row, content_md: "" }),
    );
  }

  async getLessonIndex(): Promise<Lesson[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("lessons")
      .select(
        "slug, module_slug, position, title, summary, estimated_minutes, code_language, key_points",
      )
      .order("position", { ascending: true });
    if (error) fail("Chargement des leçons impossible", error.message);
    return ((data ?? []) as LessonRow[]).map((row) =>
      mapLesson({ ...row, content_md: "" }),
    );
  }

  async getLesson(slug: string): Promise<Lesson | null> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("slug", slug)
      .maybeSingle<LessonRow>();
    if (error) fail("Chargement de la leçon impossible", error.message);
    return data ? mapLesson(data) : null;
  }

  async getMissions(): Promise<Mission[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("missions")
      .select("*, mission_skills(skill_slug)")
      .order("title", { ascending: true });
    if (error) fail("Chargement des missions impossible", error.message);
    return ((data ?? []) as MissionRow[]).map(mapMission);
  }

  async getMission(slug: string): Promise<Mission | null> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("missions")
      .select("*, mission_skills(skill_slug)")
      .eq("slug", slug)
      .maybeSingle<MissionRow>();
    if (error) fail("Chargement de la mission impossible", error.message);
    return data ? mapMission(data) : null;
  }

  async getSkills(): Promise<Skill[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("position", { ascending: true });
    if (error) fail("Chargement des compétences impossible", error.message);
    return ((data ?? []) as SkillRow[]).map((row) => ({
      slug: row.slug,
      categorySlug: row.category_slug,
      position: row.position,
      title: row.title,
      description: row.description,
      technique: row.technique,
    }));
  }

  async getSkillCategories(): Promise<SkillCategory[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("position", { ascending: true });
    if (error) fail("Chargement des catégories impossible", error.message);
    return ((data ?? []) as Array<{
      slug: string;
      position: number;
      title: string;
      description: string;
    }>).map((row) => ({
      slug: row.slug,
      position: row.position,
      title: row.title,
      description: row.description,
    }));
  }

  async getLessonProgress(userId: string): Promise<LessonProgress[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("lesson_progress")
      .select("lesson_slug, status, started_at, completed_at, last_viewed_at")
      .eq("user_id", userId);
    if (error) fail("Chargement de la progression impossible", error.message);
    return ((data ?? []) as LessonProgressRow[]).map((row) => ({
      lessonSlug: row.lesson_slug,
      status: row.status,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      lastViewedAt: row.last_viewed_at,
    }));
  }

  async markLessonStarted(userId: string, lessonSlug: string): Promise<void> {
    const supabase = await this.client();
    const stamp = new Date().toISOString();
    const { data: existing, error } = await supabase
      .from("lesson_progress")
      .select("status, started_at")
      .eq("user_id", userId)
      .eq("lesson_slug", lessonSlug)
      .maybeSingle<{ status: LessonProgressStatus; started_at: string | null }>();
    if (error) fail("Lecture de la progression impossible", error.message);

    const { error: upsertError } = await supabase.from("lesson_progress").upsert(
      {
        user_id: userId,
        lesson_slug: lessonSlug,
        status: existing?.status === "completed" ? "completed" : "in_progress",
        started_at: existing?.started_at ?? stamp,
        last_viewed_at: stamp,
        completed_at: existing?.status === "completed" ? stamp : null,
      },
      { onConflict: "user_id,lesson_slug" },
    );
    if (upsertError) fail("Enregistrement de la progression impossible", upsertError.message);
  }

  async completeLesson(userId: string, lessonSlug: string): Promise<void> {
    const supabase = await this.client();
    const stamp = new Date().toISOString();
    const { data: existing } = await supabase
      .from("lesson_progress")
      .select("started_at")
      .eq("user_id", userId)
      .eq("lesson_slug", lessonSlug)
      .maybeSingle<{ started_at: string | null }>();

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: userId,
        lesson_slug: lessonSlug,
        status: "completed",
        started_at: existing?.started_at ?? stamp,
        completed_at: stamp,
        last_viewed_at: stamp,
      },
      { onConflict: "user_id,lesson_slug" },
    );
    if (error) fail("Validation de la leçon impossible", error.message);
  }

  async resetLesson(userId: string, lessonSlug: string): Promise<void> {
    const supabase = await this.client();
    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", userId)
      .eq("lesson_slug", lessonSlug);
    if (error) fail("Réinitialisation de la leçon impossible", error.message);
  }

  async getMissionProgress(userId: string): Promise<MissionProgress[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("mission_progress")
      .select(
        "mission_slug, status, notes, submission_url, score, started_at, submitted_at, completed_at",
      )
      .eq("user_id", userId);
    if (error) fail("Chargement des missions impossible", error.message);
    return ((data ?? []) as MissionProgressRow[]).map((row) => ({
      missionSlug: row.mission_slug,
      status: row.status,
      notes: row.notes ?? "",
      submissionUrl: row.submission_url ?? "",
      score: row.score,
      startedAt: row.started_at,
      submittedAt: row.submitted_at,
      completedAt: row.completed_at,
    }));
  }

  async updateMissionProgress(
    userId: string,
    missionSlug: string,
    patch: MissionProgressPatch,
  ): Promise<void> {
    const supabase = await this.client();
    const stamp = new Date().toISOString();

    const { data: existing, error } = await supabase
      .from("mission_progress")
      .select(
        "status, notes, submission_url, score, started_at, submitted_at, completed_at",
      )
      .eq("user_id", userId)
      .eq("mission_slug", missionSlug)
      .maybeSingle<MissionProgressRow>();
    if (error) fail("Lecture de la mission impossible", error.message);

    const nextStatus = patch.status ?? existing?.status ?? "todo";
    const payload = {
      user_id: userId,
      mission_slug: missionSlug,
      status: nextStatus,
      notes: patch.notes ?? existing?.notes ?? "",
      submission_url: patch.submissionUrl ?? existing?.submission_url ?? "",
      score: patch.score !== undefined ? patch.score : (existing?.score ?? null),
      started_at:
        nextStatus === "todo" ? null : (existing?.started_at ?? stamp),
      submitted_at:
        nextStatus === "todo"
          ? null
          : nextStatus === "submitted" || nextStatus === "completed"
            ? (existing?.submitted_at ?? stamp)
            : (existing?.submitted_at ?? null),
      completed_at:
        nextStatus === "completed"
          ? (existing?.completed_at ?? stamp)
          : nextStatus === "todo"
            ? null
            : (existing?.completed_at ?? null),
    };

    const { error: upsertError } = await supabase
      .from("mission_progress")
      .upsert(payload, { onConflict: "user_id,mission_slug" });
    if (upsertError) fail("Mise à jour de la mission impossible", upsertError.message);

    if (nextStatus === "completed") {
      await this.syncSkills(userId);
    }
  }

  async getSkillProgress(userId: string): Promise<UserSkillProgress[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("user_skill_progress")
      .select("skill_slug, level, progress, validated_by, updated_at")
      .eq("user_id", userId);
    if (error) fail("Chargement des compétences impossible", error.message);
    return ((data ?? []) as SkillProgressRow[]).map((row) => ({
      skillSlug: row.skill_slug,
      level: row.level,
      progress: row.progress,
      validatedBy: row.validated_by ?? "",
      updatedAt: row.updated_at,
    }));
  }

  async syncSkills(userId: string): Promise<UserSkillProgress[]> {
    const supabase = await this.client();
    const [skillsResult, progressesResult, missionsResult] = await Promise.all([
      supabase.from("skills").select("slug"),
      supabase
        .from("mission_progress")
        .select("mission_slug, status")
        .eq("user_id", userId)
        .eq("status", "completed"),
      supabase.from("missions").select("slug, title, mission_skills(skill_slug)"),
    ]);

    if (skillsResult.error) fail("Chargement des compétences impossible", skillsResult.error.message);
    if (progressesResult.error) fail("Chargement des validations impossible", progressesResult.error.message);
    if (missionsResult.error) fail("Chargement des missions impossible", missionsResult.error.message);

    const completed = new Set(
      ((progressesResult.data ?? []) as Array<{ mission_slug: string }>).map(
        (row) => row.mission_slug,
      ),
    );

    const counts = new Map<string, { count: number; titles: string[] }>();
    for (const mission of (missionsResult.data ?? []) as MissionRow[]) {
      if (!completed.has(mission.slug)) continue;
      for (const link of mission.mission_skills ?? []) {
        const entry = counts.get(link.skill_slug) ?? { count: 0, titles: [] };
        entry.count += 1;
        entry.titles.push(mission.title);
        counts.set(link.skill_slug, entry);
      }
    }

    const stamp = new Date().toISOString();
    const rows = ((skillsResult.data ?? []) as Array<{ slug: string }>).map((skill) => {
      const entry = counts.get(skill.slug);
      const level = levelFromValidations(entry?.count ?? 0);
      return {
        user_id: userId,
        skill_slug: skill.slug,
        level,
        progress: progressFromLevel(level),
        validated_by: entry ? entry.titles.join(" · ") : "",
        updated_at: stamp,
      };
    });

    if (rows.length > 0) {
      const { error } = await supabase
        .from("user_skill_progress")
        .upsert(rows, { onConflict: "user_id,skill_slug" });
      if (error) fail("Synchronisation des compétences impossible", error.message);
    }

    return rows.map((row) => ({
      skillSlug: row.skill_slug,
      level: row.level as SkillLevel,
      progress: row.progress,
      validatedBy: row.validated_by,
      updatedAt: row.updated_at,
    }));
  }

  async listProjects(userId: string): Promise<Project[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_milestones(*)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) fail("Chargement des projets impossible", error.message);
    return ((data ?? []) as ProjectRow[]).map(mapProject);
  }

  async getProject(userId: string, projectId: string): Promise<Project | null> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_milestones(*)")
      .eq("id", projectId)
      .eq("user_id", userId)
      .maybeSingle<ProjectRow>();
    if (error) fail("Chargement du projet impossible", error.message);
    return data ? mapProject(data) : null;
  }

  async createProject(userId: string, input: ProjectInput): Promise<Project> {
    const supabase = await this.client();
    const stamp = new Date().toISOString();
    const slug = `${slugify(input.title) || "projet"}-${randomUUID().slice(0, 6)}`;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title: input.title,
        slug,
        summary: input.summary,
        description: input.description,
        status: input.status,
        technologies: input.technologies,
        github_url: input.githubUrl,
        demo_url: input.demoUrl,
        results: input.results,
        started_at:
          input.status === "in_progress" || input.status === "done" ? stamp : null,
        completed_at: input.status === "done" ? stamp : null,
      })
      .select("*")
      .single<ProjectRow>();

    if (error) fail("Création du projet impossible", error.message);

    if (input.milestones.length > 0) {
      const { error: milestoneError } = await supabase.from("project_milestones").insert(
        input.milestones.map((milestone, index) => ({
          project_id: data.id,
          position: index + 1,
          title: milestone.title,
          description: milestone.description,
          status: "todo",
        })),
      );
      if (milestoneError) {
        await supabase.from("projects").delete().eq("id", data.id);
        fail("Création des jalons impossible", milestoneError.message);
      }
    }

    return this.getProject(userId, data.id) as Promise<Project>;
  }

  async updateProject(
    userId: string,
    projectId: string,
    input: ProjectInput,
  ): Promise<Project> {
    const supabase = await this.client();
    const stamp = new Date().toISOString();

    const { data: existing, error } = await supabase
      .from("projects")
      .select("id, started_at, completed_at")
      .eq("id", projectId)
      .eq("user_id", userId)
      .maybeSingle<{ id: string; started_at: string | null; completed_at: string | null }>();
    if (error) fail("Lecture du projet impossible", error.message);
    if (!existing) throw new Error("Projet introuvable");

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        title: input.title,
        summary: input.summary,
        description: input.description,
        status: input.status,
        technologies: input.technologies,
        github_url: input.githubUrl,
        demo_url: input.demoUrl,
        results: input.results,
        updated_at: stamp,
        started_at:
          existing.started_at ??
          (input.status === "in_progress" || input.status === "done" ? stamp : null),
        completed_at:
          input.status === "done" ? (existing.completed_at ?? stamp) : null,
      })
      .eq("id", projectId)
      .eq("user_id", userId);
    if (updateError) fail("Mise à jour du projet impossible", updateError.message);

    const { data: currentMilestones, error: readMilestonesError } = await supabase
      .from("project_milestones")
      .select("id, position")
      .eq("project_id", projectId);
    if (readMilestonesError) fail("Lecture des jalons impossible", readMilestonesError.message);

    const byPosition = new Map(
      ((currentMilestones ?? []) as Array<{ id: string; position: number }>).map(
        (milestone) => [milestone.position, milestone.id],
      ),
    );

    for (const [index, milestone] of input.milestones.entries()) {
      const position = index + 1;
      const existingId = byPosition.get(position);
      if (existingId) {
        const { error } = await supabase
          .from("project_milestones")
          .update({ title: milestone.title, description: milestone.description })
          .eq("id", existingId)
          .eq("project_id", projectId);
        if (error) fail("Mise à jour d'un jalon impossible", error.message);
      } else {
        const { error } = await supabase.from("project_milestones").insert({
          project_id: projectId,
          position,
          title: milestone.title,
          description: milestone.description,
        });
        if (error) fail("Création d'un jalon impossible", error.message);
      }
    }

    if (input.milestones.length > 0) {
      const keep = input.milestones.map((_, index) => index + 1);
      const { error } = await supabase
        .from("project_milestones")
        .delete()
        .eq("project_id", projectId)
        .not("position", "in", `(${keep.join(",")})`);
      if (error) fail("Nettoyage des jalons impossible", error.message);
    } else {
      const { error } = await supabase
        .from("project_milestones")
        .delete()
        .eq("project_id", projectId);
      if (error) fail("Nettoyage des jalons impossible", error.message);
    }

    return this.getProject(userId, projectId) as Promise<Project>;
  }

  async deleteProject(userId: string, projectId: string): Promise<void> {
    const supabase = await this.client();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", userId);
    if (error) fail("Suppression du projet impossible", error.message);
  }

  async setMilestoneStatus(
    userId: string,
    projectId: string,
    milestoneId: string,
    status: MilestoneStatus,
  ): Promise<void> {
    const supabase = await this.client();
    const stamp = new Date().toISOString();

    const { error } = await supabase
      .from("project_milestones")
      .update({
        status,
        completed_at: status === "done" ? stamp : null,
      })
      .eq("id", milestoneId)
      .eq("project_id", projectId);
    if (error) fail("Mise à jour du jalon impossible", error.message);

    const { data: milestones, error: readError } = await supabase
      .from("project_milestones")
      .select("status")
      .eq("project_id", projectId);
    if (readError) fail("Lecture des jalons impossible", readError.message);

    const list = (milestones ?? []) as Array<{ status: MilestoneStatus }>;
    const { data: project } = await supabase
      .from("projects")
      .select("status")
      .eq("id", projectId)
      .eq("user_id", userId)
      .maybeSingle<{ status: ProjectStatus }>();

    if (project) {
      const allDone = list.length > 0 && list.every((item) => item.status === "done");
      const nextStatus: ProjectStatus = allDone
        ? "done"
        : project.status === "done"
          ? "in_progress"
          : project.status;
      await supabase
        .from("projects")
        .update({ status: nextStatus, updated_at: stamp })
        .eq("id", projectId)
        .eq("user_id", userId);
    }
  }
}

export const supabaseRepository = new SupabaseRepository();
