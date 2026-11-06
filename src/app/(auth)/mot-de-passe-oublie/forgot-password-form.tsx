"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/validation";
import { requestPasswordResetAction } from "../actions";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    requestPasswordResetAction,
    {},
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="df-eyebrow">Accès au compte</p>
        <h1 className="text-[30px] font-bold leading-tight tracking-[-0.03em] text-ink">
          Mot de passe oublié
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Indiquez votre adresse e-mail. Si un compte existe, vous recevrez un lien de
          réinitialisation.
        </p>
      </div>

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? (
        <Alert tone="success" title="Demande enregistrée">
          <p>{state.success}</p>
          {state.resetUrl ? (
            <p className="mt-2">
              Mode local :{" "}
              <Link href={state.resetUrl} className="font-semibold underline">
                ouvrir le lien de réinitialisation
              </Link>
            </p>
          ) : null}
        </Alert>
      ) : null}

      <form action={formAction} className="space-y-4" noValidate>
        <Field
          label="Adresse e-mail"
          htmlFor="email"
          required
          error={state.fieldErrors?.email?.[0]}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            required
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Mail />}
          {pending ? "Envoi en cours…" : "Recevoir le lien"}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
