"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { NOMBRES_CATEGORIA, SEGUIMIENTO_SUGERIDO, type Categoria } from "@/lib/panel/prospectos";
import { diasDesde, estaVencido, infoEtapa, siguienteEtapa } from "@/lib/panel/seguimiento";
import { cn } from "@/lib/utils";

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

export function EditarClasificacion({
  prospectoId,
  categoriaInicial,
  nichoMercadoInicial,
  seguimientoInicial,
  fechaUltimoSeguimientoInicial,
}: {
  prospectoId: string;
  categoriaInicial: Categoria | null;
  nichoMercadoInicial: string | null;
  seguimientoInicial: string | null;
  fechaUltimoSeguimientoInicial: string | null;
}) {
  const router = useRouter();
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial ?? "contacto");
  const [nicho, setNicho] = useState(nichoMercadoInicial ?? "");
  const [seguimiento, setSeguimiento] = useState(seguimientoInicial ?? "");
  const [fechaSeguimiento, setFechaSeguimiento] = useState(fechaUltimoSeguimientoInicial ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async (datos?: { seguimiento?: string; fecha?: string }) => {
    const seguimientoAEnviar = datos?.seguimiento ?? seguimiento;
    const fechaAEnviar = datos?.fecha ?? fechaSeguimiento;
    setGuardando(true);
    setError(null);
    const res = await fetch(`/api/panel/prospectos/${prospectoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoria,
        nichoMercado: nicho,
        seguimiento: seguimientoAEnviar,
        fechaUltimoSeguimiento: fechaAEnviar || null,
      }),
    });
    setGuardando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo guardar.");
      return;
    }
    setSeguimiento(seguimientoAEnviar);
    setFechaSeguimiento(fechaAEnviar);
    router.refresh();
  };

  const etapa = infoEtapa(seguimiento);
  const dias = diasDesde(fechaSeguimiento);
  const vencido = estaVencido(seguimiento, fechaSeguimiento);
  const siguiente = siguienteEtapa(seguimiento);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="categoria">Etiqueta</Label>
        <Select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as Categoria)}
        >
          {Object.entries(NOMBRES_CATEGORIA).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="nicho">Nicho de mercado</Label>
        <Input
          id="nicho"
          placeholder="Ej: inmobiliario, salud, impresión..."
          value={nicho}
          onChange={(e) => setNicho(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="seguimiento">Alerta / etapa de seguimiento</Label>
        <Input
          id="seguimiento"
          list="seguimiento-sugerido"
          placeholder="Ej: Primer seguimiento (déjalo vacío para quitar la alerta)"
          value={seguimiento}
          onChange={(e) => setSeguimiento(e.target.value)}
        />
        <datalist id="seguimiento-sugerido">
          {SEGUIMIENTO_SUGERIDO.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
      <div>
        <Label htmlFor="fecha-seguimiento">Fecha del último contacto</Label>
        <Input
          id="fecha-seguimiento"
          type="date"
          value={fechaSeguimiento}
          onChange={(e) => setFechaSeguimiento(e.target.value)}
        />
        {dias !== null && (
          <p className="mt-1.5 text-xs text-text-secondary">
            Hace {dias} día{dias === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {etapa && (
        <GlassCard
          className={cn(
            "sm:col-span-2 p-4",
            vencido ? "border-amber-500/50 bg-amber-500/10" : "border-border-glass",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
              {vencido && <AlertTriangle size={15} className="text-amber-400" />}
              {etapa.nombre} · {etapa.plazo}
            </p>
            {vencido && (
              <span className="text-xs font-semibold text-amber-300">
                Ya toca el siguiente paso
              </span>
            )}
          </div>
          <dl className="mt-3 space-y-1.5 text-xs text-text-secondary">
            <p>
              <span className="font-medium text-white/80">Objetivo:</span> {etapa.objetivo}
            </p>
            <p>
              <span className="font-medium text-white/80">Canal:</span> {etapa.canal}
            </p>
            <p>
              <span className="font-medium text-white/80">Enfoque:</span> {etapa.enfoque}
            </p>
          </dl>
          {siguiente && (
            <Button
              size="md"
              variant="secondary"
              className="mt-3"
              disabled={guardando}
              onClick={() => guardar({ seguimiento: siguiente, fecha: hoy() })}
            >
              Marcar hecho y avanzar a {siguiente}
              <ArrowRight size={14} />
            </Button>
          )}
        </GlassCard>
      )}

      <div className="sm:col-span-2">
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <Button variant="secondary" onClick={() => guardar()} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar clasificación"}
        </Button>
      </div>
    </div>
  );
}
