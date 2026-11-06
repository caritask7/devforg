import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  Play,
  Route,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth/session";
import { loadParcours } from "@/lib/data/queries";
import { difficultyLabels } from "@/lib/labels";
import { formatMinutes } from "@/lib/utils";

export const metadata: Metadata = { title: "Mon parcours" };

export default async function ParcoursPage() {
  const user = await requireUser();
  const data = await loadParcours(user.id);
  const moduleCount = data.phases.reduce((total, item) => total + item.moduleCount, 0);
  const completedModules = data.phases.reduce(
    (total, item) => total + item.completedModules,
    0,
  );

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={<span className="df-eyebrow">Curriculum technique rigoureux</span>}
        title="Mon Parcours"
        description="Feuille de route structurée pour acquérir une maîtrise fondamentale et la rigueur du développement logiciel."
        actions={
          data.activeModule ? (
            <Button asChild>
              <Link href={`/modules/${data.activeModule.slug}`}>
                <Play aria-hidden="true" />
                Reprendre le module actif
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/modules/python-fondamentaux">
                <Play aria-hidden="true" />
                Commencer la phase 1
              </Link>
            </Button>
          )
        }
      />

      <Card className="grid gap-0 overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3.5 border-b border-line p-5 sm:border-b-0 sm:border-r">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="22" cy="22" r="19" fill="none" stroke="#e9ecf2" strokeWidth="4" />
              <circle
                cx="22"
                cy="22"
                r="19"
                fill="none"
                stroke="#5267e8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(data.globalPercent / 100) * 119.4} 119.4`}
              />
            </svg>
            <span className="text-[13px] font-bold text-ink">{data.globalPercent}%</span>
          </div>
          <div className="min-w-0">
            <p className="df-label">Synthèse globale</p>
            <p className="mt-1 truncate text-[13.5px] font-semibold text-ink">
              {data.activePhase?.title ?? "Parcours terminé"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted">
              {data.completedLessons} / {data.totalLessons} leçons validées
            </p>
          </div>
        </div>

        <div className="border-b border-line p-5 sm:border-r lg:border-b-0">
          <p className="df-label">Modules validés</p>
          <p className="mt-2 text-[24px] font-bold leading-none tracking-[-0.02em] text-ink">
            {completedModules}
            <span className="ml-1 text-[13px] font-medium text-muted">/ {moduleCount}</span>
          </p>
          <p className="mt-2 text-[11px] text-muted">Phase 1 · 8 modules ouverts</p>
        </div>

        <div className="border-b border-line p-5 sm:border-b-0 sm:border-r">
          <p className="df-label">Temps restant estimé</p>
          <p className="mt-2 flex items-center gap-1.5 text-[24px] font-bold leading-none tracking-[-0.02em] text-ink">
            <Clock3 className="h-4 w-4 text-muted" aria-hidden="true" />
            {formatMinutes(data.remainingMinutes)}
          </p>
          <p className="mt-2 text-[11px] text-muted">Sur l&apos;ensemble des leçons disponibles</p>
        </div>

        <div className="p-5">
          <p className="df-label">Pipeline de formation</p>
          <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
            {data.phases.map((item) => (
              <span
                key={item.phase.slug}
                className={
                  item.phase.status === "available"
                    ? "h-full bg-accent"
                    : "h-full bg-line-strong"
                }
                style={{ width: `${100 / data.phases.length}%` }}
              />
            ))}
          </div>
          <p className="mt-2.5 text-[11px] text-muted">
            Phase 1 active · Phases 2 à 4 en préparation
          </p>
        </div>
      </Card>

      <div className="relative space-y-5">
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-[15px] top-8 hidden w-px bg-line sm:block"
        />
        {data.phases.map((summary) => {
          const { phase } = summary;
          const available = phase.status === "available";
          return (
            <section key={phase.slug} className="relative sm:pl-12">
              <span
                aria-hidden="true"
                className={
                  available
                    ? "absolute left-[7px] top-8 hidden h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-accent bg-surface sm:flex"
                    : "absolute left-[7px] top-8 hidden h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-line-strong bg-canvas sm:flex"
                }
              >
                <span
                  className={
                    available ? "h-1.5 w-1.5 rounded-full bg-accent" : "h-1.5 w-1.5 rounded-full bg-line-strong"
                  }
                />
              </span>

              <Card className="overflow-hidden">
                <div className="border-b border-line p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="df-eyebrow">Phase {String(phase.position).padStart(2, "0")}</span>
                        {available ? (
                          <Badge variant={summary.percent === 100 ? "success" : "accent"}>
                            {summary.percent === 100
                              ? "Terminée"
                              : summary.percent === 0
                                ? "À commencer"
                                : "En cours"}
                          </Badge>
                        ) : (
                          <Badge variant="neutral">
                            <Lock className="h-3 w-3" aria-hidden="true" />
                            À venir
                          </Badge>
                        )}
                      </div>
                      <h2 className="mt-2 text-[20px] font-bold tracking-[-0.02em] text-ink">
                        {phase.title}
                      </h2>
                      <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-muted">
                        {phase.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      {available ? (
                        <>
                          <p className="text-[20px] font-bold leading-none text-ink">
                            {summary.percent}%
                          </p>
                          <p className="mt-1 text-[11px] text-muted">
                            {summary.completedLessons} / {summary.lessonCount} leçons
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[13px] font-semibold text-muted">
                            {summary.moduleCount} modules
                          </p>
                          <p className="mt-1 text-[11px] text-muted">
                            {formatMinutes(phase.estimatedHours * 60)} estimées
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {available ? (
                    <Progress value={summary.percent} className="mt-5 max-w-md" />
                  ) : null}
                </div>

                <div className="p-5 sm:p-6">
                  <p className="df-label mb-3">
                    {available ? "Modules du cursus détaillé" : "Aperçu du programme"}
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {summary.modules.map((item) => {
                      const moduleAvailable = item.module.status === "available";
                      return moduleAvailable && available ? (
                        <Link
                          key={item.module.slug}
                          href={`/modules/${item.module.slug}`}
                          className="group rounded-xl border border-line bg-canvas/40 p-4 transition-colors hover:border-accent/30 hover:bg-accent-soft/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="df-eyebrow">
                              Module {String(item.module.position).padStart(2, "0")}
                            </span>
                            {item.percent === 100 ? (
                              <Badge variant="success">
                                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                100%
                              </Badge>
                            ) : item.percent > 0 ? (
                              <Badge variant="accent">En cours · {item.percent}%</Badge>
                            ) : (
                              <Badge variant="neutral">À commencer</Badge>
                            )}
                          </div>
                          <h3 className="mt-2 flex items-start gap-1.5 text-[13.5px] font-semibold leading-snug text-ink">
                            {item.lessonCount > 0 && item.completedLessons === item.lessonCount ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                            ) : (
                              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                            )}
                            {item.module.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
                            {item.module.description}
                          </p>
                          <div className="mt-3">
                            <Progress value={item.percent} />
                          </div>
                          <div className="mt-2.5 flex items-center justify-between text-[10.5px] text-muted">
                            <span>
                              {item.completedLessons} / {item.lessonCount} leçons ·{" "}
                              {difficultyLabels[item.module.level]}
                            </span>
                            <span className="inline-flex items-center gap-1 font-medium text-accent">
                              Ouvrir
                              <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <div
                          key={item.module.slug}
                          className="rounded-xl border border-dashed border-line bg-canvas/30 p-4"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="df-eyebrow">
                              Module {String(item.module.position).padStart(2, "0")}
                            </span>
                            <Badge variant="neutral">À venir</Badge>
                          </div>
                          <h3 className="mt-2 text-[13.5px] font-semibold leading-snug text-ink/80">
                            {item.module.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
                            {item.module.description}
                          </p>
                          <p className="mt-3 font-mono text-[10px] text-muted">
                            {formatMinutes(item.module.estimatedMinutes)} ·{" "}
                            {difficultyLabels[item.module.level]}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {available && summary.modules.some((item) => item.percent > 0 && item.percent < 100) ? (
                    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-accent/15 bg-accent-soft px-4 py-3 sm:flex-row sm:items-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
                        <Route className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-ink">Prochain jalon</p>
                        <p className="truncate text-[11.5px] text-[#55607a]">
                          {
                            summary.modules.find((item) => item.percent > 0 && item.percent < 100)
                              ?.module.title
                          }
                        </p>
                      </div>
                      {(() => {
                        const next = summary.modules.find(
                          (item) => item.percent > 0 && item.percent < 100,
                        );
                        return next ? (
                          <Button asChild variant="secondary" size="sm">
                            <Link href={`/modules/${next.module.slug}`}>
                              Continuer
                              <ArrowRight aria-hidden="true" />
                            </Link>
                          </Button>
                        ) : null;
                      })()}
                    </div>
                  ) : null}
                </div>
              </Card>
            </section>
          );
        })}
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-[11.5px] leading-relaxed text-muted">
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
        <p>
          Programme validé par le comité pédagogique DEVFORGE. Les compétences sont
          validées uniquement par des missions terminées, jamais par la simple
          consultation d&apos;une leçon.
        </p>
      </div>
    </div>
  );
}
