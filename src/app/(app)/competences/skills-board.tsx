"use client";

import { useMemo, useState } from "react";
import {
  Binary,
  Blocks,
  BrainCircuit,
  Code2,
  Database,
  Network,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { skillLevelLabels } from "@/lib/labels";
import type { SkillCategoryWithSkills, SkillLevel } from "@/lib/types";

const categoryIcon = {
  programmation: Code2,
  algorithmique: Binary,
  "developpement-logiciel": Blocks,
  "bases-donnees": Database,
  "reseaux-systemes": Network,
  "intelligence-artificielle": BrainCircuit,
} as const;

type Filter = "all" | "active" | "advanced" | "not_started";

const filters: Array<{ key: Filter; label: string }> = [
  { key: "all", label: "Toutes les compétences" },
  { key: "active", label: "En cours" },
  { key: "advanced", label: "Avancées" },
  { key: "not_started", label: "Non commencées" },
];

const levelVariant: Record<SkillLevel, "neutral" | "accent" | "success" | "outline"> = {
  not_started: "neutral",
  beginner: "outline",
  intermediate: "accent",
  advanced: "success",
};

export function SkillsBoard({ categories }: { categories: SkillCategoryWithSkills[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        skills: category.skills.filter((skill) => {
          if (filter === "all") return true;
          if (filter === "not_started") return skill.level === "not_started";
          if (filter === "advanced") return skill.level === "advanced";
          return skill.level === "beginner" || skill.level === "intermediate";
        }),
      }))
      .filter((category) => category.skills.length > 0);
  }, [categories, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filtrer les compétences">
          {filters.map((item) => {
            const active = filter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.key)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3 text-[10.5px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" /> Avancé
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> Intermédiaire
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-line-strong" aria-hidden="true" /> Non commencé
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-6 py-12 text-center text-sm text-muted">
          Aucune compétence dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((category) => {
            const Icon =
              categoryIcon[category.slug as keyof typeof categoryIcon] ?? Code2;
            return (
              <section key={category.slug} className="df-card p-5">
                <div className="flex items-start gap-3 border-b border-line pb-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/15 bg-accent-soft text-accent">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[14px] font-semibold tracking-tight text-ink">
                      {category.title}
                    </h2>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                      {category.description}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 font-mono text-[10px] text-muted">
                    {category.skills.length} comp.
                  </span>
                </div>

                <ul className="divide-y divide-line">
                  {category.skills.map((skill) => (
                    <li key={skill.slug} className="py-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[12px] font-semibold text-ink">{skill.title}</h3>
                        <Badge variant={levelVariant[skill.level]} className="ml-auto">
                          {skillLevelLabels[skill.level]}
                        </Badge>
                        <span className="font-mono text-[10.5px] font-medium text-muted">
                          {skill.progress}%
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted">
                        {skill.description}
                      </p>
                      <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.03em] text-muted/80">
                        {skill.technique}
                      </p>
                      <Progress
                        value={skill.progress}
                        tone={skill.progress === 0 ? "muted" : "accent"}
                        className="mt-2"
                      />
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-[9.5px] text-muted">
                          {skill.validatedMissions > 0
                            ? `${skill.validatedMissions} mission${skill.validatedMissions > 1 ? "s" : ""} validée${skill.validatedMissions > 1 ? "s" : ""}`
                            : "En attente de validation"}
                        </span>
                        {skill.validationLabel ? (
                          <span
                            className="max-w-[60%] truncate text-[9.5px] text-muted"
                            title={skill.validationLabel}
                          >
                            {skill.validationLabel}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
