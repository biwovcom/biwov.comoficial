"use client";

import { Camera, Video, Globe2, Megaphone, CheckCircle2, Circle, type LucideIcon } from "lucide-react";
import { EXTRAS_COTIZABLES, type CategoriaExtra } from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

const ICONOS: Record<CategoriaExtra, LucideIcon> = {
  "Producción de contenido": Camera,
  "Grabación y edición de video": Video,
  "Páginas web": Globe2,
  "Campaña en Meta": Megaphone,
};

const CATEGORIAS: CategoriaExtra[] = [
  "Producción de contenido",
  "Grabación y edición de video",
  "Páginas web",
  "Campaña en Meta",
];

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
    <div>
      {titulo && <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{titulo}</p>}
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {CATEGORIAS.map((categoria) => {
          const Icono = ICONOS[categoria];
          const items = EXTRAS_COTIZABLES.filter((e) => e.categoria === categoria);
          return (
            <div
              key={categoria}
              className="overflow-hidden rounded-2xl border border-border-glass shadow-[0_8px_30px_-16px_rgba(13,59,102,0.45)]"
            >
              <div className="flex items-center gap-2 bg-gradient-brand px-4 py-2.5">
                <Icono className="h-4 w-4 shrink-0 text-white" />
                <p className="text-xs font-semibold uppercase tracking-wide text-white">{categoria}</p>
              </div>
              <div className="divide-y divide-border-glass bg-white/[0.02]">
                {items.map((item) => {
                  const marcado = seleccionados.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onToggle(item.id)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors",
                        marcado ? "bg-accent/10" : "hover:bg-white/[0.04]",
                      )}
                    >
                      <span className="flex items-center gap-2.5 text-sm text-white/90">
                        {marcado ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-text-secondary" />
                        )}
                        {item.nombre}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-accent">
                        {formatCopEnMoneda(item.precioCop, moneda, trm)}
                        {item.periodicidad === "mensual" ? " /mes" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
