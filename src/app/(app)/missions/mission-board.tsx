"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FlaskConical,
  Play,
  RotateCw,
  Search,
  Swords,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/input";
import {
  difficultyLabels,
  difficultyOrder,
  missionCategoryLabels,
  missionCategoryOrder,
  missionStatusLabels,
} from "@/lib/labels";
import { cn, formatMinutes } from "@/lib/utils";
import type {
  Difficulty,
  MissionCategory,
  MissionProgressStatus,
  MissionWithProgress,
} from "@/lib/types";

const categoryIcon = {
  exercice: FlaskConical,
  defi: Swords,
  evaluation: ClipboardCheck,
} satisfies Record<MissionCategory, typeof Target>;

type StatusFilter = "all" | MissionProgressStatus;

interface MissionBoardProps {
  missions: MissionWithProgress[];
}

export function MissionBoard({ missions }: MissionBoardProps) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<MissionCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    return {
      all: missions.length,
      todo: missions.filter((mission) => mission.progress.status === "todo").length,
      in_progress: missions.filter((mission) => mission.progress.status === "in_progress").length,
      submitted: missions.filter((mission) => mission.progress.status === "submitted").length,
      completed: missions.filter((mission) => mission.progress.status === "completed").length,
    } satisfies Record<StatusFilter, number>;
  }, [missions]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return missions.filter((mission) => {
      if (status !== "all" && mission.progress.status !== status) return false;
      if (category !== "all" && mission.category !== category) return false;
      if (difficulty !== "all" && mission.difficulty !== difficulty) return false;
      if (!normalized) return true;
      return (
        mission.title.toLowerCase().includes(normalized) ||
        mission.description.toLowerCase().includes(normalized) ||
        mission.tags.some((tag) => tag.toLowerCase().includes(normalized))
      );
    });
  }, [missions, status, category, difficulty, query]);

  const tabs: Array<{ key: StatusFilter; label: string }> = [
    { key: "all", label: "Toutes les missions" },
    { key: "todo", label: "À faire" },
    { key: "in_progress", label: "En cours" },
    { key: "submitted", label: "Soumises" },
    { key: "completed", label: "Terminées" },
  ];

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filtrer par statut">
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
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                  active
                    ? "bg-accent text-white shadow-[0_1px_2px_rgba(23,32,51,0.12)]"
                    : "text-muted hover:bg-tint hover:text-ink",
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

          <div className="relative ml-auto w-full sm:w-64">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrer par module ou tag…"
              aria-label="Filtrer les missions"
              className="h-8 pl-8 text-[12px]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
          <label className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-muted">
            Typologie
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value as MissionCategory | "all")}
              className="h-7 w-auto pr-7 text-[11px] font-normal normal-case"
              aria-label="Filtrer par typologie"
            >
              <option value="all">Toutes</option>
              {missionCategoryOrder.map((item) => (
                <option key={item} value={item}>
                  {missionCategoryLabels[item]}
                </option>
              ))}
            </Select>
          </label>

          <label className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-muted">
            Difficulté
            <Select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty | "all")}
              className="h-7 w-auto pr-7 text-[11px] font-normal normal-case"
              aria-label="Filtrer par difficulté"
            >
              <option value="all">Tous niveaux</option>
              {difficultyOrder.map((item) => (
                <option key={item} value={item}>
                  {difficultyLabels[item]}
                </option>
              ))}
            </Select>
          </label>

          <span className="ml-auto font-mono text-[10.5px] text-muted">
            {results.length} résultat{results.length > 1 ? "s" : ""}
          </span>
        </div>
      </Card>

      {results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Aucune mission ne correspond"
          description="Élargissez les filtres ou effacez la recherche pour retrouver l'ensemble des missions."
          action={
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setStatus("all");
                setCategory("all");
                setDifficulty("all");
                setQuery("");
              }}
            >
              Réinitialiser les filtres
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {results.map((mission) => {
            const Icon = categoryIcon[mission.category];
            const progress = mission.progress.status;
            return (
              <Card
                key={mission.slug}
                className={cn(
                  "flex flex-col overflow-hidden border-t-2",
                  progress === "completed"
                    ? "border-t-success"
                    : progress === "in_progress"
                      ? "border-t-accent"
                      : progress === "submitted"
                        ? "border-t-warning"
                        : "border-t-line-strong",
                )}
              >
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={progress === "completed" ? "success" : "accent"}>
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {missionCategoryLabels[mission.category]}
                    </Badge>
                    <Badge variant="outline">Difficulté : {difficultyLabels[mission.difficulty]}</Badge>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />~
                      {formatMinutes(mission.estimatedMinutes)}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-tight text-ink">
                    {mission.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-muted">
                    {mission.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mission.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-line bg-tint px-1.5 py-0.5 font-mono text-[10px] text-[#55607a]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4">
                    <div
                      className={cn(
                        "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2.5",
                        progress === "completed"
                          ? "border-emerald-600/15 bg-success-soft"
                          : progress === "submitted"
                            ? "border-amber-600/15 bg-warning-soft"
                            : progress === "in_progress"
                              ? "border-accent/15 bg-accent-soft"
                              : "border-line bg-canvas/50",
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                        {progress === "completed" ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                        ) : progress === "in_progress" ? (
                          <RotateCw className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                        ) : (
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              progress === "submitted" ? "bg-warning" : "bg-muted/40",
                            )}
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={
                            progress === "completed"
                              ? "text-success"
                              : progress === "submitted"
                                ? "text-warning"
                                : progress === "in_progress"
                                  ? "text-accent"
                                  : "text-muted"
                          }
                        >
                          {missionStatusLabels[progress]}
                        </span>
                        {mission.progress.score !== null ? (
                          <span className="font-mono text-[10px] text-muted">
                            Score {mission.progress.score}/100
                          </span>
                        ) : null}
                      </span>
                      {mission.progress.submittedAt ? (
                        <span className="text-[10px] text-muted">Soumise</span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[10.5px] text-muted">
                        {mission.skills.length} compétence{mission.skills.length > 1 ? "s" : ""} visée
                        {mission.skills.length > 1 ? "s" : ""}
                      </span>
                      <Button asChild variant={progress === "todo" ? "secondary" : "default"} size="sm">
                        <Link href={`/missions/${mission.slug}`}>
                          {progress === "todo" ? (
                            <>
                              Démarrer
                              <ArrowRight aria-hidden="true" />
                            </>
                          ) : progress === "completed" ? (
                            <>
                              Revoir le livrable
                              <ArrowRight aria-hidden="true" />
                            </>
                          ) : (
                            <>
                              Reprendre
                              <Play aria-hidden="true" />
                            </>
                          )}
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

      <p className="text-center text-[10.5px] text-muted">
        Les compétences sont validées uniquement lorsqu&apos;une mission passe au statut
        « Terminée ». Une soumission seule ne débloque aucun niveau.
      </p>
    </div>
  );
}
