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
  carrito,
  moneda,
  trm,
  onClose,
}: {
  abierto: boolean;
  carrito: Record<string, number>;
  moneda: Moneda;
  trm: number;
  onClose: () => void;
}) {
  const items = Object.entries(carrito)
    .map(([id, cantidad]) => ({ item: EXTRAS_COTIZABLES.find((e) => e.id === id), cantidad }))
    .filter((x): x is { item: (typeof EXTRAS_COTIZABLES)[number]; cantidad: number } => Boolean(x.item) && x.cantidad > 0);

  const totalUnico = items
    .filter((x) => x.item.periodicidad === "único")
    .reduce((acc, x) => acc + x.item.precioCop * x.cantidad, 0);
  const totalMensual = items
    .filter((x) => x.item.periodicidad === "mensual")
    .reduce((acc, x) => acc + x.item.precioCop * x.cantidad, 0);
  const tiposContrato = Array.from(new Set(items.map((x) => x.item.tipoContrato)));

  const lineasWhatsApp = items.map(
    (x) =>
      `• ${x.item.nombre} × ${x.cantidad}: ${formatCopEnMoneda(x.item.precioCop * x.cantidad, moneda, trm)}${x.item.periodicidad === "mensual" ? " /mes" : ""}`,
  );
  const mensajeWhatsApp = `¡Hola! 👋 Quiero esta cotización de mi carrito en la tienda:\n\n${lineasWhatsApp.join("\n")}\n\nYa firmé y confirmé desde el sitio. Quisiera coordinar los detalles.`;

  const itemsPropuesta = items.map((x) => {
    const base = extraAItemPropuesta(x.item, moneda, trm);
    return {
      ...base,
      nombre: x.cantidad > 1 ? `${x.item.nombre} × ${x.cantidad}` : x.item.nombre,
      precio: formatCopEnMoneda(x.item.precioCop * x.cantidad, moneda, trm),
    };
  });

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
        itemNombre: items.map((x) => `${x.item.nombre} x${x.cantidad}`).join(", "),
        ...contacto,
        moneda,
        monto: montoNumerico,
        aceptaContrato,
        aceptaDatos,
        tiposContrato,
        nombreFirmante,
        firmaImagenBase64,
        snapshot: { items: items.map((x) => ({ ...x.item, cantidad: x.cantidad })), moneda },
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
            className="scrollbar-none max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border-glass bg-[#0b1f38] p-6 md:p-8"
          >
            <div className="print:hidden">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-white">Tu carrito</h2>
                <button type="button" onClick={onClose} aria-label="Cerrar" className="text-text-secondary hover:text-white">
                  <X size={22} />
                </button>
              </div>

              <ul className="mt-5 space-y-2.5">
                {items.map((x) => (
                  <li key={x.item.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-white/90">
                      {x.item.nombre}
                      {x.cantidad > 1 && <span className="text-text-secondary"> × {x.cantidad}</span>}
                    </span>
                    <span className="shrink-0 font-medium text-accent">
                      {formatCopEnMoneda(x.item.precioCop * x.cantidad, moneda, trm)}
                      {x.item.periodicidad === "mensual" ? " /mes" : ""}
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
                  nombreItem={items.map((x) => `${x.item.nombre} x${x.cantidad}`).join(", ")}
                  montoFormateado={montoFormateado}
                  mensajeWhatsApp={mensajeWhatsApp}
                  onConfirmar={confirmar}
                />
              </div>
            </div>

            <div className="hidden print:block">
              <PropuestaImprimible
                titulo="Cotización de tu carrito en la tienda biwov"
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
