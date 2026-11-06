"use client";

import { useActionState } from "react";
import { CheckCheck, Loader2, Save, Send } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { missionWorkspaceAction } from "@/lib/actions/missions";
import type { FormState } from "@/lib/validation";

interface MissionWorkspaceProps {
  missionSlug: string;
  notes: string;
  submissionUrl: string;
  status: string;
}

export function MissionWorkspace({
  missionSlug,
  notes,
  submissionUrl,
  status,
}: MissionWorkspaceProps) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    missionWorkspaceAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="missionSlug" value={missionSlug} />

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Lien du dépôt / livrable"
          htmlFor="submissionUrl"
          hint="GitHub, Gist, démo…"
          error={state.fieldErrors?.submissionUrl?.[0]}
        >
          <Input
            id="submissionUrl"
            name="submissionUrl"
            type="url"
            defaultValue={submissionUrl}
            placeholder="https://github.com/…"
            autoComplete="url"
          />
        </Field>
        <Field
          label="Statut actuel"
          htmlFor="mission-status-readonly"
          hint="Géré par les actions de validation"
        >
          <Input
            id="mission-status-readonly"
            value={
              status === "todo"
                ? "À faire"
                : status === "in_progress"
                  ? "En cours"
                  : status === "submitted"
                    ? "Soumise"
                    : "Terminée"
            }
            readOnly
            className="bg-tint/60"
          />
        </Field>
      </div>

      <Field
        label="Notes d'ingénierie & justification"
        htmlFor="notes"
        hint="Décisions techniques, cas limites, tests exécutés"
        error={state.fieldErrors?.notes?.[0]}
      >
        <Textarea
          id="notes"
          name="notes"
          defaultValue={notes}
          rows={6}
          placeholder="Décrivez votre démarche, les choix techniques et les vérifications réalisées…"
        />
      </Field>

      <div className="flex flex-col gap-2 rounded-lg border border-line bg-canvas/50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10.5px] leading-relaxed text-muted">
          Le brouillon est conservé. La soumission transmet votre lien pour revue.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" name="intent" value="draft" variant="secondary" size="sm" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Save aria-hidden="true" />}
            Enregistrer le brouillon
          </Button>
          <Button type="submit" name="intent" value="submit" size="sm" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Send aria-hidden="true" />}
            Soumettre pour revue
          </Button>
        </div>
      </div>

      {status === "submitted" ? (
        <p className="flex items-center gap-1.5 text-[11px] text-warning">
          <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Soumise : utilisez « Marquer comme terminée » à droite pour valider les compétences.
        </p>
      ) : null}
    </form>
  );
}
