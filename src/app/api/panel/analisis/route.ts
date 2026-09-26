import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AnalisisIA } from "@/lib/panel/ia/schema";

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: { analisisId: string; contenidoEditado: AnalisisIA; aprobar?: boolean } =
    await request.json();

  if (!body.analisisId) {
    return NextResponse.json({ error: "Falta el análisis" }, { status: 400 });
  }

  const { error } = await supabase
    .from("analisis_ia")
    .update({
      contenido_editado: body.contenidoEditado,
      editado_en: new Date().toISOString(),
      editado_por: user.id,
      estado: body.aprobar ? "aprobado" : "borrador",
    })
    .eq("id", body.analisisId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
