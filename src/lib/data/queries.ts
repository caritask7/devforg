import type {
  DashboardData,
  Lesson,
  LessonProgress,
  LessonWithProgress,
  Mission,
  MissionWithProgress,
  Module,
  Phase,
  PhaseProgressSummary,
  PortfolioData,
  Profile,
  Project,
  SearchItem,
  SkillCategory,
  SkillWithProgress,
} from "@/lib/types";
import {
  attachLessonProgress,
  attachMissionProgress,
  buildDashboardData,
  buildSkillList,
  lessonProgressMap,
  missionProgressMap,
  summarizeModule,
  summarizePhases,
} from "@/lib/progress";
import { percent } from "@/lib/utils";
import { repository as defaultRepository, type DataRepository } from "./index";

export async function loadDashboard(
  userId: string,
  repo: DataRepository = defaultRepository,
): Promise<DashboardData> {
  const [profile, phases, modules, lessons, missions, lessonProgress, missionProgress] =
    await Promise.all([
      repo.ensureProfile({ id: userId, email: "" }),
      repo.getPhases(),
      repo.getModules(),
      repo.getLessonIndex(),
      repo.getMissions(),
      repo.getLessonProgress(userId),
      repo.getMissionProgress(userId),
    ]);

  const missionRecords = attachMissionProgress(missions, missionProgressMap(missionProgress));

  return buildDashboardData({
    profile,
    phases,
    modules,
    lessons,
    missionRecords,
    progressRecords: lessonProgress,
  });
}

export async function loadDashboardProfile(
  userId: string,
  email: string,
  repo: DataRepository = defaultRepository,
): Promise<Profile> {
  return repo.ensureProfile({ id: userId, email });
}

export interface ParcoursData {
  profile: Profile;
  phases: PhaseProgressSummary[];
  globalPercent: number;
  completedLessons: number;
  totalLessons: number;
  remainingMinutes: number;
  activePhase: Phase | null;
  activeModule: Module | null;
}

export async function loadParcours(
  userId: string,
  repo: DataRepository = defaultRepository,
): Promise<ParcoursData> {
  const [profile, phases, modules, lessons, progress] = await Promise.all([
    repo.ensureProfile({ id: userId, email: "" }),
    repo.getPhases(),
    repo.getModules(),
    repo.getLessonIndex(),
    repo.getLessonProgress(userId),
  ]);

  const progressMap = lessonProgressMap(progress);
  const summaries = summarizePhases(phases, modules, lessons, progressMap);
  const totalLessons = lessons.length;
  const completedLessons = progress.filter((item) => item.status === "completed").length;
  const remainingMinutes = lessons.reduce((total, lesson) => {
    return progressMap.get(lesson.slug)?.status === "completed"
      ? total
      : total + lesson.estimatedMinutes;
  }, 0);

  const activeSummary =
    summaries.find((item) => item.percent > 0 && item.percent < 100) ??
    summaries.find((item) => item.percent === 0 && item.lessonCount > 0) ??
    summaries[0] ??
    null;

  const activeModuleSummary =
    activeSummary?.modules.find((item) => item.percent > 0 && item.percent < 100) ??
    activeSummary?.modules.find((item) => item.percent === 0 && item.lessonCount > 0) ??
    null;

  return {
    profile,
    phases: summaries,
    globalPercent: percent(completedLessons, totalLessons),
    completedLessons,
    totalLessons,
    remainingMinutes,
    activePhase: activeSummary?.phase ?? null,
    activeModule: activeModuleSummary?.module ?? null,
  };
}

export interface ModulePageData {
  module: Module;
  phase: Phase;
  lessons: LessonWithProgress[];
  completedLessons: number;
  percent: number;
  estimatedMinutes: number;
  remainingMinutes: number;
  nextLesson: Lesson | null;
  missions: MissionWithProgress[];
  previousModule: Module | null;
  nextModule: Module | null;
}

export async function loadModulePage(
  userId: string,
  moduleSlug: string,
  repo: DataRepository = defaultRepository,
): Promise<ModulePageData | null> {
  const [module, phases, modules, missions, progress, missionProgress] = await Promise.all([
    repo.getModule(moduleSlug),
    repo.getPhases(),
    repo.getModules(),
    repo.getMissions(),
    repo.getLessonProgress(userId),
    repo.getMissionProgress(userId),
  ]);

  if (!module) return null;
  const phase = phases.find((item) => item.slug === module.phaseSlug);
  if (!phase) return null;

  const moduleLessons = await repo.getLessons(module.slug);
  const progressMap = lessonProgressMap(progress);
  const summary = summarizeModule(module, moduleLessons, progressMap);
  const lessonsWithProgress = attachLessonProgress(moduleLessons, progressMap);
  const nextLesson =
    moduleLessons.find(
      (lesson) => progressMap.get(lesson.slug)?.status !== "completed",
    ) ?? moduleLessons[0] ?? null;

  const phaseModules = modules
    .filter((item) => item.phaseSlug === module.phaseSlug)
    .sort((a, b) => a.position - b.position);
  const currentIndex = phaseModules.findIndex((item) => item.slug === module.slug);

  const missionRecords = attachMissionProgress(
    missions.filter((mission) => mission.moduleSlug === module.slug),
    missionProgressMap(missionProgress),
  );

  return {
    module,
    phase,
    lessons: lessonsWithProgress,
    completedLessons: summary.completedLessons,
    percent: summary.percent,
    estimatedMinutes: summary.estimatedMinutes,
    remainingMinutes: summary.remainingMinutes,
    nextLesson,
    missions: missionRecords,
    previousModule: currentIndex > 0 ? phaseModules[currentIndex - 1] ?? null : null,
    nextModule:
      currentIndex >= 0 && currentIndex < phaseModules.length - 1
        ? phaseModules[currentIndex + 1] ?? null
        : null,
  };
}

