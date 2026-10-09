"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { REDES_SUGERIDAS, type RedHistorialEntrada } from "@/lib/panel/redesHistorial";

const HOY = () => new Date().toISOString().slice(0, 10);

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
  const [fecha, setFecha] = useState(HOY());
  const [redSocial, setRedSocial] = useState("");
  const [seguidores, setSeguidores] = useState("");
  const [alcance, setAlcance] = useState("");
  const [engagement, setEngagement] = useState("");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agregar = async () => {
    if (!redSocial.trim()) {
      setError("Escribe la red social.");
      return;
    }
    setEnviando(true);
    setError(null);
    const res = await fetch("/api/panel/redes-historial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prospectoId,
        fecha,
        redSocial: redSocial.trim(),
        seguidores: seguidores ? Number(seguidores) : null,
        alcancePromedio: alcance ? Number(alcance) : null,
        engagementRate: engagement ? Number(engagement) : null,
        notas,
      }),
    });
    setEnviando(false);
    if (!res.ok) {
      setError("No se pudo guardar.");
      return;
    }
    const data = await res.json();
    setEntradas((prev) => [data.entrada, ...prev]);
    setFecha(HOY());
    setRedSocial("");
    setSeguidores("");
    setAlcance("");
    setEngagement("");
    setNotas("");
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

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        Redes y crecimiento
      </h2>
      <p className="mt-1 text-xs text-text-secondary">
        Deja una medición cada tanto (seguidores, alcance, engagement) para ver cómo iniciaron las
        redes de este negocio y cómo han venido escalando.
      </p>

      <div className="mt-4 space-y-2 rounded-xl border border-dashed border-border-glass p-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <Label htmlFor="red-fecha">Fecha</Label>
            <Input id="red-fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="red-social">Red social</Label>
            <Input
              id="red-social"
              list="redes-sugeridas"
              value={redSocial}
              onChange={(e) => setRedSocial(e.target.value)}
              placeholder="Ej: Instagram"
            />
            <datalist id="redes-sugeridas">
              {REDES_SUGERIDAS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <Label htmlFor="red-seguidores">Seguidores</Label>
            <Input
              id="red-seguidores"
              type="number"
              value={seguidores}
              onChange={(e) => setSeguidores(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="red-alcance">Alcance promedio</Label>
            <Input id="red-alcance" type="number" value={alcance} onChange={(e) => setAlcance(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="red-engagement">Engagement %</Label>
            <Input
              id="red-engagement"
              type="number"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="red-notas">Notas (opcional)</Label>
          <textarea
            id="red-notas"
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-accent"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button size="md" onClick={agregar} disabled={enviando}>
          <Plus size={15} />
          {enviando ? "Guardando..." : "Agregar medición"}
        </Button>
      </div>

      <div className="mt-5 overflow-x-auto">
        {entradas.length === 0 ? (
          <p className="text-sm text-text-secondary">Todavía no hay mediciones registradas.</p>
        ) : (
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-text-secondary">
                <th className="pb-2 pr-3">Fecha</th>
                <th className="pb-2 pr-3">Red</th>
                <th className="pb-2 pr-3">Seguidores</th>
                <th className="pb-2 pr-3">Alcance</th>
                <th className="pb-2 pr-3">Engagement</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {entradas.map((e) => (
                <tr key={e.id} className="border-t border-border-glass">
                  <td className="py-2 pr-3 text-white/90">
                    {new Date(`${e.fecha}T00:00:00`).toLocaleDateString("es-CO")}
                  </td>
                  <td className="py-2 pr-3 text-white/90">{e.red_social}</td>
                  <td className="py-2 pr-3 text-white/90">{e.seguidores ?? "—"}</td>
                  <td className="py-2 pr-3 text-white/90">{e.alcance_promedio ?? "—"}</td>
                  <td className="py-2 pr-3 text-white/90">{e.engagement_rate ? `${e.engagement_rate}%` : "—"}</td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => eliminar(e.id)}
                      aria-label="Eliminar"
                      className="text-text-secondary hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
