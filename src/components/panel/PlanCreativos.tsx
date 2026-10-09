"use client";

import { useState } from "react";
import { Trash2, Plus, ChevronDown, Copy, Check, Pencil, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  COLOR_SUBCATEGORIA,
  ESTADOS_CREATIVO,
  SUBCATEGORIAS_CREATIVO,
  type EstadoCreativo,
  type PlanCreativoEntrada,
  type SubcategoriaCreativo,
} from "@/lib/panel/planCreativos";
import { cn } from "@/lib/utils";

export async function actualizarEntradaCreativo(
  id: string,
  cambios: Partial<
    Pick<PlanCreativoEntrada, "tipo" | "titulo" | "contenido" | "link" | "fecha" | "estado" | "subcategoria" | "aprobado">
  >,
) {
  const res = await fetch("/api/panel/plan-creativos", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...cambios }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.entrada as PlanCreativoEntrada;
}

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
  tiposSugeridos,
  onGuardar,
  onCancelar,
}: {
  entrada: PlanCreativoEntrada;
  tiposSugeridos: string[];
  onGuardar: (cambios: {
    tipo: string;
    titulo: string;
    link: string;
    contenido: string;
    fecha: string;
    subcategoria: string;
  }) => Promise<void>;
  onCancelar: () => void;
}) {
  const [tipo, setTipo] = useState(entrada.tipo);
  const [titulo, setTitulo] = useState(entrada.titulo ?? "");
  const [link, setLink] = useState(entrada.link ?? "");
  const [contenido, setContenido] = useState(entrada.contenido ?? "");
  const [fecha, setFecha] = useState(entrada.fecha ?? "");
  const [subcategoria, setSubcategoria] = useState(entrada.subcategoria ?? "");
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    if (!tipo.trim()) return;
    setGuardando(true);
    await onGuardar({ tipo: tipo.trim(), titulo, link, contenido, fecha, subcategoria });
    setGuardando(false);
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Input list="tipos-plan-sugeridos-edit" value={tipo} onChange={(e) => setTipo(e.target.value)} />
          <datalist id="tipos-plan-sugeridos-edit">
            {tiposSugeridos.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <Input placeholder="Título (opcional)" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        {entrada.categoria === "creativo" && (
          <Select value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)}>
            <option value="">Sin sección</option>
            {Object.entries(SUBCATEGORIAS_CREATIVO).map(([valor, label]) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </Select>
        )}
      </div>
      <Input placeholder="Link de referencia (opcional)" value={link} onChange={(e) => setLink(e.target.value)} />
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        rows={5}
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

export function TarjetaCreativo({
  entrada,
  tiposSugeridos,
  onEliminar,
  onActualizar,
}: {
  entrada: PlanCreativoEntrada;
  tiposSugeridos: string[];
  onEliminar: (id: string) => void;
  onActualizar: (entrada: PlanCreativoEntrada) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [marcando, setMarcando] = useState(false);

  const toggleAprobado = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMarcando(true);
    const actualizada = await actualizarEntradaCreativo(entrada.id, { aprobado: !entrada.aprobado });
    setMarcando(false);
    if (actualizada) onActualizar(actualizada);
  };

  const cambiarEstado = async (estado: EstadoCreativo) => {
    const actualizada = await actualizarEntradaCreativo(entrada.id, { estado });
    if (actualizada) onActualizar(actualizada);
  };

  return (
    <div className="rounded-xl bg-white/[0.03] p-4">
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => setAbierto((v) => !v)}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">{entrada.tipo}</span>
            {entrada.subcategoria && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  COLOR_SUBCATEGORIA[entrada.subcategoria].badge,
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", COLOR_SUBCATEGORIA[entrada.subcategoria].dot)} />
                {SUBCATEGORIAS_CREATIVO[entrada.subcategoria]}
              </span>
            )}
            {entrada.fecha && (
              <span className="text-[11px] text-text-secondary">
                {new Date(`${entrada.fecha}T00:00:00`).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
            {entrada.aprobado && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                <Check size={11} /> Aprobado
              </span>
            )}
          </div>
          {entrada.titulo && <p className="mt-0.5 text-sm font-semibold text-white">{entrada.titulo}</p>}
          {!abierto && entrada.contenido && (
            <p className="mt-1 truncate text-sm text-white/70">{entrada.contenido}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {entrada.categoria === "creativo" && (
            <select
              value={entrada.estado}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => cambiarEstado(e.target.value as EstadoCreativo)}
              className="rounded-full border border-border-glass bg-white/[0.03] px-2 py-1 text-[11px] text-white outline-none focus:border-accent [&>option]:bg-bg-base"
            >
              {Object.entries(ESTADOS_CREATIVO).map(([valor, info]) => (
                <option key={valor} value={valor}>
                  {info.label}
                </option>
              ))}
            </select>
          )}
          {entrada.contenido && <BotonCopiar texto={entrada.contenido} />}
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
          <ChevronDown
            size={16}
            className={cn("text-text-secondary transition-transform", abierto && "rotate-180")}
          />
        </div>
      </div>

      {abierto && !editando && (
        <div className="mt-3 space-y-2">
          {entrada.link && (
            <a
              href={entrada.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-accent hover:underline"
            >
              <LinkIcon size={13} /> {entrada.link}
            </a>
          )}
          {entrada.contenido && (
            <p className="whitespace-pre-line text-sm text-white/90">{entrada.contenido}</p>
          )}
          <button
            type="button"
            onClick={toggleAprobado}
            disabled={marcando}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              entrada.aprobado
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                : "border-border-glass text-text-secondary hover:border-accent/40 hover:text-white",
            )}
          >
            <Check size={13} />
            {entrada.aprobado ? "Aprobado por el cliente" : "Marcar como aprobado por el cliente"}
          </button>
        </div>
      )}

      {abierto && editando && (
        <div className="mt-3">
          <FormularioEdicion
            entrada={entrada}
            tiposSugeridos={tiposSugeridos}
            onCancelar={() => setEditando(false)}
            onGuardar={async (cambios) => {
              const actualizada = await actualizarEntradaCreativo(entrada.id, {
                ...cambios,
                fecha: cambios.fecha || null,
                subcategoria: (cambios.subcategoria || null) as SubcategoriaCreativo | null,
              });
              if (actualizada) {
                onActualizar(actualizada);
                setEditando(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

function FormularioAlta({
  prospectoId,
  categoria,
  tiposSugeridos,
  fechaFija,
  onAgregado,
}: {
  prospectoId: string;
  categoria: "creativo" | "embudo" | "analisis";
  tiposSugeridos: string[];
  fechaFija?: string;
  onAgregado: (entrada: PlanCreativoEntrada) => void;
}) {
  const [tipo, setTipo] = useState("");
  const [tituloNuevo, setTituloNuevo] = useState("");
  const [link, setLink] = useState("");
  const [contenido, setContenido] = useState("");
  const [fecha, setFecha] = useState(fechaFija ?? "");
  const [subcategoria, setSubcategoria] = useState<SubcategoriaCreativo | "">("");
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
      body: JSON.stringify({
        prospectoId,
        categoria,
        tipo: tipo.trim(),
        titulo: tituloNuevo.trim(),
        link: link.trim(),
        contenido: contenido.trim(),
        fecha,
        subcategoria,
      }),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo guardar. Intenta de nuevo.");
      return;
    }
    const data = await res.json();
    onAgregado(data.entrada);
    setTipo("");
    setTituloNuevo("");
    setLink("");
    setContenido("");
    setFecha(fechaFija ?? "");
    setSubcategoria("");
  };

  const idDatalist = `tipos-plan-sugeridos-${categoria}`;

  return (
    <div className="space-y-2 rounded-xl border border-dashed border-border-glass p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor={`tipo-${categoria}`}>Tipo</Label>
          <Input
            id={`tipo-${categoria}`}
            list={idDatalist}
            placeholder="Ej: Historia, Guion, Copy..."
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
          <datalist id={idDatalist}>
            {tiposSugeridos.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor={`titulo-${categoria}`}>Título (opcional)</Label>
          <Input
            id={`titulo-${categoria}`}
            placeholder="Ej: Historia 1"
            value={tituloNuevo}
            onChange={(e) => setTituloNuevo(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor={`fecha-${categoria}`}>Fecha (opcional)</Label>
          <Input id={`fecha-${categoria}`} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        {categoria === "creativo" && (
          <div>
            <Label htmlFor={`subcategoria-${categoria}`}>Sección</Label>
            <Select
              id={`subcategoria-${categoria}`}
              value={subcategoria}
              onChange={(e) => setSubcategoria(e.target.value as SubcategoriaCreativo | "")}
            >
              <option value="">Sin sección</option>
              {Object.entries(SUBCATEGORIAS_CREATIVO).map(([valor, label]) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
      <div>
        <Label htmlFor={`link-${categoria}`}>Link de referencia (opcional)</Label>
        <Input
          id={`link-${categoria}`}
          placeholder="https://..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`contenido-${categoria}`}>Contenido / guion / descripción</Label>
        <textarea
          id={`contenido-${categoria}`}
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent"
          placeholder="Escribe el guion, el copy o la idea..."
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <Button size="md" onClick={agregar} disabled={enviando}>
        <Plus size={15} />
        {enviando ? "Guardando..." : "Agregar"}
      </Button>
    </div>
  );
}

export function PlanCreativos({
  prospectoId,
  categoria,
  titulo,
  descripcion,
  tiposSugeridos,
  entradas,
  onEntradasChange,
}: {
  prospectoId: string;
  categoria: "creativo" | "embudo" | "analisis";
  titulo: string;
  descripcion: string;
  tiposSugeridos: string[];
  entradas: PlanCreativoEntrada[];
  onEntradasChange: (entradas: PlanCreativoEntrada[]) => void;
}) {
  const eliminar = async (id: string) => {
    const confirmado = window.confirm("¿Eliminar este ítem?");
    if (!confirmado) return;
    const res = await fetch(`/api/panel/plan-creativos?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("No se pudo eliminar.");
      return;
    }
    onEntradasChange(entradas.filter((e) => e.id !== id));
  };

  const actualizarEnLista = (actualizada: PlanCreativoEntrada) => {
    onEntradasChange(entradas.map((e) => (e.id === actualizada.id ? actualizada : e)));
  };

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">{titulo}</h2>
      <p className="mt-1 text-xs text-text-secondary">{descripcion}</p>

      <div className="mt-4">
        <FormularioAlta
          prospectoId={prospectoId}
          categoria={categoria}
          tiposSugeridos={tiposSugeridos}
          onAgregado={(nueva) => onEntradasChange([nueva, ...entradas])}
        />
      </div>

      <div className="mt-5 space-y-3">
        {entradas.length === 0 && (
          <p className="text-sm text-text-secondary">Todavía no hay nada aquí. Agrega el primer ítem arriba.</p>
        )}
        {entradas.map((entrada) => (
          <TarjetaCreativo
            key={entrada.id}
            entrada={entrada}
            tiposSugeridos={tiposSugeridos}
            onEliminar={eliminar}
            onActualizar={actualizarEnLista}
          />
        ))}
      </div>
    </div>
  );
}

export { FormularioAlta };
