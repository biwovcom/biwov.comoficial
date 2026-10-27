"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { ExtraCotizable } from "@/data/extrasCotizables";
import { ARTE_CATEGORIA } from "@/data/categoriasExtras";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";

export function ProductoCard({
  item,
  moneda,
  trm,
  cantidad,
  onCambiarCantidad,
}: {
  item: ExtraCotizable;
  moneda: Moneda;
  trm: number;
  cantidad: number;
  onCambiarCantidad: (id: string, cantidad: number) => void;
}) {
  const { icono: Icono, gradiente } = ARTE_CATEGORIA[item.categoria];
  const precio = formatCopEnMoneda(item.precioCop, moneda, trm) + (item.periodicidad === "mensual" ? " /mes" : "");

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border-glass bg-[#0c1119] shadow-[0_8px_30px_-16px_rgba(13,59,102,0.45)]">
      <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${gradiente}`}>
        <Icono className="h-10 w-10 text-white/90" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">{item.categoria}</p>
        <h4 className="mt-1 text-sm font-semibold text-white">{item.nombre}</h4>
        {item.incluye && item.incluye.length > 0 && (
          <ul className="mt-2 flex-1 space-y-1">
            {item.incluye.slice(0, 3).map((inc) => (
              <li key={inc} className="truncate text-xs text-text-secondary">
                • {inc}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-base font-bold text-accent">{precio}</p>

        <div className="mt-3">
          {cantidad === 0 ? (
            <button
              type="button"
              onClick={() => onCambiarCantidad(item.id, 1)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-brand px-3 py-2 text-xs font-medium text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(50,153,204,0.7)]"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Agregar
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-full border border-accent/40 bg-accent/10 px-2 py-1.5">
              <button
                type="button"
                onClick={() => onCambiarCantidad(item.id, cantidad - 1)}
                aria-label={`Quitar una unidad de ${item.nombre}`}
                className="flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-semibold text-white">{cantidad}</span>
              <button
                type="button"
                onClick={() => onCambiarCantidad(item.id, cantidad + 1)}
                aria-label={`Agregar una unidad más de ${item.nombre}`}
                className="flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
