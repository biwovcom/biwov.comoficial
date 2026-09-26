"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { CAMINOS_NECESIDAD } from "@/data/necesidades";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { cn } from "@/lib/utils";
import { Users2, TrendingUp, Clock, Puzzle, ChevronDown } from "lucide-react";

const ICONOS = {
  clientes: Users2,
  ventas: TrendingUp,
  tiempo: Clock,
  personalizada: Puzzle,
};

export function NeedsPaths() {
  const [abierto, setAbierto] = useState<string | null>(null);
  const { open } = useQuoter();

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Encuentra tu camino"
          title="¿Qué necesita tu negocio?"
          description="No vendemos una lista de servicios. Elige lo que buscas, entiende el problema real detrás y haz tu diagnóstico gratis."
        />

        <div className="mt-14 mx-auto max-w-2xl space-y-5">
          {CAMINOS_NECESIDAD.map((camino) => {
            const Icon = ICONOS[camino.id];
            const estaAbierto = abierto === camino.id;
            return (
              <GlassCard key={camino.id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAbierto(estaAbierto ? null : camino.id)}
                  className="flex w-full items-center gap-4 p-6 text-left"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <span className="flex-1 text-lg font-medium text-white">
                    {camino.titulo}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-text-secondary transition-transform",
                      estaAbierto && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {estaAbierto && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="space-y-4 px-6 pb-6">
                        <p className="text-sm text-text-secondary">
                          <span className="font-semibold text-white/80">
                            El problema:{" "}
                          </span>
                          {camino.problema}
                        </p>
                        <p className="text-sm text-text-secondary">
                          <span className="font-semibold text-accent">
                            Cómo lo resolvemos:{" "}
                          </span>
                          {camino.solucion}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {camino.incluye.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1.5 text-xs text-white/85"
                            >
                              ✔ {item}
                            </span>
                          ))}
                        </div>
                        <Button size="md" className="w-full" onClick={() => open()}>
                          Hacer mi diagnóstico gratis
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
