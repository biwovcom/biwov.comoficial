"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { PreguntasFiltro } from "@/components/panel/PreguntasFiltro";
import { MensajeSugeridoWhatsApp } from "@/components/panel/MensajeSugeridoWhatsApp";
import { respuestasCompletas, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import type { Moneda } from "@/lib/panel/panelConfig";
import type { Semaforo } from "@/lib/panel/prospectos";

export function FiltroWizard({
  prospectoId,
  nombre,
  whatsapp,
  empresa,
  tipoNegocio,
  moneda,
}: {
  prospectoId: string;
  nombre: string;
  whatsapp: string;
  empresa?: string | null;
  tipoNegocio?: string | null;
  moneda: Moneda;
}) {
  const router = useRouter();
  const [respuestas, setRespuestas] = useState<RespuestasFiltro>({});
  const [resultado, setResultado] = useState<{ semaforo: Semaforo; razon: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const emoji = resultado.semaforo === "verde" ? "🟢" : resultado.semaforo === "amarillo" ? "🟡" : "🔴";

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
          <MensajeSugeridoWhatsApp
            semaforo={resultado.semaforo}
            nombre={nombre}
            whatsapp={whatsapp}
            empresa={empresa}
            tipoNegocio={tipoNegocio}
            respuestasFiltro={respuestas}
          />
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
    <GlassCard className="max-w-2xl p-8">
      <PreguntasFiltro
        respuestas={respuestas}
        update={update}
        moneda={moneda}
        onSubmit={calcular}
        enviando={enviando}
        error={error}
        labelBoton="Calcular semáforo"
      />
    </GlassCard>
  );
}
