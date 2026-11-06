import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/session";
import { isLocalMode } from "@/lib/config";
import { repository } from "@/lib/data";
import { loadSearchItems } from "@/lib/data/queries";
import { computeStreak } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const profile = await repository.ensureProfile({ id: user.id, email: user.email });

  const [lessonProgress, missionProgress, searchItems] = await Promise.all([
    repository.getLessonProgress(user.id),
    repository.getMissionProgress(user.id),
    loadSearchItems(user.id),
  ]);

  const streak = computeStreak([
    ...lessonProgress.flatMap((record) => [record.completedAt, record.lastViewedAt]),
    ...missionProgress.flatMap((record) => [
      record.completedAt,
      record.submittedAt,
      record.startedAt,
    ]),
  ]);

  return (
    <AppShell
      profile={profile}
      streak={streak}
      searchItems={searchItems}
      localMode={isLocalMode}
    >
      {children}
    </AppShell>
  );
}
