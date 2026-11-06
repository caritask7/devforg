import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  FolderKanban,
  Github,
  Globe,
  Linkedin,
  Pencil,
  Target,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { requireUser } from "@/lib/auth/session";
import { loadDashboard } from "@/lib/data/queries";
import { formatDate, formatMinutes, percent } from "@/lib/utils";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilePage() {
  const user = await requireUser();
  const data = await loadDashboard(user.id);
  const profile = data.profile;

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow={
          <>
            <span className="df-eyebrow">Identité d&apos;apprenant</span>
            <Badge variant="accent">Niveau {profile.level}</Badge>
          </>
        }
        title="Mon profil"
        description="Votre identité, votre progression et vos derniers travaux en un coup d'œil."
        actions={
          <Button asChild variant="secondary" size="sm">
            <Link href="/parametres">
              <Pencil aria-hidden="true" />
              Modifier le profil
            </Link>
          </Button>
        }
      />

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar
            name={profile.fullName}
            src={profile.avatarUrl}
            size="xl"
            className="h-20 w-20 text-xl"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[22px] font-bold tracking-[-0.02em] text-ink">
                {profile.fullName}
              </h2>
              <Badge variant="outline">Membre depuis {formatDate(profile.createdAt)}</Badge>
            </div>
            <p className="mt-1 text-[13px] font-medium text-accent">
              {profile.headline || "Développeur en formation"}
            </p>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-[#55607a]">
              {profile.bio || "Aucune biographie renseignée pour le moment."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.githubUrl ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-tint"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  GitHub
                </a>
              ) : null}
              {profile.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-tint"
                >
                  <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                  LinkedIn
                </a>
              ) : null}
              {profile.websiteUrl ? (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-line-strong hover:bg-tint"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  Site personnel
                </a>
              ) : null}
            </div>
          </div>
          <div className="w-full shrink-0 rounded-xl border border-line bg-canvas/50 p-4 sm:w-52">
            <div className="flex items-center justify-between">
              <p className="df-label">Objectif quotidien</p>
              <Target className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            </div>
            <p className="mt-1.5 text-[20px] font-bold leading-none text-ink">
              {formatMinutes(profile.dailyGoalMinutes)}
            </p>
            <p className="mt-1 text-[10.5px] text-muted">
              {formatMinutes(data.weeklyMinutes)} cette semaine
            </p>
            <Progress
              value={percent(data.weeklyMinutes, data.weeklyGoalMinutes)}
              className="mt-3"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Progression du parcours"
          value={`${data.globalPercent}%`}
          icon={BookOpen}
          progress={data.globalPercent}
          footnote={
            <>
              <span>
                {data.completedLessons} / {data.totalLessons} leçons
              </span>
              <span className="font-mono">Phase 1</span>
            </>
          }
        />
        <StatCard
          label="Missions terminées"
          value={String(data.completedMissions)}
          icon={CheckCircle2}
          tone="success"
          progress={percent(data.completedMissions, data.totalMissions)}
          footnote={
            <>
              <span>Sur {data.totalMissions} missions</span>
              <span className="font-mono text-success">Validées</span>
            </>
          }
        />
        <StatCard
          label="Temps cette semaine"
          value={formatMinutes(data.weeklyMinutes)}
          icon={Target}
          progress={percent(data.weeklyMinutes, data.weeklyGoalMinutes)}
          footnote={
            <>
              <span>Objectif {formatMinutes(data.weeklyGoalMinutes)}</span>
              <span className="font-mono">
                {percent(data.weeklyMinutes, data.weeklyGoalMinutes)}%
              </span>
            </>
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-ink">
              <BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />
              Reprendre
            </h2>
            <Badge variant="neutral">Leçon</Badge>
          </div>
          {data.lastLesson ? (
            <div className="mt-3">
              <p className="df-eyebrow">{data.lastLesson.module.title}</p>
              <p className="mt-1.5 text-[13px] font-semibold leading-snug text-ink">
                {data.lastLesson.lesson.title}
              </p>
              <Progress value={data.lastLesson.percent} className="mt-3" />
              <Button asChild size="sm" className="mt-4 w-full">
                <Link href={`/lecons/${data.lastLesson.lesson.slug}`}>
                  Reprendre
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-[12px] text-muted">
              Aucune leçon ouverte.{" "}
              <Link href="/parcours" className="df-link">
                Commencer le parcours
              </Link>
              .
            </p>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-ink">
              <Award className="h-4 w-4 text-accent" aria-hidden="true" />
              Dernière validation
            </h2>
            <Badge variant="success">Mission</Badge>
          </div>
          {data.lastCompletedMission ? (
            <div className="mt-3">
              <p className="df-eyebrow">Mission terminée</p>
              <p className="mt-1.5 text-[13px] font-semibold leading-snug text-ink">
                {data.lastCompletedMission.title}
              </p>
              <p className="mt-1 text-[10.5px] text-muted">
                {data.lastCompletedMission.progress.completedAt
                  ? formatDate(data.lastCompletedMission.progress.completedAt)
                  : ""}
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
                <Link href={`/missions/${data.lastCompletedMission.slug}`}>
                  Revoir
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-[12px] text-muted">
              Aucune mission terminée pour l&apos;instant.{" "}
              <Link href="/missions" className="df-link">
                Voir les missions
              </Link>
              .
            </p>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-ink">
              <FolderKanban className="h-4 w-4 text-accent" aria-hidden="true" />
              Portfolio
            </h2>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            Consultez la synthèse de vos projets terminés et de vos compétences validées.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
            <Link href="/portfolio">
              Ouvrir le portfolio
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
