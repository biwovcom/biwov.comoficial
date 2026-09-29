"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type InputHTMLAttributes } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import {
  aCOP,
  costoComponente,
  costoHora,
  desglosarTarifa,
  formatoCOP,
  formatoUSD,
  precioParaMargen,
  type ComponenteTarifa,
  type CostoProveedor,
  type CotizadorConfig,
  type Moneda,
  type TarifaBase,
} from "@/lib/panel/cotizador";

type EstadoGuardado = "idle" | "guardando" | "guardado" | "error";

interface Props {
  configInicial: CotizadorConfig;
  costosIniciales: CostoProveedor[];
  tarifasIniciales: TarifaBase[];
}

const SIN_GRUPO = "Sin grupo";

function nuevaKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

function num(valor: string): number {
  const n = parseFloat(valor);
  return Number.isFinite(n) ? n : 0;
}

function colorMargen(pct: number): string {
  if (pct < 0) return "text-red-400";
  if (pct < 30) return "text-amber-300";
  return "text-emerald-400";
}

function Campo({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border-glass bg-white/[0.03] px-2.5 py-1.5 text-sm text-white placeholder:text-text-secondary/50 outline-none transition-colors focus:border-accent",
        props.type === "number" && "text-right tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

function SelectMoneda({ value, onChange }: { value: Moneda; onChange: (m: Moneda) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Moneda)}
      className="rounded-lg border border-border-glass bg-bg-base px-2 py-1.5 text-sm text-white outline-none focus:border-accent"
    >
      <option value="COP">COP</option>
      <option value="USD">USD</option>
    </select>
  );
}

