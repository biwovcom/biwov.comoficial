"use client";

import { LINKS_PANEL } from "@/lib/panel/panelConfig";
import { BloqueMensajeCopiable } from "./BloqueMensajeCopiable";

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

export function CopiarMensajeEnganche() {
  return (
    <div className="space-y-3">
      <BloqueMensajeCopiable titulo="1. Cuando muestre interés: agenda de una vez" mensaje={mensajeAgendar()} />
      <BloqueMensajeCopiable
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
