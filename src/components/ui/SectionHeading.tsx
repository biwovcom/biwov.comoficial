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
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-5 inline-block text-xs font-semibold tracking-[0.2em] uppercase",
            light ? "text-[#0088a8]" : "text-accent",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-4xl font-semibold leading-[1.02] sm:text-5xl md:text-6xl",
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
