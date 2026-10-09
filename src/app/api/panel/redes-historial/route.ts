import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface BodyRed {
  id?: string;
  prospectoId?: string;
  fecha?: string;
  redSocial?: string;
  periodoDias?: number;
  seguidores?: number | null;
  seguidos?: number | null;
  alcancePromedio?: number | null;
  visualizaciones?: number | null;
  interacciones?: number | null;
  cuentasInteractuaron?: number | null;
  visitasPerfil?: number | null;
  sumaVistasPiezas?: number | null;
  numPiezas?: number | null;
  pctReels?: number | null;
  pctHistorias?: number | null;
  pctPublicaciones?: number | null;
  pctNoSeguidores?: number | null;
  notas?: string | null;
}

function mapearCambios(body: BodyRed): Record<string, unknown> {
  const cambios: Record<string, unknown> = {};
  if (body.fecha !== undefined) cambios.fecha = body.fecha;
  if (body.periodoDias !== undefined) cambios.periodo_dias = body.periodoDias;
  if (body.seguidores !== undefined) cambios.seguidores = body.seguidores;
  if (body.seguidos !== undefined) cambios.seguidos = body.seguidos;
  if (body.alcancePromedio !== undefined) cambios.alcance_promedio = body.alcancePromedio;
  if (body.visualizaciones !== undefined) cambios.visualizaciones = body.visualizaciones;
  if (body.interacciones !== undefined) cambios.interacciones = body.interacciones;
  if (body.cuentasInteractuaron !== undefined) cambios.cuentas_interactuaron = body.cuentasInteractuaron;
  if (body.visitasPerfil !== undefined) cambios.visitas_perfil = body.visitasPerfil;
  if (body.sumaVistasPiezas !== undefined) cambios.suma_vistas_piezas = body.sumaVistasPiezas;
  if (body.numPiezas !== undefined) cambios.num_piezas = body.numPiezas;
  if (body.pctReels !== undefined) cambios.pct_reels = body.pctReels;
  if (body.pctHistorias !== undefined) cambios.pct_historias = body.pctHistorias;
  if (body.pctPublicaciones !== undefined) cambios.pct_publicaciones = body.pctPublicaciones;
  if (body.pctNoSeguidores !== undefined) cambios.pct_no_seguidores = body.pctNoSeguidores;
  if (body.notas !== undefined) cambios.notas = body.notas?.trim() || null;
  return cambios;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: BodyRed = await request.json().catch(() => ({}));
  const prospectoId = body.prospectoId?.trim();
  const redSocial = body.redSocial?.trim();

  if (!prospectoId || !redSocial) {
    return NextResponse.json({ error: "Falta el prospecto o la red social" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("redes_historial")
    .insert({
      prospecto_id: prospectoId,
      red_social: redSocial,
      fecha: body.fecha || new Date().toISOString().slice(0, 10),
      ...mapearCambios(body),
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

  const body: BodyRed = await request.json().catch(() => ({}));
  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const cambios = mapearCambios(body);
  if (body.redSocial !== undefined) cambios.red_social = body.redSocial.trim();

  const { data, error } = await supabase
    .from("redes_historial")
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

  const { error } = await supabase.from("redes_historial").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
