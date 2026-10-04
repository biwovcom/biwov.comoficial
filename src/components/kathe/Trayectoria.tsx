"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { TRAYECTORIA } from "@/data/kathe";

export function Trayectoria() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Trayectoria" title="Cómo he llegado hasta aquí" />

        <div className="relative mx-auto mt-14 max-w-2xl">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-accent/20 to-transparent" />
          <div className="space-y-8">
            {TRAYECTORIA.map((hito, i) => (
              <motion.div
                key={hito.anio}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative flex items-start gap-6"
              >
                <div className="mt-1 h-3 w-3 shrink-0 translate-x-[18px] rounded-full bg-accent" />
                <GlassCard className="flex-1 p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {hito.anio}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-white">{hito.titulo}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{hito.detalle}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
