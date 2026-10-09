"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  COLOR_SUBCATEGORIA,
  ETAPAS_EMBUDO,
  SUBCATEGORIAS_CREATIVO,
  type EtapaEmbudo,
  type PlanCreativoEntrada,
  type SubcategoriaCreativo,
} from "@/lib/panel/planCreativos";
import { TarjetaCreativo } from "./PlanCreativos";
import { cn } from "@/lib/utils";

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function colorDe(item: PlanCreativoEntrada) {
  return COLOR_SUBCATEGORIA[item.subcategoria ?? "sin_seccion"];
}

function diasDelMes(anio: number, mes: number): (number | null)[] {
  const primerDia = new Date(anio, mes - 1, 1);
  // getDay(): 0=domingo..6=sábado -> lo convertimos a 0=lunes..6=domingo
  const offset = (primerDia.getDay() + 6) % 7;
  const totalDias = new Date(anio, mes, 0).getDate();
  const celdas: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= totalDias; d++) celdas.push(d);
  return celdas;
}

export function CalendarioMes({
  prospectoId,
  anio,
  mes,
  tiposSugeridos,
  entradas,
  onEntradasChange,
}: {
  prospectoId: string;
  anio: number;
  mes: number;
  tiposSugeridos: string[];
  entradas: PlanCreativoEntrada[];
  onEntradasChange: (entradas: PlanCreativoEntrada[]) => void;
}) {
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const [agregando, setAgregando] = useState(false);
  const celdas = diasDelMes(anio, mes);
  const mesTexto = String(mes).padStart(2, "0");

  const itemsPorDia = (dia: number) => {
    const fecha = `${anio}-${mesTexto}-${String(dia).padStart(2, "0")}`;
    return entradas.filter((e) => e.fecha === fecha);
  };

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

  const fechaSeleccionada =
    diaSeleccionado !== null ? `${anio}-${mesTexto}-${String(diaSeleccionado).padStart(2, "0")}` : undefined;

  const itemsDia = diaSeleccionado !== null ? itemsPorDia(diaSeleccionado) : [];
  const historiasDia = itemsDia.filter((i) => i.subcategoria === "historia");
  const otrosDia = itemsDia.filter((i) => i.subcategoria !== "historia");

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
        {DIAS_SEMANA.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {celdas.map((dia, i) => {
          if (dia === null) return <div key={`vacio-${i}`} />;
          const items = itemsPorDia(dia);
          return (
            <button
              key={dia}
              type="button"
              onClick={() => {
                setDiaSeleccionado(dia);
                setAgregando(false);
              }}
              className={cn(
                "flex min-h-[56px] flex-col items-start gap-1 rounded-lg border p-1.5 text-left transition-colors",
                diaSeleccionado === dia
                  ? "border-accent bg-accent/10"
                  : "border-border-glass bg-white/[0.02] hover:border-accent/40",
              )}
            >
              <span className="text-xs text-white/80">{dia}</span>
              <div className="flex flex-wrap gap-1">
                {items.slice(0, 4).map((item) => (
                  <span key={item.id} className={cn("h-2 w-2 rounded-full", colorDe(item).dot)} />
                ))}
                {items.length > 4 && (
                  <span className="text-[9px] text-text-secondary">+{items.length - 4}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {diaSeleccionado !== null && (
        <div className="mt-5 space-y-4 border-t border-border-glass pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              {diaSeleccionado} de {new Date(anio, mes - 1, 1).toLocaleDateString("es-CO", { month: "long" })}
            </h3>
            <button
              type="button"
              onClick={() => setAgregando((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-border-glass px-3 py-1.5 text-xs text-text-secondary hover:border-accent/40 hover:text-white"
            >
              <Plus size={14} /> Agregar a este día
            </button>
          </div>

          {agregando && (
            <FormularioAltaDia
              prospectoId={prospectoId}
              fecha={fechaSeleccionada!}
              tiposSugeridos={tiposSugeridos}
              onAgregado={(nueva) => {
                onEntradasChange([nueva, ...entradas]);
                setAgregando(false);
              }}
            />
          )}

          {itemsDia.length === 0 && !agregando && (
            <p className="text-sm text-text-secondary">Nada planeado para este día todavía.</p>
          )}

          {historiasDia.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-300">
                Secuencia de historias ({historiasDia.length})
              </p>
              <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [mask-image:linear-gradient(to_right,black,black_90%,transparent)]">
                {historiasDia.map((item) => (
                  <div key={item.id} className="w-[250px] shrink-0 snap-start">
                    <TarjetaCreativo
                      entrada={item}
                      tiposSugeridos={tiposSugeridos}
                      onEliminar={eliminar}
                      onActualizar={actualizarEnLista}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {otrosDia.length > 0 && (
            <div className="space-y-3">
              {otrosDia.map((item) => (
                <TarjetaCreativo
                  key={item.id}
                  entrada={item}
                  tiposSugeridos={tiposSugeridos}
                  onEliminar={eliminar}
                  onActualizar={actualizarEnLista}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-text-secondary">
        {(Object.keys(SUBCATEGORIAS_CREATIVO) as SubcategoriaCreativo[]).map((valor) => (
          <span key={valor} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", COLOR_SUBCATEGORIA[valor].dot)} /> {SUBCATEGORIAS_CREATIVO[valor]}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", COLOR_SUBCATEGORIA.sin_seccion.dot)} /> Sin sección
        </span>
      </div>
    </div>
  );
}

function FormularioAltaDia({
  prospectoId,
  fecha,
  tiposSugeridos,
  onAgregado,
}: {
  prospectoId: string;
  fecha: string;
  tiposSugeridos: string[];
  onAgregado: (entrada: PlanCreativoEntrada) => void;
}) {
  const [tipo, setTipo] = useState("");
  const [subcategoria, setSubcategoria] = useState<SubcategoriaCreativo | "">("");
  const [etapaEmbudo, setEtapaEmbudo] = useState<EtapaEmbudo | "">("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregar = async () => {
    if (!tipo.trim()) {
      setError("Escribe qué tipo de ítem es.");
      return;
    }
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/panel/plan-creativos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectoId, categoria: "creativo", tipo: tipo.trim(), fecha, subcategoria, etapaEmbudo }),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo guardar.");
      return;
    }
    const data = await res.json();
    onAgregado(data.entrada);
    setTipo("");
    setSubcategoria("");
    setEtapaEmbudo("");
  };

  return (
    <div className="space-y-2 rounded-xl border border-dashed border-border-glass p-3">
      <div className="flex flex-wrap gap-2">
        <input
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          list="tipos-plan-sugeridos-dia"
          placeholder="Ej: Historia, Guion, Copy..."
          className="min-w-[160px] flex-1 rounded-xl border border-border-glass bg-white/[0.03] px-3 py-1.5 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent"
        />
        <datalist id="tipos-plan-sugeridos-dia">
          {tiposSugeridos.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <select
          value={subcategoria}
          onChange={(e) => setSubcategoria(e.target.value as SubcategoriaCreativo | "")}
          className="rounded-xl border border-border-glass bg-white/[0.03] px-3 py-1.5 text-sm text-white outline-none focus:border-accent [&>option]:bg-bg-base"
        >
          <option value="">Sin sección</option>
          {Object.entries(SUBCATEGORIAS_CREATIVO).map(([valor, label]) => (
            <option key={valor} value={valor}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={etapaEmbudo}
          onChange={(e) => setEtapaEmbudo(e.target.value as EtapaEmbudo | "")}
          className="rounded-xl border border-border-glass bg-white/[0.03] px-3 py-1.5 text-sm text-white outline-none focus:border-accent [&>option]:bg-bg-base"
        >
          <option value="">Sin etapa</option>
          {Object.entries(ETAPAS_EMBUDO).map(([valor, info]) => (
            <option key={valor} value={valor}>
              {info.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={agregar}
          disabled={enviando}
          className="shrink-0 rounded-xl bg-gradient-brand px-4 text-sm font-semibold text-white"
        >
          {enviando ? "..." : "Agregar"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
