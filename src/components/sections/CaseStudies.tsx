"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { CASOS_EXITO } from "@/data/casos";

export function CaseStudies() {
  return (
    <section id="casos" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Casos de éxito"
          title="Negocios que ya tienen todo conectado"
          description="Desde sitios en construcción hasta desarrollo a medida y ventas con automatización: así se ve en la vida real un negocio con todo conectado."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {CASOS_EXITO.map((caso, i) => (
            <motion.a
              key={caso.id}
              href={caso.url}
              target={caso.url !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="group block"
            >
              <GlassCard className="h-full p-8 transition-colors group-hover:border-accent/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{caso.cliente}</h3>
                  {caso.url !== "#" && (
                    <ExternalLink className="h-4 w-4 text-text-secondary transition-colors group-hover:text-accent" />
                  )}
                </div>
                <div className="mt-5 space-y-3 text-sm">
                  <p>
                    <span className="font-semibold text-accent">Reto: </span>
                    <span className="text-text-secondary">{caso.reto}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-accent">Solución: </span>
                    <span className="text-text-secondary">{caso.solucion}</span>
                  </p>
                </div>
                <p className="mt-5 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-white">
                  {caso.destacado}
                </p>
              </GlassCard>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}
