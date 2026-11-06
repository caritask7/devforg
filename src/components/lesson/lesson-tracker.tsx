"use client";

import { useEffect } from "react";
import { markLessonViewedAction } from "@/lib/actions/learning";

export function LessonTracker({ lessonSlug }: { lessonSlug: string }) {
  useEffect(() => {
    void markLessonViewedAction(lessonSlug);
  }, [lessonSlug]);

  return null;
}
