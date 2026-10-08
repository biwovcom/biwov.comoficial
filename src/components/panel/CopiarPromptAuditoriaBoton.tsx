"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { construirPromptAuditoriaRedes } from "@/lib/panel/ia/promptAuditoriaRedes";

export function CopiarPromptAuditoriaBoton({
  nombreProspecto,
  empresa,
  nichoMercado,
  redesSociales,
  linkRedesProspecto,
  queQuiereResolver,
}: {
  nombreProspecto: string;
  empresa: string | null;
  nichoMercado: string | null;
  redesSociales: string | null;
  linkRedesProspecto: string | null;
  queQuiereResolver: string | null;
}) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    const texto = construirPromptAuditoriaRedes({
      nombreProspecto,
      empresa,
      nichoMercado,
      redesSociales,
      linkRedesProspecto,
      queQuiereResolver,
    });
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
        {copiado ? "¡Copiado! Pégalo en claude.ai" : "Copiar prompt de auditoría de redes sociales"}
      </button>
      <p className="mt-2 text-xs text-text-secondary">
        Prompt de auditoría 360° para analizar el perfil de redes de este prospecto en claude.ai.
        Ya viene con el nombre, nicho y enlace que tenemos; completa red social, antigüedad y
        métricas según lo que veas en el perfil.
      </p>
    </div>
  );
}
