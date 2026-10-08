"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PreguntasFiltro } from "@/components/panel/PreguntasFiltro";
import { respuestasCompletas, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import { LINKS_PANEL, type Moneda } from "@/lib/panel/panelConfig";

export function DiagnosticoPublicoForm({
  prospectoId,
  moneda,
}: {
  prospectoId: string;
  moneda: Moneda;
}) {
  const [respuestas, setRespuestas] = useState<RespuestasFiltro>({});
  const [autorizaDatos, setAutorizaDatos] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<RespuestasFiltro>) =>
    setRespuestas((prev) => ({ ...prev, ...patch }));

  const enviar = async () => {
    if (!respuestasCompletas(respuestas)) return;
    if (!autorizaDatos) {
      setError("Debes autorizar el tratamiento de tus datos para continuar.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectoId, respuestas, autorizaDatos }),
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
          {LINKS_PANEL.calendario
            ? "Ya recibimos tu información. Agenda tu asesoría ya mismo para que te contemos lo que encontramos."
            : "Ya recibimos tu información. Nos vamos a poner en contacto contigo pronto."}
        </p>
        {LINKS_PANEL.calendario && (
          <a href={LINKS_PANEL.calendario} target="_blank" rel="noopener noreferrer" className="mt-5 block">
            <Button size="lg" className="w-full">
              Agendar mi asesoría
            </Button>
          </a>
        )}
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <PreguntasFiltro
        respuestas={respuestas}
        update={update}
        moneda={moneda}
        onSubmit={enviar}
        enviando={enviando}
        error={error}
        labelBoton="Enviar mis respuestas"
      />
      <label className="mt-5 flex items-start gap-2.5 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={autorizaDatos}
          onChange={(e) => setAutorizaDatos(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>
          Autorizo el tratamiento de mis datos personales según la{" "}
          <Link
            href="/politica-datos"
            target="_blank"
            className="text-accent underline hover:text-white"
          >
            política de tratamiento de datos
          </Link>
          .
        </span>
      </label>
    </GlassCard>
  );
}
