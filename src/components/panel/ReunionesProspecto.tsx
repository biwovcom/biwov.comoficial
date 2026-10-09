"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import type { Reunion, TareaReunion } from "@/lib/panel/reuniones";
import { cn } from "@/lib/utils";

function nuevoId() {
  return Math.random().toString(36).slice(2);
}

function ChecklistEditable({
  titulo,
  tareas,
  onChange,
}: {
  titulo: string;
  tareas: TareaReunion[];
  onChange: (tareas: TareaReunion[]) => void;
}) {
  const [texto, setTexto] = useState("");

  const agregar = () => {
    if (!texto.trim()) return;
    onChange([...tareas, { id: nuevoId(), texto: texto.trim(), hecho: false }]);
    setTexto("");
  };

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-text-secondary">{titulo}</p>
      <div className="space-y-1.5">
        {tareas.map((tarea) => (
          <div key={tarea.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={tarea.hecho}
              onChange={(e) =>
                onChange(tareas.map((t) => (t.id === tarea.id ? { ...t, hecho: e.target.checked } : t)))
              }
              className="h-4 w-4 shrink-0 accent-accent"
            />
            <span className={cn("flex-1 text-sm", tarea.hecho ? "text-text-secondary line-through" : "text-white/90")}>
              {tarea.texto}
            </span>
            <button
              type="button"
              onClick={() => onChange(tareas.filter((t) => t.id !== tarea.id))}
              aria-label="Eliminar tarea"
              className="text-text-secondary hover:text-red-400"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              agregar();
            }
          }}
          placeholder="Agregar tarea..."
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-1.5 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={agregar}
          className="shrink-0 rounded-xl border border-border-glass px-3 text-text-secondary hover:border-accent/40 hover:text-white"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

async function actualizarReunion(id: string, cambios: Record<string, unknown>) {
  const res = await fetch("/api/panel/reuniones", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...cambios }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.reunion as Reunion;
}

function TarjetaReunion({
  reunion,
  onEliminar,
  onActualizar,
}: {
  reunion: Reunion;
  onEliminar: (id: string) => void;
  onActualizar: (reunion: Reunion) => void;
}) {
  const [abierto, setAbierto] = useState(false);

  const totalTareas = reunion.tareas_cliente.length + reunion.tareas_kathe.length;
  const tareasHechas =
    reunion.tareas_cliente.filter((t) => t.hecho).length + reunion.tareas_kathe.filter((t) => t.hecho).length;

  return (
    <div className="rounded-xl bg-white/[0.03] p-4">
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => setAbierto((v) => !v)}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            {new Date(`${reunion.fecha}T00:00:00`).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {reunion.hora && ` · ${reunion.hora.slice(0, 5)}`}
          </p>
          {!abierto && reunion.notas && (
            <p className="mt-1 truncate text-sm text-white/70">{reunion.notas}</p>
          )}
          {totalTareas > 0 && (
            <p className="mt-0.5 text-xs text-text-secondary">
              {tareasHechas}/{totalTareas} tareas hechas
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(reunion.id);
            }}
            aria-label="Eliminar reunión"
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
        <div className="mt-3 space-y-4 border-t border-border-glass pt-3">
          {reunion.notas && (
            <div>
              <p className="mb-1 text-xs font-medium text-text-secondary">Notas de la reunión</p>
              <p className="whitespace-pre-line text-sm text-white/90">{reunion.notas}</p>
            </div>
          )}
          {reunion.plan_trabajo && (
            <div>
              <p className="mb-1 text-xs font-medium text-text-secondary">Plan de trabajo que salió de aquí</p>
              <p className="whitespace-pre-line text-sm text-white/90">{reunion.plan_trabajo}</p>
            </div>
          )}

          <ChecklistEditable
            titulo="Tareas para el cliente"
            tareas={reunion.tareas_cliente}
            onChange={async (tareas) => {
              onActualizar({ ...reunion, tareas_cliente: tareas });
              const actualizada = await actualizarReunion(reunion.id, { tareasCliente: tareas });
              if (actualizada) onActualizar(actualizada);
            }}
          />
          <ChecklistEditable
            titulo="Tareas para mí"
            tareas={reunion.tareas_kathe}
            onChange={async (tareas) => {
              onActualizar({ ...reunion, tareas_kathe: tareas });
              const actualizada = await actualizarReunion(reunion.id, { tareasKathe: tareas });
              if (actualizada) onActualizar(actualizada);
            }}
          />
        </div>
      )}
    </div>
  );
}

