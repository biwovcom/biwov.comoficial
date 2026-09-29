import type { SupabaseClient } from "@supabase/supabase-js";
import { cargarCotizador } from "@/lib/panel/cargarCotizador";
import {
  calcularPaquete,
  itemsVisibles,
  linkPagoValido,
  precioUSDPaquete,
  type ItemVisible,
  type Paquete,
} from "@/lib/panel/cotizador";

/**
 * Lo único que ve el cliente de un paquete: nombres, cantidades y precios.
 * Nunca incluye costos, horas ni márgenes.
 */
export interface CotizacionPublica {
  id: string;
  nombre: string;
  descripcion: string | null;
  items: ItemVisible[];
  servicios: number;
  descuentoVolumenPct: number;
  cop: { total: number; sumaItems: number };
  usd: { total: number; sumaItems: number };
  linkPagoCop: string | null;
  linkPagoUsd: string | null;
}

/** Se usa con el cliente de Supabase con service role (página pública y API de aceptar). */
export async function cargarCotizacionPublica(
  supabase: SupabaseClient,
  paqueteId: string,
): Promise<CotizacionPublica | null> {
  if (!/^[0-9a-f-]{36}$/i.test(paqueteId)) return null;

  const resultado = await cargarCotizador(supabase, true);
  if ("error" in resultado) return null;
  const ctx = resultado.datos;
  const { config, paquetes } = ctx;

  const paquete: Paquete | undefined = paquetes.find((p) => p.id === paqueteId);
  if (!paquete) return null;

  const tot = calcularPaquete(paquete, ctx);
  const totalUsd = precioUSDPaquete(paquete, tot.precioFinal, config.trm);
  const sumaUsd = config.trm > 0 ? Math.round(tot.sumaItems / config.trm) : 0;

  return {
    id: paquete.id,
    nombre: paquete.nombre || "Propuesta biwov_",
    descripcion: paquete.descripcion,
    items: itemsVisibles(paquete, ctx),
    servicios: tot.servicios,
    descuentoVolumenPct: tot.descuentoVolumenPct,
    cop: { total: tot.precioFinal, sumaItems: tot.sumaItems },
    usd: { total: totalUsd, sumaItems: Math.max(sumaUsd, totalUsd) },
    linkPagoCop: linkPagoValido(paquete.link_pago_cop),
    linkPagoUsd: linkPagoValido(paquete.link_pago_usd),
  };
}
