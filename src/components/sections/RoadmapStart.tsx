"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { COMO_AVANZA } from "@/data/comoAvanza";
import { cn } from "@/lib/utils";

export function RoadmapStart() {
  const [activo, setActivo] = useState(0);
  const fase = COMO_AVANZA[activo];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="Cómo avanza tu negocio" title="Así se ven tus primeros meses" />

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="-mx-6 overflow-x-auto px-6 scrollbar-none sm:mx-0 sm:overflow-visible sm:px-0 [mask-image:linear-gradient(to_right,black,black_88%,transparent)] sm:[mask-image:none]">
            <div className="flex w-max gap-2 sm:grid sm:w-full sm:grid-cols-4 sm:gap-3">
              {COMO_AVANZA.map((f, i) => (
                <button
                  key={f.momento}
                  type="button"
                  onClick={() => setActivo(i)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide transition-all sm:shrink sm:whitespace-normal",
                    activo === i
                      ? "border-accent bg-accent/10 text-accent shadow-[0_0_24px_-8px_rgba(50,153,204,0.6)]"
                      : "border-border-glass text-text-secondary hover:border-accent/40 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "text-base font-black",
                      activo === i ? "text-gradient" : "text-white/20",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {f.momento}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activo}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="relative mt-5 overflow-hidden p-7">
                <span className="pointer-events-none absolute -top-6 -right-2 select-none text-[130px] font-black leading-none text-white/[0.04]">
                  {String(activo + 1).padStart(2, "0")}
                </span>
                <span className="relative text-xs font-semibold uppercase tracking-wide text-accent">
                  {fase.momento}
                </span>
                <h3 className="relative mt-1 text-xl font-semibold text-white">{fase.titulo}</h3>
                <p className="relative mt-3 max-w-md text-sm leading-relaxed text-text-secondary">{fase.detalle}</p>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex justify-center gap-1.5">
            {COMO_AVANZA.map((f, i) => (
              <button
                key={f.momento}
                type="button"
                onClick={() => setActivo(i)}
                aria-label={`Ver ${f.momento}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  activo === i ? "w-8 bg-accent" : "w-4 bg-border-glass hover:bg-accent/40",
                )}
              />
            ))}
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-text-secondary">
          Cada negocio avanza a su ritmo. No prometemos cifras de ventas: prometemos orden,
          estrategia y trabajo medido.
        </p>
      </Container>
    </section>
  );
}
