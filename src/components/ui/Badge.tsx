import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const VARIANTS: Record<string, string> = {
  neutral: "border-border-glass bg-white/[0.03] text-text-secondary",
  accent: "border-accent/40 bg-accent/10 text-accent",
  verde: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  amarillo: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  rojo: "border-red-500/40 bg-red-500/10 text-red-400",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
