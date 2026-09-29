import type { SupabaseClient } from "@supabase/supabase-js";
import { cargarCotizador } from "@/lib/panel/cargarCotizador";
import { calcularPaquete, linkPagoValido, precioUSDPaquete, type Paquete } from "@/lib/panel/cotizador";

/**
 * Lo único que ve el cliente de un paquete: nombres, cantidades y precios.
 * Nunca incluye costos, horas ni márgenes.
 */
export interface CotizacionPublica {
  id: string;
  nombre: string;
  descripcion: string | null;
  items: { nombre: string; cantidad: number; unidad: string | null }[];
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
  const { config, costos, tarifas, paquetes } = resultado.datos;

  const paquete: Paquete | undefined = paquetes.find((p) => p.id === paqueteId);
  if (!paquete) return null;

  const tot = calcularPaquete(paquete, tarifas, costos, config);
  const totalUsd = precioUSDPaquete(paquete, tot.precioFinal, config.trm);
  const sumaUsd = config.trm > 0 ? Math.round(tot.sumaItems / config.trm) : 0;

  const items = paquete.items.flatMap((i) => {
    if (i.tipo === "manual") {
      return i.descripcion.trim() ? [{ nombre: i.descripcion.trim(), cantidad: i.cantidad, unidad: null }] : [];
    }
    const t = tarifas.find((x) => x.id === i.tarifa_id);
    return t ? [{ nombre: t.servicio, cantidad: i.cantidad, unidad: t.unidad }] : [];
  });

  return {
    id: paquete.id,
    nombre: paquete.nombre || "Propuesta biwov_",
    descripcion: paquete.descripcion,
    items,
    cop: { total: tot.precioFinal, sumaItems: tot.sumaItems },
    usd: { total: totalUsd, sumaItems: Math.max(sumaUsd, totalUsd) },
    linkPagoCop: linkPagoValido(paquete.link_pago_cop),
    linkPagoUsd: linkPagoValido(paquete.link_pago_usd),
  };
}
