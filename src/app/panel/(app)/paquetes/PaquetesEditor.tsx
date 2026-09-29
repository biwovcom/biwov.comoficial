"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Link2, MessageCircle, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import { useAutoguardado } from "@/lib/panel/useAutoguardado";
import { Campo, EstadoGuardadoTexto, colorMargen, nuevaKey, num } from "@/components/panel/cotizador/Campos";
import {
  calcularPaquete,
  contienePaquete,
  formatoCOP,
  itemsVisibles,
  precioParaMargen,
  precioUSDPaquete,
  totalesItem,
  type Aceptacion,
  type CostoProveedor,
  type ContextoCotizador,
  type CotizadorConfig,
  type ItemPaquete,
  type ItemVisible,
  type Paquete,
  type TarifaBase,
  type TramoDescuento,
} from "@/lib/panel/cotizador";

interface Props {
  configInicial: CotizadorConfig;
  costos: CostoProveedor[];
  tarifas: TarifaBase[];
  paquetesIniciales: Paquete[];
  aceptaciones: Aceptacion[];
}

const SIN_GRUPO = "Sin grupo";

function formatoUSDExacto(n: number): string {
  return "US$" + Math.round(n).toLocaleString("en-US");
}

/** Quita tildes para que "estrategia" encuentre "Estratégia" y viceversa. */
function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function PaquetesEditor({ configInicial, costos, tarifas, paquetesIniciales, aceptaciones }: Props) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [config, setConfig] = useState(configInicial);
  const [paquetes, setPaquetes] = useState(paquetesIniciales);
  const [verTramos, setVerTramos] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string | null>(paquetesIniciales[0]?.id ?? null);
  const [busqueda, setBusqueda] = useState("");
  const [borradorPct, setBorradorPct] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
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

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    if (!q) return paquetes;
    return paquetes.filter((p) => normalizar(`${p.nombre} ${p.descripcion ?? ""}`).includes(q));
  }, [paquetes, busqueda]);

  const p = paquetes.find((x) => x.id === seleccionado) ?? null;
  const ctx: ContextoCotizador = { config, costos, tarifas, paquetes };

  // ---------- guardado ----------
  function actualizarPaquete(id: string, patch: Partial<Paquete>) {
    const siguiente = paquetes.map((x) => (x.id === id ? { ...x, ...patch } : x));
    setPaquetes(siguiente);
    const fila = siguiente.find((x) => x.id === id)!;
    guardarLuego(`paquete:${id}`, () =>
      supabase
        .from("cotizador_paquetes")
        .update({
          nombre: fila.nombre,
          descripcion: fila.descripcion,
          items: fila.items,
          precio_final: fila.precio_final,
          precio_usd: fila.precio_usd,
          link_pago_cop: fila.link_pago_cop,
          link_pago_usd: fila.link_pago_usd,
          aplicar_descuento: fila.aplicar_descuento,
        })
        .eq("id", id),
    );
  }

  function actualizarItem(paq: Paquete, key: string, patch: Partial<ItemPaquete>) {
    actualizarPaquete(paq.id, {
      items: paq.items.map((i) => (i.key === key ? ({ ...i, ...patch } as ItemPaquete) : i)),
    });
  }

  function agregarItem(paq: Paquete, tipo: ItemPaquete["tipo"]) {
    const combinables = paquetesCombinables(paq);
    const nuevo: ItemPaquete =
      tipo === "tarifa"
        ? { key: nuevaKey(), tipo, tarifa_id: tarifas[0]?.id ?? "", cantidad: 1 }
        : tipo === "paquete"
          ? { key: nuevaKey(), tipo, paquete_id: combinables[0]?.id ?? "", cantidad: 1 }
          : { key: nuevaKey(), tipo, descripcion: "", costo: 0, precio: 0, cantidad: 1 };
    actualizarPaquete(paq.id, { items: [...paq.items, nuevo] });
  }

  /** Paquetes que se pueden meter dentro de `paq` sin crear un círculo (A dentro de B dentro de A). */
  function paquetesCombinables(paq: Paquete): Paquete[] {
    return paquetes.filter((x) => !contienePaquete(x.id, paq.id, paquetes));
  }

  function quitarItem(paq: Paquete, key: string) {
    actualizarPaquete(paq.id, { items: paq.items.filter((i) => i.key !== key) });
  }

  async function crearPaquete(base?: Paquete) {
    const orden = paquetes.reduce((max, x) => Math.max(max, x.orden), 0) + 1;
    setEstado("guardando");
    const { data, error } = await supabase
      .from("cotizador_paquetes")
      .insert({
        nombre: base ? `${base.nombre} (copia)` : "Paquete nuevo",
        descripcion: base?.descripcion ?? null,
        items: base ? base.items.map((i) => ({ ...i, key: nuevaKey() })) : [],
        precio_final: base?.precio_final ?? null,
        precio_usd: base?.precio_usd ?? null,
        link_pago_cop: null,
        link_pago_usd: null,
        aplicar_descuento: base?.aplicar_descuento ?? true,
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
      {
        ...data,
        precio_final: data.precio_final === null ? null : Number(data.precio_final),
        precio_usd: data.precio_usd == null ? null : Number(data.precio_usd),
        aplicar_descuento: data.aplicar_descuento ?? true,
        items: data.items ?? [],
      },
    ]);
    setSeleccionado(data.id);
    setBusqueda("");
    setEstado("guardado");
  }

  async function eliminarPaquete(paq: Paquete) {
    if (!window.confirm(`¿Eliminar el paquete "${paq.nombre || "sin nombre"}"?`)) return;
    const resto = paquetes.filter((x) => x.id !== paq.id);
    setPaquetes(resto);
    setSeleccionado(resto[0]?.id ?? null);
    await ejecutar(() => supabase.from("cotizador_paquetes").delete().eq("id", paq.id));
  }

  // ---------- envío al cliente ----------
  function linkCotizacion(paq: Paquete): string {
    return `${window.location.origin}/cotizacion/${paq.id}`;
  }

  function textoWhatsApp(paq: Paquete): string {
    const tot = calcularPaquete(paq, ctx);
    const usd = precioUSDPaquete(paq, tot.precioFinal, config.trm);
    const lineas = (items: ItemVisible[], sangria: string): string[] =>
      items.flatMap((i) => [
        `${sangria}• ${i.cantidad !== 1 ? `${i.cantidad} × ` : ""}${i.incluye.length ? `*${i.nombre}*` : i.nombre}`,
        ...lineas(i.incluye, sangria + "   "),
      ]);
    return [
      `¡Hola! 👋 Te comparto la propuesta *${paq.nombre || "biwov_"}*:`,
      paq.descripcion ? `\n${paq.descripcion}` : "",
      "",
      "*Incluye:*",
      ...lineas(itemsVisibles(paq, ctx), ""),
      "",
      tot.descuentoPct > 0 ? `Valor por separado: ~${formatoCOP(tot.sumaItems)}~` : "",
      `*Inversión:* ${formatoCOP(tot.precioFinal)} COP (o ${formatoUSDExacto(usd)} USD)`,
      tot.descuentoVolumenPct > 0
        ? `🎁 Incluye ${tot.descuentoVolumenPct}% de descuento por combinar ${tot.servicios} servicios.`
        : "",
      "",
      `Puedes verla y aceptarla aquí 👉 ${linkCotizacion(paq)}`,
    ]
      .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
      .join("\n");
  }

  // ---------- descuento por cantidad de servicios (configuración global) ----------
  function actualizarTramos(tramos: TramoDescuento[]) {
    setConfig({ ...config, descuentos_volumen: tramos });
    guardarLuego("tramos", () =>
      supabase.from("cotizador_config").update({ descuentos_volumen: tramos }).eq("id", 1),
    );
  }

  async function copiar(texto: string, cual: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(cual);
      setTimeout(() => setCopiado(null), 2000);
    } catch {
      window.prompt("Copia este texto:", texto);
    }
  }

  // ---------- render ----------
  return (
    <div className="max-w-[1400px] space-y-6 pb-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Paquetes</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            Arma paquetes con tus{" "}
            <Link href="/panel/cotizaciones" className="text-accent hover:underline">
              tarifas base
            </Link>{" "}
            e ítems manuales, y envíale al cliente un link para que lo acepte y pague en pesos o dólares.
          </p>
        </div>
        <EstadoGuardadoTexto estado={estado} error={mensajeError} />
      </header>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* ===================== LISTA CON BUSCADOR ===================== */}
        <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <button
            type="button"
            onClick={() => crearPaquete()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus size={16} /> Nuevo paquete
          </button>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <Campo
              className="py-2 pl-9"
              placeholder={`Buscar entre ${paquetes.length} paquete(s)…`}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="max-h-[65vh] space-y-1 overflow-y-auto pr-1">
            {filtrados.length === 0 && (
              <p className="px-2 py-4 text-center text-xs text-text-secondary">
                {paquetes.length === 0 ? "Todavía no hay paquetes." : "Ningún paquete coincide."}
              </p>
            )}
            {filtrados.map((x) => {
              const tot = calcularPaquete(x, ctx);
              const aceptadas = aceptaciones.filter((a) => a.paquete_id === x.id).length;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setSeleccionado(x.id)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                    x.id === seleccionado
                      ? "border-accent/50 bg-accent/10"
                      : "border-transparent hover:bg-white/[0.04]",
                  )}
                >
                  <span className="block truncate text-sm font-medium text-white">{x.nombre || "Sin nombre"}</span>
                  <span className="mt-0.5 flex items-center justify-between gap-2 text-xs text-text-secondary">
                    <span className="tabular-nums">{formatoCOP(tot.precioFinal)}</span>
                    <span className={colorMargen(tot.margenPct)}>{Math.round(tot.margenPct)}% margen</span>
                  </span>
                  {aceptadas > 0 && (
                    <span className="mt-1 block text-[11px] text-emerald-400">✓ {aceptadas} aceptación(es)</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ---------- tramos de descuento por cantidad ---------- */}
          <div className="rounded-2xl border border-border-glass bg-white/[0.02] p-3">
            <button
              type="button"
              onClick={() => setVerTramos(!verTramos)}
              className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-text-secondary hover:text-white"
            >
              Descuento por cantidad
              <span className="normal-case tracking-normal">{verTramos ? "cerrar" : "editar"}</span>
            </button>
            {!verTramos ? (
              <p className="mt-2 text-xs text-text-secondary">
                {config.descuentos_volumen.length === 0
                  ? "Sin descuentos configurados."
                  : [...config.descuentos_volumen]
                      .sort((a, b) => a.min - b.min)
                      .map((t) => `${t.min}+ servicios: ${t.pct}%`)
                      .join(" · ")}
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {config.descuentos_volumen.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-text-secondary">
                    Desde
                    <Campo
                      type="number"
                      min={1}
                      step={1}
                      className="w-14"
                      value={t.min}
                      onChange={(e) =>
                        actualizarTramos(
                          config.descuentos_volumen.map((x, j) => (j === idx ? { ...x, min: num(e.target.value) } : x)),
                        )
                      }
                    />
                    servicios
                    <Campo
                      type="number"
                      min={0}
                      max={90}
                      step={1}
                      className="w-14"
                      value={t.pct}
                      onChange={(e) =>
                        actualizarTramos(
                          config.descuentos_volumen.map((x, j) => (j === idx ? { ...x, pct: num(e.target.value) } : x)),
                        )
                      }
                    />
                    %
                    <button
                      type="button"
                      onClick={() => actualizarTramos(config.descuentos_volumen.filter((_, j) => j !== idx))}
                      className="ml-auto rounded p-1 hover:text-red-400"
                      title="Quitar tramo"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const ultimo = config.descuentos_volumen[config.descuentos_volumen.length - 1];
                    actualizarTramos([
                      ...config.descuentos_volumen,
                      { min: (ultimo?.min ?? 1) + 1, pct: (ultimo?.pct ?? 0) + 5 },
                    ]);
                  }}
                  className="flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  <Plus size={12} /> Agregar tramo
                </button>
                <p className="text-[11px] text-text-secondary/70">
                  Aplica a todos los paquetes que tengan activado el descuento. Cada línea del paquete cuenta como un
                  servicio (un paquete combinado cuenta como uno).
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ===================== EDITOR ===================== */}
        {!p ? (
          <div className="rounded-2xl border border-dashed border-border-glass p-10 text-center text-sm text-text-secondary">
            {paquetes.length === 0
              ? 'Pulsa "Nuevo paquete" para armar el primero.'
              : "Elige un paquete de la lista para editarlo."}
          </div>
        ) : (
          (() => {
            const tot = calcularPaquete(p, ctx);
            const usd = precioUSDPaquete(p, tot.precioFinal, config.trm);
            const pctMostrado = borradorPct ?? (Math.round(tot.margenPct * 10) / 10).toString();
            const aceptadasP = aceptaciones.filter((a) => a.paquete_id === p.id);

            return (
              <div className="space-y-6">
                <div className="rounded-2xl border border-border-glass bg-white/[0.02] p-5">
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
                      const t = totalesItem(i, ctx);
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
                          ) : i.tipo === "paquete" ? (
                            <select
                              value={i.paquete_id}
                              onChange={(e) => actualizarItem(p, i.key, { paquete_id: e.target.value })}
                              className="min-w-[240px] flex-1 rounded-lg border border-accent/40 bg-bg-base px-2.5 py-1.5 text-sm text-white outline-none focus:border-accent"
                            >
                              {!paquetesCombinables(p).some((x) => x.id === i.paquete_id) && (
                                <option value={i.paquete_id}>— Paquete eliminado: elige otro —</option>
                              )}
                              {paquetesCombinables(p).map((x) => (
                                <option key={x.id} value={x.id}>
                                  📦 {x.nombre || "Sin nombre"} — {formatoCOP(calcularPaquete(x, ctx).precioFinal)}
                                </option>
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
                      onClick={() => agregarItem(p, "paquete")}
                      disabled={paquetesCombinables(p).length === 0}
                      className="flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1.5 text-xs text-white hover:border-accent disabled:opacity-40"
                      title="Combina un paquete que ya armaste (ej: Landing + CRM)"
                    >
                      <Plus size={13} /> Otro paquete
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
                      <label className="flex items-center justify-between gap-2 text-text-secondary">
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={p.aplicar_descuento}
                            onChange={(e) => actualizarPaquete(p.id, { aplicar_descuento: e.target.checked })}
                            className="accent-[var(--accent)]"
                          />
                          Descuento por {tot.servicios} servicio{tot.servicios === 1 ? "" : "s"}
                        </span>
                        <span className="tabular-nums text-emerald-400">
                          {p.precio_final !== null
                            ? "precio manual"
                            : p.aplicar_descuento
                              ? `${tot.descuentoVolumenPct}%`
                              : "no aplica"}
                        </span>
                      </label>
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
                        <span className={cn("tabular-nums", colorMargen(tot.margenPct))}>
                          {formatoCOP(tot.margen)}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-accent/30 bg-accent/10 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">Precio en pesos (COP)</span>
                        {p.precio_final !== null && (
                          <button
                            type="button"
                            onClick={() => actualizarPaquete(p.id, { precio_final: null })}
                            className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-white"
                            title="Volver al precio automático (suma menos el descuento por cantidad)"
                          >
                            <RotateCcw size={11} /> precio automático
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
                        <span>Margen %</span>
                        <Campo
                          type="number"
                          max={99}
                          step={1}
                          className={cn("w-20", colorMargen(tot.margenPct))}
                          value={pctMostrado}
                          onFocus={() => setBorradorPct(pctMostrado)}
                          onBlur={() => setBorradorPct(null)}
                          onChange={(e) => {
                            setBorradorPct(e.target.value);
                            if (e.target.value === "" || e.target.value === "-") return;
                            actualizarPaquete(p.id, {
                              precio_final: precioParaMargen(tot.costoTotal, num(e.target.value)),
                            });
                          }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-accent/20 pt-2 text-xs text-text-secondary">
                        <span>Precio en dólares (USD)</span>
                        {p.precio_usd !== null && (
                          <button
                            type="button"
                            onClick={() => actualizarPaquete(p.id, { precio_usd: null })}
                            className="flex items-center gap-1 text-[11px] hover:text-white"
                            title={`Volver a calcularlo con la TRM (${formatoCOP(config.trm)})`}
                          >
                            <RotateCcw size={11} /> usar TRM
                          </button>
                        )}
                      </div>
                      <Campo
                        type="number"
                        min={0}
                        step={1}
                        className="mt-1 font-semibold text-accent"
                        value={usd}
                        onChange={(e) => actualizarPaquete(p.id, { precio_usd: num(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {/* ---------- enviar al cliente ---------- */}
                <div className="rounded-2xl border border-border-glass bg-white/[0.02] p-5">
                  <h2 className="text-base font-semibold text-white">Enviar al cliente</h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    El cliente ve el paquete (sin tus costos), elige pesos o dólares, lo acepta y lo enviamos al link
                    de pago de esa moneda. Crea los links en Bold, Wompi, Mercado Pago o PayPal por el valor del
                    paquete y pégalos aquí.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs text-text-secondary">
                      Link de pago en pesos ({formatoCOP(tot.precioFinal)})
                      <Campo
                        className="mt-1"
                        type="url"
                        placeholder="https://checkout.bold.co/…"
                        value={p.link_pago_cop ?? ""}
                        onChange={(e) => actualizarPaquete(p.id, { link_pago_cop: e.target.value.trim() || null })}
                      />
                    </label>
                    <label className="block text-xs text-text-secondary">
                      Link de pago en dólares ({formatoUSDExacto(usd)})
                      <Campo
                        className="mt-1"
                        type="url"
                        placeholder="https://paypal.me/…"
                        value={p.link_pago_usd ?? ""}
                        onChange={(e) => actualizarPaquete(p.id, { link_pago_usd: e.target.value.trim() || null })}
                      />
                    </label>
                  </div>
                  {(!p.link_pago_cop || !p.link_pago_usd) && (
                    <p className="mt-2 text-xs text-amber-300">
                      Sin link de pago en {!p.link_pago_cop && !p.link_pago_usd ? "ninguna moneda" : !p.link_pago_cop ? "pesos" : "dólares"}
                      : si el cliente acepta en esa moneda, queda registrado y le decimos que lo contactarás para el pago.
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copiar(textoWhatsApp(p), "whatsapp")}
                      className="flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-white"
                    >
                      <MessageCircle size={15} /> {copiado === "whatsapp" ? "¡Copiado!" : "Copiar mensaje para WhatsApp"}
                    </button>
                    <button
                      type="button"
                      onClick={() => copiar(linkCotizacion(p), "link")}
                      className="flex items-center gap-2 rounded-full border border-border-glass px-4 py-2 text-sm text-white hover:border-accent/40"
                    >
                      <Link2 size={15} /> {copiado === "link" ? "¡Copiado!" : "Copiar link"}
                    </button>
                    <a
                      href={`/cotizacion/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-border-glass px-4 py-2 text-sm text-white hover:border-accent/40"
                    >
                      <ExternalLink size={15} /> Ver como el cliente
                    </a>
                  </div>

                  {aceptadasP.length > 0 && (
                    <div className="mt-5 border-t border-border-glass pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                        Aceptaciones ({aceptadasP.length})
                      </p>
                      <ul className="mt-2 space-y-2">
                        {aceptadasP.map((a) => (
                          <li key={a.id} className="rounded-xl bg-white/[0.03] px-3 py-2 text-sm">
                            <span className="font-medium text-white">{a.nombre}</span>
                            {a.empresa && <span className="text-text-secondary"> · {a.empresa}</span>}
                            <span className="block text-xs text-text-secondary">
                              {new Date(a.created_at).toLocaleString("es-CO")} ·{" "}
                              {a.moneda === "USD" ? formatoUSDExacto(a.monto) : formatoCOP(a.monto)} {a.moneda}
                              {a.whatsapp && ` · ${a.whatsapp}`}
                              {a.email && ` · ${a.email}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[11px] text-text-secondary/70">
                        Aceptar no confirma el pago: verifica en tu pasarela que el pago haya entrado.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
