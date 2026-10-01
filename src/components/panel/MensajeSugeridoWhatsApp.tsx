"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  fraseDesafio,
  fraseMeta,
  type RespuestasFiltro,
} from "@/lib/panel/filtroRapido";
import { MENSAJES_WHATSAPP, guionAudioVerde } from "@/lib/panel/panelConfig";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import type { Semaforo } from "@/lib/panel/prospectos";

const PASOS_VERDE = [
  "Envía el mensaje de WhatsApp (botón de abajo)",
  "Graba y envía tu nota de voz leyendo el guion de audio",
  "Cuando te confirme el horario, agenda la llamada",
  "En la llamada, llena el Diagnóstico completo de este prospecto",
];

function BotonCopiar({ texto, label }: { texto: string; label: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={async () => {
        await navigator.clipboard.writeText(texto);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }}
    >
      {copiado ? "¡Copiado!" : label}
    </Button>
  );
}

export function MensajeSugeridoWhatsApp({
  semaforo,
  nombre,
  whatsapp,
  empresa,
  tipoNegocio,
  respuestasFiltro,
}: {
  semaforo: Semaforo;
  nombre: string;
  whatsapp: string;
  empresa?: string | null;
  tipoNegocio?: string | null;
  respuestasFiltro: RespuestasFiltro;
}) {
  const nombrePila = nombre.split(" ")[0];
  const ctx = {
    nombrePila,
    empresa,
    tipoNegocio,
    fraseMeta: fraseMeta(respuestasFiltro),
    fraseDesafio: fraseDesafio(respuestasFiltro),
  };
  const mensaje = MENSAJES_WHATSAPP[semaforo](ctx);
  const waUrl = linkWhatsApp(whatsapp, mensaje);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Mensaje sugerido para WhatsApp
        </p>
        <div className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-4 text-sm text-white/90">
          {mensaje}
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <BotonCopiar texto={mensaje} label="Copiar mensaje" />
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Abrir WhatsApp</Button>
          </a>
        </div>
      </div>

      {semaforo === "verde" && (
        <>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Guion para tu nota de voz
            </p>
            <p className="mb-2 text-xs text-text-secondary">
              WhatsApp no deja adjuntar un audio automáticamente desde un link — esto es lo que
              puedes decir al grabar tu nota de voz manualmente.
            </p>
            <div className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-4 text-sm text-white/90">
              {guionAudioVerde(ctx)}
            </div>
            <div className="mt-3">
              <BotonCopiar texto={guionAudioVerde(ctx)} label="Copiar guion de audio" />
            </div>
          </div>

          <GlassCard className="border-accent/30 bg-accent/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
              Siguientes pasos
            </p>
            <ol className="space-y-1.5 text-sm text-white/90">
              {PASOS_VERDE.map((paso, i) => (
                <li key={paso} className="flex gap-2">
                  <span className="text-accent">{i + 1}.</span>
                  {paso}
                </li>
              ))}
            </ol>
          </GlassCard>
        </>
      )}
    </div>
  );
}
