import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  footnote?: ReactNode;
  accent?: ReactNode;
  progress?: number;
  tone?: "accent" | "success";
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  footnote,
  accent,
  progress,
  tone = "accent",
  className,
}: StatCardProps) {
  return (
    <div className={cn("df-card flex flex-col p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="df-label">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-muted/70" aria-hidden="true" /> : null}
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <p className="text-[30px] font-bold leading-none tracking-[-0.03em] text-ink">
          {value}
        </p>
        {accent}
      </div>
      {typeof progress === "number" ? (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className={cn(
              "h-full rounded-full",
              tone === "success" ? "bg-success" : "bg-accent",
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
      {footnote ? (
        <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-muted">
          {footnote}
        </div>
      ) : null}
    </div>
  );
}
