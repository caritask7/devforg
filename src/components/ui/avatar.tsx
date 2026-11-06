import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-8 w-8 text-[11px]",
  lg: "h-10 w-10 text-xs",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`Avatar de ${name}`}
        className={cn(
          "shrink-0 rounded-full border border-line object-cover",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-accent/15 bg-accent-soft font-semibold tracking-wide text-accent",
        sizeClasses[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
