"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { FORMACION_KATHE } from "@/data/kathe";

export function Formacion() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Formación y mentores" title="Sigo aprendiendo todo el tiempo" />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMACION_KATHE.map((item, i) => (
            <motion.div
              key={item.categoria}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <GlassCard className="h-full p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {item.categoria}
                </span>
                <p className="mt-1.5 text-sm text-white/90">{item.detalle}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
