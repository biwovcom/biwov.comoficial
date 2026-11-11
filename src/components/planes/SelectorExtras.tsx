"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { EXTRAS_COTIZABLES, DESCRIPCION_CATEGORIA, type CategoriaExtra } from "@/data/extrasCotizables";
import { ARTE_CATEGORIA } from "@/data/categoriasExtras";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

/** Lo que más se suma a un plan mensual, en orden de uso. */
const CATEGORIAS_PARA_PLAN: CategoriaExtra[] = [
  "Campañas en Meta",
  "Producción audiovisual",
  "Edición y guía de grabación",
  "WhatsApp y agentes de IA",
  "Email marketing",
  "Páginas web y embudos",
];

export function SelectorExtras({
  moneda,
  trm,
  seleccionados,
  onToggle,
  titulo = "¿Quieres sumar algo más a tu cotización? (opcional)",
  categorias = CATEGORIAS_PARA_PLAN,
}: {
  moneda: Moneda;
  trm: number;
  seleccionados: string[];
  onToggle: (id: string) => void;
  titulo?: string;
  categorias?: CategoriaExtra[];
}) {
  const [categoriaAbierta, setCategoriaAbierta] = useState<CategoriaExtra | null>(null);
  const [itemAbierto, setItemAbierto] = useState<string | null>(null);

  return (
    <div>
      {titulo && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">{titulo}</p>}
      <div className="mt-3 grid gap-3">
        {categorias.map((categoria) => {
          const { icono: Icono } = ARTE_CATEGORIA[categoria];
          const items = EXTRAS_COTIZABLES.filter((e) => e.categoria === categoria);
          const abierta = categoriaAbierta === categoria;
          const marcados = items.filter((i) => seleccionados.includes(i.id)).length;
          return (
            <div key={categoria} className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setCategoriaAbierta(abierta ? null : categoria)}
                aria-expanded={abierta}
                className="flex w-full items-center gap-2 px-4 py-3 text-left"
              >
                <Icono className="h-4 w-4 shrink-0 text-accent" />
                <span className="flex-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">{categoria}</span>
                {marcados > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-[#0a2642]">{marcados}</span>
                )}
                <ChevronDown className={cn("h-4 w-4 text-white/60 transition-transform", abierta && "rotate-180")} />
              </button>
              {abierta && (
                <div className="border-t border-white/10">
                  {DESCRIPCION_CATEGORIA[categoria] && (
                    <p className="px-4 pt-3 text-xs text-white/50">{DESCRIPCION_CATEGORIA[categoria]}</p>
                  )}
                  <div className="divide-y divide-white/[0.06]">
                    {items.map((item) => {
                      const marcado = seleccionados.includes(item.id);
                      const desplegado = itemAbierto === item.id;
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
                            <span className="shrink-0 text-right text-xs font-semibold text-white">
                              {item.desde ? "Desde " : ""}
                              {formatCopEnMoneda(item.precioCop, moneda, trm)}
                              {item.periodicidad === "mensual" ? " /mes" : ""}
                            </span>
                            {item.incluye && item.incluye.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setItemAbierto(desplegado ? null : item.id)}
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
                              {item.nota && <p className="mt-2 text-xs text-accent/90">{item.nota}</p>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
