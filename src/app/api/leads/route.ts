import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { guardarLeadLocal } from "@/lib/localStore";

export async function POST(request: Request) {
  const body = await request.json();

  const registro = {
    nombre: body.formulario?.nombre ?? null,
    empresa: body.formulario?.empresa ?? null,
    whatsapp: body.formulario?.whatsapp ?? null,
    email: body.formulario?.email ?? null,
    tipo_negocio: body.formulario?.tipoNegocio ?? null,
    trayectoria: body.formulario?.trayectoria ?? null,
    redes: body.formulario?.redes ?? null,
    seguidores: body.formulario?.seguidores ?? null,
    gestion_leads: body.formulario?.gestionLeads ?? null,
    branding_estado: body.formulario?.brandingEstado ?? null,
    objetivo: body.formulario?.objetivo ?? null,
    presupuesto: body.formulario?.presupuesto ?? null,
    urgencia: body.formulario?.urgencia ?? null,
    ecosistema_recomendado: body.ecosistemaRecomendado ?? null,
    canal: body.canal ?? null,
  };

  // Guardado local garantizado: siempre queda el registro aunque Supabase
  // no esté configurado todavía.
  guardarLeadLocal(registro);

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from("leads").insert(registro);
    if (error) {
      return NextResponse.json({ ok: true, persisted: "local", supabaseError: error.message });
    }
    return NextResponse.json({ ok: true, persisted: "supabase" });
  }

  return NextResponse.json({ ok: true, persisted: "local" });
}
