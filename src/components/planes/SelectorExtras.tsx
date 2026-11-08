"use client";

import { useState } from "react";
import { Camera, Globe2, Megaphone, CheckCircle2, Circle, ChevronDown, type LucideIcon } from "lucide-react";
import { EXTRAS_COTIZABLES, type CategoriaExtra } from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

const ICONOS: Partial<Record<CategoriaExtra, LucideIcon>> = {
  "Producción de contenido": Camera,
  "Páginas web": Globe2,
  "Campaña en Meta": Megaphone,
};

// "Grabación y edición de video" no se ofrece aquí: repetía lo que ya cubre
// "Producción de contenido" (y los planes ya incluyen videos).
const CATEGORIAS: CategoriaExtra[] = ["Producción de contenido", "Páginas web", "Campaña en Meta"];

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
  const [abierto, setAbierto] = useState<string | null>(null);

  return (
    <div>
      {titulo && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">{titulo}</p>}
      <div className="mt-3 grid gap-4">
        {CATEGORIAS.map((categoria) => {
          const Icono = ICONOS[categoria] ?? Camera;
          const items = EXTRAS_COTIZABLES.filter((e) => e.categoria === categoria);
          return (
            <div key={categoria} className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <Icono className="h-4 w-4 shrink-0 text-accent" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">{categoria}</p>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {items.map((item) => {
                  const marcado = seleccionados.includes(item.id);
                  const desplegado = abierto === item.id;
                  return (
                    <div key={item.id} className={cn("transition-colors", marcado && "bg-accent/10")}>
                      <div className="flex items-center gap-2 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onToggle(item.id)}
                          aria-pressed={marcado}
                          className="flex min-w-0 flex-1 items-center gap-2.5 text-left text-sm text-white/90"
                        >
                          {marcado ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-text-secondary" />
                          )}
                          <span className="min-w-0">{item.nombre}</span>
                        </button>
                        <span className="shrink-0 text-xs font-semibold text-white">
                          {formatCopEnMoneda(item.precioCop, moneda, trm)}
                          {item.periodicidad === "mensual" ? " /mes" : ""}
                        </span>
                        {item.incluye && item.incluye.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setAbierto(desplegado ? null : item.id)}
                            aria-expanded={desplegado}
                            aria-label={`${desplegado ? "Ocultar" : "Ver"} qué incluye ${item.nombre}`}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-accent hover:text-accent"
                          >
                            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", desplegado && "rotate-180")} />
                          </button>
                        )}
                      </div>
                      {desplegado && (
                        <div className="px-4 pb-4 pl-11">
                          {item.descripcion && <p className="text-xs leading-relaxed text-white/55">{item.descripcion}</p>}
                          <ul className="mt-2 space-y-1">
                            {item.incluye?.map((inc) => (
                              <li key={inc} className="text-xs leading-relaxed text-white/80">
                                <span className="text-accent">✔</span> {inc}
                              </li>
                            ))}
                          </ul>
                          {item.noIncluye && item.noIncluye.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {item.noIncluye.map((no) => (
                                <li key={no} className="text-xs text-white/45">
                                  ✕ {no}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
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
