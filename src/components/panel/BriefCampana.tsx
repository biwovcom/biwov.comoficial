"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { OPCIONES_OBJETIVO_CONVERSION, primerDiaDelMes, type PlanCampana } from "@/lib/panel/planCampanas";
import type { PlanCreativoEntrada } from "@/lib/panel/planCreativos";

const CAMPOS_INICIALES = {
  ticketPromedio: "",
  moneda: "COP" as "COP" | "USD",
  objetivoConversion: "",
  presupuestoDiario: "",
  presupuestoMensual: "",
  cpaMaximo: "",
  numConjuntos: "",
  numCreativosObjetivo: "",
  publico: "",
  eventoCalificacion: "",
  ofertaPrincipal: "",
  objetivoMes: "",
  resultadoMes: "",
};

function campanaAFormulario(campana: PlanCampana | null) {
  if (!campana) return CAMPOS_INICIALES;
  return {
    ticketPromedio: campana.ticket_promedio?.toString() ?? "",
    moneda: campana.moneda ?? "COP",
    objetivoConversion: campana.objetivo_conversion ?? "",
    presupuestoDiario: campana.presupuesto_diario?.toString() ?? "",
    presupuestoMensual: campana.presupuesto_mensual?.toString() ?? "",
    cpaMaximo: campana.cpa_maximo?.toString() ?? "",
    numConjuntos: campana.num_conjuntos?.toString() ?? "",
    numCreativosObjetivo: campana.num_creativos_objetivo?.toString() ?? "",
    publico: campana.publico ?? "",
    eventoCalificacion: campana.evento_calificacion ?? "",
    ofertaPrincipal: campana.oferta_principal ?? "",
    objetivoMes: campana.objetivo_mes ?? "",
    resultadoMes: campana.resultado_mes ?? "",
  };
}

export function BriefCampana(props: {
  prospectoId: string;
  anio: number;
  mes: number;
  campana: PlanCampana | null;
  creativosDelMes: PlanCreativoEntrada[];
  onGuardado: (campana: PlanCampana) => void;
}) {
  // Se remonta (y reinicia el formulario) cada vez que cambia el mes o se
  // crea el brief por primera vez, sin necesitar un efecto para sincronizar.
  return <BriefCampanaInterna key={`${props.anio}-${props.mes}-${props.campana?.id ?? "nuevo"}`} {...props} />;
}

