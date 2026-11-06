"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/validation";
import { resetPasswordAction } from "../actions";

interface ResetPasswordFormProps {
  token: string;
  localMode: boolean;
}

export function ResetPasswordForm({ token, localMode }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    resetPasswordAction,
    {},
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="df-eyebrow">Nouveau mot de passe</p>
        <h1 className="text-[30px] font-bold leading-tight tracking-[-0.03em] text-ink">
          Réinitialiser l&apos;accès
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Choisissez un mot de passe de 8 caractères minimum.
        </p>
      </div>

      {localMode && !token ? (
        <Alert tone="info">
          Ce lien ne contient pas de jeton.{" "}
          <Link href="/mot-de-passe-oublie" className="font-semibold underline">
            Demandez un nouveau lien
          </Link>
          .
        </Alert>
      ) : null}
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="token" value={token} />
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
            placeholder="••••••••"
            required
            minLength={8}
          />
        </Field>
        <Field
          label="Confirmer le mot de passe"
          htmlFor="confirmPassword"
          required
          error={state.fieldErrors?.confirmPassword?.[0]}
        >
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            required
            minLength={8}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          {pending ? "Mise à jour…" : "Enregistrer le mot de passe"}
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
