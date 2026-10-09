import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface BodyCampana {
  id?: string;
  prospectoId?: string;
  mes?: string;
  ticketPromedio?: number | null;
  moneda?: "COP" | "USD" | null;
  objetivoConversion?: string | null;
  presupuestoDiario?: number | null;
  presupuestoMensual?: number | null;
  cpaMaximo?: number | null;
  numConjuntos?: number | null;
  numCreativosObjetivo?: number | null;
  publico?: string | null;
  eventoCalificacion?: string | null;
  ofertaPrincipal?: string | null;
  objetivoMes?: string | null;
  resultadoMes?: string | null;
  aprobado?: boolean;
}

function mapearCambios(body: BodyCampana): Record<string, unknown> {
  const cambios: Record<string, unknown> = {};
  if (body.ticketPromedio !== undefined) cambios.ticket_promedio = body.ticketPromedio;
  if (body.moneda !== undefined) cambios.moneda = body.moneda;
  if (body.objetivoConversion !== undefined) cambios.objetivo_conversion = body.objetivoConversion;
  if (body.presupuestoDiario !== undefined) cambios.presupuesto_diario = body.presupuestoDiario;
  if (body.presupuestoMensual !== undefined) cambios.presupuesto_mensual = body.presupuestoMensual;
  if (body.cpaMaximo !== undefined) cambios.cpa_maximo = body.cpaMaximo;
  if (body.numConjuntos !== undefined) cambios.num_conjuntos = body.numConjuntos;
  if (body.numCreativosObjetivo !== undefined) cambios.num_creativos_objetivo = body.numCreativosObjetivo;
  if (body.publico !== undefined) cambios.publico = body.publico;
  if (body.eventoCalificacion !== undefined) cambios.evento_calificacion = body.eventoCalificacion;
  if (body.ofertaPrincipal !== undefined) cambios.oferta_principal = body.ofertaPrincipal;
  if (body.objetivoMes !== undefined) cambios.objetivo_mes = body.objetivoMes;
  if (body.resultadoMes !== undefined) cambios.resultado_mes = body.resultadoMes;
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

  const body: BodyCampana = await request.json().catch(() => ({}));
  const prospectoId = body.prospectoId?.trim();
  const mes = body.mes?.trim();

  if (!prospectoId || !mes) {
    return NextResponse.json({ error: "Falta el prospecto o el mes" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("plan_campanas")
    .upsert({ prospecto_id: prospectoId, mes, ...mapearCambios(body) }, { onConflict: "prospecto_id,mes" })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, campana: data });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: BodyCampana = await request.json().catch(() => ({}));
  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Falta el id" }, { status: 400 });
  }

  const cambios = mapearCambios(body);
  if (body.aprobado !== undefined) {
    cambios.aprobado = body.aprobado;
    cambios.aprobado_en = body.aprobado ? new Date().toISOString() : null;
    cambios.aprobado_por = body.aprobado ? user.id : null;
  }

  const { data, error } = await supabase
    .from("plan_campanas")
    .update(cambios)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, campana: data });
}
