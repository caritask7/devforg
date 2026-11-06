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
  Lock,
  Play,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth/session";
import { loadModulePage } from "@/lib/data/queries";
import {
  difficultyLabels,
  lessonStatusLabels,
  missionCategoryLabels,
  missionStatusLabels,
} from "@/lib/labels";
import { formatMinutes } from "@/lib/utils";

interface ModulePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const user = await requireUser();
  const data = await loadModulePage(user.id, slug);
  return { title: data?.module.title ?? "Module" };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const user = await requireUser();
  const data = await loadModulePage(user.id, slug);
  if (!data) notFound();

  const {
    module,
    phase,
    lessons,
    completedLessons,
    percent,
    remainingMinutes,
    nextLesson,
    missions,
    previousModule,
    nextModule,
  } = data;
  const locked = module.status === "coming_soon";

  return (
    <div className="space-y-7">
      <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted">
        <Link href="/parcours" className="transition-colors hover:text-ink">
          Mon parcours
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span>
          Phase {String(phase.position).padStart(2, "0")} · {phase.title}
        </span>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="font-medium text-ink">
          Module {String(module.position).padStart(2, "0")}
        </span>
      </nav>

      <PageHeader
        eyebrow={
          <>
            <span className="df-eyebrow">
              Module {String(module.position).padStart(2, "0")}
            </span>
            <Badge variant={locked ? "neutral" : percent === 100 ? "success" : "accent"}>
              {locked ? "À venir" : percent === 100 ? "Terminé" : percent > 0 ? "En cours" : "À commencer"}
            </Badge>
            <Badge variant="outline">{difficultyLabels[module.level]}</Badge>
          </>
        }
        title={module.title}
        description={module.description}
        meta={
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {lessons.length} leçons
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {formatMinutes(module.estimatedMinutes)} estimées
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              {missions.length} missions liées
            </span>
          </div>
        }
        actions={
          !locked && nextLesson ? (
            <Button asChild>
              <Link href={`/lecons/${nextLesson.slug}`}>
                <Play aria-hidden="true" />
                {percent === 0 ? "Commencer le module" : "Reprendre la leçon"}
              </Link>
            </Button>
          ) : null
        }
      />

      {locked ? (
        <Card className="flex flex-col items-center px-6 py-16 text-center">
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-tint text-muted">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Ce module ouvre prochainement
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Terminez d&apos;abord la phase 1 pour débloquer le programme complet. Le
            contenu est déjà visible dans le syllabus.
          </p>
          <Button asChild variant="secondary" className="mt-5">
            <Link href="/parcours">Voir le syllabus</Link>
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.9fr_1fr]">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                <div>
                  <h2 className="text-[15px] font-semibold tracking-tight text-ink">
                    Programme du module
                  </h2>
                  <p className="mt-0.5 text-[11.5px] text-muted">
                    {completedLessons} / {lessons.length} leçons validées
                  </p>
                </div>
                <Badge variant="accent">{percent}%</Badge>
              </div>
              <ol className="divide-y divide-line">
                {lessons.map((lesson) => {
                  const status = lesson.progress.status;
                  return (
                    <li key={lesson.slug}>
                      <Link
                        href={`/lecons/${lesson.slug}`}
                        className="group flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-canvas/60"
                      >
                        <span className="mt-0.5 shrink-0">
                          {status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-success" aria-label="Terminée" />
                          ) : status === "in_progress" ? (
                            <span className="relative flex h-5 w-5 items-center justify-center">
                              <span className="absolute h-5 w-5 rounded-full border-2 border-accent/25" />
                              <Play className="h-2.5 w-2.5 fill-accent text-accent" aria-label="En cours" />
                            </span>
                          ) : (
                            <Circle className="h-5 w-5 text-line-strong" aria-label="À commencer" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] text-muted">
                              {String(lesson.position).padStart(2, "0")}
                            </span>
                            <span className="text-[13.5px] font-semibold leading-snug text-ink group-hover:text-accent">
                              {lesson.title}
                            </span>
                            {status === "in_progress" ? (
                              <Badge variant="accent">En cours</Badge>
                            ) : null}
                          </span>
                          <span className="mt-1 block text-[12px] leading-relaxed text-muted">
                            {lesson.summary}
                          </span>
                          <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10.5px] text-muted">
                            <Clock3 className="h-3 w-3" aria-hidden="true" />
                            {formatMinutes(lesson.estimatedMinutes)}
                          </span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-line-strong transition-colors group-hover:text-accent" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <h2 className="text-[14px] font-semibold tracking-tight text-ink">
                  Avancement
                </h2>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-[28px] font-bold leading-none text-ink">{percent}%</span>
                  <span className="text-[11px] text-muted">
                    {remainingMinutes > 0
                      ? `${formatMinutes(remainingMinutes)} restantes`
                      : "Module terminé"}
                  </span>
                </div>
                <Progress value={percent} className="mt-3" />
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[11.5px]">
                  <div>
                    <dt className="text-muted">Leçons</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {completedLessons} / {lessons.length}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Statut</dt>
                    <dd className="mt-0.5 font-semibold text-ink">
                      {lessonStatusLabels[percent === 100 ? "completed" : percent > 0 ? "in_progress" : "not_started"]}
                    </dd>
                  </div>
                </dl>
                {nextLesson ? (
                  <Button asChild className="mt-4 w-full" size="sm">
                    <Link href={`/lecons/${nextLesson.slug}`}>
                      <Play aria-hidden="true" />
                      {percent === 0 ? "Commencer" : "Continuer"}
                    </Link>
                  </Button>
                ) : null}
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[14px] font-semibold tracking-tight text-ink">
                    Objectifs
                  </h2>
                  <ListChecks className="h-4 w-4 text-muted" aria-hidden="true" />
                </div>
                {module.objectives.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {module.objectives.map((objective) => (
                      <li key={objective} className="flex items-start gap-2 text-[12px] leading-relaxed text-muted">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent/70" aria-hidden="true" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[12px] text-muted">Objectifs détaillés à venir.</p>
                )}
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[14px] font-semibold tracking-tight text-ink">
                    Missions du module
                  </h2>
                  <Badge variant="neutral">{missions.length}</Badge>
                </div>
                {missions.length > 0 ? (
                  <ul className="mt-3 space-y-1.5">
                    {missions.map((mission) => (
                      <li key={mission.slug}>
                        <Link
                          href={`/missions/${mission.slug}`}
                          className="group flex items-start gap-2 rounded-lg p-1.5 transition-colors hover:bg-tint"
                        >
                          <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[12px] font-medium leading-snug text-ink group-hover:text-accent">
                              {mission.title}
                            </span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
                              {missionCategoryLabels[mission.category]} ·{" "}
                              {formatMinutes(mission.estimatedMinutes)}
                              {mission.progress.status !== "todo" ? (
                                <Badge variant={mission.progress.status === "completed" ? "success" : "accent"}>
                                  {missionStatusLabels[mission.progress.status]}
                                </Badge>
                              ) : null}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[12px] text-muted">
                    Aucune mission n&apos;est encore rattachée à ce module.
                  </p>
                )}
              </Card>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            {previousModule ? (
              <Button asChild variant="secondary" size="sm">
                <Link href={`/modules/${previousModule.slug}`}>
                  <ArrowLeft aria-hidden="true" />
                  <span className="max-w-[240px] truncate">{previousModule.title}</span>
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {nextModule ? (
              <Button asChild variant="secondary" size="sm">
                <Link href={`/modules/${nextModule.slug}`}>
                  <span className="max-w-[240px] truncate">{nextModule.title}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <span />
            )}
          </div>
        </>
      )}
    </div>
  );
}
