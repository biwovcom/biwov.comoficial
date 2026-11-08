"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Printer } from "lucide-react";
import type { ReactNode } from "react";

export function ComplementoPdfModal({
  titulo,
  abierto,
  onClose,
  children,
  onDescargarPdf,
}: {
  titulo: string;
  abierto: boolean;
  onClose: () => void;
  children: ReactNode;
  onDescargarPdf?: () => Promise<{ ok: true } | { ok: false; error: string }>;
}) {
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [errorPdf, setErrorPdf] = useState<string | null>(null);
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          id="complemento-modal-overlay"
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
            className="scrollbar-none max-h-[90vh] w-full max-w-2xl overflow-y-auto card-universo rounded-[2rem] p-6 md:p-8"
          >
            <div className="print:hidden">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-white">{titulo}</h2>
                <button type="button" onClick={onClose} aria-label="Cerrar" className="text-text-secondary hover:text-white">
                  <X size={22} />
                </button>
              </div>

              <div className="mt-5">{children}</div>

              {onDescargarPdf && (
                <>
                  <button
                    type="button"
                    disabled={descargandoPdf}
                    onClick={async () => {
                      setDescargandoPdf(true);
                      setErrorPdf(null);
                      const r = await onDescargarPdf();
                      if (!r.ok) setErrorPdf(r.error);
                      setDescargandoPdf(false);
                    }}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white disabled:opacity-50"
                  >
                    <Printer size={14} /> {descargandoPdf ? "Generando PDF..." : "Descargar en PDF"}
                  </button>
                  {errorPdf && <p className="mt-2 text-xs text-red-400">{errorPdf}</p>}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
