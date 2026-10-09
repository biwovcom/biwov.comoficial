"use client";

import { COLOR_ETAPA_EMBUDO, ETAPAS_EMBUDO, type EtapaEmbudo, type PlanCreativoEntrada } from "@/lib/panel/planCreativos";
import { cn } from "@/lib/utils";

export function TemperaturaEmbudo({ items }: { items: PlanCreativoEntrada[] }) {
  const clasificados = items.filter((i) => i.etapa_embudo);
  const sinClasificar = items.length - clasificados.length;

  if (items.length === 0) return null;

  const conteos: Record<EtapaEmbudo, number> = { tofu: 0, mofu: 0, bofu: 0 };
  for (const item of clasificados) {
    if (item.etapa_embudo) conteos[item.etapa_embudo]++;
  }

  const total = clasificados.length;

  return (
    <div className="rounded-xl border border-border-glass bg-white/[0.02] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Temperatura del embudo este mes
      </p>
      <p className="mt-1 text-xs text-text-secondary">
        Mezcla ideal: 60-70% TOFU (atracción), 20-30% MOFU (consideración), ~10% BOFU (conversión).
        {sinClasificar > 0 && ` ${sinClasificar} ítem${sinClasificar === 1 ? "" : "s"} sin etapa asignada.`}
      </p>

      {total === 0 ? (
        <p className="mt-3 text-sm text-text-secondary">
          Todavía no has clasificado ningún creativo de este mes como TOFU, MOFU o BOFU.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
            {(Object.keys(ETAPAS_EMBUDO) as EtapaEmbudo[]).map((etapa) => {
              const pct = (conteos[etapa] / total) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={etapa}
                  className={COLOR_ETAPA_EMBUDO[etapa].barra}
                  style={{ width: `${pct}%` }}
                  title={`${ETAPAS_EMBUDO[etapa].label}: ${pct.toFixed(0)}%`}
                />
              );
            })}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(ETAPAS_EMBUDO) as EtapaEmbudo[]).map((etapa) => {
              const pct = (conteos[etapa] / total) * 100;
              const { idealMin, idealMax } = ETAPAS_EMBUDO[etapa];
              const dentroDelRango = pct >= idealMin && pct <= idealMax;
              return (
                <div key={etapa} className="rounded-lg bg-white/[0.03] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      <span className={cn("h-2 w-2 rounded-full", COLOR_ETAPA_EMBUDO[etapa].dot)} />
                      {ETAPAS_EMBUDO[etapa].label}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold",
                        dentroDelRango ? "text-emerald-300" : "text-amber-300",
                      )}
                    >
                      {dentroDelRango ? "✓ en rango" : "fuera de rango"}
                    </span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-white">
                    {pct.toFixed(0)}% <span className="text-xs font-normal text-text-secondary">({conteos[etapa]})</span>
                  </p>
                  <p className="text-[11px] text-text-secondary">
                    Ideal: {idealMin}-{idealMax}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
