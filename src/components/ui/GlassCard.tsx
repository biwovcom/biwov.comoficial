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
        "rounded-[1.75rem] backdrop-blur-xl",
        variant === "light"
          ? "border border-border-light bg-bg-light-elevated shadow-[0_8px_30px_-16px_rgba(46,91,126,0.25)]"
          : "card-universo shadow-[0_8px_40px_-16px_rgba(0,0,0,0.6)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
