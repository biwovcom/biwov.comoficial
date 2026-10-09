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
    fecha?: string;
    redSocial?: string;
    seguidores?: number | null;
    alcancePromedio?: number | null;
    engagementRate?: number | null;
    notas?: string;
  } = await request.json().catch(() => ({}));

  const prospectoId = body.prospectoId?.trim();
  const redSocial = body.redSocial?.trim();

  if (!prospectoId || !redSocial) {
    return NextResponse.json({ error: "Falta el prospecto o la red social" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("redes_historial")
    .insert({
      prospecto_id: prospectoId,
      fecha: body.fecha || new Date().toISOString().slice(0, 10),
      red_social: redSocial,
      seguidores: body.seguidores ?? null,
      alcance_promedio: body.alcancePromedio ?? null,
      engagement_rate: body.engagementRate ?? null,
      notas: body.notas?.trim() || null,
    })
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

  const { error } = await supabase.from("redes_historial").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
