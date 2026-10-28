"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { CIFRAS_KATHE } from "@/data/kathe";

export function Impacto() {
  return (
    <section className="bg-bg-light py-16 md:py-20">
      <Container>
        <h2 className="text-center text-2xl font-bold tracking-tight text-text-on-light sm:text-3xl">
          Nuestro impacto
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CIFRAS_KATHE.map((cifra, i) => (
            <motion.div
              key={cifra.valor}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border-light bg-bg-light-elevated p-7 text-center"
            >
              <p className="text-4xl font-bold text-bg-base">{cifra.valor}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-on-light-secondary">
                {cifra.etiqueta}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
