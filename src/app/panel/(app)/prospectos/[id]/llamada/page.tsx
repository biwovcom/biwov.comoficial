import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Prospecto } from "@/lib/panel/prospectos";
import type { RespuestasLlamada } from "@/lib/panel/llamada";
import { LlamadaForm } from "./LlamadaForm";

export default async function LlamadaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: prospecto } = await supabase
    .from("prospectos")
    .select("*")
    .eq("id", id)
    .maybeSingle<Prospecto>();

  if (!prospecto) {
    notFound();
  }

  const { data: llamada } = await supabase
    .from("llamada_respuestas")
    .select("respuestas")
    .eq("prospecto_id", id)
    .maybeSingle<{ respuestas: RespuestasLlamada }>();

  return (
    <div>
      <Link
        href={`/panel/prospectos/${id}`}
        className="text-sm text-text-secondary hover:text-white"
      >
        ← Volver a {prospecto.nombre}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-white">Preparar llamada</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Todo lo que necesitas para la llamada de 45 minutos con {prospecto.nombre}.
      </p>

      <div className="mt-8">
        <LlamadaForm
          prospectoId={id}
          linkRedesInicial={prospecto.link_redes_prospecto ?? ""}
          queQuiereResolverInicial={prospecto.que_quiere_resolver ?? ""}
          respuestasIniciales={llamada?.respuestas ?? {}}
        />
      </div>
    </div>
  );
}
