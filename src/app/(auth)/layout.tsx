import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden border-r border-line bg-[#101a2e] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-accent/25 blur-3xl"
        />

        <div className="relative">
          <Logo href="/login" />
          <p className="mt-16 max-w-md font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
            Programme d&apos;ingénierie · Édition 2026
          </p>
          <h1 className="mt-4 max-w-lg text-[38px] font-bold leading-[1.12] tracking-[-0.03em] xl:text-[44px]">
            La régularité forge l&apos;expertise technique.
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
            Un parcours rigoureux : des leçons courtes, des missions concrètes et une
            validation objective des compétences. Pas de score gonflé, pas de contenu
            superficiel.
          </p>

          <ul className="mt-10 space-y-3.5">
            {[
              "Phase 1 complète : 8 modules, 40 leçons, 12 missions",
              "Progression enregistrée et reprise là où vous vous êtes arrêté",
              "Compétences validées uniquement par des livrables terminés",
              "Portfolio alimenté par vos projets réels",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-white/75">
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#8ea0ff]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-12 flex items-center justify-between border-t border-white/10 pt-5 text-[11px] text-white/45">
          <span className="font-mono uppercase tracking-[0.12em]">DEVFORGE Platform</span>
          <span>Python 3.12 · PostgreSQL · Next.js</span>
        </div>
      </div>

      <div className="flex min-h-dvh flex-col">
        <div className="flex h-16 items-center border-b border-line px-5 lg:hidden">
          <Logo href="/login" />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <div className="px-5 pb-6 text-center text-[11px] text-muted lg:text-right">
          © 2026 DEVFORGE · Apprentissage rigoureux
        </div>
      </div>
    </div>
  );
}
