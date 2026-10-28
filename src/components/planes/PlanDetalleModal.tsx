"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown, Printer } from "lucide-react";
import { DURACION_MINIMA_MESES, type ItemPlan, type Plan } from "@/data/planes";
import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";
import { formatCopEnMoneda, sumarPrecios, multiplicarPrecio, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";
import { SelectorExtras } from "./SelectorExtras";
import { CompraFormulario } from "@/components/compras/CompraFormulario";
import { PropuestaImprimible, type ItemPropuesta } from "@/components/propuestas/PropuestaImprimible";

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
      {tieneSubitems && (
        <ul className={cn("mt-2 ml-6 space-y-1.5 border-l border-border-glass pl-3", abierto ? "block" : "hidden")}>
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
  trm,
  abrirEnCompra,
  onClose,
}: {
  plan: Plan | null;
  moneda: Moneda;
  trm: number;
  abrirEnCompra?: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {plan && (
        <motion.div
          id="plan-modal-overlay"
          className="print-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
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
            trm={trm}
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
  trm,
  abrirEnCompraInicial,
  onClose,
}: {
  plan: Plan;
  moneda: Moneda;
  trm: number;
  abrirEnCompraInicial: boolean;
  onClose: () => void;
}) {
  const [mostrarCompra, setMostrarCompra] = useState(abrirEnCompraInicial);
  const [extras, setExtras] = useState<string[]>([]);

  const toggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };
  const extrasSeleccionados = EXTRAS_COTIZABLES.filter((e) => extras.includes(e.id));

  const cerrar = () => {
    onClose();
    setExtras([]);
    setMostrarCompra(abrirEnCompraInicial);
  };

  const totalSeisMeses = sumarPrecios(
    plan.montajeInicial,
    multiplicarPrecio(plan.precioDesde, DURACION_MINIMA_MESES),
  );
  const cuotaMontaje = multiplicarPrecio(plan.montajeInicial, 0.5);
  const totalExtrasCop = extrasSeleccionados.reduce((acc, e) => acc + e.precioCop, 0);

  const confirmar = async ({
    contacto,
    aceptaContrato,
    aceptaDatos,
    nombreFirmante,
    firmaImagenBase64,
  }: {
    contacto: { nombre: string; whatsapp: string; email: string; empresa: string };
    aceptaContrato: boolean;
    aceptaDatos: boolean;
    nombreFirmante: string;
    firmaImagenBase64: string;
  }) => {
    const monto = moneda === "USD" ? Math.round(totalSeisMeses.cop / trm) : totalSeisMeses.cop;
    const res = await fetch("/api/plan-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: plan.id,
        ...contacto,
        moneda,
        monto,
        aceptaContrato,
        aceptaDatos,
        nombreFirmante,
        firmaImagenBase64,
        snapshot: {
          nombre: plan.nombre,
          totalSeisMeses,
          moneda,
          extras: extrasSeleccionados.map((e) => ({ nombre: e.nombre, precioCop: e.precioCop, periodicidad: e.periodicidad })),
        },
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.error };
    }
    return { ok: true };
  };

  const lineasExtras = extrasSeleccionados.map(
    (e) => `+ ${e.nombre}: ${formatCopEnMoneda(e.precioCop, moneda, trm)}${e.periodicidad === "mensual" ? " /mes" : ""}`,
  );
  const mensajeWhatsApp = `¡Hola! 👋 Quiero comprar el Plan ${plan.nombre} (${formatCopEnMoneda(totalSeisMeses.cop, moneda, trm)} por ${DURACION_MINIMA_MESES} meses).${lineasExtras.length ? `\n\nTambién quiero sumar:\n${lineasExtras.join("\n")}\n\nTotal aproximado, lo confirmamos por aquí.` : ""} Ya firmé y confirmé desde el sitio.`;

  const itemsPropuesta: ItemPropuesta[] = [
    {
      nombre: `Plan ${plan.nombre}`,
      descripcion: plan.paraQuien,
      incluye: plan.incluye.flatMap((i) => [i.label, ...(i.subitems ?? [])]),
      precio: `${formatCopEnMoneda(plan.precioDesde.cop, moneda, trm)} al mes`,
    },
    ...extrasSeleccionados.map((e) => ({
      nombre: e.nombre,
      descripcion: e.descripcion,
      incluye: e.incluye,
      noIncluye: e.noIncluye,
      precio: formatCopEnMoneda(e.precioCop, moneda, trm),
      periodicidad: e.periodicidad,
    })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      className="scrollbar-none max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border-glass bg-[#0b1f38] p-6 md:p-8"
    >
      <div className="print:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Plan {plan.nombre}
            </span>
            <h2 className="mt-1 text-2xl font-semibold text-white">{plan.claim}</h2>
          </div>
          <button type="button" onClick={cerrar} aria-label="Cerrar" className="text-text-secondary hover:text-white">
            <X size={22} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-text-secondary">{plan.paraQuien}</p>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-text-secondary">Qué incluye</p>
        <ul className="mt-3 space-y-2">
          {plan.incluye.map((item) => (
            <FilaIncluye key={item.label} item={item} />
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-border-glass bg-white/[0.02] p-5">
          <p className="text-base font-semibold text-white">
            {formatCopEnMoneda(plan.precioDesde.cop, moneda, trm)} al mes
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            + montaje inicial de {formatCopEnMoneda(plan.montajeInicial.cop, moneda, trm)}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            La inversión en pauta publicitaria (lo que le pagas directamente a Meta) va aparte; la
            definimos juntos según tu negocio.
          </p>

          <div className="mt-4 border-t border-border-glass pt-4">
            <p className="text-xs text-text-secondary">
              Nuestros planes tienen un compromiso mínimo de {DURACION_MINIMA_MESES} meses: es el
              tiempo real que toma ver resultados.
            </p>
            <p className="mt-2 text-xs text-text-secondary">
              ¿Prefieres diferir el montaje inicial? Puedes pagarlo en 2 cuotas iguales de{" "}
              {formatCopEnMoneda(cuotaMontaje.cop, moneda, trm)}, sin recargo: una al iniciar y otra al segundo mes.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <SelectorExtras
            moneda={moneda}
            trm={trm}
            seleccionados={extras}
            onToggle={toggleExtra}
            titulo="¿Quieres sumar algo más a tu plan? (opcional)"
          />
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
        >
          <Printer size={14} /> Descargar esta cotización en PDF (sin firmar)
        </button>

        <div className="mt-4 border-t border-border-glass pt-5">
          {!mostrarCompra ? (
            <button
              type="button"
              onClick={() => setMostrarCompra(true)}
              className="w-full rounded-full bg-gradient-brand px-7 py-3.5 text-base font-medium text-white shadow-[0_0_30px_-5px_rgba(31,196,222,0.6)] transition-all hover:shadow-[0_0_45px_-5px_rgba(31,196,222,0.85)]"
            >
              Comprar ahora
            </button>
          ) : (
            <CompraFormulario
              tiposContrato={Array.from(new Set(["plan", ...extrasSeleccionados.map((e) => e.tipoContrato)]))}
              nombreItem={`Plan ${plan.nombre}`}
              montoFormateado={formatCopEnMoneda(totalSeisMeses.cop + totalExtrasCop, moneda, trm)}
              mensajeWhatsApp={mensajeWhatsApp}
              onConfirmar={confirmar}
            />
          )}
        </div>
      </div>

      <div className="hidden print:block">
        <PropuestaImprimible
          titulo={`Plan ${plan.nombre}`}
          subtitulo={plan.claim}
          items={itemsPropuesta}
          totales={[
            { label: `Plan ${plan.nombre} (${DURACION_MINIMA_MESES} meses)`, valor: formatCopEnMoneda(totalSeisMeses.cop, moneda, trm) },
            ...(extrasSeleccionados.length
              ? [{ label: "Extras seleccionados", valor: formatCopEnMoneda(totalExtrasCop, moneda, trm) }]
              : []),
          ]}
          formasPago={[
            "Montaje inicial en 1 o 2 cuotas iguales (sin recargo)",
            "Mensualidad del plan, mes a mes",
            "Transferencia o PSE, se coordina por WhatsApp",
          ]}
          validez={`Compromiso mínimo de ${DURACION_MINIMA_MESES} meses.`}
        />
      </div>
    </motion.div>
  );
}
