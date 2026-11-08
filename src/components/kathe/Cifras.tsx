"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { CIFRAS_KATHE } from "@/data/kathe";

export function Cifras() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3">
          {CIFRAS_KATHE.map((cifra, i) => (
            <motion.div
              key={cifra.valor}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="h-full border-t border-white/15 pt-6">
                <p className="text-5xl font-medium tracking-[-0.04em] text-white md:text-6xl">{cifra.valor}</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55 md:text-base">{cifra.etiqueta}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
