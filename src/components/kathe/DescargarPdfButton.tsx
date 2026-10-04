"use client";

import { Download } from "lucide-react";

export function DescargarPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-full border border-border-glass bg-white/[0.03] px-4 py-2 text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
    >
      <Download size={14} />
      Descargar como PDF
    </button>
  );
}
