import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Flag,
  Gauge,
  ListChecks,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { LessonMarkdown } from "@/components/lesson/lesson-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { setMissionStatusAction } from "@/lib/actions/missions";
import { requireUser } from "@/lib/auth/session";
import { loadMissionPage } from "@/lib/data/queries";
import {
  difficultyLabels,
  missionCategoryLabels,
  missionStatusLabels,
  skillLevelLabels,
} from "@/lib/labels";
import { formatDate, formatMinutes, percent } from "@/lib/utils";
import { MissionWorkspace } from "./mission-workspace";

interface MissionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MissionPageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser();
  const data = await loadMissionPage(user.id, id);
  return { title: data?.mission.title ?? "Mission" };
}

export default async function MissionPage({ params }: MissionPageProps) {
  const { id } = await params;
  const user = await requireUser();
  const data = await loadMissionPage(user.id, id);
  if (!data) notFound();

  const { mission, progress, module, phase, relatedSkills, moduleMissionCount, completedInModule } =
    data;
  const status = progress.status;
  const modulePercent = percent(completedInModule, moduleMissionCount);

  return (
    <div className="space-y-7">
      <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted">
        <Link href="/missions" className="transition-colors hover:text-ink">
          Missions
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        {module ? (
          <>
            <Link href={`/modules/${module.slug}`} className="transition-colors hover:text-ink">
              {module.title}
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
          </>
        ) : null}
        <span className="font-medium text-ink">Mission</span>
      </nav>

      <PageHeader
        eyebrow={
          <>
            <Badge variant="accent">
              {missionCategoryLabels[mission.category]}
            </Badge>
            <Badge variant="outline">Difficulté : {difficultyLabels[mission.difficulty]}</Badge>
            <Badge
              variant={
                status === "completed"
                  ? "success"
                  : status === "submitted"
                    ? "warning"
                    : status === "in_progress"
                      ? "accent"
                      : "neutral"
              }
            >
              {missionStatusLabels[status]}
            </Badge>
          </>
        }
        title={mission.title}
        description={mission.description}
        meta={
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              ~{formatMinutes(mission.estimatedMinutes)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              {mission.skills.length} compétence{mission.skills.length > 1 ? "s" : ""} visée
              {mission.skills.length > 1 ? "s" : ""}
            </span>
            {module ? (
              <span className="inline-flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                Module : {module.title}
              </span>
            ) : null}
          </div>
        }
        actions={
          status === "todo" ? (
            <form action={setMissionStatusAction}>
              <input type="hidden" name="missionSlug" value={mission.slug} />
              <input type="hidden" name="status" value="in_progress" />
              <Button type="submit">
                <Play aria-hidden="true" />
                Démarrer la mission
              </Button>
            </form>
          ) : status === "completed" ? (
            <Button asChild variant="secondary">
              <Link href="/missions">
                <ArrowLeft aria-hidden="true" />
                Retour aux missions
              </Link>
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href="#espace-de-travail">
                Aller à l&apos;espace de travail
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-5">
          <Card className="border-l-2 border-l-accent p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <h2 className="text-[14px] font-semibold tracking-tight text-ink">Contexte du problème</h2>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-[#55607a]">{mission.context}</p>
            <div className="mt-4 rounded-lg border border-line bg-canvas/50 px-3.5 py-3">
              <p className="df-label">Objectif</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink">{mission.objective}</p>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-ink">
                <FileCheck2 className="h-4 w-4 text-accent" aria-hidden="true" />
                Cahier des charges
              </h2>
              <p className="mt-1 text-[11.5px] text-muted">
                Instructions détaillées et livrable attendu.
              </p>
            </div>
            <div className="px-5 py-6 sm:px-6">
              <LessonMarkdown content={mission.instructionsMd} />
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <h2 className="flex items-center gap-2 text-[13.5px] font-semibold tracking-tight text-ink">
                <ListChecks className="h-4 w-4 text-accent" aria-hidden="true" />
                Exigences
              </h2>
              <ol className="mt-3 space-y-2.5">
                {mission.requirements.map((requirement, index) => (
                  <li key={requirement} className="flex items-start gap-2.5 text-[12px] leading-relaxed text-[#55607a]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-line bg-tint font-mono text-[9px] font-semibold text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {requirement}
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-5">
              <h2 className="flex items-center gap-2 text-[13.5px] font-semibold tracking-tight text-ink">
                <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
                Critères de réussite
              </h2>
              <ul className="mt-3 space-y-2.5">
                {mission.successCriteria.map((criterion) => (
                  <li key={criterion} className="flex items-start gap-2 text-[12px] leading-relaxed text-[#55607a]">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                    {criterion}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card id="espace-de-travail" className="scroll-mt-24 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
              <div>
                <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-ink">
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                  Espace de réponse & soumission
                </h2>
                <p className="mt-1 text-[11.5px] text-muted">
                  Vos notes et votre lien sont enregistrés côté serveur.
                </p>
              </div>
              <Badge variant={status === "completed" ? "success" : "neutral"}>
                {missionStatusLabels[status]}
              </Badge>
            </div>
            <div className="p-5">
              <MissionWorkspace
                missionSlug={mission.slug}
                notes={progress.notes}
                submissionUrl={progress.submissionUrl}
                status={status}
              />
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[13.5px] font-semibold tracking-tight text-ink">Statut</h2>
                <Badge
                  variant={
                    status === "completed"
                      ? "success"
                      : status === "submitted"
                        ? "warning"
                        : status === "in_progress"
                          ? "accent"
                          : "neutral"
                  }
                >
                  {missionStatusLabels[status]}
                </Badge>
              </div>

              {status === "submitted" ? (
                <form action={setMissionStatusAction} className="mt-4">
                  <input type="hidden" name="missionSlug" value={mission.slug} />
                  <input type="hidden" name="status" value="completed" />
                  <Button type="submit" size="sm" className="w-full">
                    <CheckCircle2 aria-hidden="true" />
                    Marquer comme terminée
                  </Button>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                    Cette action valide les compétences liées à la mission.
                  </p>
                </form>
              ) : status === "in_progress" ? (
                <div className="mt-4 space-y-2">
                  <div className="rounded-lg border border-accent/15 bg-accent-soft px-3 py-2.5 text-[11px] leading-relaxed text-[#3b4a6b]">
                    Complétez vos notes et votre lien, puis soumettez la mission depuis le
                    formulaire.
                  </div>
                  <form action={setMissionStatusAction}>
                    <input type="hidden" name="missionSlug" value={mission.slug} />
                    <input type="hidden" name="status" value="todo" />
                    <Button type="submit" variant="ghost" size="sm" className="w-full text-muted">
                      <RotateCcw aria-hidden="true" />
                      Remettre à zéro
                    </Button>
                  </form>
                </div>
              ) : status === "completed" ? (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-emerald-600/15 bg-success-soft px-3 py-2.5 text-[11px] text-success">
                    <p className="font-semibold">Mission validée</p>
                    {progress.completedAt ? (
                      <p className="mt-0.5 text-[10.5px] text-[#55607a]">
                        Terminée le {formatDate(progress.completedAt)}
                      </p>
                    ) : null}
                  </div>
                  {progress.score !== null ? (
                    <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                      <span className="df-label">Score</span>
                      <span className="font-mono text-[13px] font-semibold text-ink">
                        {progress.score}/100
                      </span>
                    </div>
                  ) : null}
                  {progress.submissionUrl ? (
                    <a
                      href={progress.submissionUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="df-link flex items-center gap-1.5 text-[11.5px]"
                    >
                      Ouvrir le livrable
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ) : null}
                  <form action={setMissionStatusAction}>
                    <input type="hidden" name="missionSlug" value={mission.slug} />
                    <input type="hidden" name="status" value="in_progress" />
                    <Button type="submit" variant="ghost" size="sm" className="w-full text-muted">
                      <RotateCcw aria-hidden="true" />
                      Rouvrir la mission
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-[11.5px] leading-relaxed text-muted">
                    Mission non commencée. Lancez-la pour enregistrer votre progression.
                  </p>
                  <form action={setMissionStatusAction}>
                    <input type="hidden" name="missionSlug" value={mission.slug} />
                    <input type="hidden" name="status" value="in_progress" />
                    <Button type="submit" size="sm" className="w-full">
                      <Play aria-hidden="true" />
                      Démarrer
                    </Button>
                  </form>
                </div>
              )}
            </Card>

            {module ? (
              <Card className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[13.5px] font-semibold tracking-tight text-ink">Module</h2>
                  <span className="font-mono text-[10.5px] text-muted">{modulePercent}%</span>
                </div>
                <Link
                  href={`/modules/${module.slug}`}
                  className="mt-2 block text-[12px] font-medium leading-snug text-ink hover:text-accent"
                >
                  {module.title}
                </Link>
                {phase ? <p className="mt-1 text-[10.5px] text-muted">{phase.title}</p> : null}
                <Progress value={modulePercent} className="mt-3" />
                <p className="mt-2 text-[10.5px] text-muted">
                  {completedInModule} / {moduleMissionCount} missions du module terminées
                </p>
              </Card>
            ) : null}

            <Card className="p-5">
              <h2 className="flex items-center gap-2 text-[13.5px] font-semibold tracking-tight text-ink">
                <Award className="h-4 w-4 text-accent" aria-hidden="true" />
                Compétences visées
              </h2>
              {relatedSkills.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {relatedSkills.map((skill) => (
                    <li key={skill.slug}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11.5px] font-medium text-ink">{skill.title}</span>
                        <Badge variant={skill.level === "not_started" ? "neutral" : "success"}>
                          {skillLevelLabels[skill.level]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{skill.description}</p>
                      <Progress value={skill.progress} className="mt-1.5" />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[11.5px] text-muted">Aucune compétence liée.</p>
              )}
            </Card>

            <div className="rounded-xl border border-line bg-surface px-4 py-3 text-[10.5px] leading-relaxed text-muted">
              <p className="flex items-center gap-1.5 font-semibold text-ink">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Règle de validation
              </p>
              <p className="mt-1">
                Les compétences ne progressent qu&apos;au passage de la mission au statut
                « Terminée ». Une simple ouverture ou soumission ne valide rien.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
