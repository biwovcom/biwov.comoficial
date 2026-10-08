"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SITUACIONES_NEGOCIO, NOMBRES_PLAN, type PlanId } from "@/data/queNecesita";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { cn } from "@/lib/utils";

const PLANES_TABS: PlanId[] = ["esencial", "crecimiento", "escala"];

export function NeedsPaths() {
  const { open } = useQuoter();
  const [activo, setActivo] = useState<PlanId>("esencial");

  const irAlPlan = () => {
    document.getElementById("planes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const situaciones = SITUACIONES_NEGOCIO.filter((s) => s.plan === activo);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Encuentra tu camino"
          title="¿Qué necesita tu negocio hoy?"
          description="Elige el plan que más suena a ti y mira en qué casos encaja."
        />

        <div className="mx-auto mt-10 flex max-w-md justify-center gap-2">
          {PLANES_TABS.map((plan) => (
            <button
              key={plan}
              type="button"
              onClick={() => setActivo(plan)}
              className={cn(
                "flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                activo === plan
                  ? "border-accent bg-gradient-brand text-white"
                  : "border-border-glass text-text-secondary hover:border-accent/40 hover:text-white",
              )}
            >
              {NOMBRES_PLAN[plan]}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-2xl space-y-2.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activo}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              {situaciones.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={irAlPlan}
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-border-glass bg-white/[0.03] px-5 py-3.5 text-left transition-colors hover:border-accent/50 hover:bg-white/[0.06]"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.situacion}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{item.tecnica}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
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
