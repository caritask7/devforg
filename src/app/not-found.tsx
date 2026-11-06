import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-4">
      <Logo href="/dashboard" />
      <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        Erreur 404
      </p>
      <h1 className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-ink">
        Cette ressource est introuvable
      </h1>
      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-muted">
        Le module, la leçon, la mission ou le projet demandé n&apos;existe pas ou ne vous
        appartient pas.
      </p>
      <div className="mt-6 flex gap-2">
        <Button asChild>
          <Link href="/dashboard">Retour au tableau de bord</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/parcours">Voir le parcours</Link>
        </Button>
      </div>
    </div>
  );
}
