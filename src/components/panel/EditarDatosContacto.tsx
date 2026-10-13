"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PAISES } from "@/lib/panel/paises";
import type { Prospecto } from "@/lib/panel/prospectos";

type Campos = Pick<
  Prospecto,
  | "empresa"
  | "tipo_negocio"
  | "redes_sociales"
  | "link_redes_prospecto"
  | "whatsapp"
  | "email"
  | "pais"
  | "ciudad"
  | "canal_origen"
  | "que_quiere_resolver"
  | "notas"
>;

function campoAFormulario(p: Campos) {
  return {
    empresa: p.empresa ?? "",
    tipoNegocio: p.tipo_negocio ?? "",
    redesSociales: p.redes_sociales ?? "",
    linkRedesProspecto: p.link_redes_prospecto ?? "",
    whatsapp: p.whatsapp ?? "",
    email: p.email ?? "",
    pais: p.pais ?? "",
    ciudad: p.ciudad ?? "",
    canalOrigen: p.canal_origen ?? "",
    queQuiereResolver: p.que_quiere_resolver ?? "",
    notas: p.notas ?? "",
  };
}

export function EditarDatosContacto({ prospectoId, datos }: { prospectoId: string; datos: Campos }) {
  const router = useRouter();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState(() => campoAFormulario(datos));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(campo: K, valor: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    const res = await fetch(`/api/panel/prospectos/${prospectoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setGuardando(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo guardar.");
      return;
    }
    setEditando(false);
    router.refresh();
  };

  const cancelar = () => {
    setForm(campoAFormulario(datos));
    setError(null);
    setEditando(false);
  };

  if (!editando) {
    return (
      <button
        type="button"
        onClick={() => setEditando(true)}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
      >
        <Pencil size={13} /> Editar datos de contacto
      </button>
    );
  }

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-border-glass bg-white/[0.02] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Editar datos de contacto</p>
        <button type="button" onClick={cancelar} aria-label="Cerrar" className="text-text-secondary hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="edit-empresa">Negocio</Label>
          <Input id="edit-empresa" value={form.empresa} onChange={(e) => set("empresa", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="edit-tipo-negocio">Tipo de negocio</Label>
          <Input id="edit-tipo-negocio" value={form.tipoNegocio} onChange={(e) => set("tipoNegocio", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="edit-whatsapp">WhatsApp</Label>
          <Input id="edit-whatsapp" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="edit-email">Correo</Label>
          <Input id="edit-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="edit-pais">País</Label>
          <Select id="edit-pais" value={form.pais} onChange={(e) => set("pais", e.target.value)}>
            <option value="">Sin especificar</option>
            {PAISES.map((p) => (
              <option key={p.pais} value={p.pais}>
                {p.pais}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-ciudad">Ciudad</Label>
          <Input id="edit-ciudad" value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="edit-origen">Origen</Label>
          <Input id="edit-origen" value={form.canalOrigen} onChange={(e) => set("canalOrigen", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="edit-redes">Redes sociales</Label>
          <Input id="edit-redes" value={form.redesSociales} onChange={(e) => set("redesSociales", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="edit-link-redes">Instagram / web (link)</Label>
          <Input
            id="edit-link-redes"
            value={form.linkRedesProspecto}
            onChange={(e) => set("linkRedesProspecto", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-quiere-resolver">Qué quiere resolver</Label>
        <textarea
          id="edit-quiere-resolver"
          rows={2}
          value={form.queQuiereResolver}
          onChange={(e) => set("queQuiereResolver", e.target.value)}
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-accent"
        />
      </div>
      <div>
        <Label htmlFor="edit-notas">Notas</Label>
        <textarea
          id="edit-notas"
          rows={3}
          value={form.notas}
          onChange={(e) => set("notas", e.target.value)}
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-accent"
          placeholder="Agrega cualquier información adicional aquí..."
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button size="md" onClick={guardar} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button size="md" variant="secondary" onClick={cancelar} disabled={guardando}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
