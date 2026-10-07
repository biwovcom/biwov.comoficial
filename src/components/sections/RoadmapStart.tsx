"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { COMO_AVANZA } from "@/data/comoAvanza";

export function RoadmapStart() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="Cómo avanza tu negocio" title="Así se ven tus primeros meses" />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-accent/20 to-transparent" />
          <div className="space-y-8">
            {COMO_AVANZA.map((fase, i) => (
              <motion.div
                key={fase.momento}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative flex items-start gap-6"
              >
                <div className="mt-1 h-3 w-3 shrink-0 translate-x-[18px] rounded-full bg-accent" />
                <GlassCard className="flex-1 p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {fase.momento}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-white">{fase.titulo}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{fase.detalle}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-text-secondary">
          Cada negocio avanza a su ritmo. No prometemos cifras de ventas: prometemos orden,
          estrategia y trabajo medido.
        </p>
      </Container>
    </section>
  );
}
