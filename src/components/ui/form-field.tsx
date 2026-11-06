import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input, Textarea } from "./input";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink">
          {label}
          {required ? <span className="ml-0.5 text-danger">*</span> : null}
        </label>
        {hint ? <span className="text-[11px] text-muted">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="text-[12px] font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { Input, Textarea };
