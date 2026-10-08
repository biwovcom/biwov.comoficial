"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { LINKS_PANEL } from "@/lib/panel/panelConfig";

function mensajeAgendar(): string {
  const link = LINKS_PANEL.calendario || "[pendiente: pega tu link de agendamiento en panelConfig.ts]";
  return (
    `¡Qué bueno! Me encanta. Hagamos algo: agendemos 45 minutos para revisar tu negocio. ` +
    `¿Te queda mejor el martes a las 10 o el jueves a las 3? Agenda aquí el que te quede mejor: ${link}`
  );
}

function mensajeFormulario(): string {
  return (
    `¡Listo! Para llegar a nuestra reunión con un plan pensado para ti, y no algo genérico, ` +
    `llena este formulario corto (menos de 2 minutos) antes de la cita: [Link del diagnóstico]`
  );
}

function BloqueMensaje({ titulo, mensaje }: { titulo: string; mensaje: string }) {
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

export function CopiarMensajeEnganche() {
  return (
    <div className="space-y-3">
      <BloqueMensaje titulo="1. Cuando muestre interés: agenda de una vez" mensaje={mensajeAgendar()} />
      <BloqueMensaje
        titulo="2. Apenas quede agendado: manda el formulario como preparación"
        mensaje={mensajeFormulario()}
      />
      {!LINKS_PANEL.calendario && (
        <p className="text-xs text-amber-400">
          Todavía no tienes el link de tu Horario de reservas de Google Calendar guardado. Créalo
          en Google Calendar y dámelo para dejarlo listo aquí y en los mensajes automáticos.
        </p>
      )}
    </div>
  );
}
