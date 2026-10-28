import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "md" | "lg";
  children: ReactNode;
}

const VARIANTS: Record<string, string> = {
  primary:
    "bg-gradient-brand text-white shadow-[0_6px_20px_-6px_rgba(10,38,66,0.5)] hover:shadow-[0_8px_26px_-6px_rgba(10,38,66,0.6)] hover:scale-[1.01]",
  secondary:
    "border border-border-glass bg-white/[0.03] text-white backdrop-blur-md hover:bg-white/[0.07] hover:border-accent/40",
  ghost: "text-text-secondary hover:text-white",
  outline:
    "border border-[rgba(13,20,32,0.14)] bg-[rgba(13,20,32,0.02)] text-text-on-light backdrop-blur-md hover:bg-[rgba(13,20,32,0.05)] hover:border-accent/50",
};

const SIZES: Record<string, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out cursor-pointer active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
