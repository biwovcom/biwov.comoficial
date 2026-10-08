"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";

export function BloqueMensajeCopiable({ titulo, mensaje }: { titulo: string; mensaje: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(mensaje);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border-glass bg-white/[0.02] p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">{titulo}</p>
      <p className="whitespace-pre-line text-sm text-white/90">{mensaje}</p>
      <button
        type="button"
        onClick={copiar}
        className="mt-3 flex items-center gap-2 rounded-full border border-border-glass px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
      >
        {copiado ? <Check size={14} className="text-accent" /> : <ClipboardCopy size={14} />}
        {copiado ? "¡Copiado!" : "Copiar mensaje"}
      </button>
    </div>
  );
}
