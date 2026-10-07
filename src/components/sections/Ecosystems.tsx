"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PLANES, type Plan } from "@/data/planes";
import { formatMoneda, type Moneda } from "@/lib/moneda";
import { PlanDetalleModal } from "@/components/planes/PlanDetalleModal";
import { cn } from "@/lib/utils";

export function Ecosystems() {
  const [planAbierto, setPlanAbierto] = useState<Plan | null>(null);
  const [abrirEnCompra, setAbrirEnCompra] = useState(false);
  const [moneda, setMoneda] = useState<Moneda>("COP");

  return (
    <section id="planes" className="bg-bg-light py-16 md:py-24">
      <Container>
        <SectionHeading
          variant="light"
          eyebrow="Los planes"
          title="Un plan para cada momento"
          description="Empiezas donde estás y avanzas cuando los números lo indican. Sin contratos eternos ni promesas infladas."
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-border-light bg-white p-1">
            {(["COP", "USD"] as Moneda[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMoneda(m)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  moneda === m ? "bg-gradient-brand text-white" : "text-text-on-light-secondary hover:text-text-on-light",
                )}
              >
                {m === "COP" ? "Pesos colombianos" : "Dólares (USD)"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PLANES.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className={cn(
                  "flex h-full flex-col overflow-hidden rounded-3xl border border-border-glass bg-[#0c1119] shadow-[0_12px_40px_-16px_rgba(13,59,102,0.35)]",
                  plan.id === "crecimiento" && "border-accent/50 shadow-[0_0_40px_-12px_rgba(50,153,204,0.5)]",
                )}
              >
                <div className={cn("bg-gradient-brand px-7 py-6", plan.id === "crecimiento" && "relative")}>
                  {plan.id === "crecimiento" && (
                    <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Más elegido
                    </span>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/70">Plan</span>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{plan.nombre}</h3>
                  <p className="mt-1 text-sm font-medium text-white/85">{plan.claim}</p>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <p className="text-sm leading-relaxed text-white/70">{plan.paraQuien}</p>

                  <div className="mt-6 flex-1 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                      Lo que logras
                    </p>
                    <p className="mt-1 text-sm text-white/90">{plan.resumen}</p>
                  </div>

                  <p className="mt-6 text-base font-semibold text-white">
                    Desde {formatMoneda(plan.precioDesde, moneda)} al mes
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">Plan con compromiso mínimo de 6 meses.</p>

                  <div className="mt-5 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        setAbrirEnCompra(false);
                        setPlanAbierto(plan);
                      }}
                    >
                      Más información
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={plan.id === "crecimiento" ? "primary" : "secondary"}
                      className="flex-1"
                      onClick={() => {
                        setAbrirEnCompra(true);
                        setPlanAbierto(plan);
                      }}
                    >
                      Comprar ahora
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-text-on-light-secondary">
          Valores de referencia en pesos colombianos o dólares, según elijas arriba. Mínimo 6 meses.
          Las plataformas y la publicidad se pagan aparte.
        </p>
      </Container>

      <PlanDetalleModal
        plan={planAbierto}
        moneda={moneda}
        abrirEnCompra={abrirEnCompra}
        onClose={() => setPlanAbierto(null)}
      />
    </section>
  );
}
