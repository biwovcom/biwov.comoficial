import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Prospecto } from "@/lib/panel/prospectos";
import type { RespuestasDiagnosticoLargo } from "@/lib/panel/diagnosticoLargo";
import { DiagnosticoForm } from "./DiagnosticoForm";

interface DiagnosticoFila {
  respuestas: RespuestasDiagnosticoLargo;
}

export default async function DiagnosticoPage({ params }: { params: Promise<{ id: string }> }) {
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
    .select("respuestas")
    .eq("prospecto_id", id)
    .maybeSingle<DiagnosticoFila>();

  return (
    <div>
      <Link
        href={`/panel/prospectos/${id}`}
        className="text-sm text-text-secondary hover:text-white"
      >
        ← Volver a {prospecto.nombre}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-white">Diagnóstico</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Llénalo mientras hablas con {prospecto.nombre}. Puedes dictar por voz, pegar texto
        transcrito o escribir directo — se guarda solo.
      </p>

      <div className="mt-8">
        <DiagnosticoForm prospectoId={id} respuestasIniciales={diagnostico?.respuestas ?? {}} />
      </div>
    </div>
  );
}