const HOY = () => new Date().toISOString().slice(0, 10);

export function ReunionesProspecto({
  prospectoId,
  reunionesIniciales,
}: {
  prospectoId: string;
  reunionesIniciales: Reunion[];
}) {
  const [reuniones, setReuniones] = useState(
    [...reunionesIniciales].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
  );
  const [fecha, setFecha] = useState(HOY());
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");
  const [planTrabajo, setPlanTrabajo] = useState("");
  const [tareasCliente, setTareasCliente] = useState<TareaReunion[]>([]);
  const [tareasKathe, setTareasKathe] = useState<TareaReunion[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregar = async () => {
    if (!fecha) {
      setError("Escoge la fecha de la reunión.");
      return;
    }
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/panel/reuniones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prospectoId,
        fecha,
        hora,
        notas,
        planTrabajo,
        tareasCliente,
        tareasKathe,
      }),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo guardar. Intenta de nuevo.");
      return;
    }
    const data = await res.json();
    setReuniones((prev) => [data.reunion, ...prev]);
    setFecha(HOY());
    setHora("");
    setNotas("");
    setPlanTrabajo("");
    setTareasCliente([]);
    setTareasKathe([]);
  };

  const eliminar = async (id: string) => {
    const confirmado = window.confirm("¿Eliminar esta reunión?");
    if (!confirmado) return;
    const res = await fetch(`/api/panel/reuniones?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("No se pudo eliminar.");
      return;
    }
    setReuniones((prev) => prev.filter((r) => r.id !== id));
  };

  const actualizarEnLista = (actualizada: Reunion) => {
    setReuniones((prev) => prev.map((r) => (r.id === actualizada.id ? actualizada : r)));
  };

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        Registro de reuniones
      </h2>
      <p className="mt-1 text-xs text-text-secondary">
        Deja la nota de cada reunión con fecha y hora, el plan de trabajo que salió de ahí, y las
        tareas que le quedan al cliente y las que te quedan a ti.
      </p>

      <div className="mt-4 space-y-3 rounded-xl border border-dashed border-border-glass p-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <Label htmlFor="reunion-fecha">Fecha</Label>
            <Input id="reunion-fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="reunion-hora">Hora (opcional)</Label>
            <Input id="reunion-hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="reunion-notas">Notas de la reunión</Label>
          <textarea
            id="reunion-notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent"
            placeholder="Qué se habló..."
          />
        </div>
        <div>
          <Label htmlFor="reunion-plan">Plan de trabajo que salió de aquí</Label>
          <textarea
            id="reunion-plan"
            value={planTrabajo}
            onChange={(e) => setPlanTrabajo(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-text-secondary/60 outline-none focus:border-accent"
            placeholder="Qué se acordó hacer..."
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ChecklistEditable titulo="Tareas para el cliente" tareas={tareasCliente} onChange={setTareasCliente} />
          <ChecklistEditable titulo="Tareas para mí" tareas={tareasKathe} onChange={setTareasKathe} />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button size="md" onClick={agregar} disabled={enviando}>
          <Plus size={15} />
          {enviando ? "Guardando..." : "Agregar reunión"}
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {reuniones.length === 0 && (
          <p className="text-sm text-text-secondary">Todavía no hay reuniones registradas.</p>
        )}
        {reuniones.map((reunion) => (
          <TarjetaReunion
            key={reunion.id}
            reunion={reunion}
            onEliminar={eliminar}
            onActualizar={actualizarEnLista}
          />
        ))}
      </div>
    </div>
  );
}
