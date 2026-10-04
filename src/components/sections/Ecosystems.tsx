"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PLANES } from "@/data/planes";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { cn } from "@/lib/utils";

export function Ecosystems() {
  const { open } = useQuoter();

  return (
    <section id="planes" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Los planes"
          title="Un plan para cada momento"
          description="Empiezas donde estás y avanzas cuando los números lo indican. Sin contratos eternos ni promesas infladas."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANES.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard
                className={cn(
                  "flex h-full flex-col p-8",
                  plan.id === "crecimiento" &&
                    "border-accent/50 shadow-[0_0_40px_-12px_rgba(50,153,204,0.6)]",
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Plan
                </span>
                <h3 className="mt-1 text-2xl font-semibold text-white">{plan.nombre}</h3>
                <p className="mt-1 text-sm font-medium text-white/80">{plan.claim}</p>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                  {plan.paraQuien}
                </p>
                <ul className="mt-6 flex-1 space-y-2">
                  {plan.incluye.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/90">
                      <span className="mt-0.5 text-accent">✔</span> {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-border-glass pt-4">
                  <p className="text-base font-semibold text-white">{plan.precioDesde}</p>
                  <p className="text-xs text-text-secondary">{plan.montajeInicial}</p>
                  <p className="mt-1 text-xs text-text-secondary">{plan.pautaSugerida}</p>
                </div>
                <Button
                  variant={plan.id === "crecimiento" ? "primary" : "secondary"}
                  className="mt-6 w-full"
                  onClick={() => open()}
                >
                  Diagnosticar mi negocio
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-text-secondary">
          Valores en pesos colombianos para clientes en Colombia. Para otros países, cotizamos en
          dólares. Mínimo 3 meses. Las plataformas y la publicidad se pagan aparte.
        </p>
      </Container>
    </section>
  );
}
