import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calcularSemaforo, respuestasCompletas, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import { monedaDesdePais } from "@/lib/panel/paises";
import type { Prospecto } from "@/lib/panel/prospectos";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body: { prospectoId: string; respuestas: RespuestasFiltro } = await request.json();

  if (!body.prospectoId || !respuestasCompletas(body.respuestas)) {
    return NextResponse.json({ error: "Faltan respuestas del filtro" }, { status: 400 });
  }

  const { data: prospecto, error: errorProspecto } = await supabase
    .from("prospectos")
    .select("*")
    .eq("id", body.prospectoId)
    .maybeSingle<Prospecto>();

  if (errorProspecto || !prospecto) {
    return NextResponse.json({ error: "Prospecto no encontrado" }, { status: 404 });
  }

  const moneda = monedaDesdePais(prospecto.pais);
  const { semaforo, razon } = calcularSemaforo(body.respuestas, moneda);

  const { error: errorInsert } = await supabase.from("filtro_respuestas").insert({
    prospecto_id: body.prospectoId,
    respuestas: body.respuestas,
    semaforo,
    razon,
  });

  if (errorInsert) {
    return NextResponse.json({ error: errorInsert.message }, { status: 500 });
  }

  const { error: errorUpdate } = await supabase
    .from("prospectos")
    .update({ paso_actual: "filtro", semaforo })
    .eq("id", body.prospectoId);

  if (errorUpdate) {
    return NextResponse.json({ error: errorUpdate.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, semaforo, razon, moneda });
}
