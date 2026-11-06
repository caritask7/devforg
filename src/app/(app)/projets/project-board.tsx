"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FolderKanban,
  Github,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { projectStatusLabels } from "@/lib/labels";
import { cn, formatShortDate, percent } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/lib/types";

type StatusFilter = "all" | ProjectStatus;

const statusVariant = {
  idea: "neutral",
  todo: "outline",
  in_progress: "accent",
  done: "success",
} as const;

export function ProjectBoard({ projects }: { projects: Project[] }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      all: projects.length,
      idea: projects.filter((project) => project.status === "idea").length,
      todo: projects.filter((project) => project.status === "todo").length,
      in_progress: projects.filter((project) => project.status === "in_progress").length,
      done: projects.filter((project) => project.status === "done").length,
    }),
    [projects],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (status !== "all" && project.status !== status) return false;
      if (!normalized) return true;
      return (
        project.title.toLowerCase().includes(normalized) ||
        project.summary.toLowerCase().includes(normalized) ||
        project.technologies.some((technology) => technology.toLowerCase().includes(normalized))
      );
    });
  }, [projects, status, query]);

  const tabs: Array<{ key: StatusFilter; label: string }> = [
    { key: "all", label: "Tous" },
    { key: "in_progress", label: "En cours" },
    { key: "done", label: "Terminés" },
    { key: "todo", label: "À faire" },
    { key: "idea", label: "Idées" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filtrer les projets">
          {tabs.map((tab) => {
            const active = status === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatus(tab.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded px-1 py-0.5 font-mono text-[9.5px]",
                    active ? "bg-white/20" : "bg-tint",
                  )}
                >
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-64">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtrer par nom, techno…"
            aria-label="Filtrer les projets"
            className="h-9 pl-8 text-[12px]"
          />
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={projects.length === 0 ? "Aucun projet pour l'instant" : "Aucun projet ne correspond"}
          description={
            projects.length === 0
              ? "Créez votre premier projet pour transformer vos acquis en livrable concret et alimenter votre portfolio."
              : "Modifiez les filtres ou la recherche pour retrouver vos projets."
          }
          action={
            projects.length === 0 ? (
              <Button asChild>
                <Link href="/projets/nouveau">
                  <Plus aria-hidden="true" />
                  Créer un projet
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setStatus("all");
                  setQuery("");
                }}
              >
                Réinitialiser les filtres
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((project) => {
            const doneMilestones = project.milestones.filter(
              (milestone) => milestone.status === "done",
            ).length;
            const progress = percent(doneMilestones, project.milestones.length);
            return (
              <Card key={project.id} className="flex flex-col overflow-hidden">
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant[project.status]}>
                      {projectStatusLabels[project.status]}
                    </Badge>
                    {project.milestones.length > 0 ? (
                      <Badge variant="neutral">
                        {doneMilestones} / {project.milestones.length} jalons
                      </Badge>
                    ) : null}
                    <span className="ml-auto text-[10.5px] text-muted">
                      Mise à jour le {formatShortDate(project.updatedAt)}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-tight text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-muted">
                    {project.summary || project.description || "Aucun résumé renseigné."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 5).map((technology) => (
                      <span
                        key={technology}
                        className="rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px] text-[#55607a]"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    {project.milestones.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between text-[10.5px] text-muted">
                          <span>Avancement des jalons</span>
                          <span className="font-mono font-medium text-ink">{progress}%</span>
                        </div>
                        <Progress value={progress} className="mt-2" />
                      </>
                    ) : (
                      <p className="text-[10.5px] text-muted">Aucun jalon défini.</p>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 text-[10.5px] text-muted hover:text-ink"
                          >
                            <Github className="h-3 w-3" aria-hidden="true" />
                            Dépôt
                          </a>
                        ) : null}
                        {project.demoUrl ? (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1 text-[10.5px] text-muted hover:text-ink"
                          >
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            Démo
                          </a>
                        ) : null}
                      </div>
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/projets/${project.id}`}>
                          Ouvrir
                          <ArrowRight aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-accent/15 bg-accent-soft px-4 py-3 text-[11.5px] leading-relaxed text-[#3b4a6b] sm:flex-row sm:items-center">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
          {projects.some((project) => project.status === "done") ? (
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          )}
        </span>
        <p className="flex-1">
          Les projets terminés alimentent automatiquement votre portfolio public DEVFORGE.
          Un projet complété avec tous ses jalons est marqué comme terminé.
        </p>
        <Button asChild variant="secondary" size="sm">
          <Link href="/portfolio">
            Accéder au portfolio
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
