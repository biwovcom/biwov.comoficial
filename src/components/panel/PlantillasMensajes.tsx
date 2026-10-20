"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Copy, Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { ETAPAS_MENSAJE_SUGERIDAS, type MensajePlantilla } from "@/lib/panel/mensajesPlantilla";
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

function FormularioEdicion({
  entrada,
  onGuardar,
  onCancelar,
}: {
  entrada: MensajePlantilla;
  onGuardar: (cambios: { etapa: string; titulo: string; contenido: string }) => Promise<void>;
  onCancelar: () => void;
}) {
  const [etapa, setEtapa] = useState(entrada.etapa);
  const [titulo, setTitulo] = useState(entrada.titulo ?? "");
  const [contenido, setContenido] = useState(entrada.contenido);
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    if (!etapa.trim() || !contenido.trim()) return;
    setGuardando(true);
    await onGuardar({ etapa: etapa.trim(), titulo, contenido: contenido.trim() });
    setGuardando(false);
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Input list="etapas-mensaje-sugeridas-edit" value={etapa} onChange={(e) => setEtapa(e.target.value)} />
          <datalist id="etapas-mensaje-sugeridas-edit">
            {ETAPAS_MENSAJE_SUGERIDAS.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
        </div>
        <Input placeholder="Título (opcional)" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </div>
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        rows={6}
        className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-accent"
      />
      <div className="flex gap-2">
        <Button size="md" onClick={guardar} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </Button>
        <Button size="md" variant="secondary" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

function TarjetaPlantilla({
  entrada,
  onEliminar,
  onActualizar,
}: {
  entrada: MensajePlantilla;
  onEliminar: (id: string) => void;
  onActualizar: (entrada: MensajePlantilla) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState(false);

  const guardarEdicion = async (cambios: { etapa: string; titulo: string; contenido: string }) => {
    const res = await fetch("/api/panel/mensajes-plantilla", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entrada.id, ...cambios }),
    });
    if (!res.ok) {
      window.alert("No se pudo guardar.");
      return;
    }
    const data = await res.json();
    onActualizar(data.entrada);
    setEditando(false);
  };

  return (
    <div className="rounded-xl bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setAbierto((v) => !v)}>
        <div className="min-w-0">
          {entrada.titulo && <p className="text-sm font-semibold text-white">{entrada.titulo}</p>}
          {!abierto && (
            <p className="mt-0.5 truncate text-sm text-white/70">{entrada.contenido}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <BotonCopiar texto={entrada.contenido} />
          {abierto && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditando(true);
              }}
              aria-label="Editar"
              className="text-text-secondary hover:text-accent"
            >
              <Pencil size={15} />
            </button>
          )}
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
          <ChevronDown size={16} className={cn("text-text-secondary transition-transform", abierto && "rotate-180")} />
        </div>
      </div>

      {abierto && !editando && (
        <p className="mt-3 whitespace-pre-line text-sm text-white/90">{entrada.contenido}</p>
      )}

      {abierto && editando && (
        <div className="mt-3">
          <FormularioEdicion entrada={entrada} onGuardar={guardarEdicion} onCancelar={() => setEditando(false)} />
        </div>
      )}
    </div>
  );
}

function FormularioAlta({ onAgregado }: { onAgregado: (entrada: MensajePlantilla) => void }) {
  const [etapa, setEtapa] = useState("");
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregar = async () => {
    if (!etapa.trim() || !contenido.trim()) {
      setError("Escribe la etapa y el mensaje.");
      return;
    }
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/panel/mensajes-plantilla", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etapa: etapa.trim(), titulo: titulo.trim(), contenido: contenido.trim() }),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo guardar. Intenta de nuevo.");
      return;
    }
    const data = await res.json();
    onAgregado(data.entrada);
    setEtapa("");
    setTitulo("");
    setContenido("");
  };

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-border-glass p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="etapa-nueva">Etapa</Label>
          <Input
            id="etapa-nueva"
            list="etapas-mensaje-sugeridas"
            placeholder="Ej: Seguimiento"
            value={etapa}
            onChange={(e) => setEtapa(e.target.value)}
          />
          <datalist id="etapas-mensaje-sugeridas">
            {ETAPAS_MENSAJE_SUGERIDAS.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="titulo-nuevo">Título (opcional)</Label>
          <Input
            id="titulo-nuevo"
            placeholder="Ej: Objeción de precio"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="contenido-nuevo">Mensaje / guion / preguntas</Label>
        <textarea
          id="contenido-nuevo"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent"
          placeholder="Escribe el mensaje o las preguntas a hacer..."
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <Button size="md" onClick={agregar} disabled={enviando}>
        <Plus size={15} />
        {enviando ? "Guardando..." : "Agregar plantilla"}
      </Button>
    </div>
  );
}

export function PlantillasMensajes({ entradasIniciales }: { entradasIniciales: MensajePlantilla[] }) {
  const [entradas, setEntradas] = useState(entradasIniciales);

  const eliminar = async (id: string) => {
    const confirmado = window.confirm("¿Eliminar esta plantilla?");
    if (!confirmado) return;
    const res = await fetch(`/api/panel/mensajes-plantilla?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("No se pudo eliminar.");
      return;
    }
    setEntradas((prev) => prev.filter((e) => e.id !== id));
  };

  const actualizarEnLista = (actualizada: MensajePlantilla) => {
    setEntradas((prev) => prev.map((e) => (e.id === actualizada.id ? actualizada : e)));
  };

  const grupos = useMemo(() => {
    const etapasPresentes = Array.from(new Set(entradas.map((e) => e.etapa)));
    const ordenadas = [
      ...ETAPAS_MENSAJE_SUGERIDAS.filter((e) => etapasPresentes.includes(e)),
      ...etapasPresentes.filter((e) => !ETAPAS_MENSAJE_SUGERIDAS.includes(e)).sort(),
    ];
    return ordenadas.map((etapa) => ({
      etapa,
      items: entradas.filter((e) => e.etapa === etapa),
    }));
  }, [entradas]);

  return (
    <div className="space-y-6">
      <FormularioAlta onAgregado={(nueva) => setEntradas((prev) => [nueva, ...prev])} />

      {grupos.length === 0 && (
        <p className="text-sm text-text-secondary">
          Todavía no hay plantillas. Agrega la primera arriba — por ejemplo, un mensaje en frío o
          las preguntas que haces en la reunión de cierre.
        </p>
      )}

      {grupos.map((grupo) => (
        <div key={grupo.etapa}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">{grupo.etapa}</h3>
          <div className="space-y-2">
            {grupo.items.map((entrada) => (
              <TarjetaPlantilla
                key={entrada.id}
                entrada={entrada}
                onEliminar={eliminar}
                onActualizar={actualizarEnLista}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
