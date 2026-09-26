import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-white outline-none transition-colors focus:border-accent",
        "[&>option]:bg-bg-base",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
