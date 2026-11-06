import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface/60 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-tint text-muted">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
