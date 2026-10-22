"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MonedaToggle } from "@/components/ui/MonedaToggle";
import { SelectorExtras } from "@/components/planes/SelectorExtras";
import { CotizacionCombinadaModal } from "./CotizacionCombinadaModal";
import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { useTRM } from "@/hooks/useTRM";

export function CalculadoraCotizacion() {
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const { trm } = useTRM();
  const [extras, setExtras] = useState<string[]>([]);
  const [cotizacionAbierta, setCotizacionAbierta] = useState(false);

  const toggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };
  const seleccionados = EXTRAS_COTIZABLES.filter((e) => extras.includes(e.id));
  const totalUnico = seleccionados.filter((e) => e.periodicidad === "único").reduce((acc, e) => acc + e.precioCop, 0);
  const totalMensual = seleccionados.filter((e) => e.periodicidad === "mensual").reduce((acc, e) => acc + e.precioCop, 0);

  return (
    <section id="calculadora" className="print-host bg-bg-light py-16 md:py-24">
      <Container>
        <SectionHeading
          variant="light"
          eyebrow="Calculadora"
          title="Arma tu propia cotización"
          description="Marca lo que necesitas y te armamos un solo mensaje con todo — sin compromiso, solo para que sepas cuánto costaría."
        />

        <div className="mt-8">
          <MonedaToggle moneda={moneda} onChange={setMoneda} />
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-[32px] border border-border-glass bg-[#0c1119] p-6 shadow-[0_20px_60px_-24px_rgba(13,59,102,0.5)] md:p-8">
          <SelectorExtras
            moneda={moneda}
            trm={trm}
            seleccionados={extras}
            onToggle={toggleExtra}
            titulo="Elige lo que quieres sumar a tu cotización"
          />

          <div className="mt-6 overflow-hidden rounded-2xl border border-accent/30 bg-gradient-brand">
            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              {seleccionados.length > 0 ? (
                <div className="text-white">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                    {seleccionados.length} seleccionado{seleccionados.length === 1 ? "" : "s"}
                  </p>
                  <p className="mt-0.5 text-lg font-semibold">
                    {totalUnico > 0 && <>{formatCopEnMoneda(totalUnico, moneda, trm)} pago único</>}
                    {totalUnico > 0 && totalMensual > 0 && " + "}
                    {totalMensual > 0 && <>{formatCopEnMoneda(totalMensual, moneda, trm)} /mes</>}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-white/85">
                  Selecciona arriba lo que te interesa y aquí verás el total aproximado.
                </p>
              )}
              <Button
                variant="secondary"
                className="shrink-0 !border-white/30 !bg-white/10 !text-white hover:!bg-white/20"
                disabled={seleccionados.length === 0}
                onClick={() => setCotizacionAbierta(true)}
              >
                Ver mi cotización
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {extras.length > 0 && !cotizacionAbierta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-gradient-brand p-4 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] sm:inset-x-auto sm:right-6"
          >
            <p className="text-xs text-white">
              {extras.length} seleccionado{extras.length === 1 ? "" : "s"}
              <br />
              <span className="font-semibold">
                {formatCopEnMoneda(totalUnico + totalMensual, moneda, trm)} aprox.
              </span>
            </p>
            <Button
              variant="secondary"
              className="shrink-0 !border-white/30 !bg-white/10 !px-4 !py-2 !text-xs !text-white whitespace-nowrap hover:!bg-white/20"
              onClick={() => setCotizacionAbierta(true)}
            >
              Ver cotización
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <CotizacionCombinadaModal
        abierto={cotizacionAbierta}
        extras={extras}
        moneda={moneda}
        trm={trm}
        onClose={() => setCotizacionAbierta(false)}
      />
    </section>
  );
}
