"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PAISES } from "@/lib/panel/paises";
import type { NuevoProspectoInput } from "@/lib/panel/prospectos";

const CANALES_ORIGEN = [
  { id: "instagram", label: "Instagram" },
  { id: "recomendado", label: "Recomendado" },
  { id: "pagina-web", label: "Página web" },
  { id: "publicidad", label: "Publicidad" },
  { id: "otro", label: "Otro" },
];

export function NuevoProspectoForm() {
  const router = useRouter();
  const [form, setForm] = useState<NuevoProspectoInput>({ nombre: "", whatsapp: "" });
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const zonaHoraria = PAISES.find((p) => p.pais === form.pais)?.zonaHoraria;

  const update = (patch: Partial<NuevoProspectoInput>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.whatsapp.trim()) {
      setError("Nombre y WhatsApp son obligatorios.");
      return;
    }
    setError(null);
    setGuardando(true);

    const res = await fetch("/api/panel/prospectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setGuardando(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo guardar el prospecto.");
      return;
    }

    const { prospecto } = await res.json();
    router.push(`/panel/prospectos/${prospecto.id}`);
  };

  return (
    <GlassCard className="max-w-xl p-8">
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            required
            value={form.nombre}
            onChange={(e) => update({ nombre: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="empresa">Negocio</Label>
          <Input
            id="empresa"
            value={form.empresa ?? ""}
            onChange={(e) => update({ empresa: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="pais">País</Label>
            <Select
              id="pais"
              value={form.pais ?? ""}
              onChange={(e) => update({ pais: e.target.value })}
            >
              <option value="">Selecciona un país</option>
              {PAISES.map((p) => (
                <option key={p.pais} value={p.pais}>
                  {p.pais}
                </option>
              ))}
            </Select>
            {zonaHoraria && (
              <p className="mt-1.5 text-xs text-text-secondary">Zona horaria: {zonaHoraria}</p>
            )}
          </div>
          <div>
            <Label htmlFor="ciudad">Ciudad</Label>
            <Input
              id="ciudad"
              value={form.ciudad ?? ""}
              onChange={(e) => update({ ciudad: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp *</Label>
          <Input
            id="whatsapp"
            required
            placeholder="+57 300 000 0000"
            value={form.whatsapp}
            onChange={(e) => update({ whatsapp: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            value={form.email ?? ""}
            onChange={(e) => update({ email: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="canal_origen">¿De dónde llegó?</Label>
          <Select
            id="canal_origen"
            value={form.canal_origen ?? ""}
            onChange={(e) => update({ canal_origen: e.target.value })}
          >
            <option value="">Selecciona una opción</option>
            {CANALES_ORIGEN.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="notas">Notas</Label>
          <textarea
            id="notas"
            rows={3}
            className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-white placeholder:text-text-secondary/60 outline-none transition-colors focus:border-accent"
            value={form.notas ?? ""}
            onChange={(e) => update({ notas: e.target.value })}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar prospecto"}
        </Button>
      </form>
    </GlassCard>
  );
}
