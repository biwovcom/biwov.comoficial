"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Printer, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { DURACION_MINIMA_MESES, type ItemPlan, type Plan } from "@/data/planes";
import { formatMoneda, sumarPrecios, multiplicarPrecio, type Moneda } from "@/lib/moneda";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { cn } from "@/lib/utils";

const CONTACTO_INICIAL = { nombre: "", whatsapp: "", email: "", empresa: "" };

function FilaIncluye({ item }: { item: ItemPlan }) {
  const [abierto, setAbierto] = useState(false);
  const tieneSubitems = Boolean(item.subitems?.length);

  return (
    <li className="text-sm text-white/90">
      <div
        className={cn("flex items-start gap-2", tieneSubitems && "cursor-pointer")}
        onClick={() => tieneSubitems && setAbierto((v) => !v)}
      >
        <span className="mt-0.5 text-accent">✔</span>
        <span className="flex-1">{item.label}</span>
        {tieneSubitems && (
          <ChevronDown
            className={cn("mt-0.5 h-3.5 w-3.5 shrink-0 text-accent transition-transform", abierto && "rotate-180")}
          />
        )}
      </div>
      {tieneSubitems && abierto && (
        <ul className="mt-2 ml-6 space-y-1.5 border-l border-border-glass pl-3">
          {item.subitems!.map((sub) => (
            <li key={sub} className="text-xs text-text-secondary">
              {sub}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function PlanDetalleModal({
  plan,
  moneda,
  abrirEnCompra,
  onClose,
}: {
  plan: Plan | null;
  moneda: Moneda;
  abrirEnCompra?: boolean;
  onClose: () => void;
}) {
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
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <PlanDetalleTarjeta
            key={plan.id}
            plan={plan}
            moneda={moneda}
            abrirEnCompraInicial={Boolean(abrirEnCompra)}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlanDetalleTarjeta({
  plan,
  moneda,
  abrirEnCompraInicial,
  onClose,
}: {
  plan: Plan;
  moneda: Moneda;
  abrirEnCompraInicial: boolean;
  onClose: () => void;
}) {
  const [mostrarCompra, setMostrarCompra] = useState(abrirEnCompraInicial);
  const [contacto, setContacto] = useState(CONTACTO_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const cerrar = () => {
    onClose();
    setContacto(CONTACTO_INICIAL);
    setError(null);
    setEnviado(false);
  };

  const totalSeisMeses = sumarPrecios(
    plan.montajeInicial,
    multiplicarPrecio(plan.precioDesde, DURACION_MINIMA_MESES),
  );
  const cuotaMontaje = multiplicarPrecio(plan.montajeInicial, 0.5);

  const comprar = async () => {
    if (!contacto.nombre.trim() || (!contacto.email.trim() && !contacto.whatsapp.trim())) {
      setError("Escribe tu nombre y un correo o WhatsApp.");
      return;
    }
    setEnviando(true);
    setError(null);
    const monto = moneda === "USD" ? totalSeisMeses.usd : totalSeisMeses.cop;
    const res = await fetch("/api/plan-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: plan.id,
        ...contacto,
        moneda,
        monto,
        snapshot: { nombre: plan.nombre, totalSeisMeses, moneda },
      }),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo enviar. Intenta de nuevo.");
      return;
    }
    const mensaje = `¡Hola! 👋 Quiero comprar el Plan ${plan.nombre} (${formatMoneda(totalSeisMeses, moneda)} por ${DURACION_MINIMA_MESES} meses). Mi nombre es ${contacto.nombre}.`;
    window.open(linkWhatsApp(contacto.whatsapp || WHATSAPP_BIWOV, mensaje), "_blank");
    setEnviado(true);
  };

  return (
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
                <FilaIncluye key={item.label} item={item} />
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

            <div className="mt-6 border-t border-border-glass pt-5 print:hidden">
              {enviado ? (
                <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-center">
                  <p className="text-2xl">✅</p>
                  <p className="mt-2 text-sm text-white">
                    ¡Gracias, {contacto.nombre.split(" ")[0]}! Te abrimos WhatsApp para coordinar el
                    pago. Si no se abrió, escríbenos directo.
                  </p>
                </div>
              ) : !mostrarCompra ? (
                <Button size="lg" className="w-full" onClick={() => setMostrarCompra(true)}>
                  Comprar ahora
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">
                    Déjanos tus datos y te escribimos por WhatsApp para coordinar el pago y arrancar.
                  </p>
                  <div>
                    <Label htmlFor="compra-nombre">Nombre completo</Label>
                    <Input
                      id="compra-nombre"
                      value={contacto.nombre}
                      onChange={(e) => setContacto({ ...contacto, nombre: e.target.value })}
                      autoComplete="name"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="compra-whatsapp">WhatsApp</Label>
                      <Input
                        id="compra-whatsapp"
                        value={contacto.whatsapp}
                        onChange={(e) => setContacto({ ...contacto, whatsapp: e.target.value })}
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="compra-email">Correo</Label>
                      <Input
                        id="compra-email"
                        type="email"
                        value={contacto.email}
                        onChange={(e) => setContacto({ ...contacto, email: e.target.value })}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="compra-empresa">Empresa (opcional)</Label>
                    <Input
                      id="compra-empresa"
                      value={contacto.empresa}
                      onChange={(e) => setContacto({ ...contacto, empresa: e.target.value })}
                      autoComplete="organization"
                    />
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <Button size="lg" className="w-full" onClick={comprar} disabled={enviando}>
                    {enviando ? "Enviando..." : `Confirmar compra · ${formatMoneda(totalSeisMeses, moneda)}`}
                  </Button>
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
  );
}
