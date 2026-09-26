import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { RespuestasLlamada } from "@/lib/panel/llamada";

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
    respuestas: RespuestasLlamada;
    linkRedesProspecto?: string;
    queQuiereResolver?: string;
    completado?: boolean;
  } = await request.json();

  if (!body.prospectoId) {
    return NextResponse.json({ error: "Falta el prospecto" }, { status: 400 });
  }

  const { error: errorUpsert } = await supabase.from("llamada_respuestas").upsert(
    {
      prospecto_id: body.prospectoId,
      respuestas: body.respuestas,
      completado: Boolean(body.completado),
      ultima_actualizacion: new Date().toISOString(),
    },
    { onConflict: "prospecto_id" },
  );

  if (errorUpsert) {
    return NextResponse.json({ error: errorUpsert.message }, { status: 500 });
  }

  const cambiosProspecto: Record<string, unknown> = {};
  if (body.linkRedesProspecto !== undefined) cambiosProspecto.link_redes_prospecto = body.linkRedesProspecto;
  if (body.queQuiereResolver !== undefined) cambiosProspecto.que_quiere_resolver = body.queQuiereResolver;
  if (body.completado) cambiosProspecto.paso_actual = "llamada";

  if (Object.keys(cambiosProspecto).length > 0) {
    const { error: errorUpdate } = await supabase
      .from("prospectos")
      .update(cambiosProspecto)
      .eq("id", body.prospectoId);

    if (errorUpdate) {
      return NextResponse.json({ error: errorUpdate.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
