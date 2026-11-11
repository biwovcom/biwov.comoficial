"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown, Printer } from "lucide-react";
import { DURACION_MINIMA_MESES, type ItemPlan, type Plan } from "@/data/planes";
import { lineaPorId } from "@/data/lineas";
import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";
import { formatCopEnMoneda, sumarPrecios, multiplicarPrecio, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";
import { SelectorExtras } from "./SelectorExtras";
import { CompraFormulario } from "@/components/compras/CompraFormulario";
import { type ItemPropuesta } from "@/components/propuestas/PropuestaImprimible";
import { descargarPropuestaPdf } from "@/lib/pdf/descargarPropuesta";

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
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [errorPdf, setErrorPdf] = useState<string | null>(null);

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
  const tieneMontaje = plan.montajeInicial.cop > 0;
  const linea = lineaPorId(plan.linea);
  const extrasUnicosCop = extrasSeleccionados
    .filter((e) => e.periodicidad !== "mensual")
    .reduce((acc, e) => acc + e.precioCop, 0);
  const extrasMensualesCop = extrasSeleccionados
    .filter((e) => e.periodicidad === "mensual")
    .reduce((acc, e) => acc + e.precioCop, 0);
  // Los extras mensuales se proyectan al mismo periodo mínimo del plan.
  const totalExtrasCop = extrasUnicosCop + extrasMensualesCop * DURACION_MINIMA_MESES;
  const mensualidadTotalCop = plan.precioDesde.cop + extrasMensualesCop;
  const totalGeneralCop = totalSeisMeses.cop + totalExtrasCop;

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
    const data = await res.json().catch(() => null);
    return { ok: true, linkContrato: data?.linkContrato as string | undefined };
  };

  const lineasExtras = extrasSeleccionados.map(
    (e) => `+ ${e.nombre}: ${e.desde ? "desde " : ""}${formatCopEnMoneda(e.precioCop, moneda, trm)}${e.periodicidad === "mensual" ? " /mes" : ""}`,
  );
  const mensajeWhatsApp = `¡Hola! 👋 Quiero comprar el Plan ${plan.nombre} (${formatCopEnMoneda(totalSeisMeses.cop, moneda, trm)} por ${DURACION_MINIMA_MESES} meses).${lineasExtras.length ? `\n\nTambién quiero sumar:\n${lineasExtras.join("\n")}\n\nTotal estimado: ${formatCopEnMoneda(totalGeneralCop, moneda, trm)}. Lo confirmamos por aquí.` : ""} Ya firmé y confirmé desde el sitio.`;

  const itemsPropuesta: ItemPropuesta[] = [
    {
      nombre: `Plan ${plan.nombre}`,
      descripcion: plan.paraQuien,
      incluye: plan.incluye.flatMap((i) => [i.label, ...(i.subitems ?? [])]),
      noIncluye: plan.noIncluye,
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
      className="scrollbar-none max-h-[90vh] w-full max-w-lg overflow-y-auto card-universo rounded-[2rem] p-6 md:p-8"
    >
      <div className="print:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Plan {plan.nombre} · {linea.nombre}
            </span>
            <h2 className="mt-1 text-2xl font-semibold text-white">{plan.claim}</h2>
          </div>
          <button type="button" onClick={cerrar} aria-label="Cerrar" className="text-text-secondary hover:text-white">
            <X size={22} />
          </button>
        </div>

        <span className="mt-3 inline-block rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-white">
          {linea.etiqueta}
        </span>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">{plan.paraQuien}</p>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-text-secondary">Qué incluye</p>
        <ul className="mt-3 space-y-2">
          {plan.incluye.map((item) => (
            <FilaIncluye key={item.label} item={item} />
          ))}
        </ul>

        {plan.noIncluye.length > 0 && (
          <>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-text-secondary">No incluye</p>
            <ul className="mt-3 space-y-1.5">
              {plan.noIncluye.map((no) => (
                <li key={no} className="text-xs text-white/50">
                  ✕ {no}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-6 rounded-2xl border border-border-glass bg-white/[0.02] p-5">
          <p className="text-base font-semibold text-white">
            {formatCopEnMoneda(plan.precioDesde.cop, moneda, trm)} al mes
          </p>
          {tieneMontaje && (
            <p className="mt-1 text-xs text-text-secondary">
              + montaje inicial de {formatCopEnMoneda(plan.montajeInicial.cop, moneda, trm)}
            </p>
          )}
          <p className="mt-1 text-xs text-text-secondary">
  La inversión en pauta publicitaria (lo que le pagas directamente a Meta) va aparte.
          </p>

          <div className="mt-4 border-t border-border-glass pt-4">
            <p className="text-xs text-text-secondary">
              Nuestros planes tienen un compromiso mínimo de {DURACION_MINIMA_MESES} meses: es el
              tiempo real que toma ver resultados.
            </p>
            <p className="mt-2 text-xs text-text-secondary">
              La mensualidad se paga por anticipado en los primeros 5 días de cada mes. Sin montaje
              inicial.
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

        {/* Resumen que se va sumando a medida que eliges extras. */}
        <div className="sticky bottom-0 z-10 -mx-2 mt-6 rounded-[1.5rem] border border-accent/30 bg-[#06192a]/95 p-5 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Tu total</p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-3 text-white/80">
              <dt>Plan {plan.nombre} × {DURACION_MINIMA_MESES} meses</dt>
              <dd>{formatCopEnMoneda(plan.precioDesde.cop * DURACION_MINIMA_MESES, moneda, trm)}</dd>
            </div>
            {tieneMontaje && (
              <div className="flex justify-between gap-3 text-white/80">
                <dt>Montaje inicial</dt>
                <dd>{formatCopEnMoneda(plan.montajeInicial.cop, moneda, trm)}</dd>
              </div>
            )}
            {extrasSeleccionados.map((e) => (
              <div key={e.id} className="flex justify-between gap-3 text-white/80">
                <dt className="min-w-0">
                  + {e.nombre}
                  {e.periodicidad === "mensual" ? ` × ${DURACION_MINIMA_MESES} meses` : ""}
                </dt>
                <dd className="shrink-0">
                  {formatCopEnMoneda(e.periodicidad === "mensual" ? e.precioCop * DURACION_MINIMA_MESES : e.precioCop, moneda, trm)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
            <div>
              <p className="text-xs text-white/55">Total estimado ({DURACION_MINIMA_MESES} meses)</p>
              <p className="text-xs text-white/55">
                Mensualidad: {formatCopEnMoneda(mensualidadTotalCop, moneda, trm)}
                {extrasUnicosCop > 0 && ` · Pagos únicos: ${formatCopEnMoneda(extrasUnicosCop + plan.montajeInicial.cop, moneda, trm)}`}
              </p>
            </div>
            <p className="shrink-0 text-2xl font-semibold tracking-tight text-white">
              {formatCopEnMoneda(totalGeneralCop, moneda, trm)}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={descargandoPdf}
          onClick={async () => {
            setDescargandoPdf(true);
            setErrorPdf(null);
            const r = await descargarPropuestaPdf({
              titulo: `Plan ${plan.nombre}`,
              subtitulo: plan.claim,
              items: itemsPropuesta,
              totales: [
                {
                  label: `Plan ${plan.nombre} (${DURACION_MINIMA_MESES} meses)`,
                  valor: formatCopEnMoneda(totalSeisMeses.cop, moneda, trm),
                },
                ...(extrasSeleccionados.length
                  ? [
                      { label: `Extras seleccionados (${DURACION_MINIMA_MESES} meses)`, valor: formatCopEnMoneda(totalExtrasCop, moneda, trm) },
                      { label: "Total estimado", valor: formatCopEnMoneda(totalGeneralCop, moneda, trm) },
                    ]
                  : []),
              ],
              formasPago: [
                "Mensualidad del plan por anticipado, en los primeros 5 días de cada mes",
                "Servicios de pago único: 50% anticipado y 50% contra entrega",
                "Transferencia o PSE, se coordina por WhatsApp",
              ],
              validez: `Compromiso mínimo de ${DURACION_MINIMA_MESES} meses.`,
            });
            if (!r.ok) setErrorPdf(r.error);
            setDescargandoPdf(false);
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white disabled:opacity-50"
        >
          <Printer size={14} /> {descargandoPdf ? "Generando PDF..." : "Descargar esta cotización en PDF (sin firmar)"}
        </button>
        {errorPdf && <p className="mt-2 text-xs text-red-400">{errorPdf}</p>}

        <div className="mt-4 border-t border-border-glass pt-5">
          {!mostrarCompra ? (
            <button
              type="button"
              onClick={() => setMostrarCompra(true)}
              className="w-full rounded-full bg-white px-7 py-3.5 text-base font-semibold text-[#03101b] shadow-[0_6px_20px_-6px_rgba(10,38,66,0.5)] transition-all hover:scale-[1.02]"
            >
              Comprar ahora
            </button>
          ) : (
            <CompraFormulario
              tiposContrato={Array.from(new Set(["plan", ...extrasSeleccionados.map((e) => e.tipoContrato)]))}
              nombreItem={`Plan ${plan.nombre}`}
              montoFormateado={formatCopEnMoneda(totalGeneralCop, moneda, trm)}
              mensajeWhatsApp={mensajeWhatsApp}
              onConfirmar={confirmar}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
