"use client";

import { useActionState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { changePasswordAction } from "@/lib/actions/account";
import type { FormState } from "@/lib/validation";

export function PasswordSettingsForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    changePasswordAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Field
        label="Mot de passe actuel"
        htmlFor="currentPassword"
        required
        error={state.fieldErrors?.currentPassword?.[0]}
      >
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nouveau mot de passe"
          htmlFor="password"
          hint="8 caractères minimum"
          required
          error={state.fieldErrors?.password?.[0]}
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </Field>
        <Field
          label="Confirmation"
          htmlFor="confirmPassword"
          required
          error={state.fieldErrors?.confirmPassword?.[0]}
        >
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <KeyRound aria-hidden="true" />}
          {pending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
        </Button>
      </div>
    </form>
  );
}
