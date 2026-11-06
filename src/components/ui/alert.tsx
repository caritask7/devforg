import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  tone?: "info" | "success" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const tones = {
  info: {
    wrapper: "border-accent/20 bg-accent-soft text-[#3b4a6b]",
    icon: "text-accent",
    Icon: Info,
  },
  success: {
    wrapper: "border-emerald-600/20 bg-success-soft text-[#065f46]",
    icon: "text-success",
    Icon: CheckCircle2,
  },
  error: {
    wrapper: "border-red-600/20 bg-danger-soft text-[#991b1b]",
    icon: "text-danger",
    Icon: AlertCircle,
  },
} as const;

export function Alert({ tone = "info", title, children, className }: AlertProps) {
  const config = tones[tone];
  const Icon = config.Icon;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] leading-relaxed",
        config.wrapper,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.icon)} aria-hidden="true" />
      <div className="space-y-0.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}
