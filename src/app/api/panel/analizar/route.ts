import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AnalisisIASchema } from "@/lib/panel/ia/schema";
import { construirPromptAnalisis } from "@/lib/panel/ia/prompt";
import { resumenRespuestasFiltro, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import { monedaDesdePais } from "@/lib/panel/paises";
import type { Prospecto } from "@/lib/panel/prospectos";
import type { RespuestasDiagnosticoLargo } from "@/lib/panel/diagnosticoLargo";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Falta configurar ANTHROPIC_API_KEY en el servidor" },
      { status: 500 },
    );
  }

  const {
    prospectoId,
    pdfsRedes,
  }: { prospectoId: string; pdfsRedes?: { nombre: string; base64: string }[] } = await request.json();
  if (!prospectoId) {
    return NextResponse.json({ error: "Falta el prospecto" }, { status: 400 });
  }

  const documentosRedes = (pdfsRedes ?? []).slice(0, 5);
  for (const doc of documentosRedes) {
    if (!doc.base64 || doc.base64.length > 15_000_000) {
      return NextResponse.json(
        { error: `El archivo "${doc.nombre}" no es válido o es demasiado pesado (máx. ~10 MB).` },
        { status: 400 },
      );
    }
  }

  const { data: prospecto } = await supabase
    .from("prospectos")
    .select("*")
    .eq("id", prospectoId)
    .maybeSingle<Prospecto>();

  if (!prospecto) {
    return NextResponse.json({ error: "Prospecto no encontrado" }, { status: 404 });
  }

  const { data: diagnostico } = await supabase
    .from("diagnostico_respuestas")
    .select("respuestas")
    .eq("prospecto_id", prospectoId)
    .maybeSingle<{ respuestas: RespuestasDiagnosticoLargo }>();

  if (!diagnostico) {
    return NextResponse.json(
      { error: "Este prospecto todavía no tiene un Diagnóstico guardado" },
      { status: 400 },
    );
  }

  const { data: filtro } = await supabase
    .from("filtro_respuestas")
    .select("respuestas")
    .eq("prospecto_id", prospectoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ respuestas: RespuestasFiltro }>();

  const resumenFiltro = filtro
    ? resumenRespuestasFiltro(filtro.respuestas, monedaDesdePais(prospecto.pais))
    : [];

  const { system, mensaje } = construirPromptAnalisis({
    nombreProspecto: prospecto.nombre,
    empresa: prospecto.empresa,
    tipoNegocio: prospecto.tipo_negocio,
    redesSociales: prospecto.redes_sociales,
    resumenFiltro,
    respuestasDiagnostico: diagnostico.respuestas,
    cantidadPdfsRedes: documentosRedes.length,
  });

  const client = new Anthropic();

  const contenidoMensaje: Anthropic.Messages.MessageParam["content"] = [
    { type: "text", text: mensaje },
    ...documentosRedes.map((doc) => ({
      type: "document" as const,
      source: { type: "base64" as const, media_type: "application/pdf" as const, data: doc.base64 },
      title: doc.nombre,
    })),
  ];

  let parsed;
  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 16000,
      system,
      messages: [{ role: "user", content: contenidoMensaje }],
      output_config: { format: zodOutputFormat(AnalisisIASchema) },
    });
    parsed = { analisis: response.parsed_output, modelo: response.model };
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error llamando a la IA" },
      { status: 502 },
    );
  }

  if (!parsed.analisis) {
    return NextResponse.json({ error: "La IA no devolvió un análisis válido" }, { status: 502 });
  }

  const { count } = await supabase
    .from("analisis_ia")
    .select("id", { count: "exact", head: true })
    .eq("prospecto_id", prospectoId);

  const { data: fila, error: errorInsert } = await supabase
    .from("analisis_ia")
    .insert({
      prospecto_id: prospectoId,
      version: (count ?? 0) + 1,
      generado_por_ia: parsed.analisis,
      contenido_editado: parsed.analisis,
      modelo: parsed.modelo,
    })
    .select()
    .single();

  if (errorInsert) {
    return NextResponse.json({ error: errorInsert.message }, { status: 500 });
  }

  await supabase.from("prospectos").update({ paso_actual: "analisis" }).eq("id", prospectoId);

  return NextResponse.json({ ok: true, analisis: fila });
}
