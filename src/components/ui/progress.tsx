import { cn, clampPercent } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  tone?: "accent" | "success" | "muted";
  showLabel?: boolean;
  label?: string;
}

export function Progress({
  value,
  className,
  barClassName,
  tone = "accent",
  showLabel = false,
  label,
}: ProgressProps) {
  const safe = clampPercent(value);
  const toneClass =
    tone === "success" ? "bg-success" : tone === "muted" ? "bg-muted/50" : "bg-accent";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safe}
        aria-label={label ?? "Progression"}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-300 ease-out", toneClass, barClassName)}
          style={{ width: `${safe}%` }}
        />
      </div>
      {showLabel ? (
        <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums text-muted">
          {safe}%
        </span>
      ) : null}
    </div>
  );
}
