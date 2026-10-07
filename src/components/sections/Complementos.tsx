"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { COMPLEMENTOS } from "@/data/complementos";

export function Complementos() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="Complementos" title="¿Necesitas algo más?" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {COMPLEMENTOS.map((item, i) => (
            <motion.div
              key={item.titulo}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <GlassCard className="h-full p-6">
                <h3 className="text-base font-semibold text-white">{item.titulo}</h3>
                <p className="mt-1.5 text-sm text-text-secondary">{item.detalle}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
