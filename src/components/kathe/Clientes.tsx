"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { CLIENTES_KATHE } from "@/data/kathe";

export function Clientes() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Clientes y resultados" title="Negocios que ya confiaron en mí" />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {CLIENTES_KATHE.map((cliente, i) => {
            const contenido = (
              <GlassCard className="h-full p-7 transition-colors group-hover:border-accent/40">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-white">{cliente.nombre}</h3>
                  {cliente.url && (
                    <ExternalLink className="h-4 w-4 shrink-0 text-text-secondary transition-colors group-hover:text-accent" />
                  )}
                </div>
                <p className="mt-2 text-sm text-text-secondary">{cliente.descripcion}</p>
                {cliente.resultado && (
                  <p className="mt-4 rounded-xl bg-accent/10 px-4 py-2.5 text-sm font-medium text-white">
                    {cliente.resultado}
                  </p>
                )}
              </GlassCard>
            );

            return (
              <motion.div
                key={cliente.nombre}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              >
                {cliente.url ? (
                  <a
                    href={cliente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    {contenido}
                  </a>
                ) : (
                  contenido
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
