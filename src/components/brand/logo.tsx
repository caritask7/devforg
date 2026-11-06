import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showPro?: boolean;
  href?: string;
  compact?: boolean;
  onClick?: () => void;
}

export function Logo({
  className,
  showPro = false,
  href = "/dashboard",
  compact = false,
  onClick,
}: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-accent font-mono text-[15px] font-bold text-white shadow-[0_1px_2px_rgba(23,32,51,0.15)]"
      >
        D
        <span className="absolute right-[5px] top-[5px] h-1 w-1 rounded-full bg-white/70" />
      </span>
      {compact ? null : (
        <span className="text-[15px] font-bold tracking-[0.09em] text-ink">DEVFORGE</span>
      )}
      {showPro && !compact ? (
        <span className="rounded border border-accent/15 bg-accent-soft px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-[0.08em] text-accent">
          PRO
        </span>
      ) : null}
    </span>
  );

  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent/40"
      aria-label="DEVFORGE — Tableau de bord"
    >
      {content}
    </Link>
  );
}
