"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EVENTOS_KATHE } from "@/data/kathe";

export function Eventos() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Eventos de la industria" title="Donde me sigo formando" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {EVENTOS_KATHE.map((evento) =>
            evento.url ? (
              <a
                key={evento.nombre}
                href={evento.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border-glass bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:border-accent/40 hover:text-white"
              >
                {evento.nombre}
              </a>
            ) : (
              <span
                key={evento.nombre}
                className="rounded-full border border-border-glass bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/90"
              >
                {evento.nombre}
              </span>
            ),
          )}
        </motion.div>
      </Container>
    </section>
  );
}
