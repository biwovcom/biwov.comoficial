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

  const body: {
    prospectoId?: string;
    categoria?: "creativo" | "embudo" | "analisis";
    tipo?: string;
    titulo?: string;
    contenido?: string;
    link?: string;
    fecha?: string;
    estado?: string;
    subcategoria?: string;
    etapaEmbudo?: string;
  } = await request.json().catch(() => ({}));

  const prospectoId = body.prospectoId?.trim();
  const categoria = body.categoria;
  const tipo = body.tipo?.trim();

  if (!prospectoId || !categoria || !tipo) {
    return NextResponse.json({ error: "Falta el prospecto, la categoría o el tipo" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("plan_creativos")
    .insert({
      prospecto_id: prospectoId,
      categoria,
      tipo,
      titulo: body.titulo?.trim() || null,
      contenido: body.contenido?.trim() || null,
      link: body.link?.trim() || null,
      fecha: body.fecha?.trim() || null,
      estado: body.estado?.trim() || "idea",
      subcategoria: body.subcategoria?.trim() || null,
      etapa_embudo: body.etapaEmbudo?.trim() || null,
    })
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

  const body: {
    id?: string;
    tipo?: string;
    titulo?: string;
    contenido?: string;
    link?: string;
    fecha?: string | null;
    estado?: string;
    subcategoria?: string | null;
    etapaEmbudo?: string | null;
    aprobado?: boolean;
  } = await request.json().catch(() => ({}));

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const cambios: Record<string, unknown> = {};
  if (body.tipo !== undefined) cambios.tipo = body.tipo.trim();
  if (body.titulo !== undefined) cambios.titulo = body.titulo.trim() || null;
  if (body.contenido !== undefined) cambios.contenido = body.contenido.trim() || null;
  if (body.link !== undefined) cambios.link = body.link.trim() || null;
  if (body.fecha !== undefined) cambios.fecha = body.fecha?.trim() || null;
  if (body.estado !== undefined) cambios.estado = body.estado;
  if (body.subcategoria !== undefined) cambios.subcategoria = body.subcategoria?.trim() || null;
  if (body.etapaEmbudo !== undefined) cambios.etapa_embudo = body.etapaEmbudo?.trim() || null;
  if (body.aprobado !== undefined) {
    cambios.aprobado = body.aprobado;
    cambios.aprobado_en = body.aprobado ? new Date().toISOString() : null;
    cambios.aprobado_por = body.aprobado ? user.id : null;
  }

  const { data, error } = await supabase
    .from("plan_creativos")
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

  const { error } = await supabase.from("plan_creativos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
