"use client";

import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingCart } from "lucide-react";
import type { ExtraCotizable } from "@/data/extrasCotizables";
import { ARTE_CATEGORIA } from "@/data/categoriasExtras";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";

export function ProductoCard({
  item,
  moneda,
  trm,
  cantidad,
  onCambiarCantidad,
  onVerDetalle,
}: {
  item: ExtraCotizable;
  moneda: Moneda;
  trm: number;
  cantidad: number;
  onCambiarCantidad: (id: string, cantidad: number) => void;
  onVerDetalle: () => void;
}) {
  const { icono: Icono, imagen } = ARTE_CATEGORIA[item.categoria];
  const precio = (item.desde ? "Desde " : "") + formatCopEnMoneda(item.precioCop, moneda, trm) + (item.periodicidad === "mensual" ? " /mes" : "");

  return (
    <div className="card-universo group flex flex-col rounded-[1.75rem] p-2.5 transition-transform duration-500 hover:-translate-y-1">
      <div className="relative h-32 overflow-hidden rounded-[1.25rem]">
        <Image src={imagen} alt="" fill sizes="300px" className="object-cover" />
        <div className="absolute inset-0 bg-[#03101b]/40" />
        {item.recomendado && (
          <span className="absolute left-2 top-2 rounded bg-accent px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#0a2642]">
            Recomendado
          </span>
        )}
        <span className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/25 bg-[#03101b]/70 backdrop-blur-sm">
          <Icono className="h-4 w-4 text-white" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">{item.categoria}</p>
        <h4 className="mt-1.5 text-lg font-medium leading-snug text-white">{item.nombre}</h4>
        {item.incluye && item.incluye.length > 0 && (
          <ul className="mt-2 flex-1 space-y-1">
            {item.incluye.slice(0, 3).map((inc) => (
              <li key={inc} className="line-clamp-1 text-xs text-text-secondary">
                • {inc}
              </li>
            ))}
            {item.incluye.length > 3 && (
              <li className="text-xs font-medium text-accent/90">
                + {item.incluye.length - 3} cosas más incluidas
              </li>
            )}
          </ul>
        )}
        <p className="mt-4 text-xl font-semibold tracking-tight text-white">{precio}</p>
        {item.nota && <p className="mt-1 text-xs text-accent/90">{item.nota}</p>}

        <button
          type="button"
          onClick={onVerDetalle}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 px-3 py-2 text-xs font-medium text-white transition-colors hover:border-accent/60 hover:text-accent"
        >
          Ver detalle
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <div className="mt-2">
          {cantidad === 0 ? (
            <button
              type="button"
              onClick={() => onCambiarCantidad(item.id, 1)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#03101b] transition-all hover:scale-[1.02]"
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
