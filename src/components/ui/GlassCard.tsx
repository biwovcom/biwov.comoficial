import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function GlassCard({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border-glass bg-white/[0.03] backdrop-blur-xl",
        "shadow-[0_8px_40px_-16px_rgba(0,0,0,0.6)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
