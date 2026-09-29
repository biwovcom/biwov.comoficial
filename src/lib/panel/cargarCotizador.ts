import type { SupabaseClient } from "@supabase/supabase-js";
import {
  CONFIG_DEFAULT,
  type Aceptacion,
  type CostoProveedor,
  type CotizadorConfig,
  type Paquete,
  type TarifaBase,
} from "@/lib/panel/cotizador";

export interface DatosCotizador {
  config: CotizadorConfig;
  costos: CostoProveedor[];
  tarifas: TarifaBase[];
  paquetes: Paquete[];
  aceptaciones: Aceptacion[];
}

/**
 * Carga todo el cotizador de Supabase. Postgres "numeric" puede llegar como
 * string, así que se normaliza a number aquí una sola vez.
 * `conPaquetes` permite que Cotizaciones siga funcionando aunque la tabla de
 * paquetes todavía no exista.
 */
export async function cargarCotizador(
  supabase: SupabaseClient,
  conPaquetes: boolean,
): Promise<{ datos: DatosCotizador } | { error: string }> {
  const [configRes, costosRes, tarifasRes, paquetesRes, aceptacionesRes] = await Promise.all([
    supabase.from("cotizador_config").select("*").eq("id", 1).maybeSingle<CotizadorConfig>(),
    supabase
      .from("cotizador_costos")
      .select("*")
      .order("orden", { ascending: true })
      .order("created_at", { ascending: true })
      .returns<CostoProveedor[]>(),
    supabase
      .from("cotizador_tarifas")
      .select("*")
      .order("orden", { ascending: true })
      .order("created_at", { ascending: true })
      .returns<TarifaBase[]>(),
    conPaquetes
      ? supabase
          .from("cotizador_paquetes")
          .select("*")
          .order("orden", { ascending: true })
          .order("created_at", { ascending: true })
          .returns<Paquete[]>()
      : Promise.resolve({ data: [] as Paquete[], error: null }),
    conPaquetes
      ? supabase
          .from("cotizador_aceptaciones")
          .select("*")
          .order("created_at", { ascending: false })
          .returns<Aceptacion[]>()
      : Promise.resolve({ data: [] as Aceptacion[], error: null }),
  ]);

  const error =
    configRes.error ?? costosRes.error ?? tarifasRes.error ?? paquetesRes.error ?? aceptacionesRes.error;
  if (error) return { error: error.message };

  const config: CotizadorConfig = configRes.data
    ? {
        id: 1,
        trm: Number(configRes.data.trm),
        salario_deseado: Number(configRes.data.salario_deseado),
        costos_fijos_mes: Number(configRes.data.costos_fijos_mes),
        horas_facturables_mes: Number(configRes.data.horas_facturables_mes),
        descuentos_volumen: Array.isArray(configRes.data.descuentos_volumen)
          ? configRes.data.descuentos_volumen.map((t) => ({ min: Number(t.min), pct: Number(t.pct) }))
          : CONFIG_DEFAULT.descuentos_volumen,
      }
    : CONFIG_DEFAULT;

  return {
    datos: {
      config,
      costos: (costosRes.data ?? []).map((c) => ({ ...c, costo: Number(c.costo) })),
      tarifas: (tarifasRes.data ?? []).map((t) => ({
        ...t,
        horas: Number(t.horas),
        precio_cliente: Number(t.precio_cliente),
        componentes: t.componentes ?? [],
      })),
      paquetes: (paquetesRes.data ?? []).map((p) => ({
        ...p,
        precio_final: p.precio_final === null ? null : Number(p.precio_final),
        precio_usd: p.precio_usd == null ? null : Number(p.precio_usd),
        link_pago_cop: p.link_pago_cop ?? null,
        link_pago_usd: p.link_pago_usd ?? null,
        aplicar_descuento: p.aplicar_descuento ?? false,
        items: p.items ?? [],
      })),
      aceptaciones: (aceptacionesRes.data ?? []).map((a) => ({ ...a, monto: Number(a.monto) })),
    },
  };
}
