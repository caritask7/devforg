"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/validation";
import { signUpAction } from "../actions";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    signUpAction,
    {},
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="df-eyebrow">Nouveau compte</p>
        <h1 className="text-[30px] font-bold leading-tight tracking-[-0.03em] text-ink">
          Créer un compte
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Commencez la phase 1 immédiatement. Aucune carte bancaire requise.
        </p>
      </div>

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? (
        <Alert tone="success" title="Compte créé">
          {state.success}
        </Alert>
      ) : null}

      <form action={formAction} className="space-y-4" noValidate>
        <Field
          label="Nom complet"
          htmlFor="fullName"
          required
          error={state.fieldErrors?.fullName?.[0]}
        >
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="Votre nom complet"
            required
          />
        </Field>

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

        <Field
          label="Mot de passe"
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
          {pending ? "Création du compte…" : "Créer mon compte"}
          {!pending ? <ArrowRight /> : null}
        </Button>
      </form>

      <p className="text-center text-[13px] text-muted">
        Déjà un compte ?{" "}
        <Link href="/login" className="df-link font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
