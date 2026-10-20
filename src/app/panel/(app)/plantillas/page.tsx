import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MensajePlantilla } from "@/lib/panel/mensajesPlantilla";
import { PlantillasMensajes } from "@/components/panel/PlantillasMensajes";

export default async function PlantillasPage() {
  const supabase = await createSupabaseServerClient();

  const { data: plantillas } = await supabase
    .from("mensajes_plantilla")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<MensajePlantilla[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Plantillas y guiones</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Tus mensajes y preguntas de cada etapa, listos para copiar — desde el primer contacto en
        frío hasta el cierre — para no tener que improvisar en el chat ni en la llamada.
      </p>

      <div className="mt-6">
        <PlantillasMensajes entradasIniciales={plantillas ?? []} />
      </div>
    </div>
  );
}
