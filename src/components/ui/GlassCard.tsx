import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function GlassCard({
  children,
  className,
  variant = "dark",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; variant?: "dark" | "light" }) {
  return (
    <div
      className={cn(
        "rounded-3xl backdrop-blur-xl",
        variant === "light"
          ? "border border-border-light bg-bg-light-elevated shadow-[0_8px_30px_-16px_rgba(13,59,102,0.25)]"
          : "border border-border-glass bg-white/[0.03] shadow-[0_8px_40px_-16px_rgba(0,0,0,0.6)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
