import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Database,
  KeyRound,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/session";
import { isLocalMode } from "@/lib/config";
import { repository } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { PasswordSettingsForm } from "./password-settings-form";
import { ProfileSettingsForm } from "./profile-settings-form";

export const metadata: Metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await repository.ensureProfile({ id: user.id, email: user.email });

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={
          <>
            <span className="df-eyebrow">Compte & préférences</span>
            <Badge variant="outline">Profil privé</Badge>
          </>
        }
        title="Paramètres"
        description="Gérez votre identité d'apprenant, vos liens publics et la sécurité de votre compte."
        actions={
          <Button asChild variant="secondary" size="sm">
            <Link href="/portfolio">
              Voir mon portfolio
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2 border-b border-line pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <UserRound className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-ink">
                  Profil public
                </h2>
                <p className="mt-0.5 text-[11.5px] text-muted">
                  Ces informations alimentent votre portfolio.
                </p>
              </div>
            </div>
            <div className="pt-5">
              <ProfileSettingsForm profile={profile} />
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2 border-b border-line pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-tint text-muted">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-ink">
                  Sécurité
                </h2>
                <p className="mt-0.5 text-[11.5px] text-muted">
                  Changez votre mot de passe régulièrement.
                </p>
              </div>
            </div>
            <div className="pt-5">
              <PasswordSettingsForm />
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-[13.5px] font-semibold tracking-tight text-ink">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Compte
            </h2>
            <dl className="mt-3 space-y-3 text-[11.5px]">
              <div>
                <dt className="df-label">Adresse e-mail</dt>
                <dd className="mt-0.5 break-all font-medium text-ink">{profile.email}</dd>
              </div>
              <div>
                <dt className="df-label">Niveau</dt>
                <dd className="mt-0.5 font-medium text-ink">Niveau {profile.level}</dd>
              </div>
              <div>
                <dt className="df-label">Membre depuis</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-ink">
                  <CalendarDays className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                  {formatDate(profile.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="df-label">Objectif quotidien</dt>
                <dd className="mt-0.5 font-medium text-ink">
                  {profile.dailyGoalMinutes} minutes / jour
                </dd>
              </div>
            </dl>
          </Card>

          {isLocalMode ? (
            <Alert tone="info" title="Mode local">
              <p className="mt-1 text-[11px] leading-relaxed">
                Les données sont enregistrées localement dans{" "}
                <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-[10px]">
                  data/local-db.json
                </code>
                . Renseignez les variables Supabase dans{" "}
                <code className="rounded bg-white/60 px-1 py-0.5 font-mono text-[10px]">
                  .env.local
                </code>{" "}
                pour basculer sur PostgreSQL et Supabase Auth.
              </p>
            </Alert>
          ) : (
            <Alert tone="success" title="Supabase connecté">
              <p className="mt-1 text-[11px] leading-relaxed">
                Votre compte est protégé par Supabase Auth. Les accès aux données sont
                contrôlés par les politiques Row Level Security.
              </p>
            </Alert>
          )}

          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-[13.5px] font-semibold tracking-tight text-ink">
              <Database className="h-4 w-4 text-accent" aria-hidden="true" />
              Confidentialité
            </h2>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                La clé service role n&apos;est jamais exposée au navigateur.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                Chaque utilisateur ne peut lire et modifier que ses propres données.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                Aucun outil d&apos;IA ni appel à un LLM n&apos;est utilisé dans cette version.
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
