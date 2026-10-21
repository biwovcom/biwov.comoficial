"use client";

import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

export function SelectorExtras({
  moneda,
  trm,
  seleccionados,
  onToggle,
  titulo = "¿Quieres sumar algo más a tu cotización? (opcional)",
}: {
  moneda: Moneda;
  trm: number;
  seleccionados: string[];
  onToggle: (id: string) => void;
  titulo?: string;
}) {
  return (
    <div className="rounded-2xl border border-border-glass bg-white/[0.02] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{titulo}</p>
      <ul className="mt-3 space-y-2">
        {EXTRAS_COTIZABLES.map((extra) => {
          const marcado = seleccionados.includes(extra.id);
          return (
            <li key={extra.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-colors print:cursor-auto",
                  marcado ? "border-accent/50 bg-accent/5" : "border-border-glass hover:border-accent/30",
                )}
              >
                <span className="flex items-center gap-2.5 text-sm text-white/90">
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => onToggle(extra.id)}
                    className="h-4 w-4 shrink-0 accent-accent"
                  />
                  {extra.nombre}
                </span>
                <span className="shrink-0 text-xs font-medium text-accent">
                  {formatCopEnMoneda(extra.precioCop, moneda, trm)}
                  {extra.periodicidad === "mensual" ? " /mes" : ""}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
