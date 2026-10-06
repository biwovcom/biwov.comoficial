"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { NOMBRES_CATEGORIA, NOMBRES_SEGUIMIENTO, type Categoria, type Seguimiento } from "@/lib/panel/prospectos";

export function EditarClasificacion({
  prospectoId,
  categoriaInicial,
  nichoMercadoInicial,
  seguimientoInicial,
}: {
  prospectoId: string;
  categoriaInicial: Categoria | null;
  nichoMercadoInicial: string | null;
  seguimientoInicial: Seguimiento | null;
}) {
  const router = useRouter();
  const [categoria, setCategoria] = useState<Categoria>(categoriaInicial ?? "contacto");
  const [nicho, setNicho] = useState(nichoMercadoInicial ?? "");
  const [seguimiento, setSeguimiento] = useState<Seguimiento | "">(seguimientoInicial ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    const res = await fetch(`/api/panel/prospectos/${prospectoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoria, nichoMercado: nicho, seguimiento: seguimiento || null }),
    });
    setGuardando(false);

    if (!res.ok) {
      setError("No se pudo guardar.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="categoria">Etiqueta</Label>
        <Select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as Categoria)}
        >
          {Object.entries(NOMBRES_CATEGORIA).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="nicho">Nicho de mercado</Label>
        <Input
          id="nicho"
          placeholder="Ej: inmobiliario, salud, impresión..."
          value={nicho}
          onChange={(e) => setNicho(e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="seguimiento">Alerta de seguimiento</Label>
        <Select
          id="seguimiento"
          value={seguimiento}
          onChange={(e) => setSeguimiento(e.target.value as Seguimiento | "")}
        >
          <option value="">Sin alerta</option>
          {Object.entries(NOMBRES_SEGUIMIENTO).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </Select>
      </div>
      <div className="sm:col-span-2">
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <Button variant="secondary" onClick={guardar} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar clasificación"}
        </Button>
      </div>
    </div>
  );
}
