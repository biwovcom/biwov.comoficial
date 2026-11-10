"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { COMO_TRABAJO } from "@/data/kathe";

export function ComoTrabajo() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <SectionHeading eyebrow="Nuestro método" title="Así trabajamos" />

        <div className="relative">
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-[#03101b] text-lg font-medium text-accent">
                  {paso.numero}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-xl font-medium text-white md:text-2xl">{paso.titulo}</h3>
                  <p className="mt-1 max-w-md text-base text-white/55">{paso.frase}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
}
