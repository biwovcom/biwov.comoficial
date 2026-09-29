export type Moneda = "COP" | "USD";

/** Parámetros globales (fila única en cotizador_config). */
export interface CotizadorConfig {
  id: number;
  trm: number;
  salario_deseado: number;
  costos_fijos_mes: number;
  horas_facturables_mes: number;
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

export const CONFIG_DEFAULT: CotizadorConfig = {
  id: 1,
  trm: 3900,
  salario_deseado: 2000000,
  costos_fijos_mes: 200000,
  horas_facturables_mes: 40,
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
