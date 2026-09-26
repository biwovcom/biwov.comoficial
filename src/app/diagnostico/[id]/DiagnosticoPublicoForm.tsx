"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PreguntasFiltro } from "@/components/panel/PreguntasFiltro";
import { respuestasCompletas, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import type { Moneda } from "@/lib/panel/panelConfig";

export function DiagnosticoPublicoForm({
  prospectoId,
  moneda,
}: {
  prospectoId: string;
  moneda: Moneda;
}) {
  const [respuestas, setRespuestas] = useState<RespuestasFiltro>({});
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<RespuestasFiltro>) =>
    setRespuestas((prev) => ({ ...prev, ...patch }));

  const enviar = async () => {
    if (!respuestasCompletas(respuestas)) return;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectoId, respuestas }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo enviar. Intenta de nuevo.");
        return;
      }
      setEnviado(true);
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-2xl">✅</p>
        <h2 className="mt-3 text-lg font-semibold text-white">¡Gracias por responder!</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Ya recibimos tu información. Nos vamos a poner en contacto contigo pronto.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="space-y-6 p-8">
      <PreguntasFiltro respuestas={respuestas} update={update} moneda={moneda} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button
        size="lg"
        className="w-full"
        disabled={!respuestasCompletas(respuestas) || enviando}
        onClick={enviar}
      >
        {enviando ? "Enviando..." : "Enviar mis respuestas"}
      </Button>
    </GlassCard>
  );
}
