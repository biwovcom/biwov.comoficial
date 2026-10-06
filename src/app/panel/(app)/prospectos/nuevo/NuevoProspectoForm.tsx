"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PAISES } from "@/lib/panel/paises";
import { NOMBRES_CATEGORIA, type NuevoProspectoInput } from "@/lib/panel/prospectos";
import { detectarDuplicados, type ProspectoResumen } from "@/lib/panel/duplicados";

const CANALES_ORIGEN = [
  { id: "instagram", label: "Instagram" },
  { id: "recomendado", label: "Recomendado" },
  { id: "pagina-web", label: "Página web" },
  { id: "publicidad", label: "Publicidad" },
  { id: "networking", label: "Evento / networking" },
  { id: "otro", label: "Otro" },
];

export function NuevoProspectoForm() {
  const router = useRouter();
  const [form, setForm] = useState<NuevoProspectoInput>({
    nombre: "",
    whatsapp: "",
    categoria: "contacto",
  });
  const [codigoPais, setCodigoPais] = useState("+57");
  const [numero, setNumero] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [existentes, setExistentes] = useState<ProspectoResumen[]>([]);

  useEffect(() => {
    fetch("/api/panel/prospectos/resumen")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setExistentes(data?.prospectos ?? []))
      .catch(() => {});
  }, []);

  const duplicados = useMemo(
    () =>
      detectarDuplicados(
        { nombre: form.nombre, whatsapp: numero ? `${codigoPais} ${numero}` : "", email: form.email },
        existentes,
      ),
    [form.nombre, form.email, codigoPais, numero, existentes],
  );

  const zonaHoraria = PAISES.find((p) => p.pais === form.pais)?.zonaHoraria;

  const update = (patch: Partial<NuevoProspectoInput>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !numero.trim()) {
      setError("Nombre y WhatsApp son obligatorios.");
      return;
    }
    setError(null);
    setGuardando(true);

    const datos = { ...form, whatsapp: `${codigoPais} ${numero.trim()}` };

    const res = await fetch("/api/panel/prospectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
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
          <Label htmlFor="empresa">Nombre del negocio</Label>
          <Input
            id="empresa"
            value={form.empresa ?? ""}
            onChange={(e) => update({ empresa: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="categoria">Etiqueta</Label>
            <Select
              id="categoria"
              value={form.categoria ?? "contacto"}
              onChange={(e) => update({ categoria: e.target.value as NuevoProspectoInput["categoria"] })}
            >
              {Object.entries(NOMBRES_CATEGORIA).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>
                  {etiqueta}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="nichoMercado">Nicho de mercado</Label>
            <Input
              id="nichoMercado"
              placeholder="Ej: inmobiliario, salud, impresión..."
              value={form.nichoMercado ?? ""}
              onChange={(e) => update({ nichoMercado: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="redesSociales">¿Cómo aparece en redes sociales?</Label>
          <textarea
            id="redesSociales"
            rows={2}
            placeholder="Ej: Instagram @minegocio, Facebook facebook.com/minegocio, TikTok @minegocio..."
            className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-white placeholder:text-text-secondary/60 outline-none transition-colors focus:border-accent"
            value={form.redesSociales ?? ""}
            onChange={(e) => update({ redesSociales: e.target.value })}
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
          <PhoneInput
            codigo={codigoPais}
            numero={numero}
            onCodigoChange={setCodigoPais}
            onNumeroChange={setNumero}
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

        {duplicados.length > 0 && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <AlertTriangle size={16} />
              Posible prospecto repetido
            </p>
            <ul className="mt-2 space-y-1.5">
              {duplicados.map((d, i) => (
                <li key={`${d.prospecto.id}-${d.campo}-${i}`} className="text-sm text-amber-200/90">
                  Mismo <strong>{d.campo}</strong> que{" "}
                  <Link
                    href={`/panel/prospectos/${d.prospecto.id}`}
                    target="_blank"
                    className="underline hover:text-white"
                  >
                    {d.prospecto.nombre}
                  </Link>{" "}
                  — revisa si ya habías hablado con esta persona.
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar prospecto"}
        </Button>
      </form>
    </GlassCard>
  );
}
