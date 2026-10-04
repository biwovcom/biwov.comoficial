import { notFound } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/GlassCard";
import { monedaDesdePais } from "@/lib/panel/paises";
import type { Prospecto } from "@/lib/panel/prospectos";
import { DiagnosticoPublicoForm } from "./DiagnosticoPublicoForm";

export const dynamic = "force-dynamic";

export default async function DiagnosticoPublicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseClient();

  if (!supabase) {
    notFound();
  }

  const { data: prospecto } = await supabase
    .from("prospectos")
    .select("id, nombre, pais")
    .eq("id", id)
    .maybeSingle<Pick<Prospecto, "id" | "nombre" | "pais">>();

  if (!prospecto) {
    notFound();
  }

  const { data: filtroExistente } = await supabase
    .from("filtro_respuestas")
    .select("id")
    .eq("prospecto_id", id)
    .limit(1)
    .maybeSingle();

  const nombrePila = prospecto.nombre.split(" ")[0];

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-logo text-2xl font-semibold text-white">biwov</h1>
          <p className="mt-2 text-lg text-white">Diagnóstico inicial</p>
          <p className="mt-1 text-sm text-text-secondary">
            Hola {nombrePila}, responde estas preguntas para que podamos entender tu negocio y
            darte las recomendaciones correctas.
          </p>
        </div>

        {filtroExistente ? (
          <GlassCard className="p-8 text-center">
            <p className="text-2xl">✅</p>
            <h2 className="mt-3 text-lg font-semibold text-white">¡Ya recibimos tus respuestas!</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Gracias, {nombrePila}. Ya tenemos tu información y nos vamos a poner en contacto
              contigo pronto.
            </p>
          </GlassCard>
        ) : (
          <DiagnosticoPublicoForm prospectoId={prospecto.id} moneda={monedaDesdePais(prospecto.pais)} />
        )}
      </div>
    </div>
  );
}
