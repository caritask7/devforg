import { levelFromValidations, progressFromLevel } from "@/lib/labels";
import type {
  DashboardData,
  Lesson,
  LessonProgress,
  LessonWithProgress,
  Mission,
  MissionProgress,
  MissionWithProgress,
  Module,
  ModuleProgressSummary,
  Phase,
  PhaseProgressSummary,
  Profile,
  SkillLevel,
  SkillWithProgress,
} from "@/lib/types";
import { percent, startOfWeek } from "@/lib/utils";

export type ProgressMap<T extends { slug: string }> = Map<string, T>;

export function emptyLessonProgress(lessonSlug: string): LessonProgress {
  return {
    lessonSlug,
    status: "not_started",
    startedAt: null,
    completedAt: null,
    lastViewedAt: null,
  };
}

export function emptyMissionProgress(missionSlug: string): MissionProgress {
  return {
    missionSlug,
    status: "todo",
    notes: "",
    submissionUrl: "",
    score: null,
    startedAt: null,
    submittedAt: null,
    completedAt: null,
  };
}

export function lessonProgressMap(
  records: LessonProgress[],
): Map<string, LessonProgress> {
  return new Map(records.map((record) => [record.lessonSlug, record]));
}

export function missionProgressMap(
  records: MissionProgress[],
): Map<string, MissionProgress> {
  return new Map(records.map((record) => [record.missionSlug, record]));
}

export function summarizeModule(
  module: Module,
  moduleLessons: Lesson[],
  progress: Map<string, LessonProgress>,
): ModuleProgressSummary {
  const completed = moduleLessons.filter(
    (lesson) => progress.get(lesson.slug)?.status === "completed",
  ).length;
  const estimatedMinutes = moduleLessons.reduce(
    (total, lesson) => total + lesson.estimatedMinutes,
    0,
  );
  const completedMinutes = moduleLessons
    .filter((lesson) => progress.get(lesson.slug)?.status === "completed")
    .reduce((total, lesson) => total + lesson.estimatedMinutes, 0);

  return {
    module,
    lessonCount: moduleLessons.length,
    completedLessons: completed,
    percent: percent(completed, moduleLessons.length),
    estimatedMinutes,
    remainingMinutes: Math.max(0, estimatedMinutes - completedMinutes),
  };
}

export function summarizePhases(
  phases: Phase[],
  allModules: Module[],
  allLessons: Lesson[],
  progress: Map<string, LessonProgress>,
): PhaseProgressSummary[] {
  return phases
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((phase) => {
      const phaseModules = allModules
        .filter((module) => module.phaseSlug === phase.slug)
        .sort((a, b) => a.position - b.position)
        .map((module) =>
          summarizeModule(
            module,
            allLessons.filter((lesson) => lesson.moduleSlug === module.slug),
            progress,
          ),
        );
      const lessonCount = phaseModules.reduce((total, item) => total + item.lessonCount, 0);
      const completedLessons = phaseModules.reduce(
        (total, item) => total + item.completedLessons,
        0,
      );
      return {
        phase,
        modules: phaseModules,
        moduleCount: phaseModules.length,
        completedModules: phaseModules.filter(
          (item) => item.lessonCount > 0 && item.completedLessons === item.lessonCount,
        ).length,
        lessonCount,
        completedLessons,
        percent: percent(completedLessons, lessonCount),
      };
    });
}

export function orderedLessons(allLessons: Lesson[], allModules: Module[]): Lesson[] {
  const modulePositions = new Map(
    allModules.map((module) => [module.slug, module.position]),
  );
  return allLessons
    .slice()
    .sort((a, b) => {
      const moduleA = modulePositions.get(a.moduleSlug) ?? 0;
      const moduleB = modulePositions.get(b.moduleSlug) ?? 0;
      if (moduleA !== moduleB) return moduleA - moduleB;
      return a.position - b.position;
    });
}

export function pickMissionOfTheDay(
  missionRecords: MissionWithProgress[],
  date = new Date(),
): MissionWithProgress | null {
  const candidates = missionRecords.filter(
    (mission) => mission.progress.status !== "completed",
  );
  if (candidates.length === 0) return null;
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const sorted = candidates.slice().sort((a, b) => a.slug.localeCompare(b.slug));
  return sorted[dayOfYear % sorted.length] ?? null;
}

export function computeSkillProgress(
  missionRecords: MissionWithProgress[],
): Map<
  string,
  { level: SkillLevel; progress: number; validatedBy: string; count: number }
> {
  const counts = new Map<string, { count: number; titles: string[] }>();
  for (const mission of missionRecords) {
    if (mission.progress.status !== "completed") continue;
    for (const skillSlug of mission.skills) {
      const entry = counts.get(skillSlug) ?? { count: 0, titles: [] };
      entry.count += 1;
      entry.titles.push(mission.title);
      counts.set(skillSlug, entry);
    }
  }

  const result = new Map<
    string,
    { level: SkillLevel; progress: number; validatedBy: string; count: number }
  >();
  for (const [slug, entry] of counts) {
    const level = levelFromValidations(entry.count);
    result.set(slug, {
      level,
      progress: progressFromLevel(level),
      validatedBy: entry.titles.join(" · "),
      count: entry.count,
    });
  }
  return result;
}

