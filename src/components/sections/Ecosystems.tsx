"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PLANES } from "@/data/planes";
import { formatMoneda, type Moneda } from "@/lib/moneda";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { cn } from "@/lib/utils";

export function Ecosystems() {
  const { open } = useQuoter();
  const [moneda, setMoneda] = useState<Moneda>("COP");

  return (
    <section id="planes" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Los planes"
          title="Un plan para cada momento"
          description="Empiezas donde estás y avanzas cuando los números lo indican. Sin contratos eternos ni promesas infladas."
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-border-glass bg-white/[0.03] p-1">
            {(["COP", "USD"] as Moneda[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMoneda(m)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  moneda === m ? "bg-gradient-brand text-white" : "text-text-secondary hover:text-white",
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
                  "flex h-full flex-col overflow-hidden rounded-3xl border border-border-glass bg-[#0c1119] shadow-[0_8px_40px_-16px_rgba(0,0,0,0.6)]",
                  plan.id === "crecimiento" && "border-accent/50 shadow-[0_0_40px_-12px_rgba(50,153,204,0.6)]",
                )}
              >
                <div
                  className={cn(
                    "bg-gradient-brand px-7 py-6",
                    plan.id === "crecimiento" && "relative",
                  )}
                >
                  {plan.id === "crecimiento" && (
                    <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Más elegido
                    </span>
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
                    Plan
                  </span>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{plan.nombre}</h3>
                  <p className="mt-1 text-sm font-medium text-white/85">{plan.claim}</p>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <p className="text-sm leading-relaxed text-text-secondary">{plan.paraQuien}</p>
                  <ul className="mt-6 flex-1 space-y-2">
                    {plan.incluye.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-white/90">
                        <span className="mt-0.5 text-accent">✔</span> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-border-glass pt-4">
                    <p className="text-base font-semibold text-white">
                      Desde {formatMoneda(plan.precioDesde, moneda)} al mes
                    </p>
                    <p className="text-xs text-text-secondary">
                      + montaje inicial de {formatMoneda(plan.montajeInicial, moneda)}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      Publicidad aparte, sugerida desde {formatMoneda(plan.pautaSugerida, moneda)} al mes.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-center text-xs font-semibold text-accent">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    Empieza con un diagnóstico 100% gratis
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant={plan.id === "crecimiento" ? "primary" : "secondary"}
                      className="flex-1"
                      onClick={() => open()}
                    >
                      Diagnóstico gratis
                    </Button>
                    <a
                      href={linkWhatsApp(
                        WHATSAPP_BIWOV,
                        `¡Hola! 👋 Quiero más información del Plan ${plan.nombre}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="secondary" className="w-full">
                        WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
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
