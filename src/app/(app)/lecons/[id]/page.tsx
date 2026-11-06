import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  ListChecks,
  Play,
  RotateCcw,
  Target,
} from "lucide-react";
import { LessonMarkdown } from "@/components/lesson/lesson-markdown";
import { LessonTracker } from "@/components/lesson/lesson-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { completeLessonAction, resetLessonAction } from "@/lib/actions/learning";
import { requireUser } from "@/lib/auth/session";
import { loadLessonPage } from "@/lib/data/queries";
import { missionCategoryLabels, missionStatusLabels, difficultyLabels } from "@/lib/labels";
import { cn, formatMinutes, formatShortDate } from "@/lib/utils";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser();
  const data = await loadLessonPage(user.id, id);
  return { title: data?.lesson.title ?? "Leçon" };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const user = await requireUser();
  const data = await loadLessonPage(user.id, id);
  if (!data) notFound();

  const {
    lesson,
    module,
    phase,
    moduleLessons,
    percent,
    position,
    total,
    previous,
    next,
    missions,
  } = data;

  const current = moduleLessons.find((item) => item.slug === lesson.slug);
  const status = current?.progress.status ?? "not_started";
  const isCompleted = status === "completed";
  const redirectTarget = next ? `/lecons/${next.slug}` : `/modules/${module.slug}`;

  return (
    <div className="space-y-6">
      <LessonTracker lessonSlug={lesson.slug} />

      <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted">
        <Link href="/parcours" className="transition-colors hover:text-ink">
          Mon parcours
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <Link href={`/modules/${module.slug}`} className="transition-colors hover:text-ink">
          {module.title}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="font-medium text-ink">
          Leçon {String(position).padStart(2, "0")}
        </span>
      </nav>

      <PageHeader
        eyebrow={
          <>
            <span className="df-eyebrow">
              {phase.title} · Module {String(module.position).padStart(2, "0")}
            </span>
            <Badge variant={isCompleted ? "success" : status === "in_progress" ? "accent" : "neutral"}>
              {isCompleted ? "Terminée" : status === "in_progress" ? "En cours" : "À commencer"}
            </Badge>
            <Badge variant="outline">{difficultyLabels[module.level]}</Badge>
          </>
        }
        title={lesson.title}
        description={lesson.summary}
        meta={
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {formatMinutes(lesson.estimatedMinutes)} de lecture
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Leçon {position} sur {total}
            </span>
            {lesson.codeLanguage ? (
              <span className="rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px] uppercase text-ink">
                {lesson.codeLanguage}
              </span>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_250px]">
        <aside className="order-2 lg:order-1">
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="overflow-hidden">
              <div className="border-b border-line px-4 py-3">
                <p className="df-label">Programme</p>
                <Link
                  href={`/modules/${module.slug}`}
                  className="mt-1 block text-[12px] font-semibold leading-snug text-ink hover:text-accent"
                >
                  {module.title}
                </Link>
                <div className="mt-2.5 flex items-center gap-2">
                  <Progress value={percent} className="flex-1" />
                  <span className="font-mono text-[10px] text-muted">{percent}%</span>
                </div>
              </div>
              <ol className="max-h-[420px] overflow-y-auto py-2 df-scroll">
                {moduleLessons.map((item) => {
                  const active = item.slug === lesson.slug;
                  const done = item.progress.status === "completed";
                  return (
                    <li key={item.slug}>
                      <Link
                        href={`/lecons/${item.slug}`}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-start gap-2 px-3 py-2 text-[11.5px] leading-snug transition-colors",
                          active
                            ? "bg-accent-soft font-semibold text-accent"
                            : "text-[#55607a] hover:bg-tint hover:text-ink",
                        )}
                      >
                        <span className="mt-0.5 shrink-0">
                          {done ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                          ) : active ? (
                            <Play className="h-3 w-3 fill-accent text-accent" aria-hidden="true" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-line-strong" aria-hidden="true" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="font-mono text-[9px] opacity-60">
                            {String(item.position).padStart(2, "0")}
                          </span>{" "}
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </Card>

            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href={`/modules/${module.slug}`}>
                <ArrowLeft aria-hidden="true" />
                Retour au module
              </Link>
            </Button>
          </div>
        </aside>

        <article className="order-1 min-w-0 lg:order-2">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-canvas/50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="df-eyebrow">Leçon {String(position).padStart(2, "0")}</span>
                <span className="text-[11px] text-muted">·</span>
                <span className="text-[11px] text-muted">{formatMinutes(lesson.estimatedMinutes)}</span>
              </div>
              {current?.progress.completedAt ? (
                <span className="text-[10.5px] text-muted">
                  Validée le {formatShortDate(current.progress.completedAt)}
                </span>
              ) : null}
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              <LessonMarkdown content={lesson.contentMd} />
            </div>

            {lesson.keyPoints.length > 0 ? (
              <div className="border-t border-line bg-canvas/40 px-5 py-5 sm:px-8 xl:hidden">
                <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <ListChecks className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  Points clés
                </h2>
                <ul className="mt-3 space-y-2">
                  {lesson.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-[12px] leading-relaxed text-muted">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-line bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Leçon validée
                    </Badge>
                    <form action={resetLessonAction}>
                      <input type="hidden" name="lessonSlug" value={lesson.slug} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-[11.5px] text-muted"
                      >
                        <RotateCcw aria-hidden="true" />
                        Repasser
                      </Button>
                    </form>
                  </>
                ) : (
                  <p className="text-[11.5px] text-muted">
                    La lecture seule ne valide aucune compétence.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!isCompleted ? (
                  <form action={completeLessonAction}>
                    <input type="hidden" name="lessonSlug" value={lesson.slug} />
                    <input type="hidden" name="redirectTo" value={redirectTarget} />
                    <Button type="submit" size="sm">
                      <CheckCircle2 aria-hidden="true" />
                      Marquer comme terminée
                    </Button>
                  </form>
                ) : next ? (
                  <Button asChild size="sm">
                    <Link href={`/lecons/${next.slug}`}>
                      Leçon suivante
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="sm">
                    <Link href={`/modules/${module.slug}`}>
                      Terminer le module
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/lecons/${previous.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-line-strong"
              >
                <ArrowLeft className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="df-eyebrow block">Leçon précédente</span>
                  <span className="mt-0.5 block truncate text-[12px] font-medium text-ink group-hover:text-accent">
                    {previous.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/lecons/${next.slug}`}
                className="group flex items-center justify-end gap-3 rounded-xl border border-line bg-surface p-3.5 text-right transition-colors hover:border-line-strong"
              >
                <span className="min-w-0">
                  <span className="df-eyebrow block">Leçon suivante</span>
                  <span className="mt-0.5 block truncate text-[12px] font-medium text-ink group-hover:text-accent">
                    {next.title}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </article>

        <aside className="order-3 hidden xl:block">
          <div className="space-y-4 xl:sticky xl:top-24">
            <Card className="p-4">
              <h2 className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
                <ListChecks className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Points clés
              </h2>
              {lesson.keyPoints.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {lesson.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[11.5px] text-muted">
                  Aucun point clé renseigné pour cette leçon.
                </p>
              )}
            </Card>

            <Card className="p-4">
              <h2 className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
                <Target className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Missions associées
              </h2>
              {missions.length > 0 ? (
                <ul className="mt-3 space-y-2.5">
                  {missions.map((mission) => (
                    <li key={mission.slug}>
                      <Link
                        href={`/missions/${mission.slug}`}
                        className="group block rounded-lg border border-line p-2.5 transition-colors hover:border-accent/30 hover:bg-accent-soft/40"
                      >
                        <span className="block text-[11.5px] font-medium leading-snug text-ink group-hover:text-accent">
                          {mission.title}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
                          {missionCategoryLabels[mission.category]}
                          {mission.progress.status !== "todo" ? (
                            <Badge variant={mission.progress.status === "completed" ? "success" : "accent"}>
                              {missionStatusLabels[mission.progress.status]}
                            </Badge>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[11.5px] text-muted">
                  Les missions de ce module sont accessibles depuis la page du module.
                </p>
              )}
            </Card>

            <div className="rounded-xl border border-accent/15 bg-accent-soft px-3.5 py-3 text-[11px] leading-relaxed text-[#3b4a6b]">
              <p className="font-semibold">Validation objective</p>
              <p className="mt-1 text-muted">
                Terminer une leçon met à jour votre progression, mais ne valide jamais une
                compétence à elle seule.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
