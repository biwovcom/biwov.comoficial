"use client";

import { cn } from "@/lib/utils";
import {
  OPCIONES_OBJETIVO,
  OPCIONES_META,
  OPCIONES_CUMPLIMIENTO_VENTAS,
  OPCIONES_CANAL_LLEGADA,
  OPCIONES_PRIORIDAD_EQUIPO,
  OPCIONES_CUANDO_EMPEZAR,
  type RespuestasFiltro,
} from "@/lib/panel/filtroRapido";
import { RANGOS_PRESUPUESTO, type Moneda } from "@/lib/panel/panelConfig";

function OptionCard({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200",
        selected
          ? "border-accent bg-accent/10 text-white shadow-[0_0_24px_-8px_rgba(50,153,204,0.7)]"
          : "border-border-glass bg-white/[0.02] text-white/90 hover:border-accent/40 hover:bg-white/[0.05]",
      )}
    >
      {label}
    </button>
  );
}

function Pregunta({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-white">{titulo}</p>
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent";

/**
 * Las 7 preguntas del diagnóstico inicial, reutilizadas tanto en la versión
 * interna (Kathe la llena) como en la pública (la llena el prospecto).
 */
export function PreguntasFiltro({
  respuestas,
  update,
  moneda,
}: {
  respuestas: RespuestasFiltro;
  update: (patch: Partial<RespuestasFiltro>) => void;
  moneda: Moneda;
}) {
  const canales = respuestas.canalLlegada ?? [];

  const alternarCanal = (id: (typeof OPCIONES_CANAL_LLEGADA)[number]["id"]) => {
    const yaEsta = canales.includes(id);
    const nuevos = yaEsta ? canales.filter((c) => c !== id) : [...canales, id];
    update({ canalLlegada: nuevos });
  };

  return (
    <>
      <Pregunta titulo="¿Cuáles son los desafíos que enfrenta tu empresa actualmente?">
        {OPCIONES_OBJETIVO.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.objetivo === o.id}
            onClick={() => update({ objetivo: o.id })}
          />
        ))}
      </Pregunta>
      {respuestas.objetivo === "otro" && (
        <input
          className={inputClass}
          placeholder="¿Cuál?"
          value={respuestas.objetivoOtro ?? ""}
          onChange={(e) => update({ objetivoOtro: e.target.value })}
        />
      )}

      <Pregunta titulo="Si un genio pudiera concederte un deseo para tu negocio, ¿cuál sería?">
        {OPCIONES_META.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.meta === o.id}
            onClick={() => update({ meta: o.id })}
          />
        ))}
      </Pregunta>
      {respuestas.meta === "otro" && (
        <input
          className={inputClass}
          placeholder="¿Cuál?"
          value={respuestas.metaOtro ?? ""}
          onChange={(e) => update({ metaOtro: e.target.value })}
        />
      )}

      <Pregunta titulo="¿Sientes que tu negocio está cumpliendo de forma consistente con sus metas mensuales de ventas?">
        {OPCIONES_CUMPLIMIENTO_VENTAS.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.cumplimientoVentas === o.id}
            onClick={() => update({ cumplimientoVentas: o.id })}
          />
        ))}
      </Pregunta>

      <Pregunta titulo="Actualmente, ¿por dónde llegan la mayoría de tus clientes nuevos? (Puedes marcar varias opciones)">
        {OPCIONES_CANAL_LLEGADA.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={canales.includes(o.id)}
            onClick={() => alternarCanal(o.id)}
          />
        ))}
      </Pregunta>
      {canales.includes("otro") && (
        <input
          className={inputClass}
          placeholder="¿Cuál?"
          value={respuestas.canalLlegadaOtro ?? ""}
          onChange={(e) => update({ canalLlegadaOtro: e.target.value })}
        />
      )}

      <Pregunta titulo="Para ti, ¿qué tan prioritario es contar con un equipo que te mantenga con total visibilidad de las estadísticas, lidere el crecimiento con valor agregado y te dé control estratégico de tu negocio?">
        {OPCIONES_PRIORIDAD_EQUIPO.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.prioridadEquipo === o.id}
            onClick={() => update({ prioridadEquipo: o.id })}
          />
        ))}
      </Pregunta>

      <Pregunta titulo="Si encontraras la estrategia adecuada para tu negocio, ¿cuándo te gustaría comenzar a implementarla?">
        {OPCIONES_CUANDO_EMPEZAR.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.cuandoEmpezar === o.id}
            onClick={() => update({ cuandoEmpezar: o.id })}
          />
        ))}
      </Pregunta>

      <Pregunta
        titulo={`Para recomendarte algo que de verdad se ajuste a tu negocio, ¿cuánto podrías invertir al mes en marketing, sin contar la pauta publicitaria? (${moneda})`}
      >
        {RANGOS_PRESUPUESTO[moneda].map((r) => (
          <OptionCard
            key={r.id}
            label={r.etiqueta}
            selected={respuestas.presupuesto === r.id}
            onClick={() => update({ presupuesto: r.id })}
          />
        ))}
      </Pregunta>
    </>
  );
}
