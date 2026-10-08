"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Printer } from "lucide-react";
import type { ReactNode } from "react";

export function ComplementoPdfModal({
  titulo,
  abierto,
  onClose,
  children,
}: {
  titulo: string;
  abierto: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          id="complemento-modal-overlay"
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
            className="scrollbar-none max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border-glass bg-[#0c1119] p-6 md:p-8"
          >
            <div className="hidden print:mb-6 print:block">
              <span className="font-logo text-2xl font-bold">biwov_</span>
              <p className="mt-0.5 text-xs text-[#4b5563]">Agencia de Marketing Digital</p>
              <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#1d4772] to-[#3d98cc]" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-white">{titulo}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="print:hidden text-text-secondary hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mt-5">{children}</div>

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white print:hidden"
            >
              <Printer size={14} /> Descargar en PDF
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
