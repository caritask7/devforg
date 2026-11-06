import { randomUUID } from "node:crypto";
import { lessons as allLessons } from "@/lib/content/lessons";
import { missions as allMissions } from "@/lib/content/missions";
import { modules as allModules, phases as allPhases } from "@/lib/content/curriculum";
import { skills as allSkills, skillCategories as allSkillCategories } from "@/lib/content/skills";
import { readDatabase, updateDatabase } from "@/lib/demo/db";
import type { DemoDatabase } from "@/lib/demo/seed";
import type {
  AuthUser,
  Lesson,
  LessonProgress,
  MilestoneStatus,
  Mission,
  MissionProgress,
  Module,
  Phase,
  Profile,
  Project,
  ProjectInput,
  Skill,
  SkillCategory,
  UserSkillProgress,
} from "@/lib/types";
import { slugify } from "@/lib/utils";
import type { DataRepository, MissionProgressPatch, ProfileInput } from "./repository";

function nowIso(): string {
  return new Date().toISOString();
}

function stripUser<T extends { userId: string }>(record: T): Omit<T, "userId"> {
  const { userId: _userId, ...rest } = record;
  return rest;
}

function defaultProfile(user: AuthUser): Profile {
  const stamp = nowIso();
  return {
    id: user.id,
    email: user.email,
    fullName: user.email.split("@")[0]?.replace(/[._-]/g, " ") ?? "Apprenant DEVFORGE",
    headline: "Développeur en formation",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    avatarUrl: "",
    level: 1,
    dailyGoalMinutes: 45,
    createdAt: stamp,
    updatedAt: stamp,
  };
}

function normalizeMilestones(project: Project): Project {
  return {
    ...project,
    milestones: project.milestones
      .slice()
      .sort((a, b) => a.position - b.position),
  };
}

export class DemoRepository implements DataRepository {
  async ensureProfile(user: AuthUser): Promise<Profile> {
    const db = await readDatabase();
    const existing = db.profiles.find((profile) => profile.id === user.id);
    if (existing) return { ...existing };

    const profile = defaultProfile(user);
    await updateDatabase((current) => {
      current.profiles = current.profiles.filter((item) => item.id !== user.id);
      current.profiles.push(profile);
    });
    return profile;
  }

  async updateProfile(userId: string, input: ProfileInput): Promise<Profile> {
    return updateDatabase((db) => {
      const profile = db.profiles.find((item) => item.id === userId);
      if (!profile) throw new Error("Profil introuvable");
      Object.assign(profile, input, { updatedAt: nowIso() });
      return { ...profile };
    });
  }

  async getPhases(): Promise<Phase[]> {
    return allPhases.slice().sort((a, b) => a.position - b.position);
  }

  async getModules(): Promise<Module[]> {
    return allModules.slice().sort((a, b) => a.position - b.position);
  }

  async getModule(slug: string): Promise<Module | null> {
    return allModules.find((module) => module.slug === slug) ?? null;
  }

  async getLessons(moduleSlug: string): Promise<Lesson[]> {
    return allLessons
      .filter((lesson) => lesson.moduleSlug === moduleSlug)
      .sort((a, b) => a.position - b.position);
  }

  async getLessonIndex(): Promise<Lesson[]> {
    return allLessons.slice();
  }

  async getLesson(slug: string): Promise<Lesson | null> {
    return allLessons.find((lesson) => lesson.slug === slug) ?? null;
  }

  async getMissions(): Promise<Mission[]> {
    return allMissions.slice();
  }

  async getMission(slug: string): Promise<Mission | null> {
    return allMissions.find((mission) => mission.slug === slug) ?? null;
  }

  async getSkills(): Promise<Skill[]> {
    return allSkills.slice();
  }

  async getSkillCategories(): Promise<SkillCategory[]> {
    return allSkillCategories.slice().sort((a, b) => a.position - b.position);
  }

  async getLessonProgress(userId: string): Promise<LessonProgress[]> {
    const db = await readDatabase();
    return db.lessonProgress
      .filter((record) => record.userId === userId)
      .map((record) => stripUser(record));
  }

  async markLessonStarted(userId: string, lessonSlug: string): Promise<void> {
    if (!allLessons.some((lesson) => lesson.slug === lessonSlug)) {
      throw new Error("Leçon introuvable");
    }
    await updateDatabase((db) => {
      const stamp = nowIso();
      const existing = db.lessonProgress.find(
        (record) => record.userId === userId && record.lessonSlug === lessonSlug,
      );
      if (!existing) {
        db.lessonProgress.push({
          userId,
          lessonSlug,
          status: "in_progress",
          startedAt: stamp,
          completedAt: null,
          lastViewedAt: stamp,
        });
        return;
      }
      existing.lastViewedAt = stamp;
      if (existing.status !== "completed") {
        existing.status = "in_progress";
        existing.startedAt ??= stamp;
      }
    });
  }

