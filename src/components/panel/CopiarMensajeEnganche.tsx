"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { LINKS_PANEL } from "@/lib/panel/panelConfig";

function mensajeEnganche(): string {
  const link = LINKS_PANEL.calendario || "[pendiente: pega tu link de agendamiento en panelConfig.ts]";
  return (
    `¡Hola [Nombre]! Claro que sí, me encantaría ayudarte con esto. ` +
    `Para aprovechar al máximo el tiempo de los dos y traerte una propuesta hecha a la medida, ` +
    `por favor llena este breve formulario de 3 minutos aquí: [Link del diagnóstico]. ` +
    `Una vez lo llenes, te va a salir mi calendario para que agendemos nuestra sesión de estrategia: ${link}`
  );
}

export function CopiarMensajeEnganche() {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(mensajeEnganche());
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border-glass bg-white/[0.02] p-4">
      <p className="whitespace-pre-line text-sm text-white/90">{mensajeEnganche()}</p>
      <button
        type="button"
        onClick={copiar}
        className="mt-3 flex items-center gap-2 rounded-full border border-border-glass px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
      >
        {copiado ? <Check size={14} className="text-accent" /> : <ClipboardCopy size={14} />}
        {copiado ? "¡Copiado!" : "Copiar mensaje"}
      </button>
      {!LINKS_PANEL.calendario && (
        <p className="mt-2 text-xs text-amber-400">
          Todavía no tienes el link de tu Horario de reservas de Google Calendar guardado. Créalo
          en Google Calendar y dámelo para dejarlo listo aquí y en los mensajes automáticos.
        </p>
      )}
    </div>
  );
}
