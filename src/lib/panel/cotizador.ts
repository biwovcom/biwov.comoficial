export type Moneda = "COP" | "USD";

/** Parámetros globales (fila única en cotizador_config). */
export interface CotizadorConfig {
  id: number;
  trm: number;
  salario_deseado: number;
  costos_fijos_mes: number;
  horas_facturables_mes: number;
  /** Descuento automático por cantidad de servicios en un paquete. */
  descuentos_volumen: TramoDescuento[];
}

/** "Desde `min` servicios, `pct`% de descuento". */
export interface TramoDescuento {
  min: number;
  pct: number;
}

/** Lo que un proveedor le cobra a biwov_ por un concepto. */
export interface CostoProveedor {
  id: string;
  proveedor: string;
  contacto: string | null;
  concepto: string;
  unidad: string | null;
  moneda: Moneda;
  costo: number;
  /** Qué incluye el plan / entregables / condiciones. */
  detalle: string | null;
  orden: number;
}

/**
 * Componente de costo de una tarifa: o apunta a un costo de proveedor
 * (se actualiza solo cuando cambia el proveedor) o es un ítem manual
 * (dominio, hosting, licencias...).
 */
export type ComponenteTarifa =
  | { key: string; tipo: "proveedor"; costo_id: string; cantidad: number }
  | { key: string; tipo: "manual"; descripcion: string; moneda: Moneda; costo: number; cantidad: number };

export interface TarifaBase {
  id: string;
  grupo: string | null;
  servicio: string;
  unidad: string | null;
  horas: number;
  precio_cliente: number;
  componentes: ComponenteTarifa[];
  orden: number;
}

/**
 * Ítem de un paquete: un servicio de las tarifas base, otro paquete completo
 * (para combinar, ej. Landing + CRM) o un ítem manual con costo y precio
 * propios. Tarifas y paquetes se actualizan solos si cambian.
 */
export type ItemPaquete =
  | { key: string; tipo: "tarifa"; tarifa_id: string; cantidad: number }
  | { key: string; tipo: "paquete"; paquete_id: string; cantidad: number }
  | { key: string; tipo: "manual"; descripcion: string; costo: number; precio: number; cantidad: number };

export interface Paquete {
  id: string;
  nombre: string;
  descripcion: string | null;
  items: ItemPaquete[];
  /** null = se cobra la suma de los ítems, sin descuento. */
  precio_final: number | null;
  /** null = se calcula con la TRM. */
  precio_usd: number | null;
  /** Links de pago (Bold, Wompi, Mercado Pago, PayPal…) a los que se envía al cliente al aceptar. */
  link_pago_cop: string | null;
  link_pago_usd: string | null;
  /** Aplica el descuento por cantidad de servicios de la configuración. */
  aplicar_descuento: boolean;
  orden: number;
}

/** Todo lo necesario para calcular un paquete (incluidos los paquetes que contiene). */
export interface ContextoCotizador {
  config: CotizadorConfig;
  costos: CostoProveedor[];
  tarifas: TarifaBase[];
  paquetes: Paquete[];
}

export interface Aceptacion {
  id: string;
  created_at: string;
  paquete_id: string;
  nombre: string;
  email: string | null;
  whatsapp: string | null;
  empresa: string | null;
  moneda: Moneda;
  monto: number;
}

export function precioUSDPaquete(paquete: Paquete, precioFinalCOP: number, trm: number): number {
  if (paquete.precio_usd !== null) return paquete.precio_usd;
  return trm > 0 ? Math.round(precioFinalCOP / trm) : 0;
}

