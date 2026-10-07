"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { EL_CAMINO, PASOS_CAMINO_TITULO, ETIQUETAS_CAMINO } from "@/data/elCamino";

export function ElCamino() {
  return (
    <section id="como-conectamos-todo" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="El camino"
          title="Desde que alguien te ve hasta que te paga"
          description="Así de simple es lo que organizamos contigo."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EL_CAMINO.map((paso, i) => (
            <motion.div
              key={paso.numero}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                    {paso.numero}
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {PASOS_CAMINO_TITULO[i]}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-text-secondary">{paso.pasa}</p>
                <p className="mt-3 text-xs font-medium text-accent">{paso.posible}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {ETIQUETAS_CAMINO.map((etiqueta) => (
            <span
              key={etiqueta}
              className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary"
            >
              {etiqueta}
            </span>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
