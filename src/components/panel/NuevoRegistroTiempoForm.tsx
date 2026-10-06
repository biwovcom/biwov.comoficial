"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { CronometroTiempo } from "@/components/panel/CronometroTiempo";
import { CATEGORIAS_TIEMPO_SUGERIDAS, type NuevoRegistroTiempoInput } from "@/lib/panel/tiempo";

const HOY = () => new Date().toISOString().slice(0, 10);

export function NuevoRegistroTiempoForm() {
  const router = useRouter();
  const [form, setForm] = useState<NuevoRegistroTiempoInput>({
    fecha: HOY(),
    categoria: "",
    proyecto: "",
    horas: 1,
    notas: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const update = (patch: Partial<NuevoRegistroTiempoInput>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.categoria?.trim() || !form.horas || form.horas <= 0) {
      setError("Categoría y horas son obligatorias.");
      return;
    }
    setError(null);
    setGuardando(true);

    const res = await fetch("/api/panel/tiempo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setGuardando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo guardar el registro.");
      return;
    }

    setForm({ fecha: HOY(), categoria: form.categoria, proyecto: "", horas: 1, notas: "" });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <CronometroTiempo
        onFinalizar={({ categoria, proyecto, horas }) =>
          setForm((prev) => ({ ...prev, categoria, proyecto, horas, fecha: HOY() }))
        }
      />

      <GlassCard className="p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        Registrar tiempo
      </h2>
      <p className="mt-1 text-xs text-text-secondary">
        Al finalizar el cronómetro, las horas llegan aquí — revísalas o ajústalas antes de guardar
        si olvidaste pausarlo.
      </p>
      <form onSubmit={guardar} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label htmlFor="fecha">Fecha</Label>
          <Input
            id="fecha"
            type="date"
            value={form.fecha}
            onChange={(e) => update({ fecha: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="categoria">Tipo de trabajo *</Label>
          <Input
            id="categoria"
            list="categorias-tiempo"
            placeholder="Ej: Sitio web"
            required
            value={form.categoria}
            onChange={(e) => update({ categoria: e.target.value })}
          />
          <datalist id="categorias-tiempo">
            {CATEGORIAS_TIEMPO_SUGERIDAS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="proyecto">Proyecto / cliente</Label>
          <Input
            id="proyecto"
            placeholder="Ej: FashionLash"
            value={form.proyecto ?? ""}
            onChange={(e) => update({ proyecto: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="horas">Horas *</Label>
          <Input
            id="horas"
            type="number"
            min={0.25}
            step={0.25}
            required
            value={form.horas}
            onChange={(e) => update({ horas: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="notas">Notas</Label>
          <Input
            id="notas"
            placeholder="Opcional"
            value={form.notas ?? ""}
            onChange={(e) => update({ notas: e.target.value })}
          />
        </div>

        {error && <p className="sm:col-span-2 lg:col-span-5 text-sm text-red-400">{error}</p>}

        <div className="sm:col-span-2 lg:col-span-5">
          <Button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar registro"}
          </Button>
        </div>
      </form>
      </GlassCard>
    </div>
  );
}
