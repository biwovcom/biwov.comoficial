"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Printer } from "lucide-react";
import type { ExtraCotizable } from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { CompraFormulario } from "./CompraFormulario";
import { PropuestaImprimible } from "@/components/propuestas/PropuestaImprimible";
import { extraAItemPropuesta } from "@/lib/propuestas/itemPropuesta";

export function CompraItemModal({
  item,
  moneda,
  trm,
  onClose,
}: {
  item: ExtraCotizable | null;
  moneda: Moneda;
  trm: number;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          id="compra-item-modal-overlay"
          className="print-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <ItemTarjeta key={item.id} item={item} moneda={moneda} trm={trm} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ItemTarjeta({
  item,
  moneda,
  trm,
  onClose,
}: {
  item: ExtraCotizable;
  moneda: Moneda;
  trm: number;
  onClose: () => void;
}) {
  const precioFormateado = formatCopEnMoneda(item.precioCop, moneda, trm) + (item.periodicidad === "mensual" ? " /mes" : "");
  const monto = moneda === "USD" ? Math.round(item.precioCop / trm) : item.precioCop;
  const formasPago =
    item.periodicidad === "mensual"
      ? ["Pago mensual por adelantado", "Transferencia o PSE, se coordina por WhatsApp"]
      : ["50% anticipado, 50% contra entrega", "Transferencia o PSE, se coordina por WhatsApp"];

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
    const res = await fetch("/api/item-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: "item",
        itemId: item.id,
        itemNombre: `${item.categoria} — ${item.nombre}`,
        ...contacto,
        moneda,
        monto,
        aceptaContrato,
        aceptaDatos,
        tiposContrato: [item.tipoContrato],
        nombreFirmante,
        firmaImagenBase64,
        snapshot: { item, moneda, monto },
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.error };
    }
    return { ok: true };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      className="scrollbar-none max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border-glass bg-[#0a2642] p-6 md:p-8"
    >
      <div className="flex items-start justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            {item.categoria}
          </span>
          <h2 className="mt-1 text-2xl font-semibold text-white">{item.nombre}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="text-text-secondary hover:text-white">
          <X size={22} />
        </button>
      </div>

      <div className="mt-4 print:hidden">
        {item.descripcion && <p className="text-sm leading-relaxed text-text-secondary">{item.descripcion}</p>}
        {item.incluye && item.incluye.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {item.incluye.map((inc) => (
              <li key={inc} className="text-sm text-white/90">
                <span className="text-accent">✔</span> {inc}
              </li>
            ))}
          </ul>
        )}
        {item.noIncluye && item.noIncluye.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {item.noIncluye.map((no) => (
              <li key={no} className="text-xs text-text-secondary">
                ✕ {no}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-lg font-semibold text-white">{precioFormateado}</p>

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
        >
          <Printer size={14} /> Descargar esta cotización en PDF (sin firmar)
        </button>
      </div>

      <div className="mt-6 border-t border-border-glass pt-5">
        <CompraFormulario
          tiposContrato={[item.tipoContrato]}
          nombreItem={`${item.categoria} — ${item.nombre}`}
          montoFormateado={precioFormateado}
          mensajeWhatsApp={`¡Hola! 👋 Quiero adquirir "${item.categoria} — ${item.nombre}" (${precioFormateado}). Ya firmé y confirmé desde el sitio.`}
          onConfirmar={confirmar}
        />
      </div>

      <div className="hidden print:block">
        <PropuestaImprimible
          titulo={`${item.categoria} — ${item.nombre}`}
          items={[extraAItemPropuesta(item, moneda, trm)]}
          totales={[{ label: "Total", valor: precioFormateado }]}
          formasPago={formasPago}
          validez="Esta propuesta tiene una validez de 15 días."
        />
      </div>
    </motion.div>
  );
}