export interface LessonPageData {
  lesson: Lesson;
  module: Module;
  phase: Phase;
  moduleLessons: LessonWithProgress[];
  percent: number;
  position: number;
  total: number;
  previous: Lesson | null;
  next: Lesson | null;
  missions: MissionWithProgress[];
}

export async function loadLessonPage(
  userId: string,
  lessonSlug: string,
  repo: DataRepository = defaultRepository,
): Promise<LessonPageData | null> {
  const lesson = await repo.getLesson(lessonSlug);
  if (!lesson) return null;

  const [module, phases, moduleLessons, progress, missions, missionProgress] =
    await Promise.all([
      repo.getModule(lesson.moduleSlug),
      repo.getPhases(),
      repo.getLessons(lesson.moduleSlug),
      repo.getLessonProgress(userId),
      repo.getMissions(),
      repo.getMissionProgress(userId),
    ]);

  if (!module) return null;
  const phase = phases.find((item) => item.slug === module.phaseSlug);
  if (!phase) return null;

  const progressMap = lessonProgressMap(progress);
  const orderedModuleLessons = moduleLessons
    .slice()
    .sort((a, b) => a.position - b.position);
  const index = orderedModuleLessons.findIndex((item) => item.slug === lesson.slug);
  const summary = summarizeModule(module, orderedModuleLessons, progressMap);

  return {
    lesson,
    module,
    phase,
    moduleLessons: attachLessonProgress(orderedModuleLessons, progressMap),
    percent: summary.percent,
    position: index + 1,
    total: orderedModuleLessons.length,
    previous: index > 0 ? orderedModuleLessons[index - 1] ?? null : null,
    next:
      index >= 0 && index < orderedModuleLessons.length - 1
        ? orderedModuleLessons[index + 1] ?? null
        : null,
    missions: attachMissionProgress(
      missions.filter((mission) => mission.moduleSlug === module.slug),
      missionProgressMap(missionProgress),
    ),
  };
}

export interface MissionsPageData {
  missions: MissionWithProgress[];
  completed: number;
  inProgress: number;
  submitted: number;
  todo: number;
  totalMinutes: number;
}

export async function loadMissionsPage(
  userId: string,
  repo: DataRepository = defaultRepository,
): Promise<MissionsPageData> {
  const [missions, progress] = await Promise.all([
    repo.getMissions(),
    repo.getMissionProgress(userId),
  ]);
  const records = attachMissionProgress(missions, missionProgressMap(progress));
  return {
    missions: records,
    completed: records.filter((item) => item.progress.status === "completed").length,
    inProgress: records.filter((item) => item.progress.status === "in_progress").length,
    submitted: records.filter((item) => item.progress.status === "submitted").length,
    todo: records.filter((item) => item.progress.status === "todo").length,
    totalMinutes: records.reduce((total, item) => total + item.estimatedMinutes, 0),
  };
}

export interface MissionPageData {
  mission: Mission;
  progress: MissionWithProgress["progress"];
  module: Module | null;
  phase: Phase | null;
  relatedSkills: SkillWithProgress[];
  completedInModule: number;
  moduleMissionCount: number;
}

export async function loadMissionPage(
  userId: string,
  missionSlug: string,
  repo: DataRepository = defaultRepository,
): Promise<MissionPageData | null> {
  const [mission, missions, missionProgress, modules, phases, skills] = await Promise.all([
    repo.getMission(missionSlug),
    repo.getMissions(),
    repo.getMissionProgress(userId),
    repo.getModules(),
    repo.getPhases(),
    repo.getSkills(),
  ]);
  if (!mission) return null;

  const progressMap = missionProgressMap(missionProgress);
  const records = attachMissionProgress(missions, progressMap);
  const missionModule = mission.moduleSlug
    ? modules.find((item) => item.slug === mission.moduleSlug) ?? null
    : null;
  const phase = missionModule
    ? phases.find((item) => item.slug === missionModule.phaseSlug) ?? null
    : null;

  const skillList = buildSkillList(skills, records).filter((skill) =>
    mission.skills.includes(skill.slug),
  );

  const moduleMissions = records.filter(
    (item) => item.moduleSlug === mission.moduleSlug,
  );

  return {
    mission,
    progress: progressMap.get(mission.slug) ?? {
      missionSlug: mission.slug,
      status: "todo",
      notes: "",
      submissionUrl: "",
      score: null,
      startedAt: null,
      submittedAt: null,
      completedAt: null,
    },
    module: missionModule,
    phase,
    relatedSkills: skillList,
    moduleMissionCount: moduleMissions.length,
    completedInModule: moduleMissions.filter(
      (item) => item.progress.status === "completed",
    ).length,
  };
}