  async completeLesson(userId: string, lessonSlug: string): Promise<void> {
    if (!allLessons.some((lesson) => lesson.slug === lessonSlug)) {
      throw new Error("Leçon introuvable");
    }
    await updateDatabase((db) => {
      const stamp = nowIso();
      const existing = db.lessonProgress.find(
        (record) => record.userId === userId && record.lessonSlug === lessonSlug,
      );
      if (existing) {
        existing.status = "completed";
        existing.startedAt ??= stamp;
        existing.completedAt = stamp;
        existing.lastViewedAt = stamp;
      } else {
        db.lessonProgress.push({
          userId,
          lessonSlug,
          status: "completed",
          startedAt: stamp,
          completedAt: stamp,
          lastViewedAt: stamp,
        });
      }
    });
  }

  async resetLesson(userId: string, lessonSlug: string): Promise<void> {
    await updateDatabase((db) => {
      db.lessonProgress = db.lessonProgress.filter(
        (record) => !(record.userId === userId && record.lessonSlug === lessonSlug),
      );
    });
  }

  async getMissionProgress(userId: string): Promise<MissionProgress[]> {
    const db = await readDatabase();
    return db.missionProgress
      .filter((record) => record.userId === userId)
      .map((record) => stripUser(record));
  }

  async updateMissionProgress(
    userId: string,
    missionSlug: string,
    patch: MissionProgressPatch,
  ): Promise<void> {
    const mission = allMissions.find((item) => item.slug === missionSlug);
    if (!mission) throw new Error("Mission introuvable");

    await updateDatabase((db) => {
      const stamp = nowIso();
      let record = db.missionProgress.find(
        (item) => item.userId === userId && item.missionSlug === missionSlug,
      );
      if (!record) {
        record = {
          userId,
          missionSlug,
          status: "todo",
          notes: "",
          submissionUrl: "",
          score: null,
          startedAt: null,
          submittedAt: null,
          completedAt: null,
        };
        db.missionProgress.push(record);
      }

      if (patch.notes !== undefined) record.notes = patch.notes;
      if (patch.submissionUrl !== undefined) record.submissionUrl = patch.submissionUrl;
      if (patch.score !== undefined) record.score = patch.score;

      if (patch.status !== undefined && patch.status !== record.status) {
        record.status = patch.status;
        if (patch.status === "in_progress") {
          record.startedAt ??= stamp;
        }
        if (patch.status === "submitted") {
          record.startedAt ??= stamp;
          record.submittedAt = stamp;
        }
        if (patch.status === "completed") {
          record.startedAt ??= stamp;
          record.submittedAt ??= stamp;
          record.completedAt = stamp;
        }
        if (patch.status === "todo") {
          record.startedAt = null;
          record.submittedAt = null;
          record.completedAt = null;
        }
      }
    });

    if (patch.status === "completed") {
      await this.syncSkills(userId);
    }
  }

  async getSkillProgress(userId: string): Promise<UserSkillProgress[]> {
    const db = await readDatabase();
    return db.skillProgress
      .filter((record) => record.userId === userId)
      .map((record) => stripUser(record));
  }

  async syncSkills(userId: string): Promise<UserSkillProgress[]> {
    const db = await readDatabase();
    const completed = new Set(
      db.missionProgress
        .filter((record) => record.userId === userId && record.status === "completed")
        .map((record) => record.missionSlug),
    );

    const counts = new Map<string, { count: number; titles: string[] }>();
    for (const mission of allMissions) {
      if (!completed.has(mission.slug)) continue;
      for (const skillSlug of mission.skills) {
        const entry = counts.get(skillSlug) ?? { count: 0, titles: [] };
        entry.count += 1;
        entry.titles.push(mission.title);
        counts.set(skillSlug, entry);
      }
    }

    const stamp = nowIso();
    return updateDatabase((current) => {
      current.skillProgress = current.skillProgress.filter(
        (record) => record.userId !== userId,
      );
      const next: Array<UserSkillProgress & { userId: string }> = allSkills.map((skill) => {
        const entry = counts.get(skill.slug);
        const count = entry?.count ?? 0;
        const level =
          count >= 4 ? "advanced" : count >= 2 ? "intermediate" : count >= 1 ? "beginner" : "not_started";
        return {
          userId,
          skillSlug: skill.slug,
          level,
          progress: count >= 4 ? 90 : count >= 2 ? 65 : count >= 1 ? 35 : 0,
          validatedBy: entry ? entry.titles.join(" · ") : "",
          updatedAt: stamp,
        };
      });
      current.skillProgress.push(...next);
      return next.map((record) => stripUser(record));
    });
  }

