"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PreguntasFiltro } from "@/components/panel/PreguntasFiltro";
import { respuestasCompletas, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import { MENSAJES_WHATSAPP, type Moneda } from "@/lib/panel/panelConfig";
import type { Semaforo } from "@/lib/panel/prospectos";

function soloDigitos(whatsapp: string): string {
  return whatsapp.replace(/[^\d]/g, "");
}

export function FiltroWizard({
  prospectoId,
  nombre,
  whatsapp,
  moneda,
}: {
  prospectoId: string;
  nombre: string;
  whatsapp: string;
  moneda: Moneda;
}) {
  const router = useRouter();
  const [respuestas, setRespuestas] = useState<RespuestasFiltro>({});
  const [resultado, setResultado] = useState<{ semaforo: Semaforo; razon: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const update = (patch: Partial<RespuestasFiltro>) =>
    setRespuestas((prev) => ({ ...prev, ...patch }));

  const calcular = async () => {
    if (!respuestasCompletas(respuestas)) return;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch("/api/panel/filtro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectoId, respuestas }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "No se pudo calcular el semáforo.");
        return;
      }
      const data = await res.json();
      setResultado({ semaforo: data.semaforo, razon: data.razon });
    } finally {
      setEnviando(false);
    }
  };

  if (resultado) {
    const nombrePila = nombre.split(" ")[0];
    const mensaje = MENSAJES_WHATSAPP[resultado.semaforo]({ nombrePila });
    const emoji = resultado.semaforo === "verde" ? "🟢" : resultado.semaforo === "amarillo" ? "🟡" : "🔴";
    const waUrl = `https://wa.me/${soloDigitos(whatsapp)}?text=${encodeURIComponent(mensaje)}`;

    return (
      <GlassCard className="max-w-xl p-8">
        <div className="flex items-center gap-3">
          <Badge variant={resultado.semaforo}>{emoji}</Badge>
          <h2 className="text-lg font-semibold text-white">
            {resultado.semaforo === "verde"
              ? "Caliente — pasa a diagnóstico"
              : resultado.semaforo === "amarillo"
                ? "Tibio"
                : "No califica por ahora"}
          </h2>
        </div>
        <p className="mt-2 text-sm text-text-secondary">{resultado.razon}</p>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Mensaje sugerido para WhatsApp
          </p>
          <div className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-4 text-sm text-white/90">
            {mensaje}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            size="lg"
            onClick={async () => {
              await navigator.clipboard.writeText(mensaje);
              setCopiado(true);
              setTimeout(() => setCopiado(false), 2000);
            }}
          >
            {copiado ? "¡Copiado!" : "Copiar mensaje"}
          </Button>
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Abrir WhatsApp</Button>
          </a>
        </div>

        <button
          onClick={() => router.push(`/panel/prospectos/${prospectoId}`)}
          className="mt-6 text-sm text-text-secondary hover:text-white"
        >
          ← Volver a la ficha del prospecto
        </button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-2xl space-y-6 p-8">
      <PreguntasFiltro respuestas={respuestas} update={update} moneda={moneda} />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button
        size="lg"
        className="w-full"
        disabled={!respuestasCompletas(respuestas) || enviando}
        onClick={calcular}
      >
        {enviando ? "Calculando..." : "Calcular semáforo"}
      </Button>
    </GlassCard>
  );
}
