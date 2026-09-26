"use client";

import { cn } from "@/lib/utils";
import {
  OPCIONES_OBJETIVO,
  OPCIONES_IMPORTANCIA,
  OPCIONES_META,
  OPCIONES_YA_VENDE,
  OPCIONES_COMO_LLEGAN,
  OPCIONES_URGENCIA,
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
 * En la versión pública se oculta la pregunta de estimación de presupuesto
 * ("según lo que hablaste con él") porque ahí no hay nadie estimando por el
 * prospecto — él mismo responde directamente.
 */
export function PreguntasFiltro({
  respuestas,
  update,
  moneda,
  esPublico = false,
}: {
  respuestas: RespuestasFiltro;
  update: (patch: Partial<RespuestasFiltro>) => void;
  moneda: Moneda;
  esPublico?: boolean;
}) {
  return (
    <>
      <Pregunta titulo="¿Cuáles son los desafíos que enfrenta tu negocio actualmente?">
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

      <Pregunta titulo="¿Qué tan importante es para ti que tu negocio venda más?">
        {OPCIONES_IMPORTANCIA.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.importancia === o.id}
            onClick={() => update({ importancia: o.id })}
          />
        ))}
      </Pregunta>

      <Pregunta titulo="¿Tu negocio ya vende?">
        {OPCIONES_YA_VENDE.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.yaVende === o.id}
            onClick={() => update({ yaVende: o.id })}
          />
        ))}
      </Pregunta>

      <Pregunta titulo="¿Cómo te llegan los clientes?">
        {OPCIONES_COMO_LLEGAN.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.comoLlegan === o.id}
            onClick={() => update({ comoLlegan: o.id })}
          />
        ))}
      </Pregunta>

      <Pregunta titulo="¿Para cuándo te gustaría empezar a resolver esto?">
        {OPCIONES_URGENCIA.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            selected={respuestas.urgencia === o.id}
            onClick={() => update({ urgencia: o.id })}
          />
        ))}
      </Pregunta>

      <Pregunta
        titulo={`Si podemos garantizarte más ventas para tu negocio, ¿qué presupuesto tendrías para invertir ahora mismo? (${moneda})`}
      >
        {RANGOS_PRESUPUESTO[moneda].map((r) => (
          <OptionCard
            key={r.id}
            label={r.etiqueta}
            selected={respuestas.presupuesto === r.id}
            onClick={() => update({ presupuesto: r.id, presupuestoEstimado: undefined })}
          />
        ))}
        <OptionCard
          label="Aún no sé"
          selected={respuestas.presupuesto === "aun-no-se"}
          onClick={() => update({ presupuesto: "aun-no-se" })}
        />
      </Pregunta>

      {!esPublico && respuestas.presupuesto === "aun-no-se" && (
        <Pregunta titulo="El prospecto no sabe su presupuesto. Según lo que hablaste con él, ¿tú crees que alcanza?">
          <OptionCard
            label="Probablemente sí alcanza"
            selected={respuestas.presupuestoEstimado === "probablemente-si"}
            onClick={() => update({ presupuestoEstimado: "probablemente-si" })}
          />
          <OptionCard
            label="Probablemente no alcanza"
            selected={respuestas.presupuestoEstimado === "probablemente-no"}
            onClick={() => update({ presupuestoEstimado: "probablemente-no" })}
          />
        </Pregunta>
      )}
    </>
  );
}