function BriefCampanaInterna({
  prospectoId,
  anio,
  mes,
  campana,
  creativosDelMes,
  onGuardado,
}: {
  prospectoId: string;
  anio: number;
  mes: number;
  campana: PlanCampana | null;
  creativosDelMes: PlanCreativoEntrada[];
  onGuardado: (campana: PlanCampana) => void;
}) {
  const [form, setForm] = useState(() => campanaAFormulario(campana));
  const [guardando, setGuardando] = useState(false);

  const set = <K extends keyof typeof form>(campo: K, valor: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const guardar = async (aprobar?: boolean) => {
    setGuardando(true);
    const res = await fetch("/api/panel/plan-campanas", {
      method: campana ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: campana?.id,
        prospectoId,
        mes: primerDiaDelMes(anio, mes),
        ticketPromedio: form.ticketPromedio ? Number(form.ticketPromedio) : null,
        moneda: form.moneda,
        objetivoConversion: form.objetivoConversion || null,
        presupuestoDiario: form.presupuestoDiario ? Number(form.presupuestoDiario) : null,
        presupuestoMensual: form.presupuestoMensual ? Number(form.presupuestoMensual) : null,
        cpaMaximo: form.cpaMaximo ? Number(form.cpaMaximo) : null,
        numConjuntos: form.numConjuntos ? Number(form.numConjuntos) : null,
        numCreativosObjetivo: form.numCreativosObjetivo ? Number(form.numCreativosObjetivo) : null,
        publico: form.publico || null,
        eventoCalificacion: form.eventoCalificacion || null,
        ofertaPrincipal: form.ofertaPrincipal || null,
        objetivoMes: form.objetivoMes || null,
        resultadoMes: form.resultadoMes || null,
        ...(aprobar !== undefined ? { aprobado: aprobar } : {}),
      }),
    });
    setGuardando(false);
    if (!res.ok) {
      window.alert("No se pudo guardar el brief.");
      return;
    }
    const data = await res.json();
    onGuardado(data.campana);
  };

  const creativosListos = creativosDelMes.length;

  return (
    <div className="rounded-xl border border-border-glass bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">Brief de la campaña</h3>
        {campana?.aprobado && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            <Check size={11} /> Aprobado por el cliente
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-text-secondary">
        {creativosListos} creativo{creativosListos === 1 ? "" : "s"} listo{creativosListos === 1 ? "" : "s"} este mes
        {form.numCreativosObjetivo && ` de ${form.numCreativosObjetivo} planeados`}.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Ticket promedio</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={form.ticketPromedio}
              onChange={(e) => set("ticketPromedio", e.target.value)}
            />
            <Select
              value={form.moneda}
              onChange={(e) => set("moneda", e.target.value as "COP" | "USD")}
              className="w-24"
            >
              <option value="COP">COP</option>
              <option value="USD">USD</option>
            </Select>
          </div>
        </div>
        <div>
          <Label>Objetivo de conversión</Label>
          <Input
            list="objetivos-conversion"
            value={form.objetivoConversion}
            onChange={(e) => set("objetivoConversion", e.target.value)}
          />
          <datalist id="objetivos-conversion">
            {OPCIONES_OBJETIVO_CONVERSION.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </div>
        <div>
          <Label>Presupuesto diario</Label>
          <Input
            type="number"
            value={form.presupuestoDiario}
            onChange={(e) => set("presupuestoDiario", e.target.value)}
          />
        </div>
        <div>
          <Label>Presupuesto mensual</Label>
          <Input
            type="number"
            value={form.presupuestoMensual}
            onChange={(e) => set("presupuestoMensual", e.target.value)}
          />
        </div>
        <div>
          <Label>CPA máximo</Label>
          <Input type="number" value={form.cpaMaximo} onChange={(e) => set("cpaMaximo", e.target.value)} />
        </div>
        <div>
          <Label>Público / segmentación</Label>
          <Input value={form.publico} onChange={(e) => set("publico", e.target.value)} placeholder="Advantage+, público guardado..." />
        </div>
        <div>
          <Label>Número de conjuntos (sugerido 3-5)</Label>
          <Input type="number" value={form.numConjuntos} onChange={(e) => set("numConjuntos", e.target.value)} />
        </div>
        <div>
          <Label>Creativos objetivo (sugerido 9-15)</Label>
          <Input
            type="number"
            value={form.numCreativosObjetivo}
            onChange={(e) => set("numCreativosObjetivo", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <Label>Cómo se mide una venta o lead real (evento de calificación)</Label>
        <Input value={form.eventoCalificacion} onChange={(e) => set("eventoCalificacion", e.target.value)} />
      </div>
      <div className="mt-3">
        <Label>Oferta principal del mes</Label>
        <Input value={form.ofertaPrincipal} onChange={(e) => set("ofertaPrincipal", e.target.value)} />
      </div>
      <div className="mt-3">
        <Label>Objetivo / metas del mes</Label>
        <textarea
          rows={2}
          value={form.objetivoMes}
          onChange={(e) => set("objetivoMes", e.target.value)}
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-accent"
        />
      </div>
      <div className="mt-3">
        <Label>Resultado del mes (se llena al cierre)</Label>
        <textarea
          rows={2}
          value={form.resultadoMes}
          onChange={(e) => set("resultadoMes", e.target.value)}
          className="w-full rounded-xl border border-border-glass bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-accent"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="md" variant="secondary" onClick={() => guardar()} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar brief"}
        </Button>
        <Button size="md" onClick={() => guardar(!campana?.aprobado)} disabled={guardando}>
          {campana?.aprobado ? "Quitar aprobación" : "Marcar como aprobado por el cliente"}
        </Button>
      </div>
    </div>
  );
}
