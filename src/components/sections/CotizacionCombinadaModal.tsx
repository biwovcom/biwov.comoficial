"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Printer } from "lucide-react";
import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { CompraFormulario } from "@/components/compras/CompraFormulario";
import { PropuestaImprimible } from "@/components/propuestas/PropuestaImprimible";
import { extraAItemPropuesta } from "@/lib/propuestas/itemPropuesta";

export function CotizacionCombinadaModal({
  abierto,
  extras,
  moneda,
  trm,
  onClose,
}: {
  abierto: boolean;
  extras: string[];
  moneda: Moneda;
  trm: number;
  onClose: () => void;
}) {
  const items = EXTRAS_COTIZABLES.filter((e) => extras.includes(e.id));
  const totalUnico = items.filter((i) => i.periodicidad === "único").reduce((acc, i) => acc + i.precioCop, 0);
  const totalMensual = items.filter((i) => i.periodicidad === "mensual").reduce((acc, i) => acc + i.precioCop, 0);
  const tiposContrato = Array.from(new Set(items.map((i) => i.tipoContrato)));

  const lineasWhatsApp = items.map(
    (i) => `• ${i.nombre}: ${formatCopEnMoneda(i.precioCop, moneda, trm)}${i.periodicidad === "mensual" ? " /mes" : ""}`,
  );
  const mensajeWhatsApp = `¡Hola! 👋 Quiero esta cotización combinada:\n\n${lineasWhatsApp.join("\n")}\n\nYa firmé y confirmé desde el sitio. Quisiera coordinar los detalles.`;

  const itemsPropuesta = items.map((i) => extraAItemPropuesta(i, moneda, trm));

  const montoFormateado = [
    totalUnico > 0 ? `${formatCopEnMoneda(totalUnico, moneda, trm)} único` : null,
    totalMensual > 0 ? `${formatCopEnMoneda(totalMensual, moneda, trm)} /mes` : null,
  ]
    .filter(Boolean)
    .join(" + ");

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
    const montoNumerico = moneda === "USD" ? Math.round((totalUnico + totalMensual) / trm) : totalUnico + totalMensual;
    const res = await fetch("/api/item-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: "combo",
        itemNombre: items.map((i) => i.nombre).join(", "),
        ...contacto,
        moneda,
        monto: montoNumerico,
        aceptaContrato,
        aceptaDatos,
        tiposContrato,
        nombreFirmante,
        firmaImagenBase64,
        snapshot: { items, moneda },
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.error };
    }
    return { ok: true };
  };

  return (
    <AnimatePresence>
      {abierto && items.length > 0 && (
        <motion.div
          id="cotizacion-combinada-modal-overlay"
          className="print-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="scrollbar-none max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border-glass bg-[#0c1119] p-6 md:p-8"
          >
            <div className="print:hidden">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-white">Tu cotización combinada</h2>
                <button type="button" onClick={onClose} aria-label="Cerrar" className="text-text-secondary hover:text-white">
                  <X size={22} />
                </button>
              </div>

              <ul className="mt-5 space-y-2.5">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-white/90">{item.nombre}</span>
                    <span className="shrink-0 font-medium text-accent">
                      {formatCopEnMoneda(item.precioCop, moneda, trm)}
                      {item.periodicidad === "mensual" ? " /mes" : ""}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-1 border-t border-border-glass pt-4">
                {totalUnico > 0 && (
                  <p className="text-sm text-white">
                    Total pago único: <span className="font-semibold text-accent">{formatCopEnMoneda(totalUnico, moneda, trm)}</span>
                  </p>
                )}
                {totalMensual > 0 && (
                  <p className="text-sm text-white">
                    Total mensual: <span className="font-semibold text-accent">{formatCopEnMoneda(totalMensual, moneda, trm)}</span>
                  </p>
                )}
                <p className="text-xs text-text-secondary">Valores aproximados; los confirmamos juntos por WhatsApp.</p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
              >
                <Printer size={14} /> Descargar esta cotización en PDF (sin firmar)
              </button>

              <div className="mt-4 border-t border-border-glass pt-5">
                <CompraFormulario
                  tiposContrato={tiposContrato}
                  nombreItem={items.map((i) => i.nombre).join(", ")}
                  montoFormateado={montoFormateado}
                  mensajeWhatsApp={mensajeWhatsApp}
                  onConfirmar={confirmar}
                />
              </div>
            </div>

            <div className="hidden print:block">
              <PropuestaImprimible
                titulo="Cotización combinada"
                items={itemsPropuesta}
                totales={[
                  ...(totalUnico > 0 ? [{ label: "Total pago único", valor: formatCopEnMoneda(totalUnico, moneda, trm) }] : []),
                  ...(totalMensual > 0 ? [{ label: "Total mensual", valor: formatCopEnMoneda(totalMensual, moneda, trm) }] : []),
                ]}
                formasPago={["50% anticipado, 50% contra entrega (servicios únicos)", "Pago mensual por adelantado (servicios recurrentes)"]}
                validez="Esta propuesta tiene una validez de 15 días."
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
