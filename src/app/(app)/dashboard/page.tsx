import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleDot,
  Clock3,
  Flame,
  Play,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { requireUser } from "@/lib/auth/session";
import { loadDashboard } from "@/lib/data/queries";
import {
  difficultyLabels,
  missionCategoryLabels,
  missionStatusLabels,
} from "@/lib/labels";
import {
  formatLongDateWithWeekday,
  formatMinutes,
  percent,
} from "@/lib/utils";

export const metadata: Metadata = { title: "Tableau de bord" };

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Encore debout";
  if (hour < 12) return "Prêt à progresser aujourd'hui";
  if (hour < 18) return "Bon après-midi";
  return "Belle session ce soir";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await loadDashboard(user.id);

  const currentLesson = data.lastLesson?.lesson ?? data.nextLesson?.lesson ?? null;
  const currentModule = data.lastLesson?.module ?? data.nextLesson?.module ?? null;
  const currentPercent = data.lastLesson?.percent ?? 0;
  const currentProgress = data.lastLesson?.progress ?? null;
  const weeklyPercent = percent(data.weeklyMinutes, data.weeklyGoalMinutes);
  const availablePhases = data.phases.filter((item) => item.phase.status === "available");

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={
          <span className="df-eyebrow">
            {formatLongDateWithWeekday(new Date())} · Espace travail
          </span>
        }
        title={`${greeting()} ?`}
        description="La régularité forge l'expertise technique. Un problème résolu par jour."
        actions={
          <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            Environnement actif
            <span className="rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px] text-ink">
              Python 3.12
            </span>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        {data.missionOfTheDay ? (
          <Card className="flex flex-col overflow-hidden">
            <div className="flex flex-col gap-5 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">
                  <Target className="h-3 w-3" aria-hidden="true" />
                  Mission du jour
                </Badge>
                <Badge variant="outline">
                  {missionCategoryLabels[data.missionOfTheDay.category]}
                </Badge>
                <Badge variant="neutral">
                  {difficultyLabels[data.missionOfTheDay.difficulty]}
                </Badge>
                {data.missionOfTheDay.progress.status !== "todo" ? (
                  <Badge variant="warning">
                    {missionStatusLabels[data.missionOfTheDay.progress.status]}
                  </Badge>
                ) : null}
                <span className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-muted">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  ~{formatMinutes(data.missionOfTheDay.estimatedMinutes)}
                </span>
              </div>

              <div className="space-y-2.5">
                <h2 className="max-w-2xl text-[26px] font-bold leading-[1.18] tracking-[-0.025em] text-ink">
                  {data.missionOfTheDay.title}
                </h2>
                <p className="max-w-2xl text-[14px] leading-relaxed text-muted">
                  {data.missionOfTheDay.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {data.missionOfTheDay.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-line bg-tint px-2 py-0.5 font-mono text-[10.5px] text-[#55607a]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-line bg-canvas/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] text-muted">
                {data.missionOfTheDay.progress.status === "in_progress"
                  ? "Votre brouillon et vos notes sont conservés."
                  : "Objectif concret, critères de réussite explicites."}
              </p>
              <Button asChild>
                <Link href={`/missions/${data.missionOfTheDay.slug}`}>
                  {data.missionOfTheDay.progress.status === "todo"
                    ? "Commencer la mission"
                    : "Reprendre la mission"}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <EmptyState
              icon={CheckCircle2}
              title="Toutes les missions sont terminées"
              description="Excellent travail. Explorez vos projets personnels pour continuer à progresser."
              action={
                <Button asChild>
                  <Link href="/projets">Voir mes projets</Link>
                </Button>
              }
            />
          </Card>
        )}

        <Card className="flex flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="df-label">Continuer mon apprentissage</p>
              <p className="mt-1 text-[11px] text-muted">
                {currentProgress?.status === "completed"
                  ? "Dernière leçon terminée"
                  : "Reprise de votre session"}
              </p>
            </div>
            <Badge variant="accent">
              <BookOpen className="h-3 w-3" aria-hidden="true" />
              Leçon
            </Badge>
          </div>

          {currentLesson && currentModule ? (
            <div className="mt-5 flex flex-1 flex-col">
              <p className="df-eyebrow">{currentModule.title}</p>
              <h3 className="mt-2 text-[18px] font-semibold leading-snug tracking-tight text-ink">
                {currentLesson.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-muted">
                {currentLesson.summary}
              </p>

              <div className="mt-auto space-y-3 pt-5">
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span>Progression du module</span>
                  <span className="font-mono font-medium text-ink">{currentPercent}%</span>
                </div>
                <Progress value={currentPercent} />
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatMinutes(currentLesson.estimatedMinutes)} restantes
                  </span>
                  <Button asChild size="sm">
                    <Link href={`/lecons/${currentLesson.slug}`}>
                      <Play aria-hidden="true" />
                      {currentProgress?.status === "completed" ? "Relire" : "Reprendre"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-1 items-center">
              <p className="text-sm text-muted">
                Aucune leçon disponible pour le moment.
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Progression globale"
          value={`${data.globalPercent}%`}
          icon={TrendingUp}
          progress={data.globalPercent}
          accent={<Badge variant="accent">Niveau {data.profile.level}</Badge>}
          footnote={
            <>
              <span>
                {data.completedLessons} / {data.totalLessons} leçons validées
              </span>
              <span className="font-mono">Phase 1</span>
            </>
          }
        />
        <StatCard
          label="Temps d'apprentissage"
          value={formatMinutes(data.weeklyMinutes)}
          icon={Timer}
          progress={weeklyPercent}
          footnote={
            <>
              <span>Objectif hebdomadaire : {formatMinutes(data.weeklyGoalMinutes)}</span>
              <span className="font-mono">
                {weeklyPercent >= 100 ? "Atteint" : `${weeklyPercent}%`}
              </span>
            </>
          }
        />
        <StatCard
          label="Missions terminées"
          value={String(data.completedMissions).padStart(2, "0")}
          icon={CheckCircle2}
          tone="success"
          progress={percent(data.completedMissions, data.totalMissions)}
          accent={
            <Badge variant="success">
              / {data.totalMissions} au total
            </Badge>
          }
          footnote={
            <>
              <span>Validation par livrables</span>
              <span className="font-mono text-success">Objectif actif</span>
            </>
          }
        />
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight text-ink">Mon parcours</h2>
            <p className="mt-1 text-[12.5px] text-muted">
              Progression structurée à travers les paliers d&apos;ingénierie logicielle.
            </p>
          </div>
          <Button asChild variant="link" size="sm" className="px-0">
            <Link href="/parcours">
              Consulter le syllabus complet
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.phases.map(({ phase, percent: value, lessonCount, completedLessons }) => {
            const available = phase.status === "available";
            return (
              <div
                key={phase.slug}
                className="rounded-xl border border-line bg-canvas/40 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold text-muted">
                    {String(phase.position).padStart(2, "0")}
                  </span>
                  {available ? (
                    <Badge variant={value === 100 ? "success" : "accent"}>
                      {value === 100 ? "Terminé" : value === 0 ? "À commencer" : `En cours · ${value}%`}
                    </Badge>
                  ) : (
                    <Badge variant="neutral">À venir</Badge>
                  )}
                </div>
                <h3 className="mt-3 min-h-[38px] text-[13.5px] font-semibold leading-snug text-ink">
                  {phase.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
                  {phase.description}
                </p>
                <div className="mt-4">
                  <Progress value={available ? value : 0} tone={available ? "accent" : "muted"} />
                  <p className="mt-2 font-mono text-[10px] text-muted">
                    {available
                      ? `${completedLessons} / ${lessonCount} leçons`
                      : `${formatMinutes(phase.estimatedHours * 60)} estimées`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {availablePhases.length > 0 ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-accent/15 bg-accent-soft px-3.5 py-2.5 text-[12px] text-[#3b4a6b]">
            <CircleDot className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            Phase active :{" "}
            <Link
              href="/parcours"
              className="font-semibold text-accent hover:underline"
            >
              {availablePhases[0]?.phase.title}
            </Link>
            <span className="ml-auto hidden text-[11px] text-muted sm:inline">
              Les phases suivantes sont visibles en aperçu.
            </span>
          </div>
        ) : null}
      </Card>

      {data.lastCompletedMission ? (
        <div className="flex flex-col gap-3 rounded-xl border border-emerald-600/15 bg-success-soft px-5 py-4 sm:flex-row sm:items-center">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-600/20 bg-white/70 text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="df-label text-success/80">Dernière mission terminée</p>
            <p className="mt-0.5 truncate text-[13px] font-semibold text-[#065f46]">
              {data.lastCompletedMission.title}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {data.lastCompletedMission.progress.score !== null ? (
              <Badge variant="success">
                Score {data.lastCompletedMission.progress.score}/100
              </Badge>
            ) : null}
            <Button asChild variant="secondary" size="sm">
              <Link href={`/missions/${data.lastCompletedMission.slug}`}>Revoir le livrable</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-[12px] text-muted">
          <Flame className="h-4 w-4 text-warning" aria-hidden="true" />
          Aucune mission terminée pour l&apos;instant. Chaque livrable validé renforce vos
          compétences.
        </div>
      )}
    </div>
  );
}