export interface SkillsPageData {
  categories: Array<SkillCategory & { skills: SkillWithProgress[] }>;
  totalSkills: number;
  evaluated: number;
  intermediateOrAbove: number;
  advanced: number;
  coverage: number;
}

export async function loadSkillsPage(
  userId: string,
  repo: DataRepository = defaultRepository,
): Promise<SkillsPageData> {
  const [categories, skills, missions, progress] = await Promise.all([
    repo.getSkillCategories(),
    repo.getSkills(),
    repo.getMissions(),
    repo.getMissionProgress(userId),
  ]);

  const records = attachMissionProgress(missions, missionProgressMap(progress));
  const skillList = buildSkillList(skills, records);
  const skillsByCategory = new Map<string, SkillWithProgress[]>();
  for (const skill of skillList) {
    const bucket = skillsByCategory.get(skill.categorySlug) ?? [];
    bucket.push(skill);
    skillsByCategory.set(skill.categorySlug, bucket);
  }

  const evaluated = skillList.filter((skill) => skill.level !== "not_started").length;
  const intermediateOrAbove = skillList.filter(
    (skill) => skill.level === "intermediate" || skill.level === "advanced",
  ).length;
  const advanced = skillList.filter((skill) => skill.level === "advanced").length;

  return {
    categories: categories.map((category) => ({
      ...category,
      skills: skillsByCategory.get(category.slug) ?? [],
    })),
    totalSkills: skillList.length,
    evaluated,
    intermediateOrAbove,
    advanced,
    coverage: percent(evaluated, skillList.length),
  };
}

export async function loadPortfolio(
  userId: string,
  repo: DataRepository = defaultRepository,
): Promise<PortfolioData> {
  const [profile, projects, missions, progress, skills] = await Promise.all([
    repo.ensureProfile({ id: userId, email: "" }),
    repo.listProjects(userId),
    repo.getMissions(),
    repo.getMissionProgress(userId),
    repo.getSkills(),
  ]);

  const records = attachMissionProgress(missions, missionProgressMap(progress));
  const skillList = buildSkillList(skills, records)
    .filter((skill) => skill.progress > 0)
    .sort((a, b) => b.progress - a.progress);

  const completedProjects = projects.filter((project) => project.status === "done");
  const technologies = new Map<string, number>();
  for (const project of completedProjects) {
    for (const technology of project.technologies) {
      technologies.set(technology, (technologies.get(technology) ?? 0) + 1);
    }
  }

  return {
    profile,
    projects: completedProjects,
    skills: skillList,
    completedMissions: records.filter(
      (mission) => mission.progress.status === "completed",
    ).length,
    technologies: Array.from(technologies.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  };
}

export async function loadProjects(
  userId: string,
  repo: DataRepository = defaultRepository,
): Promise<Project[]> {
  return repo.listProjects(userId);
}

export async function loadSearchItems(
  userId: string,
  repo: DataRepository = defaultRepository,
): Promise<SearchItem[]> {
  const [modules, lessons, missions, projects, phases] = await Promise.all([
    repo.getModules(),
    repo.getLessonIndex(),
    repo.getMissions(),
    repo.listProjects(userId),
    repo.getPhases(),
  ]);

  const phaseBySlug = new Map(phases.map((phase) => [phase.slug, phase]));
  const moduleBySlug = new Map(modules.map((item) => [item.slug, item]));

  const items: SearchItem[] = [];

  for (const moduleRecord of modules) {
    const phase = phaseBySlug.get(moduleRecord.phaseSlug);
    items.push({
      type: "module",
      title: moduleRecord.title,
      subtitle: phase ? `Module · ${phase.title}` : "Module",
      href: `/modules/${moduleRecord.slug}`,
    });
  }

  for (const lesson of lessons) {
    const lessonModule = moduleBySlug.get(lesson.moduleSlug);
    items.push({
      type: "lecon",
      title: lesson.title,
      subtitle: lessonModule ? `Leçon · ${lessonModule.title}` : "Leçon",
      href: `/lecons/${lesson.slug}`,
    });
  }

  for (const mission of missions) {
    items.push({
      type: "mission",
      title: mission.title,
      subtitle: `Mission · ${mission.category}`,
      href: `/missions/${mission.slug}`,
    });
  }

  for (const project of projects) {
    items.push({
      type: "projet",
      title: project.title,
      subtitle: "Projet personnel",
      href: `/projets/${project.id}`,
    });
  }

  return items;
}

export function searchItemsLocally(items: SearchItem[], query: string): SearchItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items.slice(0, 8);
  return items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle.toLowerCase().includes(normalized),
    )
    .slice(0, 12);
}

export type { LessonProgress, Mission };
