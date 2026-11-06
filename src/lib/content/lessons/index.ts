import type { Lesson } from "@/lib/types";
import { module01Lessons } from "./module-01";
import { module02Lessons } from "./module-02";
import { module03Lessons } from "./module-03";
import { module04Lessons } from "./module-04";
import { module05Lessons } from "./module-05";
import { module06Lessons } from "./module-06";
import { module07Lessons } from "./module-07";
import { module08Lessons } from "./module-08";

export const lessons: Lesson[] = [
  ...module01Lessons,
  ...module02Lessons,
  ...module03Lessons,
  ...module04Lessons,
  ...module05Lessons,
  ...module06Lessons,
  ...module07Lessons,
  ...module08Lessons,
];

export function lessonsForModule(moduleSlug: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.moduleSlug === moduleSlug)
    .sort((a, b) => a.position - b.position);
}

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getLessonByRoute(moduleSlug: string, lessonSlug: string): Lesson | undefined {
  return lessons.find(
    (lesson) => lesson.moduleSlug === moduleSlug && lesson.slug === lessonSlug,
  );
}

export const totalLessonMinutes = lessons.reduce(
  (total, lesson) => total + lesson.estimatedMinutes,
  0,
);
