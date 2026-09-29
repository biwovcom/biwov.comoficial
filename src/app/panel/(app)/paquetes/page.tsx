import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cargarCotizador } from "@/lib/panel/cargarCotizador";
import { PaquetesEditor } from "./PaquetesEditor";

export const dynamic = "force-dynamic";

export default async function PaquetesPage() {
  const supabase = await createSupabaseServerClient();
  const resultado = await cargarCotizador(supabase, true);

  if ("error" in resultado) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-white">Paquetes</h1>
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-300">
          No se pudieron cargar los paquetes ({resultado.error}). Corre las secciones &quot;PAQUETES&quot; y &quot;ACEPTACIONES&quot; de{" "}
          <code>supabase-schema-panel.sql</code> en el SQL Editor de Supabase.
        </p>
      </div>
    );
  }

  const { config, costos, tarifas, paquetes, aceptaciones } = resultado.datos;
  return (
    <PaquetesEditor
      configInicial={config}
      costos={costos}
      tarifas={tarifas}
      paquetesIniciales={paquetes}
      aceptaciones={aceptaciones}
    />
  );
}
