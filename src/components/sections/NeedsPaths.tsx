"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SITUACIONES_NEGOCIO, NOMBRES_PLAN } from "@/data/queNecesita";
import { useQuoter } from "@/components/quoter/QuoterProvider";

export function NeedsPaths() {
  const { open } = useQuoter();

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Encuentra tu camino"
          title="¿Qué necesita tu negocio hoy?"
          description="Elige lo que más se parece a tu situación. Debajo de cada opción verás el nombre técnico, por si lo has escuchado."
        />

        <div className="mx-auto mt-14 max-w-2xl space-y-3">
          {SITUACIONES_NEGOCIO.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <GlassCard className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-sm font-medium text-white md:text-base">{item.situacion}</p>
                  <p className="mt-1 text-xs text-text-secondary">{item.tecnica}</p>
                </div>
                <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {NOMBRES_PLAN[item.plan]}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button size="lg" onClick={() => open()}>
            Haz tu diagnóstico gratis
          </Button>
        </div>
      </Container>
    </section>
  );
}
