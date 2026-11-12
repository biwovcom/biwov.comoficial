import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { documentosPorSlug } from "@/data/documentosClientes";

/**
 * Endpoint PÚBLICO del cuestionario de inicio (/documentos/<slug>/cuestionario).
 * Guarda las respuestas del cliente en el Historial de su prospecto en el
 * panel (tabla prospecto_historial), en UNA sola entrada que se va
 * actualizando mientras escribe. Solo escribe: nunca devuelve respuestas.
 */
const TIPO = "Cuestionario de inicio";
const MAX_RESP = 6000;

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Base de datos no configurada" }, { status: 500 });

  let body: { slug?: string; respuestas?: unknown; enviado?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const d = body.slug ? documentosPorSlug(body.slug) : undefined;
  if (!d || !d.prospectoId) return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });

  const preguntas = d.cuestionario.grupos.flatMap((g) => g.preguntas);
  if (!Array.isArray(body.respuestas) || body.respuestas.length !== preguntas.length) {
    return NextResponse.json({ error: "Respuestas inválidas" }, { status: 400 });
  }
  const resp = body.respuestas.map((r) => String(r ?? "").slice(0, MAX_RESP).trim());
  const respondidas = resp.filter(Boolean).length;
  if (!respondidas) return NextResponse.json({ ok: true, guardado: false });

  const ahora = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date());

  let n = 0;
  const bloques = d.cuestionario.grupos.map((g) => {
    const qs = g.preguntas.map((q) => {
      const i = n++;
      return `${i + 1}. ${q}\n→ ${resp[i] || "(sin responder)"}`;
    });
    return `■ ${g.titulo.toUpperCase()}\n\n${qs.join("\n\n")}`;
  });
  const estado = body.enviado ? "✅ ENVIADO por la clienta" : "✏️ En progreso (se guarda solo mientras escribe)";
  const contenido = `${estado} · ${respondidas} de ${preguntas.length} respondidas · última actualización: ${ahora}\n\n${bloques.join("\n\n")}`;

  const { data: existente } = await supabase
    .from("prospecto_historial")
    .select("id")
    .eq("prospecto_id", d.prospectoId)
    .eq("tipo", TIPO)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();

  const { error } = existente
    ? await supabase.from("prospecto_historial").update({ contenido }).eq("id", existente.id)
    : await supabase.from("prospecto_historial").insert({ prospecto_id: d.prospectoId, tipo: TIPO, contenido });

  if (error) return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  return NextResponse.json({ ok: true, guardado: true, respondidas });
}
