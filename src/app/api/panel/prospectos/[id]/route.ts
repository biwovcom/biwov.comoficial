import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Categoria, Seguimiento } from "@/lib/panel/prospectos";

const CATEGORIAS_VALIDAS: Categoria[] = ["contacto", "lead", "prospecto", "cliente"];
const SEGUIMIENTOS_VALIDOS: Seguimiento[] = ["pendiente_escribir", "pendiente_info", "interesado"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: { categoria?: Categoria; nichoMercado?: string; seguimiento?: Seguimiento | null } =
    await request.json();
  const patch: Record<string, string | null> = {};

  if (body.categoria !== undefined) {
    if (!CATEGORIAS_VALIDAS.includes(body.categoria)) {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
    }
    patch.categoria = body.categoria;
  }
  if (body.nichoMercado !== undefined) {
    patch.nicho_mercado = body.nichoMercado.trim() || null;
  }
  if (body.seguimiento !== undefined) {
    if (body.seguimiento !== null && !SEGUIMIENTOS_VALIDOS.includes(body.seguimiento)) {
      return NextResponse.json({ error: "Seguimiento inválido" }, { status: 400 });
    }
    patch.seguimiento = body.seguimiento;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("prospectos")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, prospecto: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // El filtro rápido y el diagnóstico se borran solos por "on delete cascade".
  const { error } = await supabase.from("prospectos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
