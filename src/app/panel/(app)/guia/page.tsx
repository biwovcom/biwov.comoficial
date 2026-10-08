import { GlassCard } from "@/components/ui/GlassCard";
import { ETAPAS_SEGUIMIENTO } from "@/lib/panel/seguimiento";
import { CopiarMensajeEnganche } from "@/components/panel/CopiarMensajeEnganche";

const PASOS_CIERRE = [
  {
    numero: 1,
    titulo: "Agenda primero, con día y hora fijos",
    detalle:
      'Cuando alguien muestre interés, agenda la reunión en ese mismo momento — no mandes el formulario todavía. Ofrece dos opciones de horario ("¿martes a las 10 o jueves a las 3?"): se responde en una palabra. "¿Cuándo puedes?" abre una conversación eterna y ahí se pierde la gente.',
  },
  {
    numero: 2,
    titulo: "El formulario, como preparación para la reunión",
    detalle:
      'Apenas quede agendada la cita, manda el formulario con una fecha límite real: "Para llegar con tu plan listo, llénalo antes de la reunión." Así la reunión ya existe aunque el formulario no llegue, y el formulario tiene un motivo claro para responderlo ya.',
  },
  {
    numero: 3,
    titulo: "El análisis previo",
    detalle:
      "Cuando veas el formulario respondido, haz una radiografía rápida (20-30 minutos). Prepara 2 o 3 hallazgos clave de su situación actual que demuestren que estudiaste su caso.",
  },
  {
    numero: 4,
    titulo: "La reunión de propuesta (cierre)",
    detalle:
      'En la llamada no le preguntas qué necesita, sino que le dices: "Analicé tus respuestas y detecté esto... Para solucionarlo, diseñé este plan..." y presentas tu solución empaquetada.',
  },
];

export default function GuiaPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Guía rápida del embudo</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Los pasos para no improvisar: desde que alguien escribe hasta el cierre, y qué hacer si no
        responde.
      </p>

      <GlassCard className="mt-6 p-6">
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          Reunión de entrega de propuesta / cierre en vivo
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">El paso a paso del embudo</h2>

        <div className="mt-4 space-y-4">
          {PASOS_CIERRE.map((paso) => (
            <div key={paso.numero} className="flex gap-4 rounded-xl bg-white/[0.03] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                {paso.numero}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">{paso.titulo}</h3>
                <p className="mt-1 text-sm text-text-secondary">{paso.detalle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-border-glass pt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Mensaje para el enganche inicial
          </p>
          <CopiarMensajeEnganche />
        </div>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-white">
          Protocolo de seguimiento: qué hacer cuando no responden
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Esta misma secuencia es la que ves y marcas en &ldquo;Alerta / etapa de seguimiento&rdquo; en
          cada prospecto.
        </p>
        <div className="mt-4 space-y-3">
          {ETAPAS_SEGUIMIENTO.map((etapa) => (
            <div key={etapa.nombre} className="rounded-xl bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{etapa.nombre}</h3>
                <span className="text-xs font-medium text-accent">{etapa.plazo}</span>
              </div>
              <dl className="mt-2 space-y-1 text-xs text-text-secondary">
                <p>
                  <span className="font-medium text-white/80">Objetivo:</span> {etapa.objetivo}
                </p>
                <p>
                  <span className="font-medium text-white/80">Canal:</span> {etapa.canal}
                </p>
                <p>
                  <span className="font-medium text-white/80">Enfoque:</span> {etapa.enfoque}
                </p>
              </dl>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
