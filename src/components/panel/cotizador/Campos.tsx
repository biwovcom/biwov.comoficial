import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Moneda } from "@/lib/panel/cotizador";

export function colorMargen(pct: number): string {
  if (pct < 0) return "text-red-400";
  if (pct < 30) return "text-amber-300";
  return "text-emerald-400";
}

export function num(valor: string): number {
  const n = parseFloat(valor);
  return Number.isFinite(n) ? n : 0;
}

export function nuevaKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function Campo({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border-glass bg-white/[0.03] px-2.5 py-1.5 text-sm text-white placeholder:text-text-secondary/50 outline-none transition-colors focus:border-accent",
        props.type === "number" && "text-right tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

export function SelectMoneda({ value, onChange }: { value: Moneda; onChange: (m: Moneda) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Moneda)}
      className="rounded-lg border border-border-glass bg-bg-base px-2 py-1.5 text-sm text-white outline-none focus:border-accent"
    >
      <option value="COP">COP</option>
      <option value="USD">USD</option>
    </select>
  );
}

export function EstadoGuardadoTexto({ estado, error }: { estado: string; error: string | null }) {
  return (
    <span
      className={cn(
        "text-xs",
        estado === "error" ? "text-red-400" : estado === "guardado" ? "text-emerald-400" : "text-text-secondary",
      )}
    >
      {estado === "guardando" && "Guardando…"}
      {estado === "guardado" && "✓ Guardado"}
      {estado === "error" && `No se pudo guardar: ${error}`}
    </span>
  );
}
