"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function SelectorMes({
  anio,
  mes,
  onChange,
}: {
  anio: number;
  mes: number; // 1-12
  onChange: (anio: number, mes: number) => void;
}) {
  const mover = (delta: number) => {
    let nuevoMes = mes + delta;
    let nuevoAnio = anio;
    if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAnio += 1;
    } else if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAnio -= 1;
    }
    onChange(nuevoAnio, nuevoMes);
  };

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border-glass bg-white/[0.02] px-3 py-1.5">
      <button
        type="button"
        onClick={() => mover(-1)}
        aria-label="Mes anterior"
        className="text-text-secondary hover:text-white"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="min-w-[140px] text-center text-sm font-semibold text-white">
        {MESES[mes - 1]} {anio}
      </span>
      <button
        type="button"
        onClick={() => mover(1)}
        aria-label="Mes siguiente"
        className="text-text-secondary hover:text-white"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
