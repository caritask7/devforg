import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FolderKanban, Lightbulb, Plus, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/session";
import { loadProjects } from "@/lib/data/queries";
import { percent } from "@/lib/utils";
import { ProjectBoard } from "./project-board";

export const metadata: Metadata = { title: "Mes projets d'ingénierie" };

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await loadProjects(user.id);

  const done = projects.filter((project) => project.status === "done").length;
  const inProgress = projects.filter((project) => project.status === "in_progress").length;
  const ideas = projects.filter(
    (project) => project.status === "idea" || project.status === "todo",
  ).length;
  const totalMilestones = projects.reduce(
    (total, project) => total + project.milestones.length,
    0,
  );
  const doneMilestones = projects.reduce(
    (total, project) =>
      total + project.milestones.filter((milestone) => milestone.status === "done").length,
    0,
  );

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={
          <>
            <span className="df-eyebrow">Workspace · Projets</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/15 bg-success-soft px-2.5 py-1 text-[10.5px] font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              Portfolio actif
            </span>
          </>
        }
        title="Mes Projets d'Ingénierie"
        description="Conception et développement de systèmes réels pour forger un portfolio technique crédible."
        actions={
          <Button asChild>
            <Link href="/projets/nouveau">
              <Plus aria-hidden="true" />
              Nouveau projet
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="df-card p-4">
          <div className="flex items-center justify-between">
            <p className="df-label">Volume projets</p>
            <FolderKanban className="h-4 w-4 text-muted/60" aria-hidden="true" />
          </div>
          <p className="mt-2 text-[26px] font-bold leading-none text-ink">
            {projects.length}
            <span className="ml-1 text-[12px] font-medium text-muted">total</span>
          </p>
        </div>
        <div className="df-card p-4">
          <div className="flex items-center justify-between">
            <p className="df-label">En cours</p>
            <Timer className="h-4 w-4 text-muted/60" aria-hidden="true" />
          </div>
          <p className="mt-2 text-[26px] font-bold leading-none text-ink">{inProgress}</p>
        </div>
        <div className="df-card p-4">
          <div className="flex items-center justify-between">
            <p className="df-label">Jalons validés</p>
            <CheckCircle2 className="h-4 w-4 text-muted/60" aria-hidden="true" />
          </div>
          <p className="mt-2 text-[26px] font-bold leading-none text-ink">
            {doneMilestones}
            <span className="ml-1 text-[12px] font-medium text-muted">/ {totalMilestones}</span>
          </p>
          <p className="mt-1.5 text-[10.5px] text-muted">
            {percent(doneMilestones, totalMilestones)}% de couverture
          </p>
        </div>
        <div className="df-card p-4">
          <div className="flex items-center justify-between">
            <p className="df-label">Terminés</p>
            <Lightbulb className="h-4 w-4 text-muted/60" aria-hidden="true" />
          </div>
          <p className="mt-2 text-[26px] font-bold leading-none text-ink">{done}</p>
          <p className="mt-1.5 text-[10.5px] text-muted">
            {ideas} idée{ideas > 1 ? "s" : ""} / à démarrer
          </p>
        </div>
      </div>

      <ProjectBoard projects={projects} />
    </div>
  );
}
