"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  COLOR_SEMAFORO,
  GLOSARIO_METRICAS,
  GLOSARIO_TERMINOS_MARKETING,
  REDES_SUGERIDAS,
  filasFormulas,
  type RedHistorialEntrada,
} from "@/lib/panel/redesHistorial";
import { cn } from "@/lib/utils";

const HOY = () => new Date().toISOString().slice(0, 10);

const CAMPOS_VACIOS = {
  fecha: HOY(),
  redSocial: "",
  periodoDias: "30",
  seguidores: "",
  seguidos: "",
  visualizaciones: "",
  alcancePromedio: "",
  interacciones: "",
  cuentasInteractuaron: "",
  visitasPerfil: "",
  sumaVistasPiezas: "",
  numPiezas: "",
  pctReels: "",
  pctHistorias: "",
  pctPublicaciones: "",
  pctNoSeguidores: "",
  notas: "",
};

type FormularioValores = typeof CAMPOS_VACIOS;

function entradaAFormulario(e: RedHistorialEntrada): FormularioValores {
  return {
    fecha: e.fecha,
    redSocial: e.red_social,
    periodoDias: String(e.periodo_dias),
    seguidores: e.seguidores?.toString() ?? "",
    seguidos: e.seguidos?.toString() ?? "",
    visualizaciones: e.visualizaciones?.toString() ?? "",
    alcancePromedio: e.alcance_promedio?.toString() ?? "",
    interacciones: e.interacciones?.toString() ?? "",
    cuentasInteractuaron: e.cuentas_interactuaron?.toString() ?? "",
    visitasPerfil: e.visitas_perfil?.toString() ?? "",
    sumaVistasPiezas: e.suma_vistas_piezas?.toString() ?? "",
    numPiezas: e.num_piezas?.toString() ?? "",
    pctReels: e.pct_reels?.toString() ?? "",
    pctHistorias: e.pct_historias?.toString() ?? "",
    pctPublicaciones: e.pct_publicaciones?.toString() ?? "",
    pctNoSeguidores: e.pct_no_seguidores?.toString() ?? "",
    notas: e.notas ?? "",
  };
}

function formularioAPayload(f: FormularioValores) {
  const num = (v: string) => (v ? Number(v) : null);
  return {
    fecha: f.fecha,
    redSocial: f.redSocial.trim(),
    periodoDias: Number(f.periodoDias),
    seguidores: num(f.seguidores),
    seguidos: num(f.seguidos),
    visualizaciones: num(f.visualizaciones),
    alcancePromedio: num(f.alcancePromedio),
    interacciones: num(f.interacciones),
    cuentasInteractuaron: num(f.cuentasInteractuaron),
    visitasPerfil: num(f.visitasPerfil),
    sumaVistasPiezas: num(f.sumaVistasPiezas),
    numPiezas: num(f.numPiezas),
    pctReels: num(f.pctReels),
    pctHistorias: num(f.pctHistorias),
    pctPublicaciones: num(f.pctPublicaciones),
    pctNoSeguidores: num(f.pctNoSeguidores),
    notas: f.notas.trim() || null,
  };
}

