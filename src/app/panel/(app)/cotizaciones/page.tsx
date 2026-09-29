import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  CONFIG_DEFAULT,
  type CostoProveedor,
  type CotizadorConfig,
  type TarifaBase,
} from "@/lib/panel/cotizador";
import { CotizadorEditor } from "./CotizadorEditor";

export const dynamic = "force-dynamic";

export default async function CotizacionesPage() {
  const supabase = await createSupabaseServerClient();

  const [configRes, costosRes, tarifasRes] = await Promise.all([
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
  ]);

  const error = configRes.error ?? costosRes.error ?? tarifasRes.error;
  if (error) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-white">Cotizaciones</h1>
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-300">
          No se pudieron cargar las tablas del cotizador ({error.message}). Corre la sección
          &quot;COTIZADOR&quot; de <code>supabase-schema-panel.sql</code> en el SQL Editor de Supabase.
        </p>
      </div>
    );
  }

  // Postgres "numeric" puede llegar como string: se normaliza a number aquí una sola vez.
  const config: CotizadorConfig = configRes.data
    ? {
        id: 1,
        trm: Number(configRes.data.trm),
        salario_deseado: Number(configRes.data.salario_deseado),
        costos_fijos_mes: Number(configRes.data.costos_fijos_mes),
        horas_facturables_mes: Number(configRes.data.horas_facturables_mes),
      }
    : CONFIG_DEFAULT;

  const costos = (costosRes.data ?? []).map((c) => ({ ...c, costo: Number(c.costo) }));
  const tarifas = (tarifasRes.data ?? []).map((t) => ({
    ...t,
    horas: Number(t.horas),
    precio_cliente: Number(t.precio_cliente),
    componentes: t.componentes ?? [],
  }));

  return <CotizadorEditor configInicial={config} costosIniciales={costos} tarifasIniciales={tarifas} />;
}
