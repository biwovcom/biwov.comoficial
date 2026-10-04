import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NuevoRegistroTiempoInput } from "@/lib/panel/tiempo";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: NuevoRegistroTiempoInput = await request.json();

  if (!body.categoria?.trim() || !body.horas || body.horas <= 0) {
    return NextResponse.json({ error: "Categoría y horas son obligatorias" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("registros_tiempo")
    .insert({
      fecha: body.fecha || new Date().toISOString().slice(0, 10),
      categoria: body.categoria.trim(),
      proyecto: body.proyecto?.trim() || null,
      horas: body.horas,
      notas: body.notas?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, registro: data });
}
