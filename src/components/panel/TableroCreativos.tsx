"use client";

import { useState } from "react";
import { ESTADOS_CREATIVO, SUBCATEGORIAS_CREATIVO, type EstadoCreativo, type PlanCreativoEntrada } from "@/lib/panel/planCreativos";
import { TarjetaCreativo } from "./PlanCreativos";
import { cn } from "@/lib/utils";

const FILTROS = [
  { valor: "todas", label: "Todas" },
  { valor: "historia", label: "Historias" },
  { valor: "feed", label: "Feed" },
] as const;

export function TableroCreativos({
  tiposSugeridos,
  entradas,
  onEntradasChange,
}: {
  tiposSugeridos: string[];
  entradas: PlanCreativoEntrada[];
  onEntradasChange: (entradas: PlanCreativoEntrada[]) => void;
}) {
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]["valor"]>("todas");

  const visibles = entradas.filter((e) => filtro === "todas" || e.subcategoria === filtro);

  const eliminar = async (id: string) => {
    const confirmado = window.confirm("¿Eliminar este ítem?");
    if (!confirmado) return;
    const res = await fetch(`/api/panel/plan-creativos?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    onEntradasChange(entradas.filter((e) => e.id !== id));
  };

  const actualizarEnLista = (actualizada: PlanCreativoEntrada) => {
    onEntradasChange(entradas.map((e) => (e.id === actualizada.id ? actualizada : e)));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            onClick={() => setFiltro(f.valor)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filtro === f.valor
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-glass text-text-secondary hover:text-white",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {(Object.keys(ESTADOS_CREATIVO) as EstadoCreativo[]).map((estado) => {
          const items = visibles.filter((e) => e.estado === estado);
          return (
            <div key={estado} className="rounded-xl border border-border-glass bg-white/[0.015] p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {ESTADOS_CREATIVO[estado].label}
                </h3>
                <span className="text-xs text-text-secondary">{items.length}</span>
              </div>
              <div className="mt-3 space-y-3">
                {items.length === 0 && (
                  <p className="text-xs text-text-secondary">Nada aquí.</p>
                )}
                {items.map((item) => (
                  <TarjetaCreativo
                    key={item.id}
                    entrada={item}
                    tiposSugeridos={tiposSugeridos}
                    onEliminar={eliminar}
                    onActualizar={actualizarEnLista}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-text-secondary">
        Secciones: {Object.values(SUBCATEGORIAS_CREATIVO).join(" · ")}. Cambia el estado de cada tarjeta con el
        desplegable para moverla de columna.
      </p>
    </div>
  );
}
