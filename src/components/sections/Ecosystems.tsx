"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PLANES, type Plan } from "@/data/planes";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { useTRM } from "@/hooks/useTRM";
import { PlanDetalleModal } from "@/components/planes/PlanDetalleModal";
import { MonedaToggle } from "@/components/ui/MonedaToggle";
import { Complementos } from "./Complementos";
import { cn } from "@/lib/utils";

const FOTO_PLAN: Record<Plan["id"], string> = {
  esencial:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=70",
  crecimiento:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=70",
  escala:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=700&q=70",
};

export function Ecosystems() {
  const [planAbierto, setPlanAbierto] = useState<Plan | null>(null);
  const [abrirEnCompra, setAbrirEnCompra] = useState(false);
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const { trm } = useTRM();

  return (
    <section id="planes" className="print-host bg-bg-light">
      <div className="relative isolate overflow-hidden py-16 md:py-20">
        <Image
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=70"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0a2642]/82" />
        <Container className="relative z-10 text-center">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            Tienda biwov_
          </span>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Arma tu ecosistema digital
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Elige un plan mensual o agrega servicios sueltos — como en una tienda, a tu propio
            ritmo.
          </p>
        </Container>
      </div>

      <Container className="py-16 md:py-20">
        <div className="planes-contenido-principal">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Planes mensuales
            </span>
            <h3 className="text-2xl font-bold text-text-on-light">Un plan para cada momento</h3>
          </div>
          <MonedaToggle moneda={moneda} onChange={setMoneda} />
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
                  "flex h-full flex-col overflow-hidden rounded-3xl border border-border-glass bg-[#0a2642] shadow-[0_12px_40px_-16px_rgba(46,91,126,0.35)]",
                  plan.id === "crecimiento" && "border-accent/50 shadow-[0_16px_44px_-16px_rgba(10,38,66,0.5)]",
                )}
              >
                <div className="relative h-36 overflow-hidden">
                  <Image src={FOTO_PLAN[plan.id]} alt="" fill sizes="400px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2642] from-5% via-[#0a2642]/15 via-45% to-transparent" />
                  {plan.id === "crecimiento" && (
                    <span className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                      Más elegido
                    </span>
                  )}
                  <div className="absolute bottom-3 left-5 right-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">Plan</span>
                    <h3 className="text-2xl font-bold text-white">{plan.nombre}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <p className="text-sm font-medium text-white/85">{plan.claim}</p>
                  <p className="text-sm leading-relaxed text-white/70">{plan.paraQuien}</p>

                  <div className="mt-6 flex-1 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                      Lo que logras
                    </p>
                    <p className="mt-1 text-sm text-white/90">{plan.resumen}</p>
                  </div>

                  <p className="mt-6 text-base font-semibold text-white">
                    Desde {formatCopEnMoneda(plan.precioDesde.cop, moneda, trm)} al mes
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">Plan con compromiso mínimo de 6 meses.</p>

                  <div className="mt-5 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 !px-3 !py-2 !text-xs whitespace-nowrap"
                      onClick={() => {
                        setAbrirEnCompra(false);
                        setPlanAbierto(plan);
                      }}
                    >
                      Más información
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    {plan.linkPago ? (
                      <a
                        href={plan.linkPago}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="primary" className="w-full !px-3 !py-2 !text-xs whitespace-nowrap">
                          Comprar ahora
                        </Button>
                      </a>
                    ) : (
                      <Button
                        variant="primary"
                        className="flex-1 !px-3 !py-2 !text-xs whitespace-nowrap"
                        onClick={() => {
                          setAbrirEnCompra(true);
                          setPlanAbierto(plan);
                        }}
                      >
                        Comprar ahora
                      </Button>
                    )}
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
        </div>

        <Complementos moneda={moneda} trm={trm} />

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-text-on-light-secondary print:hidden">
          Valores netos. Si el cliente es agente retenedor, la retención en la fuente se asume
          sobre el valor pactado.
        </p>
      </Container>

      <PlanDetalleModal
        plan={planAbierto}
        moneda={moneda}
        trm={trm}
        abrirEnCompra={abrirEnCompra}
        onClose={() => setPlanAbierto(null)}
      />
    </section>
  );
}
