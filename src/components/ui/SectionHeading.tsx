"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  variant = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  variant?: "dark" | "light";
  className?: string;
}) {
  const light = variant === "light";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase",
            light
              ? "border-border-light bg-white text-accent"
              : "border-border-glass bg-white/[0.03] text-accent",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl",
          light ? "text-text-on-light" : "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed md:text-lg",
            light ? "text-text-on-light-secondary" : "text-text-secondary",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
