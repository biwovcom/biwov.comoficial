import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

/**
 * Endpoint PÚBLICO: crea el prospecto desde el botón "Agenda una asesoría"
 * del sitio, antes de pasar al filtro rápido. Usa la llave de servicio
 * porque quien llama no tiene sesión.
 */
export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 500 });
  }

  const body: {
    nombre: string;
    empresa?: string;
    redesSociales?: string;
    whatsapp: string;
    email: string;
    pais?: string;
    ciudad?: string;
  } = await request.json();

  if (!body.nombre?.trim() || !body.whatsapp?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Nombre, WhatsApp y correo son obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("prospectos")
    .insert({
      nombre: body.nombre.trim(),
      empresa: body.empresa?.trim() || null,
      redes_sociales: body.redesSociales?.trim() || null,
      whatsapp: body.whatsapp.trim(),
      email: body.email.trim(),
      pais: body.pais?.trim() || null,
      ciudad: body.ciudad?.trim() || null,
      canal_origen: "pagina-web",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, prospectoId: data.id });
}
