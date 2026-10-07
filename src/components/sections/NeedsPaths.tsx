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

  const irAlPlan = () => {
    document.getElementById("planes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Encuentra tu camino"
          title="¿Qué necesita tu negocio hoy?"
          description="Elige lo que más se parece a tu situación. El plan que necesitas aparece debajo de cada opción: dale clic para verlo."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITUACIONES_NEGOCIO.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <GlassCard
                role="button"
                tabIndex={0}
                onClick={irAlPlan}
                onKeyDown={(e) => e.key === "Enter" && irAlPlan()}
                className="flex h-full cursor-pointer flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50"
              >
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-[0_0_16px_-4px_rgba(50,153,204,0.8)]">
                  Plan {NOMBRES_PLAN[item.plan]}
                </span>
                <p className="text-sm font-medium text-white md:text-base">{item.situacion}</p>
                <p className="mt-auto text-xs text-text-secondary">{item.tecnica}</p>
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
