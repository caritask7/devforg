import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, ShieldCheck, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth/session";
import { loadSkillsPage } from "@/lib/data/queries";
import { SkillsBoard } from "./skills-board";

export const metadata: Metadata = { title: "Mes compétences" };

export default async function SkillsPage() {
  const user = await requireUser();
  const data = await loadSkillsPage(user.id);

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={
          <>
            <span className="df-eyebrow">Répertoire d&apos;évaluation</span>
            <Badge variant="accent">Phase 1 · Évaluation continue</Badge>
          </>
        }
        title="Mes Compétences"
        description="Cartographie objective de vos acquis techniques et niveau de maîtrise pratique. Seules les missions terminées valident un niveau."
        actions={
          <div className="flex flex-wrap gap-2">
            <div className="rounded-lg border border-line bg-surface px-3 py-1.5">
              <p className="df-label">Évaluées</p>
              <p className="mt-0.5 text-[13px] font-semibold text-ink">
                {data.evaluated} / {data.totalSkills}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-3 py-1.5">
              <p className="df-label">Intermédiaires +</p>
              <p className="mt-0.5 text-[13px] font-semibold text-accent">
                {data.intermediateOrAbove}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-3 py-1.5">
              <p className="df-label">Avancées</p>
              <p className="mt-0.5 text-[13px] font-semibold text-success">{data.advanced}</p>
            </div>
          </div>
        }
      />

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="df-label">Indice global d&apos;assimilation</p>
            <p className="mt-1 text-[12px] text-muted">
              {data.evaluated} compétences évaluées sur {data.totalSkills} ·{" "}
              {data.intermediateOrAbove} de niveau intermédiaire ou supérieur
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[20px] font-bold leading-none text-ink">
              {data.coverage}%
            </span>
            <Badge variant="success">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Progression liée aux missions
            </Badge>
          </div>
        </div>
        <Progress value={data.coverage} className="mt-3" />
      </Card>

      <SkillsBoard categories={data.categories} />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-[11px] leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <p>
            <span className="font-semibold text-ink">Critères de certification DEVFORGE :</span>{" "}
            un niveau n&apos;est attribué que par des missions terminées et des livrables
            vérifiés. La consultation d&apos;une leçon ou l&apos;ouverture d&apos;une mission ne
            valide aucune compétence.
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link href="/missions">
            <Award aria-hidden="true" />
            Valider une compétence
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-[10.5px] text-muted">
        <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
        Les niveaux sont recalculés à partir de vos missions terminées à chaque validation.
      </div>
    </div>
  );
}
