import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface BodyEntrada {
  id?: string;
  prospectoId?: string;
  fecha?: string;
  clientesActuales?: number | null;
  ventasMensuales?: number | null;
  ticketPromedio?: number | null;
  costoPorCliente?: number | null;
  moneda?: "COP" | "USD" | null;
  notas?: string | null;
}

function mapearCambios(body: BodyEntrada): Record<string, unknown> {
  const cambios: Record<string, unknown> = {};
  if (body.fecha !== undefined) cambios.fecha = body.fecha;
  if (body.clientesActuales !== undefined) cambios.clientes_actuales = body.clientesActuales;
  if (body.ventasMensuales !== undefined) cambios.ventas_mensuales = body.ventasMensuales;
  if (body.ticketPromedio !== undefined) cambios.ticket_promedio = body.ticketPromedio;
  if (body.costoPorCliente !== undefined) cambios.costo_por_cliente = body.costoPorCliente;
  if (body.moneda !== undefined) cambios.moneda = body.moneda;
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

  const body: BodyEntrada = await request.json().catch(() => ({}));
  const prospectoId = body.prospectoId?.trim();
  if (!prospectoId) {
    return NextResponse.json({ error: "Falta el prospecto" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("negocio_historial")
    .insert({
      prospecto_id: prospectoId,
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

  const body: BodyEntrada = await request.json().catch(() => ({}));
  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("negocio_historial")
    .update(mapearCambios(body))
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

  const { error } = await supabase.from("negocio_historial").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