  async listProjects(userId: string): Promise<Project[]> {
    const db = await readDatabase();
    return db.projects
      .filter((project) => project.userId === userId)
      .map((project) => normalizeMilestones(stripUser(project)))
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }

  async getProject(userId: string, projectId: string): Promise<Project | null> {
    const db = await readDatabase();
    const project = db.projects.find(
      (item) => item.id === projectId && item.userId === userId,
    );
    return project ? normalizeMilestones(stripUser(project)) : null;
  }

  async createProject(userId: string, input: ProjectInput): Promise<Project> {
    const id = randomUUID();
    const stamp = nowIso();
    const project: Project & { userId: string } = {
      id,
      userId,
      slug: `${slugify(input.title) || "projet"}-${id.slice(0, 6)}`,
      title: input.title,
      summary: input.summary,
      description: input.description,
      status: input.status,
      technologies: input.technologies,
      githubUrl: input.githubUrl,
      demoUrl: input.demoUrl,
      results: input.results,
      startedAt: input.status === "in_progress" || input.status === "done" ? stamp : null,
      completedAt: input.status === "done" ? stamp : null,
      createdAt: stamp,
      updatedAt: stamp,
      milestones: input.milestones.map((milestone, index) => ({
        id: randomUUID(),
        projectId: id,
        position: index + 1,
        title: milestone.title,
        description: milestone.description,
        status: "todo",
        completedAt: null,
      })),
    };

    await updateDatabase((db) => {
      db.projects.push(project);
    });
    return normalizeMilestones(stripUser(project));
  }

  async updateProject(
    userId: string,
    projectId: string,
    input: ProjectInput,
  ): Promise<Project> {
    const updated = await updateDatabase((db): Project => {
      const index = db.projects.findIndex(
        (item) => item.id === projectId && item.userId === userId,
      );
      if (index < 0) throw new Error("Projet introuvable");
      const existing = db.projects[index] as Project & { userId: string };
      const stamp = nowIso();

      const milestones = input.milestones
        .map((milestone, position) => {
          const previous = existing.milestones.find(
            (item) => item.position === position + 1,
          );
          return {
            id: previous?.id ?? randomUUID(),
            projectId,
            position: position + 1,
            title: milestone.title,
            description: milestone.description,
            status: previous?.status ?? ("todo" as MilestoneStatus),
            completedAt: previous?.completedAt ?? null,
          };
        });

      const next: Project & { userId: string } = {
        ...existing,
        title: input.title,
        summary: input.summary,
        description: input.description,
        status: input.status,
        technologies: input.technologies,
        githubUrl: input.githubUrl,
        demoUrl: input.demoUrl,
        results: input.results,
        updatedAt: stamp,
        startedAt:
          existing.startedAt ??
          (input.status === "in_progress" || input.status === "done" ? stamp : null),
        completedAt:
          input.status === "done" ? existing.completedAt ?? stamp : null,
        milestones,
      };

      db.projects[index] = next;
      return normalizeMilestones(stripUser(next));
    });

    return updated;
  }

  async deleteProject(userId: string, projectId: string): Promise<void> {
    await updateDatabase((db) => {
      const index = db.projects.findIndex(
        (item) => item.id === projectId && item.userId === userId,
      );
      if (index < 0) throw new Error("Projet introuvable");
      db.projects.splice(index, 1);
    });
  }

  async setMilestoneStatus(
    userId: string,
    projectId: string,
    milestoneId: string,
    status: MilestoneStatus,
  ): Promise<void> {
    await updateDatabase((db) => {
      const project = db.projects.find(
        (item) => item.id === projectId && item.userId === userId,
      );
      if (!project) throw new Error("Projet introuvable");
      const milestone = project.milestones.find((item) => item.id === milestoneId);
      if (!milestone) throw new Error("Jalon introuvable");
      milestone.status = status;
      milestone.completedAt = status === "done" ? nowIso() : null;
      project.updatedAt = nowIso();
      project.status =
        project.milestones.every((item) => item.status === "done") &&
        project.milestones.length > 0
          ? "done"
          : project.status === "done"
            ? "in_progress"
            : project.status;
    });
  }
}

export const demoRepository = new DemoRepository();
export type DemoDatabaseShape = DemoDatabase;
