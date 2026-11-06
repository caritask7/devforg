import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProjectForm } from "@/components/projects/project-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Nouveau projet" };

export default async function NewProjectPage() {
  await requireUser();

  return (
    <div className="space-y-7">
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-[11.5px] text-muted">
        <Link href="/projets" className="transition-colors hover:text-ink">
          Mes projets
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="font-medium text-ink">Nouveau projet</span>
      </nav>

      <PageHeader
        eyebrow={<span className="df-eyebrow">Portfolio · Nouveau livrable</span>}
        title="Nouveau projet personnel"
        description="Documentez un projet réel : objectif, architecture, jalons et résultats. Il alimentera votre portfolio."
      />

      <ProjectForm mode="create" />
    </div>
  );
}
