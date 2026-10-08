import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: { prospectoId?: string; parentId?: string; tipo?: string; contenido?: string } =
    await request.json().catch(() => ({}));

  const prospectoId = body.prospectoId?.trim();
  const parentId = body.parentId?.trim() || null;
  const tipo = body.tipo?.trim();
  const contenido = body.contenido?.trim();

  if (!prospectoId || !tipo || !contenido) {
    return NextResponse.json({ error: "Falta el tipo o el contenido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("prospecto_historial")
    .insert({ prospecto_id: prospectoId, parent_id: parentId, tipo, contenido })
    .select("id, prospecto_id, parent_id, tipo, contenido, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, entrada: data });
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const { error } = await supabase.from("prospecto_historial").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
