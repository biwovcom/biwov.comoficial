"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
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

const inputClass =
  "w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent";

const TOTAL_PASOS = 7;

/**
 * Las 7 preguntas del diagnóstico inicial, reutilizadas tanto en la versión
 * interna (Kathe la llena) como en la pública (la llena el prospecto).
 * Se muestran de a una, con navegación, en vez de todas juntas en una sola
 * pantalla larga.
 */
export function PreguntasFiltro({
  respuestas,
  update,
  moneda,
  onSubmit,
  enviando,
  error,
  labelBoton = "Enviar",
}: {
  respuestas: RespuestasFiltro;
  update: (patch: Partial<RespuestasFiltro>) => void;
  moneda: Moneda;
  onSubmit: () => void;
  enviando: boolean;
  error?: string | null;
  labelBoton?: string;
}) {
  const [paso, setPaso] = useState(0);
  const canales = respuestas.canalLlegada ?? [];

  const alternarCanal = (id: (typeof OPCIONES_CANAL_LLEGADA)[number]["id"]) => {
    const yaEsta = canales.includes(id);
    const nuevos = yaEsta ? canales.filter((c) => c !== id) : [...canales, id];
    update({ canalLlegada: nuevos });
  };

  const respondidoPorPaso = [
    Boolean(respuestas.objetivo) && (respuestas.objetivo !== "otro" || Boolean(respuestas.objetivoOtro?.trim())),
    Boolean(respuestas.meta) && (respuestas.meta !== "otro" || Boolean(respuestas.metaOtro?.trim())),
    Boolean(respuestas.cumplimientoVentas),
    canales.length > 0 && (!canales.includes("otro") || Boolean(respuestas.canalLlegadaOtro?.trim())),
    Boolean(respuestas.prioridadEquipo),
    Boolean(respuestas.cuandoEmpezar),
    Boolean(respuestas.presupuesto),
  ];

  const esUltimo = paso === TOTAL_PASOS - 1;
  const puedeAvanzar = respondidoPorPaso[paso];

  const siguiente = () => {
    if (!puedeAvanzar) return;
    if (esUltimo) {
      onSubmit();
      return;
    }
    setPaso((p) => Math.min(p + 1, TOTAL_PASOS - 1));
  };

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        {paso > 0 && (
          <button
            type="button"
            onClick={() => setPaso((p) => Math.max(p - 1, 0))}
            className="text-text-secondary hover:text-white"
            aria-label="Pregunta anterior"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex-1">
          <ProgressBar step={paso} total={TOTAL_PASOS} />
        </div>
        <span className="shrink-0 text-xs text-text-secondary">
          {paso + 1} / {TOTAL_PASOS}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={paso}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-3"
        >
          {paso === 0 && (
            <>
              <p className="mb-1 text-sm font-medium text-white">
                ¿Cuáles son los desafíos que enfrenta tu empresa actualmente?
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OPCIONES_OBJETIVO.map((o) => (
                  <OptionCard
                    key={o.id}
                    label={o.label}
                    selected={respuestas.objetivo === o.id}
                    onClick={() => update({ objetivo: o.id })}
                  />
                ))}
              </div>
              {respuestas.objetivo === "otro" && (
                <input
                  className={inputClass}
                  placeholder="¿Cuál?"
                  value={respuestas.objetivoOtro ?? ""}
                  onChange={(e) => update({ objetivoOtro: e.target.value })}
                />
              )}
            </>
          )}

          {paso === 1 && (
            <>
              <p className="mb-1 text-sm font-medium text-white">
                Si un genio pudiera concederte un deseo para tu negocio, ¿cuál sería?
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OPCIONES_META.map((o) => (
                  <OptionCard
                    key={o.id}
                    label={o.label}
                    selected={respuestas.meta === o.id}
                    onClick={() => update({ meta: o.id })}
                  />
                ))}
              </div>
              {respuestas.meta === "otro" && (
                <input
                  className={inputClass}
                  placeholder="¿Cuál?"
                  value={respuestas.metaOtro ?? ""}
                  onChange={(e) => update({ metaOtro: e.target.value })}
                />
              )}
            </>
          )}

          {paso === 2 && (
            <>
              <p className="mb-1 text-sm font-medium text-white">
                ¿Sientes que tu negocio está cumpliendo de forma consistente con sus metas
                mensuales de ventas?
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OPCIONES_CUMPLIMIENTO_VENTAS.map((o) => (
                  <OptionCard
                    key={o.id}
                    label={o.label}
                    selected={respuestas.cumplimientoVentas === o.id}
                    onClick={() => update({ cumplimientoVentas: o.id })}
                  />
                ))}
              </div>
            </>
          )}

          {paso === 3 && (
            <>
              <p className="mb-1 text-sm font-medium text-white">
                Actualmente, ¿por dónde llegan la mayoría de tus clientes nuevos? (Puedes marcar
                varias opciones)
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OPCIONES_CANAL_LLEGADA.map((o) => (
                  <OptionCard
                    key={o.id}
                    label={o.label}
                    selected={canales.includes(o.id)}
                    onClick={() => alternarCanal(o.id)}
                  />
                ))}
              </div>
              {canales.includes("otro") && (
                <input
                  className={inputClass}
                  placeholder="¿Cuál?"
                  value={respuestas.canalLlegadaOtro ?? ""}
                  onChange={(e) => update({ canalLlegadaOtro: e.target.value })}
                />
              )}
            </>
          )}

          {paso === 4 && (
            <>
              <p className="mb-1 text-sm font-medium text-white">
                Para ti, ¿qué tan prioritario es contar con un equipo que te mantenga con total
                visibilidad de las estadísticas, lidere el crecimiento con valor agregado y te dé
                control estratégico de tu negocio?
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OPCIONES_PRIORIDAD_EQUIPO.map((o) => (
                  <OptionCard
                    key={o.id}
                    label={o.label}
                    selected={respuestas.prioridadEquipo === o.id}
                    onClick={() => update({ prioridadEquipo: o.id })}
                  />
                ))}
              </div>
            </>
          )}

          {paso === 5 && (
            <>
              <p className="mb-1 text-sm font-medium text-white">
                Si encontraras la estrategia adecuada para tu negocio, ¿cuándo te gustaría
                comenzar a implementarla?
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OPCIONES_CUANDO_EMPEZAR.map((o) => (
                  <OptionCard
                    key={o.id}
                    label={o.label}
                    selected={respuestas.cuandoEmpezar === o.id}
                    onClick={() => update({ cuandoEmpezar: o.id })}
                  />
                ))}
              </div>
            </>
          )}

          {paso === 6 && (
            <>
              <p className="mb-1 text-sm font-medium text-white">
                Para recomendarte algo que de verdad se ajuste a tu negocio, ¿cuánto podrías
                invertir al mes en marketing, sin contar la pauta publicitaria? ({moneda})
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {RANGOS_PRESUPUESTO[moneda].map((r) => (
                  <OptionCard
                    key={r.id}
                    label={r.etiqueta}
                    selected={respuestas.presupuesto === r.id}
                    onClick={() => update({ presupuesto: r.id })}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <Button size="lg" className="mt-6 w-full" disabled={!puedeAvanzar || enviando} onClick={siguiente}>
        {esUltimo ? (enviando ? "Enviando..." : labelBoton) : "Siguiente"}
      </Button>
    </div>
  );
}
