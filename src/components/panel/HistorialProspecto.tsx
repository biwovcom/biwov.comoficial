"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, ChevronDown, Copy, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import {
  TIPOS_HISTORIAL_SUGERIDOS,
  TIPOS_RESPUESTA_SUGERIDOS,
  type HistorialEntrada,
} from "@/lib/panel/historial";
import { cn } from "@/lib/utils";

function BotonCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(texto);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      }}
      aria-label="Copiar"
      className="text-text-secondary hover:text-accent"
    >
      {copiado ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
    </button>
  );
}

function CajaRecuadro({
  entrada,
  onEliminar,
  anidado = false,
}: {
  entrada: HistorialEntrada;
  onEliminar: (id: string) => void;
  anidado?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className={cn("rounded-xl bg-white/[0.03] p-4", anidado && "bg-white/[0.05]")}>
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setAbierto((v) => !v)}>
        <div className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent">{entrada.tipo}</span>
          <p className="mt-0.5 text-xs text-text-secondary">
            {new Date(entrada.created_at).toLocaleString("es-CO")}
          </p>
          {!abierto && <p className="mt-1.5 truncate text-sm text-white/70">{entrada.contenido}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <BotonCopiar texto={entrada.contenido} />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(entrada.id);
            }}
            aria-label="Eliminar"
            className="text-text-secondary hover:text-red-400"
          >
            <Trash2 size={15} />
          </button>
          <ChevronDown
            size={16}
            className={cn("text-text-secondary transition-transform", abierto && "rotate-180")}
          />
        </div>
      </div>
      {abierto && <p className="mt-2 whitespace-pre-line text-sm text-white/90">{entrada.contenido}</p>}
    </div>
  );
}

function FormularioRecuadro({
  prospectoId,
  parentId,
  onAgregado,
}: {
  prospectoId: string;
  parentId: string;
  onAgregado: (entrada: HistorialEntrada) => void;
}) {
  const [mostrar, setMostrar] = useState(false);
  const [tipo, setTipo] = useState("");
  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregar = async () => {
    if (!tipo.trim() || !contenido.trim()) {
      setError("Escribe el tipo y el contenido.");
      return;
    }
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/panel/historial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectoId, parentId, tipo: tipo.trim(), contenido: contenido.trim() }),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo guardar. Intenta de nuevo.");
      return;
    }
    const data = await res.json();
    onAgregado(data.entrada);
    setTipo("");
    setContenido("");
    setMostrar(false);
  };

  if (!mostrar) {
    return (
      <button
        type="button"
        onClick={() => setMostrar(true)}
        className="w-full rounded-xl border border-dashed border-border-glass px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
      >
        + Agregar recuadro a este diagnóstico
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border-glass bg-white/[0.02] p-3">
      <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
        <div>
          <Input
            list="tipos-respuesta-sugeridos"
            placeholder="Ej: Respuesta, Resumen"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <datalist id="tipos-respuesta-sugeridos">
            {TIPOS_RESPUESTA_SUGERIDOS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent"
          placeholder="Respuesta, resumen o plan de acción para este diagnóstico..."
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      <div className="mt-2 flex gap-2">
        <Button size="md" onClick={agregar} disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar"}
        </Button>
        <Button size="md" variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

export function HistorialProspecto({
  prospectoId,
  entradasIniciales,
}: {
  prospectoId: string;
  entradasIniciales: HistorialEntrada[];
}) {
  const router = useRouter();
  const [entradas, setEntradas] = useState(entradasIniciales);
  const [tipo, setTipo] = useState("");
  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abiertoId, setAbiertoId] = useState<string | null>(null);

  const agregar = async () => {
    if (!tipo.trim() || !contenido.trim()) {
      setError("Escribe el tipo y el contenido de la nota.");
      return;
    }
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/panel/historial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectoId, tipo: tipo.trim(), contenido: contenido.trim() }),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo guardar. Intenta de nuevo.");
      return;
    }
    const data = await res.json();
    setEntradas((prev) => [data.entrada, ...prev]);
    setTipo("");
    setContenido("");
  };

  const eliminar = async (id: string) => {
    const confirmado = window.confirm("¿Eliminar esta nota del historial? Si tiene recuadros, se borran también.");
    if (!confirmado) return;
    const res = await fetch(`/api/panel/historial?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("No se pudo eliminar la nota.");
      return;
    }
    setEntradas((prev) => prev.filter((e) => e.id !== id && e.parent_id !== id));
    router.refresh();
  };

  const raiz = entradas.filter((e) => !e.parent_id);
  const hijosDe = (id: string) => entradas.filter((e) => e.parent_id === id);

  return (
    <GlassCard className="mt-6 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        Historial de la empresa
      </h2>
      <p className="mt-1 text-xs text-text-secondary">
        Agrega notas sueltas (diagnóstico de redes, diagnóstico de la empresa, llamadas, reuniones…)
        para ir armando el historial completo de este prospecto. Da clic en una nota para
        desplegarla, copiarla o agregarle una respuesta/resumen.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[220px_1fr]">
        <div>
          <Label htmlFor="tipo-historial">Tipo de nota</Label>
          <Input
            id="tipo-historial"
            list="tipos-historial-sugeridos"
            placeholder="Ej: Diagnóstico redes sociales"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <datalist id="tipos-historial-sugeridos">
            {TIPOS_HISTORIAL_SUGERIDOS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="contenido-historial">Qué pasó / qué encontraste</Label>
          <textarea
            id="contenido-historial"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-white placeholder:text-text-secondary/60 outline-none transition-colors focus:border-accent"
            placeholder="Escribe la nota..."
          />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <Button className="mt-3" onClick={agregar} disabled={enviando}>
        <Plus size={16} />
        {enviando ? "Guardando..." : "Agregar al historial"}
      </Button>

      <div className="mt-6 space-y-3 border-t border-border-glass pt-5">
        {raiz.length === 0 && (
          <p className="text-sm text-text-secondary">Todavía no hay notas en el historial.</p>
        )}
        {raiz.map((entrada) => {
          const abierto = abiertoId === entrada.id;
          const hijos = hijosDe(entrada.id);
          return (
            <div key={entrada.id} className="rounded-xl bg-white/[0.03] p-4">
              <div
                className="flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => setAbiertoId(abierto ? null : entrada.id)}
              >
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {entrada.tipo}
                  </span>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {new Date(entrada.created_at).toLocaleString("es-CO")}
                    {hijos.length > 0 && ` · ${hijos.length} recuadro${hijos.length === 1 ? "" : "s"}`}
                  </p>
                  {!abierto && <p className="mt-1.5 truncate text-sm text-white/70">{entrada.contenido}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <BotonCopiar texto={entrada.contenido} />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminar(entrada.id);
                    }}
                    aria-label="Eliminar nota"
                    className="text-text-secondary hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ChevronDown
                    size={16}
                    className={cn("text-text-secondary transition-transform", abierto && "rotate-180")}
                  />
                </div>
              </div>

              {abierto && (
                <div className="mt-3 space-y-3">
                  <p className="whitespace-pre-line text-sm text-white/90">{entrada.contenido}</p>

                  {hijos.length > 0 && (
                    <div className="space-y-2 border-l border-border-glass pl-4">
                      {hijos.map((hijo) => (
                        <CajaRecuadro key={hijo.id} entrada={hijo} onEliminar={eliminar} anidado />
                      ))}
                    </div>
                  )}

                  <FormularioRecuadro
                    prospectoId={prospectoId}
                    parentId={entrada.id}
                    onAgregado={(nueva) => setEntradas((prev) => [...prev, nueva])}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
