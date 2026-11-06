import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProjectForm } from "@/components/projects/project-form";
import { PageHeader } from "@/components/ui/page-header";
import { requireUser } from "@/lib/auth/session";
import { repository } from "@/lib/data";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser();
  const project = await repository.getProject(user.id, id);
  return { title: project ? `Modifier · ${project.title}` : "Modifier le projet" };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const user = await requireUser();
  const project = await repository.getProject(user.id, id);
  if (!project) notFound();

  return (
    <div className="space-y-7">
      <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-muted">
        <Link href="/projets" className="transition-colors hover:text-ink">
          Mes projets
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <Link href={`/projets/${project.id}`} className="max-w-[260px] truncate transition-colors hover:text-ink">
          {project.title}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className="font-medium text-ink">Modifier</span>
      </nav>

      <PageHeader
        eyebrow={<span className="df-eyebrow">Mise à jour du livrable</span>}
        title="Modifier le projet"
        description="Actualisez le périmètre, les jalons et les résultats. L'historique des jalons validés est conservé lorsque leur position ne change pas."
      />

      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
