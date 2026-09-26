"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { construirPromptAnalisis } from "@/lib/panel/ia/prompt";
import type { RespuestaLegible } from "@/lib/panel/filtroRapido";
import type { RespuestasDiagnosticoLargo } from "@/lib/panel/diagnosticoLargo";

export function CopiarParaIABoton({
  nombreProspecto,
  empresa,
  tipoNegocio,
  resumenFiltro,
  respuestasDiagnostico,
}: {
  nombreProspecto: string;
  empresa: string | null;
  tipoNegocio: string | null;
  resumenFiltro: RespuestaLegible[];
  respuestasDiagnostico: RespuestasDiagnosticoLargo;
}) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    const { system, mensaje } = construirPromptAnalisis({
      nombreProspecto,
      empresa,
      tipoNegocio,
      resumenFiltro,
      respuestasDiagnostico,
    });
    const texto = `${system}\n\n---\n\n${mensaje}`;
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div>
      <button
        type="button"
        onClick={copiar}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-glass bg-white/[0.03] px-4 py-2.5 text-sm text-white transition-colors hover:bg-white/[0.06]"
      >
        {copiado ? <Check size={16} className="text-accent" /> : <ClipboardCopy size={16} />}
        {copiado ? "¡Copiado! Pégalo en claude.ai" : "Copiar todo para analizar en claude.ai"}
      </button>
      <p className="mt-2 text-xs text-text-secondary">
        Copia las instrucciones del análisis + toda la info del diagnóstico, listas para pegar en
        un chat nuevo de claude.ai.
      </p>
    </div>
  );
}
