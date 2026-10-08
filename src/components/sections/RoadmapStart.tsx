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
                    "shrink-0 whitespace-nowrap rounded-xl border px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide transition-colors sm:shrink sm:whitespace-normal",
                    activo === i
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border-glass text-text-secondary hover:border-accent/40 hover:text-white",
                  )}
                >
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
              <GlassCard className="mt-5 p-7">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {fase.momento}
                </span>
                <h3 className="mt-1 text-xl font-semibold text-white">{fase.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{fase.detalle}</p>
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
