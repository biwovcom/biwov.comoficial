import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { VERSION_CONTRATO } from "@/lib/contrato";
import { guardarContratoLocal } from "@/lib/localStore";

export async function POST(request: Request) {
  const body = await request.json();
  const acceptedAt = new Date().toISOString();

  const registro = {
    nombre: body.nombre ?? null,
    email: body.email ?? null,
    empresa: body.empresa ?? null,
    whatsapp: body.whatsapp ?? null,
    version_contrato: VERSION_CONTRATO,
    accepted_at: acceptedAt,
  };

  guardarContratoLocal(registro);

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from("contract_acceptances").insert(registro);
  }

  return NextResponse.json({ ok: true, acceptedAt, version: VERSION_CONTRATO });
}