function CampoNum({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FormularioMedicion({
  valoresIniciales,
  onGuardar,
  onCancelar,
  textoBoton,
}: {
  valoresIniciales: FormularioValores;
  onGuardar: (valores: FormularioValores) => Promise<void>;
  onCancelar?: () => void;
  textoBoton: string;
}) {
  const [f, setF] = useState(valoresIniciales);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (campo: keyof FormularioValores) => (valor: string) => setF((prev) => ({ ...prev, [campo]: valor }));

  const guardar = async () => {
    if (!f.redSocial.trim()) {
      setError("Escribe la red social.");
      return;
    }
    setGuardando(true);
    setError(null);
    await onGuardar(f);
    setGuardando(false);
  };

  return (
    <div className="space-y-4 rounded-xl border border-dashed border-border-glass p-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <div>
          <Label>Fecha</Label>
          <Input type="date" value={f.fecha} onChange={(e) => set("fecha")(e.target.value)} />
        </div>
        <div>
          <Label>Red social</Label>
          <Input list="redes-sugeridas" value={f.redSocial} onChange={(e) => set("redSocial")(e.target.value)} />
          <datalist id="redes-sugeridas">
            {REDES_SUGERIDAS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>
        <div>
          <Label>Periodo del panel</Label>
          <Select value={f.periodoDias} onChange={(e) => set("periodoDias")(e.target.value)}>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </Select>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Del panel · Estadísticas → Cuenta
        </p>
        <div className="grid gap-2 sm:grid-cols-4">
          <CampoNum label="Visualizaciones" value={f.visualizaciones} onChange={set("visualizaciones")} />
          <CampoNum label="Espectadores (alcance)" value={f.alcancePromedio} onChange={set("alcancePromedio")} />
          <CampoNum label="Interacciones" value={f.interacciones} onChange={set("interacciones")} />
          <CampoNum label="Cuentas que interactuaron" value={f.cuentasInteractuaron} onChange={set("cuentasInteractuaron")} />
          <CampoNum label="Seguidores" value={f.seguidores} onChange={set("seguidores")} />
          <CampoNum label="Seguidos" value={f.seguidos} onChange={set("seguidos")} />
          <CampoNum label="Visitas al perfil" value={f.visitasPerfil} onChange={set("visitasPerfil")} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Por pieza · Estadísticas → Contenido
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <CampoNum label="Suma de las vistas de cada pieza" value={f.sumaVistasPiezas} onChange={set("sumaVistasPiezas")} />
          <CampoNum label="Número de piezas que sumaste" value={f.numPiezas} onChange={set("numPiezas")} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Por tipo de contenido (opcional)
        </p>
        <div className="grid gap-2 sm:grid-cols-4">
          <CampoNum label="% Reels" value={f.pctReels} onChange={set("pctReels")} />
          <CampoNum label="% Historias" value={f.pctHistorias} onChange={set("pctHistorias")} />
          <CampoNum label="% Publicaciones" value={f.pctPublicaciones} onChange={set("pctPublicaciones")} />
          <CampoNum label="% de no seguidores" value={f.pctNoSeguidores} onChange={set("pctNoSeguidores")} />
        </div>
      </div>

      <div>
        <Label>Notas (opcional)</Label>
        <textarea
          rows={2}
          value={f.notas}
          onChange={(e) => set("notas")(e.target.value)}
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-accent"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button size="md" onClick={guardar} disabled={guardando}>
          <Plus size={15} />
          {guardando ? "Guardando..." : textoBoton}
        </Button>
        {onCancelar && (
          <Button size="md" variant="secondary" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}

function MedidorFila({
  label,
  valor,
  unidad,
  explicacion,
  medidor,
}: {
  label: string;
  valor: number | null;
  unidad: string;
  explicacion: string;
  medidor?: { nivel: "rojo" | "naranja" | "amarillo" | "verde"; referencia: string };
}) {
  if (valor === null) return null;
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        medidor ? COLOR_SEMAFORO[medidor.nivel].badge : "border-border-glass bg-white/[0.02]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-white">{label}</p>
        {medidor && (
          <span className={cn("flex items-center gap-1.5 text-[10px] font-semibold", COLOR_SEMAFORO[medidor.nivel].text)}>
            <span className={cn("h-2 w-2 rounded-full", COLOR_SEMAFORO[medidor.nivel].dot)} />
            {COLOR_SEMAFORO[medidor.nivel].label}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-lg font-bold text-white">
        {valor.toLocaleString("es-CO", { maximumFractionDigits: 1 })} <span className="text-xs font-normal text-text-secondary">{unidad}</span>
      </p>
      <p className="mt-1 text-xs text-text-secondary">{explicacion}</p>
      {medidor && <p className="mt-1 text-[11px] text-text-secondary">Referencia: {medidor.referencia}</p>}
    </div>
  );
}

function GlosarioRedes() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="rounded-xl border border-border-glass bg-white/[0.02] p-4">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center justify-between gap-2"
      >
        <span className="text-sm font-semibold text-white">¿Qué significa cada métrica?</span>
        <ChevronDown size={16} className={cn("text-text-secondary transition-transform", abierto && "rotate-180")} />
      </button>
      {abierto && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2.5">
            {GLOSARIO_METRICAS.map((g) => (
              <p key={g.termino} className="text-xs text-text-secondary">
                <span className="font-semibold text-white">{g.termino}:</span> {g.explicacion}
              </p>
            ))}
          </div>
          <div className="border-t border-border-glass pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
              Palabras del marketing digital
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {GLOSARIO_TERMINOS_MARKETING.map((g) => (
                <p key={g.termino} className="text-xs text-text-secondary">
                  <span className="font-semibold text-white">{g.termino}:</span> {g.explicacion}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TarjetaMedicion({
  entrada,
  onEliminar,
  onActualizar,
}: {
  entrada: RedHistorialEntrada;
  onEliminar: (id: string) => void;
  onActualizar: (entrada: RedHistorialEntrada) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const filas = useMemo(() => filasFormulas(entrada), [entrada]);

  const guardarEdicion = async (valores: FormularioValores) => {
    const res = await fetch("/api/panel/redes-historial", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entrada.id, ...formularioAPayload(valores) }),
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
        <div>
          <p className="text-sm font-semibold text-white">
            {entrada.red_social} · {new Date(`${entrada.fecha}T00:00:00`).toLocaleDateString("es-CO")}
          </p>
          <p className="text-xs text-text-secondary">Periodo de {entrada.periodo_dias} días</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
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
        <div className="mt-4 space-y-4 border-t border-border-glass pt-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Análisis</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filas.map((fila) => (
                <MedidorFila key={fila.label} {...fila} />
              ))}
            </div>
          </div>
          {entrada.notas && <p className="whitespace-pre-line text-sm text-white/90">{entrada.notas}</p>}
        </div>
      )}

      {abierto && editando && (
        <div className="mt-4">
          <FormularioMedicion
            valoresIniciales={entradaAFormulario(entrada)}
            onGuardar={guardarEdicion}
            onCancelar={() => setEditando(false)}
            textoBoton="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}

export function RedesHistorialProspecto({
  prospectoId,
  entradasIniciales,
}: {
  prospectoId: string;
  entradasIniciales: RedHistorialEntrada[];
}) {
  const [entradas, setEntradas] = useState(
    [...entradasIniciales].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
  );
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtroRed, setFiltroRed] = useState("todas");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const redesDisponibles = useMemo(
    () => Array.from(new Set(entradas.map((e) => e.red_social))),
    [entradas],
  );

  const visibles = entradas.filter((e) => {
    if (filtroRed !== "todas" && e.red_social !== filtroRed) return false;
    if (desde && e.fecha < desde) return false;
    if (hasta && e.fecha > hasta) return false;
    return true;
  });

  const agregar = async (valores: FormularioValores) => {
    const res = await fetch("/api/panel/redes-historial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectoId, ...formularioAPayload(valores) }),
    });
    if (!res.ok) {
      window.alert("No se pudo guardar.");
      return;
    }
    const data = await res.json();
    setEntradas((prev) => [data.entrada, ...prev]);
    setMostrarForm(false);
  };

  const eliminar = async (id: string) => {
    const confirmado = window.confirm("¿Eliminar esta medición?");
    if (!confirmado) return;
    const res = await fetch(`/api/panel/redes-historial?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("No se pudo eliminar.");
      return;
    }
    setEntradas((prev) => prev.filter((e) => e.id !== id));
  };

  const actualizarEnLista = (actualizada: RedHistorialEntrada) => {
    setEntradas((prev) => prev.map((e) => (e.id === actualizada.id ? actualizada : e)));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Redes y crecimiento</h2>
        <p className="mt-1 text-xs text-text-secondary">
          Copia los números del Panel profesional de Instagram (Estadísticas → Cuenta y Estadísticas → Contenido) y
          aquí se calculan solas las fórmulas de alcance y engagement, con un medidor de qué tan bien va cada una.
        </p>
      </div>

      <GlosarioRedes />

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label>Red social</Label>
          <Select value={filtroRed} onChange={(e) => setFiltroRed(e.target.value)} className="w-40">
            <option value="todas">Todas</option>
            {redesDisponibles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Desde</Label>
          <Input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="w-40" />
        </div>
        <div>
          <Label>Hasta</Label>
          <Input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="w-40" />
        </div>
        {(desde || hasta || filtroRed !== "todas") && (
          <button
            type="button"
            onClick={() => {
              setDesde("");
              setHasta("");
              setFiltroRed("todas");
            }}
            className="text-xs text-text-secondary hover:text-white"
          >
            Quitar filtros
          </button>
        )}
      </div>

      {!mostrarForm ? (
        <Button size="md" onClick={() => setMostrarForm(true)}>
          <Plus size={15} /> Agregar medición
        </Button>
      ) : (
        <FormularioMedicion
          valoresIniciales={CAMPOS_VACIOS}
          onGuardar={agregar}
          onCancelar={() => setMostrarForm(false)}
          textoBoton="Guardar medición"
        />
      )}

      <div className="space-y-3">
        {visibles.length === 0 && (
          <p className="text-sm text-text-secondary">No hay mediciones con estos filtros todavía.</p>
        )}
        {visibles.map((e) => (
          <TarjetaMedicion key={e.id} entrada={e} onEliminar={eliminar} onActualizar={actualizarEnLista} />
        ))}
      </div>
    </div>
  );
}
