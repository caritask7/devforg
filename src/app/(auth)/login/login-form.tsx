"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/validation";
import { signInAction } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    signInAction,
    {},
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="df-eyebrow">Espace apprenant</p>
        <h1 className="text-[30px] font-bold leading-tight tracking-[-0.03em] text-ink">
          Se connecter
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Reprenez votre parcours là où vous l&apos;avez laissé.
        </p>
      </div>

      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>

        <Field
          label="Mot de passe"
          htmlFor="password"
          required
          error={state.fieldErrors?.password?.[0]}
        >
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>

        <div className="flex justify-end">
          <Link href="/mot-de-passe-oublie" className="df-link text-[12.5px]">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          {pending ? "Connexion…" : "Se connecter"}
          {!pending ? <ArrowRight /> : null}
        </Button>
      </form>

      <p className="text-center text-[13px] text-muted">
        Pas encore de compte ?{" "}
        <Link href="/register" className="df-link font-medium">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
