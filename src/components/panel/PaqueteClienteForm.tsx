"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PLANES } from "@/data/planes";

export function PaqueteClienteForm({
  prospectoId,
  paqueteInicial,
  costoInicial,
  monedaInicial,
  contratoAceptadoInicial,
  contratoAceptadoEnInicial,
}: {
  prospectoId: string;
  paqueteInicial: string | null;
  costoInicial: number | null;
  monedaInicial: "COP" | "USD" | null;
  contratoAceptadoInicial: boolean;
  contratoAceptadoEnInicial: string | null;
}) {
  const router = useRouter();
  const [paquete, setPaquete] = useState(paqueteInicial ?? "");
  const [costo, setCosto] = useState(costoInicial?.toString() ?? "");
  const [moneda, setMoneda] = useState<"COP" | "USD">(monedaInicial ?? "COP");
  const [contratoAceptado, setContratoAceptado] = useState(contratoAceptadoInicial);
  const [contratoAceptadoEn, setContratoAceptadoEn] = useState(contratoAceptadoEnInicial);
  const [guardando, setGuardando] = useState(false);

  const guardar = async (patchExtra?: { contratoAceptado?: boolean }) => {
    setGuardando(true);
    const res = await fetch(`/api/panel/prospectos/${prospectoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paqueteAdquirido: paquete,
        costoPaquete: costo ? Number(costo) : null,
        costoPaqueteMoneda: moneda,
        ...patchExtra,
      }),
    });
    setGuardando(false);
    if (!res.ok) {
      window.alert("No se pudo guardar.");
      return;
    }
    if (patchExtra?.contratoAceptado !== undefined) {
      setContratoAceptado(patchExtra.contratoAceptado);
      setContratoAceptadoEn(patchExtra.contratoAceptado ? new Date().toISOString() : null);
    }
    router.refresh();
  };

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
        Paquete adquirido (cliente)
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_140px_100px]">
        <div>
          <Label htmlFor="paquete-adquirido">Paquete / plan</Label>
          <Input
            id="paquete-adquirido"
            list="paquetes-sugeridos"
            value={paquete}
            onChange={(e) => setPaquete(e.target.value)}
            placeholder="Ej: Plan Crecimiento"
          />
          <datalist id="paquetes-sugeridos">
            {PLANES.map((p) => (
              <option key={p.id} value={`Plan ${p.nombre}`} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="costo-paquete">Costo acordado</Label>
          <Input
            id="costo-paquete"
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            placeholder="Ej: 900000"
          />
        </div>
        <div>
          <Label htmlFor="moneda-paquete">Moneda</Label>
          <Select id="moneda-paquete" value={moneda} onChange={(e) => setMoneda(e.target.value as "COP" | "USD")}>
            <option value="COP">COP</option>
            <option value="USD">USD</option>
          </Select>
        </div>
      </div>

      <Button size="md" variant="secondary" className="mt-3" onClick={() => guardar()} disabled={guardando}>
        {guardando ? "Guardando..." : "Guardar paquete y costo"}
      </Button>

      <div className="mt-4 border-t border-emerald-500/20 pt-3">
        {contratoAceptado ? (
          <p className="flex items-center gap-2 text-sm text-emerald-300">
            <Check size={15} /> Contrato y tratamiento de datos aceptados
            {contratoAceptadoEn && ` el ${new Date(contratoAceptadoEn).toLocaleString("es-CO")}`}
          </p>
        ) : (
          <label className="flex items-start gap-2.5 text-sm text-text-secondary">
            <input
              type="checkbox"
              onChange={(e) => e.target.checked && guardar({ contratoAceptado: true })}
              className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
              disabled={guardando}
            />
            <span>
              Marcar que esta persona ya aceptó el contrato y el tratamiento de sus datos (yo lo
              confirmo porque lo cerré directamente).
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