export function buildSkillList(
  skills: Array<{
    slug: string;
    categorySlug: string;
    position: number;
    title: string;
    description: string;
    technique: string;
  }>,
  missionRecords: MissionWithProgress[],
): SkillWithProgress[] {
  const computed = computeSkillProgress(missionRecords);
  return skills.map((skill) => {
    const entry = computed.get(skill.slug);
    return {
      ...skill,
      level: entry?.level ?? "not_started",
      progress: entry?.progress ?? 0,
      validatedMissions: entry?.count ?? 0,
      validationLabel: entry?.validatedBy ?? "",
    };
  });
}

interface DashboardInput {
  profile: Profile;
  phases: Phase[];
  modules: Module[];
  lessons: Lesson[];
  missionRecords: MissionWithProgress[];
  progressRecords: LessonProgress[];
  date?: Date;
}

export function buildDashboardData({
  profile,
  phases,
  modules,
  lessons,
  missionRecords,
  progressRecords,
  date = new Date(),
}: DashboardInput): DashboardData {
  const progress = lessonProgressMap(progressRecords);
  const ordered = orderedLessons(lessons, modules);
  const phaseSummaries = summarizePhases(phases, modules, lessons, progress);

  const completedLessons = ordered.filter(
    (lesson) => progress.get(lesson.slug)?.status === "completed",
  ).length;

  const weekStart = startOfWeek(date).getTime();
  const weeklyMinutes = Math.round(
    progressRecords.reduce((total, record) => {
      const lesson = lessons.find((item) => item.slug === record.lessonSlug);
      if (!lesson) return total;
      const completedAt = record.completedAt ? new Date(record.completedAt).getTime() : 0;
      const viewedAt = record.lastViewedAt ? new Date(record.lastViewedAt).getTime() : 0;
      if (completedAt >= weekStart) return total + lesson.estimatedMinutes;
      if (viewedAt >= weekStart && record.status === "in_progress") {
        return total + Math.round(lesson.estimatedMinutes / 2);
      }
      return total;
    }, 0) +
      missionRecords.reduce((total, mission) => {
        const stamp = mission.progress.completedAt ?? mission.progress.submittedAt;
        if (!stamp) return total;
        if (new Date(stamp).getTime() < weekStart) return total;
        return total + mission.estimatedMinutes;
      }, 0),
  );

  const lastRecord = progressRecords
    .filter((record) => record.lastViewedAt)
    .sort(
      (a, b) =>
        new Date(b.lastViewedAt ?? 0).getTime() -
        new Date(a.lastViewedAt ?? 0).getTime(),
    )[0];

  let lastLesson: DashboardData["lastLesson"] = null;
  if (lastRecord) {
    const lesson = lessons.find((item) => item.slug === lastRecord.lessonSlug);
    const lessonModule = lesson
      ? modules.find((item) => item.slug === lesson.moduleSlug)
      : undefined;
    if (lesson && lessonModule) {
      const moduleLessons = lessons.filter((item) => item.moduleSlug === lessonModule.slug);
      const done = moduleLessons.filter(
        (item) => progress.get(item.slug)?.status === "completed",
      ).length;
      lastLesson = {
        lesson,
        module: lessonModule,
        progress: lastRecord,
        percent: percent(done, moduleLessons.length),
      };
    }
  }

  const lastIndex = lastRecord
    ? ordered.findIndex((lesson) => lesson.slug === lastRecord.lessonSlug)
    : -1;
  const nextCandidates = [
    ...ordered.slice(lastIndex + 1),
    ...ordered.slice(0, Math.max(lastIndex, 0)),
  ];
  const nextLessonCandidate = nextCandidates.find(
    (lesson) => progress.get(lesson.slug)?.status !== "completed",
  );
  const nextModule = nextLessonCandidate
    ? modules.find((module) => module.slug === nextLessonCandidate.moduleSlug)
    : undefined;
  const nextLesson =
    nextLessonCandidate && nextModule
      ? { lesson: nextLessonCandidate, module: nextModule }
      : null;

  const lastCompletedMission = missionRecords
    .filter((mission) => mission.progress.status === "completed" && mission.progress.completedAt)
    .sort(
      (a, b) =>
        new Date(b.progress.completedAt ?? 0).getTime() -
        new Date(a.progress.completedAt ?? 0).getTime(),
    )[0];

  return {
    profile,
    date: date.toISOString(),
    missionOfTheDay: pickMissionOfTheDay(missionRecords, date),
    lastLesson,
    nextLesson,
    globalPercent: percent(completedLessons, ordered.length),
    completedLessons,
    totalLessons: ordered.length,
    weeklyMinutes,
    weeklyGoalMinutes: profile.dailyGoalMinutes * 7,
    completedMissions: missionRecords.filter(
      (mission) => mission.progress.status === "completed",
    ).length,
    totalMissions: missionRecords.length,
    phases: phaseSummaries,
    lastCompletedMission: lastCompletedMission ?? null,
  };
}

export function attachLessonProgress(
  lessons: Lesson[],
  progress: Map<string, LessonProgress>,
): LessonWithProgress[] {
  return lessons.map((lesson) => ({
    ...lesson,
    progress: progress.get(lesson.slug) ?? emptyLessonProgress(lesson.slug),
  }));
}

export function attachMissionProgress(
  missions: Mission[],
  progress: Map<string, MissionProgress>,
): MissionWithProgress[] {
  return missions.map((mission) => ({
    ...mission,
    progress: progress.get(mission.slug) ?? emptyMissionProgress(mission.slug),
  }));
}
