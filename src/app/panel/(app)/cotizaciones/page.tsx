import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cargarCotizador } from "@/lib/panel/cargarCotizador";
import { CotizadorEditor } from "./CotizadorEditor";

export const dynamic = "force-dynamic";

export default async function CotizacionesPage() {
  const supabase = await createSupabaseServerClient();
  const resultado = await cargarCotizador(supabase, false);

  if ("error" in resultado) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-white">Cotizaciones</h1>
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-300">
          No se pudieron cargar las tablas del cotizador ({resultado.error}). Corre la sección
          &quot;COTIZADOR&quot; de <code>supabase-schema-panel.sql</code> en el SQL Editor de Supabase.
        </p>
      </div>
    );
  }

  const { config, costos, tarifas } = resultado.datos;
  return <CotizadorEditor configInicial={config} costosIniciales={costos} tarifasIniciales={tarifas} />;
}
