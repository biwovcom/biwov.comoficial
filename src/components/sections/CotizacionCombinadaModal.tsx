"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";

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

  const mensaje = () => {
    const lineas = items.map(
      (i) => `• ${i.nombre}: ${formatCopEnMoneda(i.precioCop, moneda, trm)}${i.periodicidad === "mensual" ? " /mes" : ""}`,
    );
    return `¡Hola! 👋 Quiero una cotización combinada con esto:\n\n${lineas.join("\n")}\n\nTotal aproximado, lo confirmamos por aquí. Quisiera coordinar los detalles.`;
  };

  return (
    <AnimatePresence>
      {abierto && items.length > 0 && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
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
            <div className="hidden print:mb-6 print:block">
              <span className="font-logo text-2xl font-bold">biwov_</span>
              <p className="mt-0.5 text-xs text-[#4b5563]">Agencia de Marketing Digital</p>
              <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#1d4772] to-[#3d98cc]" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">Tu cotización combinada</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="print:hidden text-text-secondary hover:text-white"
              >
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

            <div className="mt-6 flex gap-2 print:hidden">
              <a href={linkWhatsApp(WHATSAPP_BIWOV, mensaje())} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full">Enviar por WhatsApp</Button>
              </a>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white print:hidden"
            >
              <Printer size={14} /> Descargar en PDF
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
