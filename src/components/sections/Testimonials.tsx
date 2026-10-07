"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { TESTIMONIOS } from "@/data/testimonios";

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-bg-light py-16 md:py-24">
      <Container>
        <SectionHeading
          variant="light"
          eyebrow="Testimonios"
          title="Lo que dicen nuestros clientes"
          description="Video, texto y fotos: resultados reales de negocios que ya tienen todo conectado."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {TESTIMONIOS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard variant="light" className="flex h-full flex-col p-6">
                <div className="flex aspect-video items-center justify-center rounded-2xl bg-bg-light">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-warm/15">
                    <Play className="h-6 w-6 text-accent-warm" fill="currentColor" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-text-on-light-secondary">{t.contenido}</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-text-on-light">{t.nombre}</p>
                  <p className="text-xs text-text-on-light-secondary">{t.rol}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          <GlassCard variant="light" className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-sm text-text-on-light-secondary">
              Más testimonios en texto y foto muy pronto.
            </p>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
