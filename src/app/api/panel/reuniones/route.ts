import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TareaReunion } from "@/lib/panel/reuniones";

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
    hora?: string;
    notas?: string;
    planTrabajo?: string;
    tareasCliente?: TareaReunion[];
    tareasKathe?: TareaReunion[];
  } = await request.json().catch(() => ({}));

  const prospectoId = body.prospectoId?.trim();
  if (!prospectoId) {
    return NextResponse.json({ error: "Falta el prospecto" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reuniones")
    .insert({
      prospecto_id: prospectoId,
      fecha: body.fecha || new Date().toISOString().slice(0, 10),
      hora: body.hora?.trim() || null,
      notas: body.notas?.trim() || null,
      plan_trabajo: body.planTrabajo?.trim() || null,
      tareas_cliente: body.tareasCliente ?? [],
      tareas_kathe: body.tareasKathe ?? [],
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, reunion: data });
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
    fecha?: string;
    hora?: string;
    notas?: string;
    planTrabajo?: string;
    tareasCliente?: TareaReunion[];
    tareasKathe?: TareaReunion[];
  } = await request.json().catch(() => ({}));

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const cambios: Record<string, unknown> = {};
  if (body.fecha !== undefined) cambios.fecha = body.fecha;
  if (body.hora !== undefined) cambios.hora = body.hora?.trim() || null;
  if (body.notas !== undefined) cambios.notas = body.notas.trim() || null;
  if (body.planTrabajo !== undefined) cambios.plan_trabajo = body.planTrabajo.trim() || null;
  if (body.tareasCliente !== undefined) cambios.tareas_cliente = body.tareasCliente;
  if (body.tareasKathe !== undefined) cambios.tareas_kathe = body.tareasKathe;

  const { data, error } = await supabase
    .from("reuniones")
    .update(cambios)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, reunion: data });
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

  const { error } = await supabase.from("reuniones").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
