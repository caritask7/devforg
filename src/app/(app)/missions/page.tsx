import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Clock3, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/session";
import { loadMissionsPage } from "@/lib/data/queries";
import { formatMinutes, percent } from "@/lib/utils";
import { MissionBoard } from "./mission-board";

export const metadata: Metadata = { title: "Missions & défis techniques" };

export default async function MissionsPage() {
  const user = await requireUser();
  const data = await loadMissionsPage(user.id);
  const validationRate = percent(data.completed, data.missions.length);
  const currentMission = data.missions.find(
    (mission) => mission.progress.status === "in_progress",
  );

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={
          <>
            <span className="df-eyebrow">Workspace · Missions</span>
            <Badge variant="accent">Phase 1</Badge>
          </>
        }
        title="Missions & Défis techniques"
        description="Mettez à l'épreuve vos connaissances à travers des cas concrets d'ingénierie logicielle. Chaque mission terminée valide des compétences."
        actions={
          <div className="flex flex-wrap gap-2">
            <div className="rounded-lg border border-line bg-surface px-3 py-1.5">
              <p className="df-label">Temps de dev cible</p>
              <p className="mt-0.5 text-[13px] font-semibold text-ink">
                {formatMinutes(data.totalMinutes)}{" "}
                <span className="text-[10.5px] font-normal text-muted">au total</span>
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-3 py-1.5">
              <p className="df-label">Taux de validation</p>
              <p className="mt-0.5 text-[13px] font-semibold text-success">{validationRate}%</p>
            </div>
            {currentMission ? (
              <Button asChild size="sm" className="self-center">
                <Link href={`/missions/${currentMission.slug}`}>
                  Reprendre
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="df-card flex items-center gap-3.5 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Target className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="df-label">À faire</p>
            <p className="mt-0.5 text-[18px] font-bold leading-none text-ink">{data.todo}</p>
          </div>
          <span className="ml-auto text-[11px] text-muted">Missions disponibles</span>
        </div>
        <div className="df-card flex items-center gap-3.5 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-soft text-warning">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="df-label">En cours</p>
            <p className="mt-0.5 text-[18px] font-bold leading-none text-ink">
              {data.inProgress + data.submitted}
            </p>
          </div>
          <span className="ml-auto text-[11px] text-muted">
            {data.submitted} soumise{data.submitted > 1 ? "s" : ""}
          </span>
        </div>
        <div className="df-card flex items-center gap-3.5 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-soft text-success">
            <Award className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="df-label">Terminées</p>
            <p className="mt-0.5 text-[18px] font-bold leading-none text-ink">{data.completed}</p>
          </div>
          <span className="ml-auto text-[11px] text-muted">Compétences validées</span>
        </div>
      </div>

      <MissionBoard missions={data.missions} />
    </div>
  );
}
