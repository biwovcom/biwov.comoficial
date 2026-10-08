import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Prospecto } from "@/lib/panel/prospectos";
import { AnalisisForm } from "./AnalisisForm";

export default async function AnalisisPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: diagnostico } = await supabase
    .from("diagnostico_respuestas")
    .select("id")
    .eq("prospecto_id", id)
    .maybeSingle();

  const { data: analisis } = await supabase
    .from("analisis_ia")
    .select("*")
    .eq("prospecto_id", id)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <Link
        href={`/panel/prospectos/${id}`}
        className="text-sm text-text-secondary hover:text-white print:hidden"
      >
        ← Volver a {prospecto.nombre}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-white print:hidden">Análisis con IA</h1>
      <p className="mt-1 text-sm text-text-secondary print:hidden">
        Analiza el diagnóstico de {prospecto.nombre} e identifica el cuello de botella de su
        negocio. Puedes editar cualquier parte antes de usarla en la propuesta.
      </p>

      <div className="mt-8">
        <AnalisisForm
          prospectoId={id}
          prospectoNombre={prospecto.nombre}
          empresa={prospecto.empresa}
          analisisInicial={analisis ?? null}
          diagnosticoDisponible={Boolean(diagnostico)}
        />
      </div>
    </div>
  );
}
