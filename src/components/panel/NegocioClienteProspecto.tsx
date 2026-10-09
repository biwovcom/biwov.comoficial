"use client";

import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  DATOS_A_PEDIR_AL_CLIENTE,
  DATOS_QUE_NO_SE_PIDEN,
  DATOS_QUE_TU_SACAS,
  calcularComparacionNegocio,
  type NegocioCliente,
  type NegocioHistorialEntrada,
} from "@/lib/panel/negocioCliente";
import type { RedHistorialEntrada } from "@/lib/panel/redesHistorial";
import { cn } from "@/lib/utils";

function ChecklistDatos() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="rounded-xl border border-border-glass bg-white/[0.02] p-4">
      <button type="button" onClick={() => setAbierto((v) => !v)} className="flex w-full items-center justify-between gap-2">
        <span className="text-sm font-semibold text-white">¿Qué le pido al cliente y qué saco yo sola?</span>
        <ChevronDown size={16} className={cn("text-text-secondary transition-transform", abierto && "rotate-180")} />
      </button>
      {abierto && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Sí le puedes pedir al cliente
            </p>
            <div className="space-y-2">
              {DATOS_A_PEDIR_AL_CLIENTE.map((d) => (
                <p key={d.campo} className="text-xs text-text-secondary">
                  <span className="font-semibold text-white">{d.campo}:</span> &ldquo;{d.pregunta}&rdquo;
                  <br />
                  <span className="text-text-secondary/80">{d.porque}</span>
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-300">
              No se lo pidas (te pasarías de la raya)
            </p>
            <ul className="space-y-1">
              {DATOS_QUE_NO_SE_PIDEN.map((d) => (
                <li key={d} className="text-xs text-text-secondary">
                  • {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
              Esto lo sacas tú sola (pestaña Redes y crecimiento)
            </p>
            <ul className="space-y-1">
              {DATOS_QUE_TU_SACAS.map((d) => (
                <li key={d} className="text-xs text-text-secondary">
                  • {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function fmt(valor: number | null, unidad = "") {
  if (valor === null || Number.isNaN(valor)) return "—";
  return `${valor.toLocaleString("es-CO", { maximumFractionDigits: 1 })}${unidad}`;
}

function ResumenRecorrido({
  base,
  ultima,
  redes,
}: {
  base: NegocioCliente | null;
  ultima: NegocioHistorialEntrada | null;
  redes: RedHistorialEntrada[];
}) {
  if (!base && !ultima) return null;
  const c = calcularComparacionNegocio(base, ultima);

  const redesOrdenadas = [...redes].sort((a, b) => (a.fecha < b.fecha ? -1 : 1));
  const primeraRed = redesOrdenadas[0] ?? null;
  const ultimaRed = redesOrdenadas[redesOrdenadas.length - 1] ?? null;
  const crecimientoAlcance =
    primeraRed?.alcance_promedio && ultimaRed?.alcance_promedio && primeraRed.id !== ultimaRed.id
      ? ((ultimaRed.alcance_promedio - primeraRed.alcance_promedio) / primeraRed.alcance_promedio) * 100
      : null;
  const crecimientoSeguidores =
    primeraRed?.seguidores && ultimaRed?.seguidores && primeraRed.id !== ultimaRed.id
      ? ((ultimaRed.seguidores - primeraRed.seguidores) / primeraRed.seguidores) * 100
      : null;

  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Resumen del recorrido: cómo empezó vs. cómo va
      </p>
      {base?.fecha_inicio && (
        <p className="mt-1 text-xs text-text-secondary">
          Trabajando juntos desde el {new Date(`${base.fecha_inicio}T00:00:00`).toLocaleDateString("es-CO")}.
        </p>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-xs text-text-secondary">Clientes</p>
          <p className="mt-0.5 text-sm font-semibold text-white">
            {fmt(base?.clientes_linea_base ?? null)} → {fmt(ultima?.clientes_actuales ?? null)}
          </p>
          {c.crecimientoClientesPct !== null && (
            <p className={cn("text-xs font-medium", c.crecimientoClientesPct >= 0 ? "text-emerald-300" : "text-red-300")}>
              {c.crecimientoClientesPct >= 0 ? "+" : ""}
              {fmt(c.crecimientoClientesPct, "%")}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-xs text-text-secondary">Ventas al mes</p>
          <p className="mt-0.5 text-sm font-semibold text-white">
            {fmt(base?.ventas_mensuales_linea_base ?? null)} → {fmt(ultima?.ventas_mensuales ?? null)}
          </p>
          {c.crecimientoVentasPct !== null && (
            <p className={cn("text-xs font-medium", c.crecimientoVentasPct >= 0 ? "text-emerald-300" : "text-red-300")}>
              {c.crecimientoVentasPct >= 0 ? "+" : ""}
              {fmt(c.crecimientoVentasPct, "%")}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-white/[0.03] p-3">
          <p className="text-xs text-text-secondary">Ingreso mensual estimado</p>
          <p className="mt-0.5 text-sm font-semibold text-white">
            {fmt(c.ingresoMensualEstimadoBase)} → {fmt(c.ingresoMensualEstimadoActual)}
          </p>
        </div>
        {c.roiAproximadoPct !== null && (
          <div className="rounded-lg bg-white/[0.03] p-3">
            <p className="text-xs text-text-secondary">ROI aproximado (clientes nuevos)</p>
            <p className={cn("mt-0.5 text-sm font-semibold", c.roiAproximadoPct >= 0 ? "text-emerald-300" : "text-red-300")}>
              {c.roiAproximadoPct >= 0 ? "+" : ""}
              {fmt(c.roiAproximadoPct, "%")}
            </p>
          </div>
        )}
        {crecimientoAlcance !== null && (
          <div className="rounded-lg bg-white/[0.03] p-3">
            <p className="text-xs text-text-secondary">Alcance en redes</p>
            <p className={cn("mt-0.5 text-sm font-semibold", crecimientoAlcance >= 0 ? "text-emerald-300" : "text-red-300")}>
              {crecimientoAlcance >= 0 ? "+" : ""}
              {fmt(crecimientoAlcance, "%")}
            </p>
          </div>
        )}
        {crecimientoSeguidores !== null && (
          <div className="rounded-lg bg-white/[0.03] p-3">
            <p className="text-xs text-text-secondary">Seguidores</p>
            <p className={cn("mt-0.5 text-sm font-semibold", crecimientoSeguidores >= 0 ? "text-emerald-300" : "text-red-300")}>
              {crecimientoSeguidores >= 0 ? "+" : ""}
              {fmt(crecimientoSeguidores, "%")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FormularioBase({
  prospectoId,
  base,
  onGuardado,
}: {
  prospectoId: string;
  base: NegocioCliente | null;
  onGuardado: (base: NegocioCliente) => void;
}) {
  const [fechaInicio, setFechaInicio] = useState(base?.fecha_inicio ?? "");
  const [clientes, setClientes] = useState(base?.clientes_linea_base?.toString() ?? "");
  const [ventas, setVentas] = useState(base?.ventas_mensuales_linea_base?.toString() ?? "");
  const [ticket, setTicket] = useState(base?.ticket_promedio_linea_base?.toString() ?? "");
  const [moneda, setMoneda] = useState<"COP" | "USD">(base?.moneda ?? "COP");
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    const res = await fetch("/api/panel/negocio-cliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prospectoId,
        fechaInicio: fechaInicio || null,
        clientesLineaBase: clientes ? Number(clientes) : null,
        ventasMensualesLineaBase: ventas ? Number(ventas) : null,
        ticketPromedioLineaBase: ticket ? Number(ticket) : null,
        moneda,
      }),
    });
    setGuardando(false);
    if (!res.ok) {
      window.alert("No se pudo guardar.");
      return;
    }
    const data = await res.json();
    onGuardado(data.base);
  };

  return (
    <div className="rounded-xl border border-dashed border-border-glass p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Línea base — cómo estaba el negocio al empezar
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label>Fecha de inicio</Label>
          <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        </div>
        <div>
          <Label>Moneda</Label>
          <Select value={moneda} onChange={(e) => setMoneda(e.target.value as "COP" | "USD")}>
            <option value="COP">COP</option>
            <option value="USD">USD</option>
          </Select>
        </div>
        <div>
          <Label>Clientes al empezar</Label>
          <Input type="number" value={clientes} onChange={(e) => setClientes(e.target.value)} />
        </div>
        <div>
          <Label>Ventas mensuales al empezar</Label>
          <Input type="number" value={ventas} onChange={(e) => setVentas(e.target.value)} />
        </div>
        <div>
          <Label>Ticket promedio al empezar</Label>
          <Input type="number" value={ticket} onChange={(e) => setTicket(e.target.value)} />
        </div>
      </div>
      <Button size="md" className="mt-3" onClick={guardar} disabled={guardando}>
        {guardando ? "Guardando..." : "Guardar línea base"}
      </Button>
    </div>
  );
}

function FormularioHistorial({
  prospectoId,
  monedaSugerida,
  onAgregado,
}: {
  prospectoId: string;
  monedaSugerida: "COP" | "USD";
  onAgregado: (entrada: NegocioHistorialEntrada) => void;
}) {
  const [mostrar, setMostrar] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [clientes, setClientes] = useState("");
  const [ventas, setVentas] = useState("");
  const [ticket, setTicket] = useState("");
  const [costoPorCliente, setCostoPorCliente] = useState("");
  const [moneda, setMoneda] = useState<"COP" | "USD">(monedaSugerida);
  const [enviando, setEnviando] = useState(false);

  const agregar = async () => {
    setEnviando(true);
    const res = await fetch("/api/panel/negocio-historial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prospectoId,
        fecha,
        clientesActuales: clientes ? Number(clientes) : null,
        ventasMensuales: ventas ? Number(ventas) : null,
        ticketPromedio: ticket ? Number(ticket) : null,
        costoPorCliente: costoPorCliente ? Number(costoPorCliente) : null,
        moneda,
      }),
    });
    setEnviando(false);
    if (!res.ok) {
      window.alert("No se pudo guardar.");
      return;
    }
    const data = await res.json();
    onAgregado(data.entrada);
    setMostrar(false);
    setClientes("");
    setVentas("");
    setTicket("");
    setCostoPorCliente("");
  };

  if (!mostrar) {
    return (
      <Button size="md" onClick={() => setMostrar(true)}>
        <Plus size={15} /> Agregar actualización
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-border-glass p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label>Fecha</Label>
          <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div>
          <Label>Moneda</Label>
          <Select value={moneda} onChange={(e) => setMoneda(e.target.value as "COP" | "USD")}>
            <option value="COP">COP</option>
            <option value="USD">USD</option>
          </Select>
        </div>
        <div>
          <Label>Clientes actuales</Label>
          <Input type="number" value={clientes} onChange={(e) => setClientes(e.target.value)} />
        </div>
        <div>
          <Label>Ventas mensuales</Label>
          <Input type="number" value={ventas} onChange={(e) => setVentas(e.target.value)} />
        </div>
        <div>
          <Label>Ticket promedio</Label>
          <Input type="number" value={ticket} onChange={(e) => setTicket(e.target.value)} />
        </div>
        <div>
          <Label>Costo por cliente nuevo (opcional)</Label>
          <Input type="number" value={costoPorCliente} onChange={(e) => setCostoPorCliente(e.target.value)} />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="md" onClick={agregar} disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar actualización"}
        </Button>
        <Button size="md" variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

export function NegocioClienteProspecto({
  prospectoId,
  baseInicial,
  historialInicial,
  redesHistorial,
}: {
  prospectoId: string;
  baseInicial: NegocioCliente | null;
  historialInicial: NegocioHistorialEntrada[];
  redesHistorial: RedHistorialEntrada[];
}) {
  const [base, setBase] = useState(baseInicial);
  const [historial, setHistorial] = useState(
    [...historialInicial].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
  );

  const eliminar = async (id: string) => {
    const confirmado = window.confirm("¿Eliminar esta actualización?");
    if (!confirmado) return;
    const res = await fetch(`/api/panel/negocio-historial?id=${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setHistorial((prev) => prev.filter((e) => e.id !== id));
  };

  const ultima = historial[0] ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Negocio del cliente</h2>
        <p className="mt-1 text-xs text-text-secondary">
          Datos reales del negocio del cliente, para comparar cómo estaba al empezar contra cómo va, y que los
          resultados que le muestres sean coherentes con lo que de verdad está pasando.
        </p>
      </div>

      <ChecklistDatos />

      <ResumenRecorrido base={base} ultima={ultima} redes={redesHistorial} />

      <FormularioBase prospectoId={prospectoId} base={base} onGuardado={setBase} />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Historial de actualizaciones
        </p>
        <FormularioHistorial
          prospectoId={prospectoId}
          monedaSugerida={base?.moneda ?? "COP"}
          onAgregado={(nueva) => setHistorial((prev) => [nueva, ...prev])}
        />
        <div className="mt-3 space-y-2">
          {historial.length === 0 && (
            <p className="text-sm text-text-secondary">Todavía no hay actualizaciones registradas.</p>
          )}
          {historial.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] p-3">
              <div className="text-sm text-white/90">
                <span className="font-semibold">{new Date(`${e.fecha}T00:00:00`).toLocaleDateString("es-CO")}</span>
                {" · "}
                {fmt(e.clientes_actuales)} clientes · {fmt(e.ventas_mensuales)} ventas/mes · ticket {fmt(e.ticket_promedio)}
              </div>
              <button
                type="button"
                onClick={() => eliminar(e.id)}
                aria-label="Eliminar"
                className="text-text-secondary hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
