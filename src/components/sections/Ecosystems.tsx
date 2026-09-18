"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ECOSISTEMAS } from "@/data/ecosistemas";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { cn } from "@/lib/utils";

export function Ecosystems() {
  const { open } = useQuoter();

  return (
    <section id="ecosistemas" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Nuestras soluciones"
          title="Nuestros Ecosistemas"
          description="No servicios sueltos: tres ecosistemas diseñados para cada momento de tu negocio."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ECOSISTEMAS.map((eco, i) => (
            <motion.div
              key={eco.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard
                className={cn(
                  "flex h-full flex-col p-8",
                  eco.id === "growth" && "border-accent/50 shadow-[0_0_40px_-12px_rgba(50,153,204,0.6)]",
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Ecosistema
                </span>
                <h3 className="mt-1 text-2xl font-semibold text-white">{eco.nombre}</h3>
                <p className="mt-1 text-sm font-medium text-white/80">{eco.claim}</p>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                  {eco.descripcion}
                </p>
                <ul className="mt-6 flex-1 space-y-2">
                  {eco.modulos.map((modulo) => (
                    <li key={modulo} className="flex items-start gap-2 text-sm text-white/90">
                      <span className="mt-0.5 text-accent">✔</span> {modulo}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={eco.id === "growth" ? "primary" : "secondary"}
                  className="mt-8 w-full"
                  onClick={() => open()}
                >
                  Diagnosticar mi negocio
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
