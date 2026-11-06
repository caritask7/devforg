import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  FolderKanban,
  Github,
  Globe,
  Linkedin,
  Pencil,
  Target,
} from "lucide-react";
import { PrintPortfolioButton } from "@/components/portfolio/print-button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth/session";
import { loadPortfolio } from "@/lib/data/queries";
import { formatDate, formatShortDate } from "@/lib/utils";
import { skillLevelLabels } from "@/lib/labels";

export const metadata: Metadata = { title: "Mon portfolio" };

export default async function PortfolioPage() {
  const user = await requireUser();
  const data = await loadPortfolio(user.id);
  const projectCount = data.projects.length;

  return (
    <div className="space-y-7 print:space-y-4">
      <PageHeader
        eyebrow={
          <>
            <span className="df-eyebrow">Portfolio d&apos;ingénierie</span>
            <Badge variant="success">Livrables vérifiés</Badge>
          </>
        }
        title="Mon Portfolio"
        description="Une synthèse factuelle de vos projets terminés, de vos compétences validées et de vos réalisations techniques."
        actions={
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button asChild variant="secondary" size="sm">
              <Link href="/parametres">
                <Pencil aria-hidden="true" />
                Modifier mon profil
              </Link>
            </Button>
            <PrintPortfolioButton />
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="h-24 bg-[#101a2e] relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.2) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="px-5 pb-5 sm:px-6">
          <div className="-mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar
              name={data.profile.fullName}
              src={data.profile.avatarUrl}
              size="xl"
              className="h-20 w-20 border-4 border-surface text-xl"
            />
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[22px] font-bold tracking-[-0.02em] text-ink">
                  {data.profile.fullName}
                </h2>
                <Badge variant="accent">Niveau {data.profile.level}</Badge>
              </div>
              <p className="mt-0.5 text-[12.5px] text-muted">
                {data.profile.headline || "Développeur en formation · DEVFORGE"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              {data.profile.githubUrl ? (
                <a
                  href={data.profile.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-tint"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  GitHub
                </a>
              ) : null}
              {data.profile.linkedinUrl ? (
                <a
                  href={data.profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-tint"
                >
                  <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                  LinkedIn
                </a>
              ) : null}
              {data.profile.websiteUrl ? (
                <a
                  href={data.profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-tint"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  Site
                </a>
              ) : null}
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-[12.5px] leading-relaxed text-[#55607a]">
            {data.profile.bio ||
              "Ajoutez une biographie depuis les paramètres pour présenter votre parcours et vos objectifs."}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-4">
            <div>
              <dt className="df-label">Missions terminées</dt>
              <dd className="mt-1 text-[20px] font-bold leading-none text-ink">
                {data.completedMissions}
              </dd>
            </div>
            <div>
              <dt className="df-label">Projets livrés</dt>
              <dd className="mt-1 text-[20px] font-bold leading-none text-ink">{projectCount}</dd>
            </div>
            <div>
              <dt className="df-label">Compétences actives</dt>
              <dd className="mt-1 text-[20px] font-bold leading-none text-ink">
                {data.skills.length}
              </dd>
            </div>
            <div>
              <dt className="df-label">Technologies</dt>
              <dd className="mt-1 text-[20px] font-bold leading-none text-ink">
                {data.technologies.length}
              </dd>
            </div>
          </dl>
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight text-ink">
              Projets terminés
            </h2>
            <p className="mt-1 text-[12px] text-muted">
              Seuls les projets au statut « Terminé » sont publiés ici.
            </p>
          </div>
          <Button asChild variant="link" size="sm" className="px-0 print:hidden">
            <Link href="/projets">
              Gérer les projets
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {data.projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="Aucun projet terminé pour l'instant"
            description="Complétez un projet et tous ses jalons pour le faire apparaître dans votre portfolio."
            action={
              <Button asChild>
                <Link href="/projets">Voir mes projets</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {data.projects.map((project) => (
              <Card key={project.id} className="flex flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    Terminé
                  </Badge>
                  {project.completedAt ? (
                    <span className="ml-auto text-[10.5px] text-muted">
                      {formatDate(project.completedAt)}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-[16px] font-semibold leading-snug tracking-tight text-ink">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-muted">
                  {project.summary || project.description}
                </p>
                {project.results ? (
                  <div className="mt-3 rounded-lg border border-emerald-600/15 bg-success-soft px-3 py-2">
                    <p className="df-label text-success/80">Résultats</p>
                    <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-[#065f46]">
                      {project.results}
                    </p>
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px] text-[#55607a]"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <span className="text-[10px] text-muted">
                    {project.milestones.length} jalons validés
                  </span>
                  <div className="flex gap-2 print:hidden">
                    {project.githubUrl ? (
                      <Button asChild variant="ghost" size="sm">
                        <a href={project.githubUrl} target="_blank" rel="noreferrer noopener">
                          <Github aria-hidden="true" />
                          Dépôt
                        </a>
                      </Button>
                    ) : null}
                    {project.demoUrl ? (
                      <Button asChild variant="ghost" size="sm">
                        <a href={project.demoUrl} target="_blank" rel="noreferrer noopener">
                          <ExternalLink aria-hidden="true" />
                          Démo
                        </a>
                      </Button>
                    ) : null}
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/projets/${project.id}`}>Détail</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 text-[16px] font-semibold tracking-tight text-ink">
                <Award className="h-4 w-4 text-accent" aria-hidden="true" />
                Compétences validées
              </h2>
              <p className="mt-1 text-[11.5px] text-muted">
                Niveaux issus uniquement des missions terminées.
              </p>
            </div>
            <Badge variant="neutral">{data.skills.length}</Badge>
          </div>

          {data.skills.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed border-line bg-canvas/40 px-4 py-8 text-center text-[12px] text-muted">
              Terminez une mission pour valider votre première compétence.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.skills.map((skill) => (
                <li key={skill.slug}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-medium text-ink">{skill.title}</span>
                    <Badge variant={skill.level === "advanced" ? "success" : "accent"} className="ml-auto">
                      {skillLevelLabels[skill.level]}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted">{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} className="mt-1.5" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[16px] font-semibold tracking-tight text-ink">
              <BriefcaseBusiness className="h-4 w-4 text-accent" aria-hidden="true" />
              Stack technique
            </h2>
            <Target className="h-4 w-4 text-muted" aria-hidden="true" />
          </div>
          <p className="mt-1 text-[11.5px] text-muted">
            Technologies utilisées dans vos projets terminés.
          </p>
          {data.technologies.length === 0 ? (
            <p className="mt-6 text-[12px] text-muted">Aucune technologie référencée.</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {data.technologies.map((technology) => (
                <span
                  key={technology.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1 font-mono text-[10.5px] text-[#55607a]"
                >
                  {technology.name}
                  <span className="rounded bg-surface px-1 text-[9px] text-muted">
                    {technology.count}
                  </span>
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 rounded-lg border border-accent/15 bg-accent-soft px-3 py-2.5 text-[10.5px] leading-relaxed text-[#3b4a6b]">
            <p className="font-semibold">Données vérifiables</p>
            <p className="mt-1 text-muted">
              Chaque projet exposé ici est associé à des jalons validés et à des missions
              terminées dans votre parcours.
            </p>
          </div>

          <div className="mt-4 border-t border-line pt-3 text-[10px] text-muted">
            Dernière mise à jour : {formatShortDate(data.profile.updatedAt)} · Phase 1 ·
            Portfolio personnel
          </div>
        </Card>
      </div>
    </div>
  );
}
