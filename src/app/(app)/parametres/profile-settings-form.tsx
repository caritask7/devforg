"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { updateProfileAction } from "@/lib/actions/account";
import type { Profile } from "@/lib/types";
import type { FormState } from "@/lib/validation";

export function ProfileSettingsForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nom complet"
          htmlFor="fullName"
          required
          error={state.fieldErrors?.fullName?.[0]}
        >
          <Input
            id="fullName"
            name="fullName"
            defaultValue={profile.fullName}
            autoComplete="name"
            required
          />
        </Field>
        <Field
          label="Titre professionnel"
          htmlFor="headline"
          hint="Affiché sur le portfolio"
          error={state.fieldErrors?.headline?.[0]}
        >
          <Input
            id="headline"
            name="headline"
            defaultValue={profile.headline}
            placeholder="Développeur en formation · Phase 1"
          />
        </Field>
      </div>

      <Field
        label="Biographie"
        htmlFor="bio"
        hint={`${profile.bio.length} caractères max 2000`}
        error={state.fieldErrors?.bio?.[0]}
      >
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={profile.bio}
          placeholder="Présentez votre parcours, vos objectifs et ce que vous construisez."
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Profil GitHub"
          htmlFor="githubUrl"
          error={state.fieldErrors?.githubUrl?.[0]}
        >
          <Input
            id="githubUrl"
            name="githubUrl"
            type="url"
            defaultValue={profile.githubUrl}
            placeholder="https://github.com/…"
          />
        </Field>
        <Field
          label="Profil LinkedIn"
          htmlFor="linkedinUrl"
          error={state.fieldErrors?.linkedinUrl?.[0]}
        >
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            defaultValue={profile.linkedinUrl}
            placeholder="https://www.linkedin.com/in/…"
          />
        </Field>
        <Field label="Site personnel" htmlFor="websiteUrl" error={state.fieldErrors?.websiteUrl?.[0]}>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={profile.websiteUrl}
            placeholder="https://…"
          />
        </Field>
        <Field
          label="URL de l'avatar"
          htmlFor="avatarUrl"
          hint="Image carrée recommandée"
          error={state.fieldErrors?.avatarUrl?.[0]}
        >
          <Input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            defaultValue={profile.avatarUrl}
            placeholder="https://…"
          />
        </Field>
      </div>

      <Field
        label="Objectif quotidien"
        htmlFor="dailyGoalMinutes"
        hint="Minutes par jour"
        error={state.fieldErrors?.dailyGoalMinutes?.[0]}
      >
        <Input
          id="dailyGoalMinutes"
          name="dailyGoalMinutes"
          type="number"
          min={10}
          max={480}
          step={5}
          defaultValue={profile.dailyGoalMinutes}
          className="max-w-[160px]"
        />
      </Field>

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save aria-hidden="true" />}
          {pending ? "Enregistrement…" : "Enregistrer le profil"}
        </Button>
      </div>
    </form>
  );
}
