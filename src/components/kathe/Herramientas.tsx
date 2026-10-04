"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HERRAMIENTAS_KATHE } from "@/data/kathe";

export function Herramientas() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Caja de herramientas" title="Con qué trabajo" />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HERRAMIENTAS_KATHE.map((grupo, i) => (
            <motion.div
              key={grupo.categoria}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {grupo.categoria}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {grupo.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1.5 text-xs text-white/85"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
