"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMO_TRABAJO } from "@/data/kathe";

export function ComoTrabajo() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Mi método" title="Cómo trabajo" />

        <div className="relative mx-auto mt-16 max-w-2xl">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-accent/20 to-transparent" />
          <div className="space-y-10">
            {COMO_TRABAJO.map((paso, i) => (
              <motion.div
                key={paso.numero}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative flex items-start gap-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-lg font-semibold text-white">
                  {paso.numero}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-lg font-semibold text-white">{paso.titulo}</h3>
                  <p className="mt-1 max-w-sm text-sm text-text-secondary">{paso.frase}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
