import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "white";
  size?: "md" | "lg";
  children: ReactNode;
}

const VARIANTS: Record<string, string> = {
  primary:
    "bg-white font-semibold text-[#03101b] shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)] hover:scale-[1.03]",
  secondary:
    "border border-white/30 bg-transparent text-white hover:border-accent hover:text-accent",
  ghost: "text-text-secondary hover:text-white",
  outline:
    "border border-[rgba(13,20,32,0.14)] bg-[rgba(13,20,32,0.02)] text-text-on-light backdrop-blur-md hover:bg-[rgba(13,20,32,0.05)] hover:border-accent/50",
  white:
    "bg-white text-bg-base shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)] hover:bg-white/90 hover:scale-[1.01]",
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
