import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NuevoProspectoInput } from "@/lib/panel/prospectos";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: NuevoProspectoInput = await request.json();

  if (!body.nombre?.trim() || !body.whatsapp?.trim()) {
    return NextResponse.json({ error: "Nombre y WhatsApp son obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("prospectos")
    .insert({
      nombre: body.nombre.trim(),
      empresa: body.empresa?.trim() || null,
      redes_sociales: body.redesSociales?.trim() || null,
      whatsapp: body.whatsapp.trim(),
      email: body.email?.trim() || null,
      pais: body.pais || null,
      ciudad: body.ciudad?.trim() || null,
      canal_origen: body.canal_origen || null,
      notas: body.notas?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, prospecto: data });
}
