import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  ExternalLink,
  Github,
  Pencil,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { setMilestoneStatusAction } from "@/lib/actions/projects";
import { requireUser } from "@/lib/auth/session";
import { repository } from "@/lib/data";
import {
  milestoneStatusLabels,
  projectStatusLabels,
} from "@/lib/labels";
import {
  cn,
  formatDate,
  formatRelativeDate,
  percent,
} from "@/lib/utils";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser();
  const project = await repository.getProject(user.id, id);
  return { title: project?.title ?? "Projet" };
}

const projectStatusVariant = {
  idea: "neutral",
  todo: "outline",
  in_progress: "accent",
  done: "success",
} as const;

const milestoneVariant = {
  todo: "neutral",
  in_progress: "accent",
  done: "success",
} as const;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const user = await requireUser();
  const project = await repository.getProject(user.id, id);
  if (!project) notFound();

  const doneMilestones = project.milestones.filter(
    (milestone) => milestone.status === "done",
  ).length;
  const progress = percent(doneMilestones, project.milestones.length);

  return (
    <div className="space-y-7">
      <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted">
        <Link href="/projets" className="transition-colors hover:text-ink">
          Mes projets
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="max-w-[320px] truncate font-medium text-ink">{project.title}</span>
      </nav>

      <PageHeader
        eyebrow={
          <>
            <Badge variant={projectStatusVariant[project.status]}>
              {projectStatusLabels[project.status]}
            </Badge>
            {progress === 100 && project.milestones.length > 0 ? (
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Tous les jalons validés
              </Badge>
            ) : (
              <Badge variant="neutral">
                {doneMilestones} / {project.milestones.length} jalons
              </Badge>
            )}
          </>
        }
        title={project.title}
        description={project.summary || undefined}
        meta={
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Mis à jour {formatRelativeDate(project.updatedAt)}
            </span>
            {project.completedAt ? (
              <span className="inline-flex items-center gap-1.5 text-success">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Terminé le {formatDate(project.completedAt)}
              </span>
            ) : null}
          </div>
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href={`/projets/${project.id}/modifier`}>
                <Pencil aria-hidden="true" />
                Modifier
              </Link>
            </Button>
            <DeleteProjectDialog projectId={project.id} projectTitle={project.title} />
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-5">
          <Card className="p-5 sm:p-6">
            <h2 className="text-[14px] font-semibold tracking-tight text-ink">
              Description technique
            </h2>
            {project.description ? (
              <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-[#55607a]">
                {project.description}
              </p>
            ) : (
              <p className="mt-3 text-[12.5px] text-muted">
                Aucune description technique renseignée.{" "}
                <Link href={`/projets/${project.id}/modifier`} className="df-link">
                  Compléter la fiche du projet
                </Link>
                .
              </p>
            )}

            {project.technologies.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded border border-line bg-tint px-2 py-0.5 font-mono text-[10.5px] text-[#55607a]"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            ) : null}
          </Card>

          {project.results ? (
            <Card className="border-l-2 border-l-success p-5">
              <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-ink">
                <Sparkles className="h-4 w-4 text-success" aria-hidden="true" />
                Résultats obtenus
              </h2>
              <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-[#55607a]">
                {project.results}
              </p>
            </Card>
          ) : null}

          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-ink">
                  <Target className="h-4 w-4 text-accent" aria-hidden="true" />
                  Jalons de réalisation
                </h2>
                <p className="mt-1 text-[11.5px] text-muted">
                  {doneMilestones} / {project.milestones.length} étapes validées
                </p>
              </div>
              <Badge variant="accent">{progress}%</Badge>
            </div>

            {project.milestones.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-[12.5px] text-muted">
                  Aucun jalon défini pour ce projet.
                </p>
                <Button asChild variant="secondary" size="sm" className="mt-3">
                  <Link href={`/projets/${project.id}/modifier`}>Ajouter des jalons</Link>
                </Button>
              </div>
            ) : (
              <ol className="divide-y divide-line">
                {project.milestones.map((milestone) => {
                  const done = milestone.status === "done";
                  return (
                    <li key={milestone.id} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0">
                          {done ? (
                            <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
                          ) : milestone.status === "in_progress" ? (
                            <span className="relative flex h-5 w-5 items-center justify-center">
                              <span className="absolute h-5 w-5 rounded-full border-2 border-accent/25" />
                              <Play className="h-2.5 w-2.5 fill-accent text-accent" aria-hidden="true" />
                            </span>
                          ) : (
                            <Circle className="h-5 w-5 text-line-strong" aria-hidden="true" />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] text-muted">
                              {String(milestone.position).padStart(2, "0")}
                            </span>
                            <h3
                              className={cn(
                                "text-[13px] font-semibold leading-snug",
                                done ? "text-muted line-through" : "text-ink",
                              )}
                            >
                              {milestone.title}
                            </h3>
                            <Badge variant={milestoneVariant[milestone.status]}>
                              {milestoneStatusLabels[milestone.status]}
                            </Badge>
                          </div>
                          {milestone.description ? (
                            <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                              {milestone.description}
                            </p>
                          ) : null}
                          {milestone.completedAt ? (
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted">
                              <Clock3 className="h-3 w-3" aria-hidden="true" />
                              Validé le {formatDate(milestone.completedAt)}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                          {milestone.status === "todo" ? (
                            <form action={setMilestoneStatusAction}>
                              <input type="hidden" name="projectId" value={project.id} />
                              <input type="hidden" name="milestoneId" value={milestone.id} />
                              <input type="hidden" name="status" value="in_progress" />
                              <Button type="submit" variant="secondary" size="sm">
                                <Play aria-hidden="true" />
                                Démarrer
                              </Button>
                            </form>
                          ) : milestone.status === "in_progress" ? (
                            <>
                              <form action={setMilestoneStatusAction}>
                                <input type="hidden" name="projectId" value={project.id} />
                                <input type="hidden" name="milestoneId" value={milestone.id} />
                                <input type="hidden" name="status" value="done" />
                                <Button type="submit" size="sm">
                                  <CheckCircle2 aria-hidden="true" />
                                  Valider
                                </Button>
                              </form>
                              <form action={setMilestoneStatusAction}>
                                <input type="hidden" name="projectId" value={project.id} />
                                <input type="hidden" name="milestoneId" value={milestone.id} />
                                <input type="hidden" name="status" value="todo" />
                                <Button
                                  type="submit"
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label="Remettre à faire"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                </Button>
                              </form>
                            </>
                          ) : (
                            <form action={setMilestoneStatusAction}>
                              <input type="hidden" name="projectId" value={project.id} />
                              <input type="hidden" name="milestoneId" value={milestone.id} />
                              <input type="hidden" name="status" value="in_progress" />
                              <Button type="submit" variant="ghost" size="sm" className="text-muted">
                                <RotateCcw aria-hidden="true" />
                                Rouvrir
                              </Button>
                            </form>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="border-t border-line bg-canvas/40 px-5 py-3">
              <Progress value={progress} />
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="p-5">
              <div className="flex items-baseline justify-between">
                <p className="df-label">Avancement global</p>
                <span className="font-mono text-[24px] font-bold leading-none text-ink">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="mt-3" />
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[11.5px]">
                <div>
                  <dt className="text-muted">Jalons</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {doneMilestones} / {project.milestones.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Statut</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {projectStatusLabels[project.status]}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Démarré</dt>
                  <dd className="mt-0.5 font-semibold text-ink">
                    {project.startedAt ? formatDate(project.startedAt) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Créé</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{formatDate(project.createdAt)}</dd>
                </div>
              </dl>
            </Card>

            {project.githubUrl || project.demoUrl ? (
              <Card className="space-y-2 p-4">
                <p className="df-label">Liens du projet</p>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[11.5px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-tint"
                  >
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    Dépôt GitHub
                    <ArrowRight className="ml-auto h-3 w-3 text-muted" aria-hidden="true" />
                  </a>
                ) : null}
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[11.5px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-tint"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    Démonstration
                    <ArrowRight className="ml-auto h-3 w-3 text-muted" aria-hidden="true" />
                  </a>
                ) : null}
              </Card>
            ) : null}

            <div className="rounded-xl border border-accent/15 bg-accent-soft px-4 py-3 text-[10.5px] leading-relaxed text-[#3b4a6b]">
              <p className="flex items-center gap-1.5 font-semibold text-ink">
                <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Portfolio
              </p>
              <p className="mt-1">
                {project.status === "done"
                  ? "Ce projet terminé est publié dans votre portfolio."
                  : "Terminez tous les jalons pour faire passer ce projet en « Terminé » et l'exposer dans votre portfolio."}
              </p>
            </div>

            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link href="/projets">
                <ArrowLeft aria-hidden="true" />
                Retour aux projets
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
