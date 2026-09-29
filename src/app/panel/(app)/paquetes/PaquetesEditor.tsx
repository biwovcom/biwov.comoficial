"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Plus, RotateCcw, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import { useAutoguardado } from "@/lib/panel/useAutoguardado";
import { Campo, EstadoGuardadoTexto, colorMargen, nuevaKey, num } from "@/components/panel/cotizador/Campos";
import {
  calcularPaquete,
  formatoCOP,
  formatoUSD,
  precioParaMargen,
  totalesItem,
  type CostoProveedor,
  type CotizadorConfig,
  type ItemPaquete,
  type Paquete,
  type TarifaBase,
} from "@/lib/panel/cotizador";

interface Props {
  config: CotizadorConfig;
  costos: CostoProveedor[];
  tarifas: TarifaBase[];
  paquetesIniciales: Paquete[];
}

const SIN_GRUPO = "Sin grupo";

export function PaquetesEditor({ config, costos, tarifas, paquetesIniciales }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [paquetes, setPaquetes] = useState(paquetesIniciales);
  const [borradorPct, setBorradorPct] = useState<{ id: string; valor: string } | null>(null);
  const { estado, mensajeError, setEstado, ejecutar, guardarLuego, fallo } = useAutoguardado();

  const tarifasPorGrupo = useMemo(() => {
    const mapa = new Map<string, TarifaBase[]>();
    for (const t of tarifas) {
      const g = t.grupo?.trim() || SIN_GRUPO;
      if (!mapa.has(g)) mapa.set(g, []);
      mapa.get(g)!.push(t);
    }
    return Array.from(mapa.entries());
  }, [tarifas]);

  function actualizarPaquete(id: string, patch: Partial<Paquete>) {
    const siguiente = paquetes.map((p) => (p.id === id ? { ...p, ...patch } : p));
    setPaquetes(siguiente);
    const p = siguiente.find((x) => x.id === id)!;
    guardarLuego(`paquete:${id}`, () =>
      supabase
        .from("cotizador_paquetes")
        .update({ nombre: p.nombre, descripcion: p.descripcion, items: p.items, precio_final: p.precio_final })
        .eq("id", id),
    );
  }

  function actualizarItem(p: Paquete, key: string, patch: Partial<ItemPaquete>) {
    actualizarPaquete(p.id, {
      items: p.items.map((i) => (i.key === key ? ({ ...i, ...patch } as ItemPaquete) : i)),
    });
  }

  function agregarItem(p: Paquete, tipo: ItemPaquete["tipo"]) {
    const nuevo: ItemPaquete =
      tipo === "tarifa"
        ? { key: nuevaKey(), tipo, tarifa_id: tarifas[0]?.id ?? "", cantidad: 1 }
        : { key: nuevaKey(), tipo, descripcion: "", costo: 0, precio: 0, cantidad: 1 };
    actualizarPaquete(p.id, { items: [...p.items, nuevo] });
  }

  function quitarItem(p: Paquete, key: string) {
    actualizarPaquete(p.id, { items: p.items.filter((i) => i.key !== key) });
  }

  async function crearPaquete(base?: Paquete) {
    const orden = paquetes.reduce((max, p) => Math.max(max, p.orden), 0) + 1;
    setEstado("guardando");
    const { data, error } = await supabase
      .from("cotizador_paquetes")
      .insert({
        nombre: base ? `${base.nombre} (copia)` : "",
        descripcion: base?.descripcion ?? null,
        items: base ? base.items.map((i) => ({ ...i, key: nuevaKey() })) : [],
        precio_final: base?.precio_final ?? null,
        orden,
      })
      .select()
      .single<Paquete>();
    if (error || !data) {
      fallo(error?.message ?? "No se pudo crear el paquete.");
      return;
    }
    setPaquetes([
      ...paquetes,
      { ...data, precio_final: data.precio_final === null ? null : Number(data.precio_final), items: data.items ?? [] },
    ]);
    setEstado("guardado");
  }

  async function eliminarPaquete(p: Paquete) {
    if (!window.confirm(`¿Eliminar el paquete "${p.nombre || "sin nombre"}"?`)) return;
    setPaquetes(paquetes.filter((x) => x.id !== p.id));
    await ejecutar(() => supabase.from("cotizador_paquetes").delete().eq("id", p.id));
  }

  return (
    <div className="max-w-[1400px] space-y-8 pb-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Paquetes</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            Arma paquetes combinando servicios de tus{" "}
            <Link href="/panel/cotizaciones" className="text-accent hover:underline">
              tarifas base
            </Link>{" "}
            (hosting, dominio, plantillas…) e ítems manuales. El total se suma solo. Si cambias un costo o una
            tarifa, los paquetes se actualizan.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <EstadoGuardadoTexto estado={estado} error={mensajeError} />
          <button
            type="button"
            onClick={() => crearPaquete()}
            className="flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-white"
          >
            <Plus size={16} /> Nuevo paquete
          </button>
        </div>
      </header>

      {paquetes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border-glass p-10 text-center text-sm text-text-secondary">
          Todavía no tienes paquetes. Pulsa &quot;Nuevo paquete&quot; para armar el primero.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {paquetes.map((p) => {
          const tot = calcularPaquete(p, tarifas, costos, config);
          const pctMostrado =
            borradorPct?.id === p.id ? borradorPct.valor : (Math.round(tot.margenPct * 10) / 10).toString();

          return (
            <div key={p.id} className="flex flex-col rounded-2xl border border-border-glass bg-white/[0.02] p-5">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Campo
                    className="text-base font-semibold"
                    placeholder="Nombre del paquete (ej: Web Emprendedor)"
                    value={p.nombre}
                    onChange={(e) => actualizarPaquete(p.id, { nombre: e.target.value })}
                  />
                  <textarea
                    rows={2}
                    placeholder="Descripción corta para el cliente (opcional)"
                    value={p.descripcion ?? ""}
                    onChange={(e) => actualizarPaquete(p.id, { descripcion: e.target.value || null })}
                    className="w-full resize-y rounded-lg border border-border-glass bg-white/[0.03] px-2.5 py-1.5 text-sm text-white placeholder:text-text-secondary/50 outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => crearPaquete(p)}
                  className="rounded-lg p-1.5 text-text-secondary hover:bg-white/[0.05] hover:text-white"
                  title="Duplicar (para armar versiones Básico / Pro / Premium)"
                >
                  <Copy size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => eliminarPaquete(p)}
                  className="rounded-lg p-1.5 text-text-secondary hover:bg-red-500/10 hover:text-red-400"
                  title="Eliminar paquete"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* ---------- ítems ---------- */}
              <div className="mt-4 space-y-2">
                {p.items.length === 0 && (
                  <p className="text-xs text-text-secondary">Agrega servicios con los botones de abajo.</p>
                )}
                {p.items.map((i) => {
                  const t = totalesItem(i, tarifas, costos, config);
                  return (
                    <div key={i.key} className="flex flex-wrap items-center gap-2">
                      {i.tipo === "tarifa" ? (
                        <select
                          value={i.tarifa_id}
                          onChange={(e) => actualizarItem(p, i.key, { tarifa_id: e.target.value })}
                          className="min-w-[240px] flex-1 rounded-lg border border-border-glass bg-bg-base px-2.5 py-1.5 text-sm text-white outline-none focus:border-accent"
                        >
                          {!tarifas.some((x) => x.id === i.tarifa_id) && (
                            <option value={i.tarifa_id}>— Servicio eliminado: elige otro —</option>
                          )}
                          {tarifasPorGrupo.map(([grupo, lista]) => (
                            <optgroup key={grupo} label={grupo}>
                              {lista.map((x) => (
                                <option key={x.id} value={x.id}>
                                  {x.servicio || "Sin nombre"} — {formatoCOP(x.precio_cliente)}
                                  {x.unidad ? ` / ${x.unidad}` : ""}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      ) : (
                        <>
                          <Campo
                            className="min-w-[160px] flex-1"
                            placeholder="Ej: Plantillas Canva"
                            value={i.descripcion}
                            onChange={(e) => actualizarItem(p, i.key, { descripcion: e.target.value })}
                          />
                          <Campo
                            type="number"
                            min={0}
                            step={1000}
                            className="w-28"
                            title="Lo que te cuesta a ti"
                            placeholder="Costo"
                            value={i.costo}
                            onChange={(e) => actualizarItem(p, i.key, { costo: num(e.target.value) })}
                          />
                          <Campo
                            type="number"
                            min={0}
                            step={1000}
                            className="w-28 text-accent"
                            title="Lo que le cobras al cliente"
                            placeholder="Precio"
                            value={i.precio}
                            onChange={(e) => actualizarItem(p, i.key, { precio: num(e.target.value) })}
                          />
                        </>
                      )}
                      <span className="text-xs text-text-secondary">×</span>
                      <Campo
                        type="number"
                        min={0}
                        step={1}
                        className="w-16"
                        title="Cantidad"
                        value={i.cantidad}
                        onChange={(e) => actualizarItem(p, i.key, { cantidad: num(e.target.value) })}
                      />
                      <span className="w-24 text-right text-sm tabular-nums text-white" title="Subtotal al cliente">
                        {formatoCOP(t.precio)}
                      </span>
                      <button
                        type="button"
                        onClick={() => quitarItem(p, i.key)}
                        className="rounded-lg p-1.5 text-text-secondary hover:bg-red-500/10 hover:text-red-400"
                        title="Quitar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => agregarItem(p, "tarifa")}
                  disabled={tarifas.length === 0}
                  className="flex items-center gap-1.5 rounded-full border border-border-glass px-3 py-1.5 text-xs text-white hover:border-accent/40 disabled:opacity-40"
                >
                  <Plus size={13} /> Servicio de tarifas base
                </button>
                <button
                  type="button"
                  onClick={() => agregarItem(p, "manual")}
                  className="flex items-center gap-1.5 rounded-full border border-border-glass px-3 py-1.5 text-xs text-white hover:border-accent/40"
                >
                  <Plus size={13} /> Ítem manual
                </button>
              </div>

              {/* ---------- totales ---------- */}
              <div className="mt-5 grid gap-3 border-t border-border-glass pt-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Suma de los servicios</span>
                    <span className="tabular-nums text-white">{formatoCOP(tot.sumaItems)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tu costo total (proveedores + tu hora)</span>
                    <span className="tabular-nums">{formatoCOP(tot.costoTotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Descuento vs. suma</span>
                    <span className={cn("tabular-nums", tot.descuentoPct < 0 && "text-emerald-400")}>
                      {tot.descuentoPct >= 0
                        ? `${Math.round(tot.descuentoPct * 10) / 10}%`
                        : `+${Math.round(-tot.descuentoPct * 10) / 10}% sobre la suma`}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tu ganancia</span>
                    <span className={cn("tabular-nums", colorMargen(tot.margenPct))}>{formatoCOP(tot.margen)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Precio del paquete</span>
                    {p.precio_final !== null && (
                      <button
                        type="button"
                        onClick={() => actualizarPaquete(p.id, { precio_final: null })}
                        className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-white"
                        title="Volver a cobrar la suma exacta de los servicios"
                      >
                        <RotateCcw size={11} /> usar la suma
                      </button>
                    )}
                  </div>
                  <Campo
                    type="number"
                    min={0}
                    step={1000}
                    className="mt-1 text-lg font-semibold text-accent"
                    value={tot.precioFinal}
                    onChange={(e) => actualizarPaquete(p.id, { precio_final: num(e.target.value) })}
                  />
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-text-secondary">
                    <span>≈ {formatoUSD(tot.precioFinal, config.trm)}</span>
                    <label className="flex items-center gap-1.5">
                      Margen %
                      <Campo
                        type="number"
                        max={99}
                        step={1}
                        className={cn("w-20", colorMargen(tot.margenPct))}
                        value={pctMostrado}
                        onFocus={() => setBorradorPct({ id: p.id, valor: pctMostrado })}
                        onBlur={() => setBorradorPct(null)}
                        onChange={(e) => {
                          setBorradorPct({ id: p.id, valor: e.target.value });
                          if (e.target.value === "" || e.target.value === "-") return;
                          actualizarPaquete(p.id, {
                            precio_final: precioParaMargen(tot.costoTotal, num(e.target.value)),
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