/** Solo acepta links https, para no redirigir al cliente a cualquier cosa. */
export function linkPagoValido(link: string | null): string | null {
  if (!link) return null;
  try {
    const url = new URL(link.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const CONFIG_DEFAULT: CotizadorConfig = {
  id: 1,
  trm: 3900,
  salario_deseado: 2000000,
  costos_fijos_mes: 200000,
  horas_facturables_mes: 40,
  descuentos_volumen: [
    { min: 2, pct: 5 },
    { min: 3, pct: 10 },
    { min: 4, pct: 15 },
  ],
};

export function aCOP(valor: number, moneda: Moneda, trm: number): number {
  return moneda === "USD" ? valor * trm : valor;
}

/**
 * Costo real de 1 hora de Kathe: todo lo que el negocio tiene que cubrir
 * en el mes (tu salario + herramientas/suscripciones) repartido solo entre
 * las horas que de verdad se le pueden cobrar a un cliente.
 */
export function costoHora(config: CotizadorConfig): number {
  if (config.horas_facturables_mes <= 0) return 0;
  return (config.salario_deseado + config.costos_fijos_mes) / config.horas_facturables_mes;
}

export interface DesgloseTarifa {
  costoTerceros: number;
  costoManoObra: number;
  costoTotal: number;
  margen: number;
  margenPct: number;
}

export function desglosarTarifa(
  tarifa: TarifaBase,
  costos: CostoProveedor[],
  config: CotizadorConfig,
): DesgloseTarifa {
  const costoTerceros = tarifa.componentes.reduce(
    (suma, c) => suma + costoComponente(c, costos, config.trm),
    0,
  );
  const costoManoObra = tarifa.horas * costoHora(config);
  const costoTotal = costoTerceros + costoManoObra;
  const margen = tarifa.precio_cliente - costoTotal;
  const margenPct = tarifa.precio_cliente > 0 ? (margen / tarifa.precio_cliente) * 100 : 0;
  return { costoTerceros, costoManoObra, costoTotal, margen, margenPct };
}

export function costoComponente(c: ComponenteTarifa, costos: CostoProveedor[], trm: number): number {
  if (c.tipo === "manual") return aCOP(c.costo, c.moneda, trm) * c.cantidad;
  const costo = costos.find((x) => x.id === c.costo_id);
  return costo ? aCOP(costo.costo, costo.moneda, trm) * c.cantidad : 0;
}

export interface TotalesItem {
  costo: number;
  precio: number;
}

export function totalesItem(
  item: ItemPaquete,
  ctx: ContextoCotizador,
  visitados: Set<string> = new Set(),
): TotalesItem {
  if (item.tipo === "manual") {
    return { costo: item.costo * item.cantidad, precio: item.precio * item.cantidad };
  }
  if (item.tipo === "paquete") {
    const sub = ctx.paquetes.find((p) => p.id === item.paquete_id);
    if (!sub || visitados.has(sub.id)) return { costo: 0, precio: 0 };
    const t = calcularPaquete(sub, ctx, visitados);
    return { costo: t.costoTotal * item.cantidad, precio: t.precioFinal * item.cantidad };
  }
  const tarifa = ctx.tarifas.find((t) => t.id === item.tarifa_id);
  if (!tarifa) return { costo: 0, precio: 0 };
  const d = desglosarTarifa(tarifa, ctx.costos, ctx.config);
  return { costo: d.costoTotal * item.cantidad, precio: tarifa.precio_cliente * item.cantidad };
}

/** Cada línea del paquete cuenta como un servicio (un paquete incluido cuenta como uno). */
export function contarServicios(paquete: Paquete): number {
  return paquete.items.filter((i) => i.cantidad > 0).length;
}

/** El mayor % de los tramos que la cantidad de servicios alcanza. */
export function descuentoPorVolumen(tramos: TramoDescuento[], servicios: number): number {
  return tramos.reduce((mejor, t) => (servicios >= t.min && t.pct > mejor ? t.pct : mejor), 0);
}

/** ¿`paqueteId` contiene (directa o indirectamente) a `buscadoId`? Evita combinaciones circulares. */
export function contienePaquete(
  paqueteId: string,
  buscadoId: string,
  paquetes: Paquete[],
  visitados: Set<string> = new Set(),
): boolean {
  if (paqueteId === buscadoId) return true;
  if (visitados.has(paqueteId)) return false;
  visitados.add(paqueteId);
  const p = paquetes.find((x) => x.id === paqueteId);
  if (!p) return false;
  return p.items.some(
    (i) => i.tipo === "paquete" && contienePaquete(i.paquete_id, buscadoId, paquetes, visitados),
  );
}

export interface TotalesPaquete {
  costoTotal: number;
  /** Suma de los ítems antes de cualquier descuento. */
  sumaItems: number;
  servicios: number;
  /** % de descuento por cantidad de servicios (0 si no aplica o si hay precio manual). */
  descuentoVolumenPct: number;
  precioFinal: number;
  /** Descuento total real frente a la suma (automático o manual). */
  descuentoPct: number;
  margen: number;
  margenPct: number;
}

export function calcularPaquete(
  paquete: Paquete,
  ctx: ContextoCotizador,
  visitados: Set<string> = new Set(),
): TotalesPaquete {
  const conEste = new Set(visitados).add(paquete.id);
  let costoTotal = 0;
  let sumaItems = 0;
  for (const item of paquete.items) {
    const t = totalesItem(item, ctx, conEste);
    costoTotal += t.costo;
    sumaItems += t.precio;
  }
  const servicios = contarServicios(paquete);
  const descuentoVolumenPct =
    paquete.precio_final === null && paquete.aplicar_descuento
      ? descuentoPorVolumen(ctx.config.descuentos_volumen, servicios)
      : 0;
  const precioFinal =
    paquete.precio_final ??
    (descuentoVolumenPct > 0 ? Math.round((sumaItems * (1 - descuentoVolumenPct / 100)) / 1000) * 1000 : sumaItems);
  const margen = precioFinal - costoTotal;
  return {
    costoTotal,
    sumaItems,
    servicios,
    descuentoVolumenPct,
    precioFinal,
    descuentoPct: sumaItems > 0 ? ((sumaItems - precioFinal) / sumaItems) * 100 : 0,
    margen,
    margenPct: precioFinal > 0 ? (margen / precioFinal) * 100 : 0,
  };
}

export interface ItemVisible {
  nombre: string;
  cantidad: number;
  unidad: string | null;
  /** Si el ítem es un paquete combinado: lo que ese paquete incluye. */
  incluye: ItemVisible[];
}

/** Lo que el cliente ve de cada ítem (sin costos). Los paquetes combinados se despliegan. */
export function itemsVisibles(
  paquete: Paquete,
  ctx: ContextoCotizador,
  visitados: Set<string> = new Set(),
): ItemVisible[] {
  const conEste = new Set(visitados).add(paquete.id);
  return paquete.items.flatMap((i): ItemVisible[] => {
    if (i.tipo === "manual") {
      const nombre = i.descripcion.trim();
      return nombre ? [{ nombre, cantidad: i.cantidad, unidad: null, incluye: [] }] : [];
    }
    if (i.tipo === "paquete") {
      const sub = ctx.paquetes.find((p) => p.id === i.paquete_id);
      if (!sub || conEste.has(sub.id)) return [];
      return [{ nombre: sub.nombre || "Paquete", cantidad: i.cantidad, unidad: null, incluye: itemsVisibles(sub, ctx, conEste) }];
    }
    const t = ctx.tarifas.find((x) => x.id === i.tarifa_id);
    return t ? [{ nombre: t.servicio, cantidad: i.cantidad, unidad: t.unidad, incluye: [] }] : [];
  });
}

/** Precio que deja exactamente el margen % pedido (margen sobre precio de venta). */
export function precioParaMargen(costoTotal: number, margenPct: number): number {
  if (margenPct >= 100) return 0;
  return Math.round(costoTotal / (1 - margenPct / 100) / 1000) * 1000;
}

export function formatoCOP(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CO");
}

export function formatoUSD(n: number, trm: number): string {
  if (trm <= 0) return "—";
  return "US$" + Math.round(n / trm).toLocaleString("en-US");
}
