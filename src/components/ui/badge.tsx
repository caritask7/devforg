import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-line bg-tint text-muted",
        accent: "border-accent/20 bg-accent-soft text-accent",
        solid: "border-accent bg-accent text-white",
        success: "border-emerald-600/20 bg-success-soft text-success",
        warning: "border-amber-600/20 bg-warning-soft text-warning",
        danger: "border-red-600/20 bg-danger-soft text-danger",
        outline: "border-line bg-surface text-muted",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
