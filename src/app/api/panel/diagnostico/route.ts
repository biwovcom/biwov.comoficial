import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { RespuestasDiagnosticoLargo } from "@/lib/panel/diagnosticoLargo";
import { BLOQUES_DIAGNOSTICO } from "@/lib/panel/diagnosticoLargo";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: {
    prospectoId: string;
    respuestas: RespuestasDiagnosticoLargo;
    completado?: boolean;
  } = await request.json();

  if (!body.prospectoId) {
    return NextResponse.json({ error: "Falta el prospecto" }, { status: 400 });
  }

  const bloquesCompletados = BLOQUES_DIAGNOSTICO.filter(
    (b) => (body.respuestas[b.id] ?? "").trim().length > 0,
  ).map((b) => b.id);

  const { error: errorUpsert } = await supabase.from("diagnostico_respuestas").upsert(
    {
      prospecto_id: body.prospectoId,
      respuestas: body.respuestas,
      bloques_completados: bloquesCompletados,
      completado: Boolean(body.completado),
      ultima_actualizacion: new Date().toISOString(),
    },
    { onConflict: "prospecto_id" },
  );

  if (errorUpsert) {
    return NextResponse.json({ error: errorUpsert.message }, { status: 500 });
  }

  if (body.completado) {
    const { error: errorUpdate } = await supabase
      .from("prospectos")
      .update({ paso_actual: "diagnostico" })
      .eq("id", body.prospectoId);

    if (errorUpdate) {
      return NextResponse.json({ error: errorUpdate.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
