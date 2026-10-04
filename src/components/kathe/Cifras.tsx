"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { CIFRAS_KATHE } from "@/data/kathe";

export function Cifras() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="grid gap-5 sm:grid-cols-3">
          {CIFRAS_KATHE.map((cifra, i) => (
            <motion.div
              key={cifra.valor}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="h-full p-6 text-center">
                <p className="text-3xl font-semibold text-accent md:text-4xl">{cifra.valor}</p>
                <p className="mt-2 text-sm text-text-secondary">{cifra.etiqueta}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
