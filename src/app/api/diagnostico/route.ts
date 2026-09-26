import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { calcularSemaforo, respuestasCompletas, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import { monedaDesdePais } from "@/lib/panel/paises";
import type { Prospecto } from "@/lib/panel/prospectos";

/**
 * Endpoint PÚBLICO: lo llena el prospecto directamente, sin sesión. Usa la
 * llave de servicio (nunca sale al navegador) para escribir, ya que las
 * tablas del panel solo permiten escritura a usuarios autenticados por RLS.
 */
export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 500 });
  }

  const body: { prospectoId: string; respuestas: RespuestasFiltro } = await request.json();

  if (!body.prospectoId || !respuestasCompletas(body.respuestas)) {
    return NextResponse.json({ error: "Faltan respuestas" }, { status: 400 });
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

  return NextResponse.json({ ok: true });
}
