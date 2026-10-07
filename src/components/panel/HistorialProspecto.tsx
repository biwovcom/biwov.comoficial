"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { TIPOS_HISTORIAL_SUGERIDOS, type HistorialEntrada } from "@/lib/panel/historial";

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
    const confirmado = window.confirm("¿Eliminar esta nota del historial?");
    if (!confirmado) return;
    const res = await fetch(`/api/panel/historial?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      window.alert("No se pudo eliminar la nota.");
      return;
    }
    setEntradas((prev) => prev.filter((e) => e.id !== id));
    router.refresh();
  };

  return (
    <GlassCard className="mt-6 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        Historial de la empresa
      </h2>
      <p className="mt-1 text-xs text-text-secondary">
        Agrega notas sueltas (diagnóstico de redes, diagnóstico de la empresa, llamadas, reuniones…)
        para ir armando el historial completo de este prospecto.
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
        {entradas.length === 0 && (
          <p className="text-sm text-text-secondary">Todavía no hay notas en el historial.</p>
        )}
        {entradas.map((entrada) => (
          <div key={entrada.id} className="rounded-xl bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {entrada.tipo}
                </span>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {new Date(entrada.created_at).toLocaleString("es-CO")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => eliminar(entrada.id)}
                aria-label="Eliminar nota"
                className="text-text-secondary hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-white/90">{entrada.contenido}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
