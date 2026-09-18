"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { ROADMAP_START } from "@/data/roadmapStart";

export function RoadmapStart() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Cómo evoluciona tu ecosistema"
          title="Así se ve tu primer mes, y los que siguen"
          description="Nada de promesas vagas: así trabajamos mes a mes, desde que arrancas en START hasta que escalas a automatización y landing pages."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-accent/20 to-transparent" />
          <div className="space-y-8">
            {ROADMAP_START.map((fase, i) => (
              <motion.div
                key={fase.fase}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative flex items-start gap-6"
              >
                <div className="mt-1 h-3 w-3 shrink-0 translate-x-[18px] rounded-full bg-accent" />
                <GlassCard className="flex-1 p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {fase.fase}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-white">{fase.titulo}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {fase.detalle.map((linea) => (
                      <li key={linea} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                        {linea}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
