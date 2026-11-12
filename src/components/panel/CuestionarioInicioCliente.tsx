"use client";

import { useState } from "react";
import { Check, ClipboardList, Copy, ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * Inicio del proyecto en la ficha del cliente: enlace del cuestionario para
 * enviarle y las respuestas que va llenando (se guardan solas en su Historial,
 * en una sola entrada que se actualiza).
 */
export function CuestionarioInicioCliente({
  ruta,
  documentos,
  respuestas,
}: {
  /** Ruta pública del cuestionario (ej. /inicio/<id> o /documentos/<slug>/cuestionario). */
  ruta: string;
  /** Página de documentos completa del cliente, si tiene (índice con análisis y contrato). */
  documentos?: string;
  respuestas: { contenido: string; created_at: string } | null;
}) {
  const [copiado, setCopiado] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const enlace = documentos ?? ruta;
  const estado = respuestas?.contenido.split("\n")[0] ?? "";
  const cuerpo = respuestas?.contenido.split("\n").slice(2).join("\n") ?? "";

  const copiar = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${enlace}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          <ClipboardList size={16} className="text-accent" /> Inicio del proyecto · Cuestionario
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copiar}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-glass px-3 py-1.5 text-xs font-semibold text-white hover:border-accent"
          >
            {copiado ? <Check size={14} /> : <Copy size={14} />} {copiado ? "Copiado" : "Copiar enlace para el cliente"}
          </button>
          <a
            href={enlace}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border-glass px-3 py-1.5 text-xs font-semibold text-white hover:border-accent"
          >
            <ExternalLink size={14} /> Ver lo que ve el cliente
          </a>
        </div>
      </div>

      {respuestas ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-white">{estado}</p>
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="mt-3 text-xs font-semibold text-accent hover:underline"
          >
            {abierto ? "Ocultar respuestas" : "Ver respuestas completas"}
          </button>
          {abierto && (
            <pre className="mt-3 max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-xl bg-white/[0.03] p-4 font-sans text-sm leading-relaxed text-white/90">
              {cuerpo}
            </pre>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-secondary">
          El cliente todavía no ha respondido. Copia el enlace y envíaselo: sus respuestas aparecerán aquí solas
          mientras escribe, y los agentes las reciben en la ficha del proyecto.
        </p>
      )}
    </GlassCard>
  );
}
