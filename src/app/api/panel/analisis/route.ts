import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AnalisisIA } from "@/lib/panel/ia/schema";

/** Guarda un análisis pegado a mano desde claude.ai (sin usar la API de Anthropic). */
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: { prospectoId: string; textoManual: string } = await request.json();

  if (!body.prospectoId || !body.textoManual?.trim()) {
    return NextResponse.json({ error: "Falta el prospecto o el texto del análisis" }, { status: 400 });
  }

  const { count } = await supabase
    .from("analisis_ia")
    .select("id", { count: "exact", head: true })
    .eq("prospecto_id", body.prospectoId);

  const { data: fila, error } = await supabase
    .from("analisis_ia")
    .insert({
      prospecto_id: body.prospectoId,
      version: (count ?? 0) + 1,
      origen: "manual",
      texto_manual: body.textoManual.trim(),
      editado_por: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("prospectos").update({ paso_actual: "analisis" }).eq("id", body.prospectoId);

  return NextResponse.json({ ok: true, analisis: fila });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: {
    analisisId: string;
    contenidoEditado?: AnalisisIA;
    textoManual?: string;
    aprobar?: boolean;
  } = await request.json();

  if (!body.analisisId) {
    return NextResponse.json({ error: "Falta el análisis" }, { status: 400 });
  }

  const cambios: Record<string, unknown> = {
    editado_en: new Date().toISOString(),
    editado_por: user.id,
    estado: body.aprobar ? "aprobado" : "borrador",
  };
  if (body.contenidoEditado !== undefined) cambios.contenido_editado = body.contenidoEditado;
  if (body.textoManual !== undefined) cambios.texto_manual = body.textoManual;

  const { error } = await supabase.from("analisis_ia").update(cambios).eq("id", body.analisisId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