export function CotizadorEditor({ configInicial, costosIniciales, tarifasIniciales }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [config, setConfig] = useState(configInicial);
  const [costos, setCostos] = useState(costosIniciales);
  const [tarifas, setTarifas] = useState(tarifasIniciales);
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set());
  const [borradorPct, setBorradorPct] = useState<{ id: string; valor: string } | null>(null);
  const [estado, setEstado] = useState<EstadoGuardado>("idle");
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  // ---------- guardado automático (con espera corta para no escribir en cada tecla) ----------
  const temporizadores = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const pendientes = useRef(0);

  useEffect(() => {
    const mapa = temporizadores.current;
    return () => mapa.forEach((t) => clearTimeout(t));
  }, []);

  async function ejecutar(accion: () => PromiseLike<{ error: { message: string } | null }>) {
    pendientes.current += 1;
    setEstado("guardando");
    const { error } = await accion();
    pendientes.current -= 1;
    if (error) {
      setEstado("error");
      setMensajeError(error.message);
    } else if (pendientes.current === 0) {
      setEstado("guardado");
      setMensajeError(null);
    }
  }

  function guardarLuego(clave: string, accion: () => PromiseLike<{ error: { message: string } | null }>) {
    const previo = temporizadores.current.get(clave);
    if (previo) clearTimeout(previo);
    setEstado("guardando");
    temporizadores.current.set(
      clave,
      setTimeout(() => {
        temporizadores.current.delete(clave);
        void ejecutar(accion);
      }, 600),
    );
  }

  // ---------- configuración: TRM y mano de obra ----------
  function actualizarConfig(patch: Partial<CotizadorConfig>) {
    const siguiente = { ...config, ...patch };
    setConfig(siguiente);
    guardarLuego("config", () =>
      supabase
        .from("cotizador_config")
        .upsert({
          id: 1,
          trm: siguiente.trm,
          salario_deseado: siguiente.salario_deseado,
          costos_fijos_mes: siguiente.costos_fijos_mes,
          horas_facturables_mes: siguiente.horas_facturables_mes,
        }),
    );
  }

  const valorHora = costoHora(config);

  // ---------- proveedores y costos ----------
  function actualizarCosto(id: string, patch: Partial<CostoProveedor>) {
    const siguiente = costos.map((c) => (c.id === id ? { ...c, ...patch } : c));
    setCostos(siguiente);
    const fila = siguiente.find((c) => c.id === id)!;
    guardarLuego(`costo:${id}`, () =>
      supabase
        .from("cotizador_costos")
        .update({
          proveedor: fila.proveedor,
          contacto: fila.contacto,
          concepto: fila.concepto,
          unidad: fila.unidad,
          moneda: fila.moneda,
          costo: fila.costo,
        })
        .eq("id", id),
    );
  }

  async function agregarCosto() {
    const ultimo = costos[costos.length - 1];
    const orden = costos.reduce((max, c) => Math.max(max, c.orden), 0) + 1;
    setEstado("guardando");
    const { data, error } = await supabase
      .from("cotizador_costos")
      .insert({ proveedor: "", concepto: "", unidad: ultimo?.unidad ?? null, moneda: "COP", costo: 0, orden })
      .select()
      .single<CostoProveedor>();
    if (error || !data) {
      setEstado("error");
      setMensajeError(error?.message ?? "No se pudo agregar la fila.");
      return;
    }
    setCostos([...costos, { ...data, costo: Number(data.costo) }]);
    setEstado("guardado");
  }

  function tarifasQueUsan(costoId: string): TarifaBase[] {
    return tarifas.filter((t) =>
      t.componentes.some((c) => c.tipo === "proveedor" && c.costo_id === costoId),
    );
  }

  async function eliminarCosto(costo: CostoProveedor) {
    const afectadas = tarifasQueUsan(costo.id);
    const nombre = [costo.proveedor, costo.concepto].filter(Boolean).join(" — ") || "esta fila";
    const aviso =
      afectadas.length > 0
        ? `¿Eliminar ${nombre}? Se quitará también de ${afectadas.length} tarifa(s): ${afectadas
            .map((t) => t.servicio)
            .join(", ")}.`
        : `¿Eliminar ${nombre}?`;
    if (!window.confirm(aviso)) return;

    setCostos(costos.filter((c) => c.id !== costo.id));
    const tarifasLimpias = tarifas.map((t) =>
      afectadas.some((a) => a.id === t.id)
        ? {
            ...t,
            componentes: t.componentes.filter(
              (c) => !(c.tipo === "proveedor" && c.costo_id === costo.id),
            ),
          }
        : t,
    );
    setTarifas(tarifasLimpias);

    await ejecutar(() => supabase.from("cotizador_costos").delete().eq("id", costo.id));
    for (const t of tarifasLimpias.filter((t) => afectadas.some((a) => a.id === t.id))) {
      await ejecutar(() =>
        supabase.from("cotizador_tarifas").update({ componentes: t.componentes }).eq("id", t.id),
      );
    }
  }

  const proveedoresConocidos = useMemo(
    () => Array.from(new Set(costos.map((c) => c.proveedor.trim()).filter(Boolean))).sort(),
    [costos],
  );

  // ---------- tarifas base ----------
  function guardarTarifa(t: TarifaBase) {
    guardarLuego(`tarifa:${t.id}`, () =>
      supabase
        .from("cotizador_tarifas")
        .update({
          grupo: t.grupo,
          servicio: t.servicio,
          unidad: t.unidad,
          horas: t.horas,
          precio_cliente: t.precio_cliente,
          componentes: t.componentes,
        })
        .eq("id", t.id),
    );
  }

  function actualizarTarifa(id: string, patch: Partial<TarifaBase>) {
    const siguiente = tarifas.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setTarifas(siguiente);
    guardarTarifa(siguiente.find((t) => t.id === id)!);
  }

  function actualizarComponente(tarifa: TarifaBase, key: string, patch: Partial<ComponenteTarifa>) {
    actualizarTarifa(tarifa.id, {
      componentes: tarifa.componentes.map((c) =>
        c.key === key ? ({ ...c, ...patch } as ComponenteTarifa) : c,
      ),
    });
  }

  function agregarComponente(tarifa: TarifaBase, tipo: ComponenteTarifa["tipo"]) {
    const nuevo: ComponenteTarifa =
      tipo === "proveedor"
        ? { key: nuevaKey(), tipo, costo_id: costos[0]?.id ?? "", cantidad: 1 }
        : { key: nuevaKey(), tipo, descripcion: "", moneda: "COP", costo: 0, cantidad: 1 };
    actualizarTarifa(tarifa.id, { componentes: [...tarifa.componentes, nuevo] });
  }

  function quitarComponente(tarifa: TarifaBase, key: string) {
    actualizarTarifa(tarifa.id, { componentes: tarifa.componentes.filter((c) => c.key !== key) });
  }

  async function agregarTarifa(grupo: string | null) {
    const orden = tarifas.reduce((max, t) => Math.max(max, t.orden), 0) + 1;
    setEstado("guardando");
    const { data, error } = await supabase
      .from("cotizador_tarifas")
      .insert({ grupo, servicio: "", horas: 0, precio_cliente: 0, componentes: [], orden })
      .select()
      .single<TarifaBase>();
    if (error || !data) {
      setEstado("error");
      setMensajeError(error?.message ?? "No se pudo agregar la tarifa.");
      return;
    }
    setTarifas([...tarifas, { ...data, horas: 0, precio_cliente: 0, componentes: [] }]);
    setAbiertas(new Set(abiertas).add(data.id));
    setEstado("guardado");
  }

  async function eliminarTarifa(t: TarifaBase) {
    if (!window.confirm(`¿Eliminar la tarifa "${t.servicio || "sin nombre"}"?`)) return;
    setTarifas(tarifas.filter((x) => x.id !== t.id));
    await ejecutar(() => supabase.from("cotizador_tarifas").delete().eq("id", t.id));
  }

  function alternar(id: string) {
    const siguiente = new Set(abiertas);
    if (siguiente.has(id)) siguiente.delete(id);
    else siguiente.add(id);
    setAbiertas(siguiente);
  }

  const grupos = useMemo(() => {
    const mapa = new Map<string, TarifaBase[]>();
    for (const t of tarifas) {
      const g = t.grupo?.trim() || SIN_GRUPO;
      if (!mapa.has(g)) mapa.set(g, []);
      mapa.get(g)!.push(t);
    }
    return Array.from(mapa.entries());
  }, [tarifas]);

  const nombresGrupo = grupos.map(([g]) => g).filter((g) => g !== SIN_GRUPO);

  function etiquetaCosto(c: CostoProveedor): string {
    const valor = c.moneda === "USD" ? `US$${c.costo}` : formatoCOP(c.costo);
    return `${c.proveedor || "Sin proveedor"} — ${c.concepto || "sin concepto"} (${valor}${c.unidad ? " / " + c.unidad : ""})`;
  }

  // ---------- render ----------
  return (
    <div className="max-w-[1400px] space-y-12 pb-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Cotizaciones</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            Costos que te cobran tus proveedores y tus tarifas base. Todo se guarda solo y se recalcula al
            instante. Con estas tarifas vas a armar los paquetes.
          </p>
        </div>
        <span
          className={cn(
            "text-xs",
            estado === "error" ? "text-red-400" : estado === "guardado" ? "text-emerald-400" : "text-text-secondary",
          )}
        >
          {estado === "guardando" && "Guardando…"}
          {estado === "guardado" && "✓ Guardado"}
          {estado === "error" && `No se pudo guardar: ${mensajeError}`}
        </span>
      </header>

      {/* ===================== TRM + MANO DE OBRA ===================== */}
      <section className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="rounded-2xl border border-border-glass bg-white/[0.02] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">TRM de referencia</p>
          <p className="mt-1 text-xs text-text-secondary/70">COP por 1 USD. Convierte los costos en dólares.</p>
          <Campo
            type="number"
            min={1}
            step={10}
            className="mt-3 text-lg font-semibold text-accent"
            value={config.trm}
            onChange={(e) => actualizarConfig({ trm: num(e.target.value) })}
          />
        </div>

        <div className="rounded-2xl border border-border-glass bg-white/[0.02] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Tu mano de obra: cuánto vale 1 hora tuya
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-4">
            <label className="block text-xs text-text-secondary">
              Lo que quieres ganar al mes (tu salario)
              <Campo
                type="number"
                min={0}
                step={50000}
                className="mt-1"
                value={config.salario_deseado}
                onChange={(e) => actualizarConfig({ salario_deseado: num(e.target.value) })}
              />
            </label>
            <label className="block text-xs text-text-secondary">
              Costos fijos del negocio al mes (Claude Code, Canva, internet…)
              <Campo
                type="number"
                min={0}
                step={10000}
                className="mt-1"
                value={config.costos_fijos_mes}
                onChange={(e) => actualizarConfig({ costos_fijos_mes: num(e.target.value) })}
              />
            </label>
            <label className="block text-xs text-text-secondary">
              Horas que le cobras a clientes al mes
              <Campo
                type="number"
                min={1}
                step={1}
                className="mt-1"
                value={config.horas_facturables_mes}
                onChange={(e) => actualizarConfig({ horas_facturables_mes: num(e.target.value) })}
              />
            </label>
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
              <p className="text-xs text-text-secondary">Costo de tu hora</p>
              <p className="text-xl font-semibold tabular-nums text-accent">{formatoCOP(valorHora)}</p>
              <p className="text-xs text-text-secondary/70">≈ {formatoUSD(valorHora, config.trm)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-secondary/70">
            (Salario + costos fijos) ÷ horas facturables. Cuenta solo las horas que de verdad le cobras a un
            cliente: responder mensajes, vender y administrar también te toman tiempo y no se facturan. Cada
            tarifa suma tus horas × este valor como costo, así que el margen que ves es ganancia real del
            negocio, aparte de tu salario.
          </p>
        </div>
      </section>

      {/* ===================== PROVEEDORES Y COSTOS ===================== */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Proveedores y costos</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Solo lo que te cobran a ti. Si cambias un costo aquí, se actualizan todas las tarifas que lo usan.
            </p>
          </div>
          <button
            type="button"
            onClick={agregarCosto}
            className="flex items-center gap-2 rounded-full border border-border-glass bg-white/[0.03] px-4 py-2 text-sm text-white hover:border-accent/40"
          >
            <Plus size={16} /> Agregar costo
          </button>
        </div>

        <datalist id="lista-proveedores">
          {proveedoresConocidos.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-border-glass">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-3 py-3">Proveedor</th>
                <th className="px-3 py-3">Contacto</th>
                <th className="px-3 py-3">Concepto</th>
                <th className="px-3 py-3">Unidad</th>
                <th className="px-3 py-3">Moneda</th>
                <th className="px-3 py-3 text-right">Costo</th>
                <th className="px-3 py-3 text-right">En COP</th>
                <th className="px-3 py-3 text-right">Usado en</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {costos.length === 0 && (
                <tr className="border-t border-border-glass">
                  <td colSpan={9} className="px-3 py-8 text-center text-text-secondary">
                    Todavía no hay costos. Pulsa &quot;Agregar costo&quot;.
                  </td>
                </tr>
              )}
              {costos.map((c) => (
                <tr key={c.id} className="border-t border-border-glass">
                  <td className="px-3 py-2">
                    <Campo
                      list="lista-proveedores"
                      placeholder="Ej: Hostinger"
                      value={c.proveedor}
                      onChange={(e) => actualizarCosto(c.id, { proveedor: e.target.value })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Campo
                      placeholder="Teléfono / correo"
                      value={c.contacto ?? ""}
                      onChange={(e) => actualizarCosto(c.id, { contacto: e.target.value || null })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Campo
                      placeholder="Ej: Hosting anual"
                      value={c.concepto}
                      onChange={(e) => actualizarCosto(c.id, { concepto: e.target.value })}
                    />
                  </td>
                  <td className="w-28 px-3 py-2">
                    <Campo
                      placeholder="pieza, mes…"
                      value={c.unidad ?? ""}
                      onChange={(e) => actualizarCosto(c.id, { unidad: e.target.value || null })}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <SelectMoneda value={c.moneda} onChange={(moneda) => actualizarCosto(c.id, { moneda })} />
                  </td>
                  <td className="w-36 px-3 py-2">
                    <Campo
                      type="number"
                      min={0}
                      step={c.moneda === "USD" ? 1 : 1000}
                      value={c.costo}
                      onChange={(e) => actualizarCosto(c.id, { costo: num(e.target.value) })}
                    />
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                    {formatoCOP(aCOP(c.costo, c.moneda, config.trm))}
                  </td>
                  <td className="px-3 py-2 text-right text-text-secondary">
                    {tarifasQueUsan(c.id).length} tarifa(s)
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => eliminarCosto(c)}
                      className="rounded-lg p-1.5 text-text-secondary hover:bg-red-500/10 hover:text-red-400"
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================== TARIFAS BASE ===================== */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Tarifas base</h2>
            <p className="mt-1 max-w-3xl text-sm text-text-secondary">
              Abre cada servicio (▸) para ponerle sus costos: de tus proveedores o ítems manuales como dominio u
              hosting. Todo se suma junto con tus horas. Escribe el precio y el margen se calcula solo, o escribe
              el margen % y se calcula el precio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => agregarTarifa(null)}
            className="flex items-center gap-2 rounded-full border border-border-glass bg-white/[0.03] px-4 py-2 text-sm text-white hover:border-accent/40"
          >
            <Plus size={16} /> Agregar servicio
          </button>
        </div>

        <datalist id="lista-grupos">
          {nombresGrupo.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-border-glass">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="w-8 px-2 py-3" />
                <th className="px-3 py-3">Servicio</th>
                <th className="px-3 py-3">Unidad</th>
                <th className="px-3 py-3 text-right">Costos</th>
                <th className="px-3 py-3 text-right">Tus horas</th>
                <th className="px-3 py-3 text-right">Mano de obra</th>
                <th className="px-3 py-3 text-right">Costo total</th>
                <th className="px-3 py-3 text-right">Precio cliente</th>
                <th className="px-3 py-3 text-right">Margen</th>
                <th className="px-3 py-3 text-right">Margen %</th>
                <th className="px-3 py-3 text-right">USD</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {tarifas.length === 0 && (
                <tr className="border-t border-border-glass">
                  <td colSpan={12} className="px-3 py-8 text-center text-text-secondary">
                    Todavía no hay tarifas. Pulsa &quot;Agregar servicio&quot;.
                  </td>
                </tr>
              )}
              {grupos.map(([grupo, lista]) => (
                <Fragment key={grupo}>
                  <tr className="border-t border-border-glass bg-white/[0.04]">
                    <td colSpan={11} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-accent">
                      {grupo}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => agregarTarifa(grupo === SIN_GRUPO ? null : grupo)}
                        className="rounded-lg p-1 text-text-secondary hover:text-white"
                        title={`Agregar servicio en ${grupo}`}
                      >
                        <Plus size={15} />
                      </button>
                    </td>
                  </tr>
                  {lista.map((t) => {
                    const d = desglosarTarifa(t, costos, config);
                    const abierta = abiertas.has(t.id);
                    const pctMostrado =
                      borradorPct?.id === t.id ? borradorPct.valor : (Math.round(d.margenPct * 10) / 10).toString();
                    return (
                      <Fragment key={t.id}>
                        <tr className="border-t border-border-glass">
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => alternar(t.id)}
                              className="rounded-lg p-1 text-text-secondary hover:text-white"
                              title={abierta ? "Cerrar costos" : "Ver y editar costos"}
                            >
                              {abierta ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </td>
                          <td className="min-w-[240px] px-3 py-2">
                            <Campo
                              placeholder="Nombre del servicio"
                              value={t.servicio}
                              onChange={(e) => actualizarTarifa(t.id, { servicio: e.target.value })}
                            />
                          </td>
                          <td className="w-28 px-3 py-2">
                            <Campo
                              placeholder="mes, pieza…"
                              value={t.unidad ?? ""}
                              onChange={(e) => actualizarTarifa(t.id, { unidad: e.target.value || null })}
                            />
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                            <button type="button" onClick={() => alternar(t.id)} className="hover:text-white">
                              {formatoCOP(d.costoTerceros)}
                              <span className="block text-[11px] text-text-secondary/60">
                                {t.componentes.length} ítem(s)
                              </span>
                            </button>
                          </td>
                          <td className="w-24 px-3 py-2">
                            <Campo
                              type="number"
                              min={0}
                              step={0.5}
                              value={t.horas}
                              onChange={(e) => actualizarTarifa(t.id, { horas: num(e.target.value) })}
                            />
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                            {formatoCOP(d.costoManoObra)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium tabular-nums text-white">
                            {formatoCOP(d.costoTotal)}
                          </td>
                          <td className="w-36 px-3 py-2">
                            <Campo
                              type="number"
                              min={0}
                              step={1000}
                              className="font-semibold text-accent"
                              value={t.precio_cliente}
                              onChange={(e) => actualizarTarifa(t.id, { precio_cliente: num(e.target.value) })}
                            />
                          </td>
                          <td className={cn("px-3 py-2 text-right tabular-nums", colorMargen(d.margenPct))}>
                            {formatoCOP(d.margen)}
                          </td>
                          <td className="w-24 px-3 py-2">
                            <Campo
                              type="number"
                              max={99}
                              step={1}
                              className={colorMargen(d.margenPct)}
                              value={pctMostrado}
                              onFocus={() => setBorradorPct({ id: t.id, valor: pctMostrado })}
                              onBlur={() => setBorradorPct(null)}
                              onChange={(e) => {
                                setBorradorPct({ id: t.id, valor: e.target.value });
                                if (e.target.value === "" || e.target.value === "-") return;
                                actualizarTarifa(t.id, {
                                  precio_cliente: precioParaMargen(d.costoTotal, num(e.target.value)),
                                });
                              }}
                            />
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-text-secondary">
                            {formatoUSD(t.precio_cliente, config.trm)}
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => eliminarTarifa(t)}
                              className="rounded-lg p-1.5 text-text-secondary hover:bg-red-500/10 hover:text-red-400"
                              title="Eliminar servicio"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>

                        {abierta && (
                          <tr className="bg-white/[0.015]">
                            <td />
                            <td colSpan={11} className="px-3 pb-4 pt-1">
                              <div className="rounded-xl border border-border-glass p-4">
                                <div className="mb-3 flex flex-wrap items-center gap-3">
                                  <label className="flex items-center gap-2 text-xs text-text-secondary">
                                    Grupo
                                    <Campo
                                      list="lista-grupos"
                                      className="w-56"
                                      placeholder="Ej: Web, Contenido…"
                                      defaultValue={t.grupo ?? ""}
                                      onBlur={(e) => {
                                        const grupo = e.target.value.trim() || null;
                                        if (grupo !== (t.grupo ?? null)) actualizarTarifa(t.id, { grupo });
                                      }}
                                    />
                                  </label>
                                </div>

                                {t.componentes.length === 0 && (
                                  <p className="mb-3 text-xs text-text-secondary">
                                    Sin costos de terceros: solo cuenta tu mano de obra.
                                  </p>
                                )}

                                <div className="space-y-2">
                                  {t.componentes.map((c) => (
                                    <div key={c.key} className="flex flex-wrap items-center gap-2">
                                      {c.tipo === "proveedor" ? (
                                        <select
                                          value={c.costo_id}
                                          onChange={(e) => actualizarComponente(t, c.key, { costo_id: e.target.value })}
                                          className="min-w-[320px] flex-1 rounded-lg border border-border-glass bg-bg-base px-2.5 py-1.5 text-sm text-white outline-none focus:border-accent"
                                        >
                                          {!costos.some((x) => x.id === c.costo_id) && (
                                            <option value={c.costo_id}>— Elige un costo de proveedor —</option>
                                          )}
                                          {costos.map((x) => (
                                            <option key={x.id} value={x.id}>
                                              {etiquetaCosto(x)}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <>
                                          <Campo
                                            className="min-w-[220px] flex-1"
                                            placeholder="Ej: Dominio .com (1 año)"
                                            value={c.descripcion}
                                            onChange={(e) =>
                                              actualizarComponente(t, c.key, { descripcion: e.target.value })
                                            }
                                          />
                                          <SelectMoneda
                                            value={c.moneda}
                                            onChange={(moneda) => actualizarComponente(t, c.key, { moneda })}
                                          />
                                          <Campo
                                            type="number"
                                            min={0}
                                            step={c.moneda === "USD" ? 1 : 1000}
                                            className="w-32"
                                            title="Costo unitario"
                                            value={c.costo}
                                            onChange={(e) =>
                                              actualizarComponente(t, c.key, { costo: num(e.target.value) })
                                            }
                                          />
                                        </>
                                      )}
                                      <span className="text-xs text-text-secondary">×</span>
                                      <Campo
                                        type="number"
                                        min={0}
                                        step={1}
                                        className="w-20"
                                        title="Cantidad"
                                        value={c.cantidad}
                                        onChange={(e) =>
                                          actualizarComponente(t, c.key, { cantidad: num(e.target.value) })
                                        }
                                      />
                                      <span className="w-28 text-right text-sm tabular-nums text-white">
                                        {formatoCOP(costoComponente(c, costos, config.trm))}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => quitarComponente(t, c.key)}
                                        className="rounded-lg p-1.5 text-text-secondary hover:bg-red-500/10 hover:text-red-400"
                                        title="Quitar"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => agregarComponente(t, "proveedor")}
                                    disabled={costos.length === 0}
                                    className="flex items-center gap-1.5 rounded-full border border-border-glass px-3 py-1.5 text-xs text-white hover:border-accent/40 disabled:opacity-40"
                                  >
                                    <Plus size={13} /> Costo de proveedor
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => agregarComponente(t, "manual")}
                                    className="flex items-center gap-1.5 rounded-full border border-border-glass px-3 py-1.5 text-xs text-white hover:border-accent/40"
                                  >
                                    <Plus size={13} /> Ítem manual (dominio, hosting, licencia…)
                                  </button>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-border-glass pt-3 text-xs text-text-secondary">
                                  <span>
                                    Costos: <b className="text-white">{formatoCOP(d.costoTerceros)}</b>
                                  </span>
                                  <span>
                                    + Mano de obra ({t.horas} h × {formatoCOP(valorHora)}):{" "}
                                    <b className="text-white">{formatoCOP(d.costoManoObra)}</b>
                                  </span>
                                  <span>
                                    = Costo total: <b className="text-white">{formatoCOP(d.costoTotal)}</b>
                                  </span>
                                  <span>
                                    Precio para 50% de margen:{" "}
                                    <b className="text-accent">{formatoCOP(precioParaMargen(d.costoTotal, 50))}</b>
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-secondary/70">
          Margen: <span className="text-emerald-400">verde ≥ 30%</span> ·{" "}
          <span className="text-amber-300">amarillo 0–30%</span> · <span className="text-red-400">rojo = pierdes plata</span>.
        </p>
      </section>
    </div>
  );
}
