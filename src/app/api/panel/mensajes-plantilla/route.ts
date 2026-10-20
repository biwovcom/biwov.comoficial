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

  const body: { etapa?: string; titulo?: string; contenido?: string } = await request
    .json()
    .catch(() => ({}));

  const etapa = body.etapa?.trim();
  const contenido = body.contenido?.trim();

  if (!etapa || !contenido) {
    return NextResponse.json({ error: "Falta la etapa o el contenido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("mensajes_plantilla")
    .insert({ etapa, titulo: body.titulo?.trim() || null, contenido })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, entrada: data });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: { id?: string; etapa?: string; titulo?: string; contenido?: string } = await request
    .json()
    .catch(() => ({}));

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const cambios: Record<string, unknown> = {};
  if (body.etapa !== undefined) cambios.etapa = body.etapa.trim();
  if (body.titulo !== undefined) cambios.titulo = body.titulo.trim() || null;
  if (body.contenido !== undefined) cambios.contenido = body.contenido.trim();

  const { data, error } = await supabase
    .from("mensajes_plantilla")
    .update(cambios)
    .eq("id", id)
    .select("*")
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

  const { error } = await supabase.from("mensajes_plantilla").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
