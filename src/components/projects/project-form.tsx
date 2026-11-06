"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { GripVertical, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { createProjectAction, updateProjectAction } from "@/lib/actions/projects";
import { projectStatusLabels, projectStatusOrder } from "@/lib/labels";
import type { FormState } from "@/lib/validation";
import type { Project, ProjectStatus } from "@/lib/types";

interface MilestoneDraft {
  key: string;
  title: string;
  description: string;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  project?: Project;
}

let milestoneSequence = 0;
function nextKey(): string {
  milestoneSequence += 1;
  return `milestone-${milestoneSequence}`;
}

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const action = mode === "edit" ? updateProjectAction : createProjectAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const [milestones, setMilestones] = useState<MilestoneDraft[]>(
    project?.milestones.length
      ? project.milestones.map((milestone) => ({
          key: nextKey(),
          title: milestone.title,
          description: milestone.description,
        }))
      : [{ key: nextKey(), title: "", description: "" }],
  );

  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "idea");

  function updateMilestone(key: string, patch: Partial<MilestoneDraft>) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.key === key ? { ...milestone, ...patch } : milestone,
      ),
    );
  }

  function addMilestone() {
    setMilestones((current) => [...current, { key: nextKey(), title: "", description: "" }]);
  }

  function removeMilestone(key: string) {
    setMilestones((current) => current.filter((milestone) => milestone.key !== key));
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {mode === "edit" && project ? (
        <input type="hidden" name="projectId" value={project.id} />
      ) : null}

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Card className="space-y-5 p-5 sm:p-6">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">Identité du projet</h2>
          <p className="mt-1 text-[11.5px] text-muted">
            Un titre clair et un résumé orienté résultat facilitent la lecture de votre portfolio.
          </p>
        </div>

        <Field label="Titre" htmlFor="title" required error={state.fieldErrors?.title?.[0]}>
          <Input
            id="title"
            name="title"
            defaultValue={project?.title}
            placeholder="CLI de suivi de tâches"
            required
          />
        </Field>

        <Field
          label="Résumé"
          htmlFor="summary"
          hint="1 à 2 phrases"
          error={state.fieldErrors?.summary?.[0]}
        >
          <Textarea
            id="summary"
            name="summary"
            rows={2}
            defaultValue={project?.summary}
            placeholder="Objectif du projet, problème résolu et valeur produite."
          />
        </Field>

        <Field
          label="Description technique"
          htmlFor="description"
          hint="Architecture, choix, difficultés"
          error={state.fieldErrors?.description?.[0]}
        >
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={project?.description}
            placeholder="Décrivez l'architecture, les contraintes et les décisions techniques importantes."
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Statut"
            htmlFor="status"
            error={state.fieldErrors?.status?.[0]}
          >
            <Select
              id="status"
              name="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ProjectStatus)}
            >
              {projectStatusOrder.map((item) => (
                <option key={item} value={item}>
                  {projectStatusLabels[item]}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Technologies"
            htmlFor="technologies"
            hint="Séparées par des virgules"
            error={state.fieldErrors?.technologies?.[0]}
          >
            <Input
              id="technologies"
              name="technologies"
              defaultValue={project?.technologies.join(", ")}
              placeholder="Python, pytest, SQLite"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Dépôt GitHub"
            htmlFor="githubUrl"
            error={state.fieldErrors?.githubUrl?.[0]}
          >
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              defaultValue={project?.githubUrl}
              placeholder="https://github.com/…"
            />
          </Field>
          <Field
            label="Démo en ligne"
            htmlFor="demoUrl"
            error={state.fieldErrors?.demoUrl?.[0]}
          >
            <Input
              id="demoUrl"
              name="demoUrl"
              type="url"
              defaultValue={project?.demoUrl}
              placeholder="https://…"
            />
          </Field>
        </div>

        <Field
          label="Résultats obtenus"
          htmlFor="results"
          hint="Tests, couverture, métriques"
          error={state.fieldErrors?.results?.[0]}
        >
          <Textarea
            id="results"
            name="results"
            rows={3}
            defaultValue={project?.results}
            placeholder="12 tests, 91 % de couverture, installation en 3 commandes…"
          />
        </Field>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-ink">
              Jalons de réalisation
            </h2>
            <p className="mt-1 text-[11.5px] text-muted">
              Découpez le projet en étapes vérifiables. Leur avancement alimente la progression.
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addMilestone}>
            <Plus aria-hidden="true" />
            Ajouter un jalon
          </Button>
        </div>

        {state.fieldErrors?.milestones?.[0] ? (
          <p className="mt-3 text-[12px] font-medium text-danger" role="alert">
            {state.fieldErrors.milestones[0]}
          </p>
        ) : null}

        {milestones.length === 0 ? (
          <p className="mt-5 rounded-lg border border-dashed border-line bg-canvas/40 px-4 py-6 text-center text-[12px] text-muted">
            Aucun jalon. Vous pourrez en ajouter plus tard.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {milestones.map((milestone, index) => (
              <li key={milestone.key} className="rounded-xl border border-line bg-canvas/40 p-3.5">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 shrink-0 text-line-strong" aria-hidden="true" />
                  <span className="df-eyebrow">Jalon {String(index + 1).padStart(2, "0")}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeMilestone(milestone.key)}
                    className="ml-auto text-muted hover:text-danger"
                    aria-label={`Supprimer le jalon ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[1fr_1.4fr]">
                  <Input
                    name="milestoneTitle"
                    value={milestone.title}
                    onChange={(event) =>
                      updateMilestone(milestone.key, { title: event.target.value })
                    }
                    placeholder={`Jalon ${index + 1} : titre`}
                    aria-label={`Titre du jalon ${index + 1}`}
                  />
                  <Input
                    name="milestoneDescription"
                    value={milestone.description}
                    onChange={(event) =>
                      updateMilestone(milestone.key, { description: event.target.value })
                    }
                    placeholder="Description courte (optionnelle)"
                    aria-label={`Description du jalon ${index + 1}`}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button asChild variant="ghost">
          <Link href={mode === "edit" && project ? `/projets/${project.id}` : "/projets"}>
            Annuler
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save aria-hidden="true" />}
          {pending
            ? "Enregistrement…"
            : mode === "edit"
              ? "Enregistrer les modifications"
              : "Créer le projet"}
        </Button>
      </div>
    </form>
  );
}
