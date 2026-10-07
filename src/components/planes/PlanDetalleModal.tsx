"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Sparkles, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DURACION_MINIMA_MESES, type Plan } from "@/data/planes";
import { GRABACION_EDICION } from "@/data/addOns";
import { formatMoneda, sumarPrecios, multiplicarPrecio, type Moneda } from "@/lib/moneda";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { useQuoter } from "@/components/quoter/QuoterProvider";

export function PlanDetalleModal({
  plan,
  moneda,
  onClose,
}: {
  plan: Plan | null;
  moneda: Moneda;
  onClose: () => void;
}) {
  const { open: abrirDiagnostico } = useQuoter();
  const [mostrarAddOn, setMostrarAddOn] = useState(false);
  const [aceptaAddOn, setAceptaAddOn] = useState(false);

  const cerrar = () => {
    setMostrarAddOn(false);
    setAceptaAddOn(false);
    onClose();
  };

  if (!plan) return null;

  const totalSeisMeses = sumarPrecios(
    plan.montajeInicial,
    multiplicarPrecio(plan.precioDesde, DURACION_MINIMA_MESES),
  );
  const cuotaMontaje = multiplicarPrecio(plan.montajeInicial, 0.5);

  const mensajeAddOn = `¡Hola! 👋 Quiero adquirir el servicio de grabación y edición de contenido junto con el Plan ${plan.nombre}.`;

  return (
    <AnimatePresence>
      {plan && (
        <motion.div
          id="plan-modal-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrar();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="scrollbar-none max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border-glass bg-[#0c1119] p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Plan {plan.nombre}
                </span>
                <h2 className="mt-1 text-2xl font-semibold text-white">{plan.claim}</h2>
              </div>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar"
                className="print:hidden text-text-secondary hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-text-secondary">{plan.paraQuien}</p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Qué incluye
            </p>
            <ul className="mt-3 space-y-2">
              {plan.incluye.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/90">
                  <span className="mt-0.5 text-accent">✔</span> {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-border-glass bg-white/[0.02] p-5">
              <p className="text-base font-semibold text-white">
                {formatMoneda(plan.precioDesde, moneda)} al mes
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                + montaje inicial de {formatMoneda(plan.montajeInicial, moneda)}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                Publicidad aparte, sugerida desde {formatMoneda(plan.pautaSugerida, moneda)} al mes.
              </p>

              <div className="mt-4 border-t border-border-glass pt-4">
                <p className="text-sm font-semibold text-white">
                  Total por {DURACION_MINIMA_MESES} meses: {formatMoneda(totalSeisMeses, moneda)}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Nuestros planes tienen un compromiso mínimo de {DURACION_MINIMA_MESES} meses: es el
                  tiempo real que toma ver resultados.
                </p>
                <p className="mt-2 text-xs text-text-secondary">
                  ¿Prefieres diferir el montaje inicial? Puedes pagarlo en 2 cuotas iguales de{" "}
                  {formatMoneda(cuotaMontaje, moneda)}, sin recargo: una al iniciar y otra al segundo mes.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-center text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              Empieza con un diagnóstico 100% gratis
            </div>

            <Button
              size="lg"
              className="mt-4 w-full print:hidden"
              onClick={() => {
                abrirDiagnostico();
                cerrar();
              }}
            >
              Quiero mi diagnóstico gratis
            </Button>

            <div className="mt-6 border-t border-border-glass pt-5 print:hidden">
              {!mostrarAddOn ? (
                <button
                  type="button"
                  onClick={() => setMostrarAddOn(true)}
                  className="w-full rounded-2xl border border-dashed border-border-glass px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
                >
                  + Quiero adquirir los servicios de grabación y edición
                </button>
              ) : (
                <div className="rounded-2xl border border-border-glass bg-white/[0.02] p-5">
                  <h3 className="text-sm font-semibold text-white">{GRABACION_EDICION.nombre}</h3>
                  <p className="mt-1 text-xs text-text-secondary">{GRABACION_EDICION.descripcion}</p>
                  <ul className="mt-3 space-y-1.5">
                    {GRABACION_EDICION.incluye.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-white/90">
                        <span className="mt-0.5 text-accent">✔</span> {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-semibold text-white">
                    {formatMoneda(GRABACION_EDICION.precio, moneda)} · pago único
                  </p>

                  <label className="mt-4 flex items-start gap-2.5 text-xs text-text-secondary">
                    <input
                      type="checkbox"
                      checked={aceptaAddOn}
                      onChange={(e) => setAceptaAddOn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
                    />
                    <span>
                      Acepto los{" "}
                      <Link href="/contrato" target="_blank" className="text-accent underline hover:text-white">
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link
                        href="/politica-datos"
                        target="_blank"
                        className="text-accent underline hover:text-white"
                      >
                        política de datos
                      </Link>
                      .
                    </span>
                  </label>

                  <a
                    href={aceptaAddOn ? linkWhatsApp(WHATSAPP_BIWOV, mensajeAddOn) : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!aceptaAddOn) e.preventDefault();
                    }}
                  >
                    <Button className="mt-4 w-full" disabled={!aceptaAddOn}>
                      Quiero adquirir este servicio
                    </Button>
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2 border-t border-border-glass pt-5 text-xs text-text-secondary">
              <p>
                Este plan incluye tu plan de trabajo y queda sujeto a nuestros{" "}
                <Link href="/contrato" target="_blank" className="text-accent underline hover:text-white">
                  términos y condiciones
                </Link>{" "}
                y{" "}
                <Link href="/politica-datos" target="_blank" className="text-accent underline hover:text-white">
                  política de datos
                </Link>
                . Te lo enviamos para firma digital cuando confirmes el plan.
              </p>
              <p>
                Las herramientas y plataformas (WhatsApp Business, Meta Ads, CRM, etc.) las paga
                directamente el cliente.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white print:hidden"
            >
              <Printer size={14} /> Descargar esta propuesta en PDF
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
