import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getSupabaseClient } from "@/lib/supabase";
import { AnalisisRapidoSchema, construirPromptAnalisisRapido } from "@/lib/panel/ia/analisisRapido";
import { resumenRespuestasFiltro, type RespuestasFiltro } from "@/lib/panel/filtroRapido";
import { monedaDesdePais } from "@/lib/panel/paises";
import type { Prospecto } from "@/lib/panel/prospectos";

/**
 * Endpoint PÚBLICO: se llama justo después de que el visitante termina el
 * filtro rápido del sitio web ("Diagnóstico gratis"), para darle una
 * primera lectura real con IA (plan + extras reales) en vez de solo la
 * sugerencia estática. Usa la llave de servicio porque quien llama no
 * tiene sesión — igual que /api/diagnostico.
 */
export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 500 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Falta configurar ANTHROPIC_API_KEY en el servidor" }, { status: 500 });
  }

  const { prospectoId }: { prospectoId: string } = await request.json();
  if (!prospectoId) {
    return NextResponse.json({ error: "Falta el prospecto" }, { status: 400 });
  }

  const { data: prospecto } = await supabase
    .from("prospectos")
    .select("*")
    .eq("id", prospectoId)
    .maybeSingle<Prospecto>();
  if (!prospecto) {
    return NextResponse.json({ error: "Prospecto no encontrado" }, { status: 404 });
  }

  const { data: filtro } = await supabase
    .from("filtro_respuestas")
    .select("respuestas")
    .eq("prospecto_id", prospectoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ respuestas: RespuestasFiltro }>();
  if (!filtro) {
    return NextResponse.json({ error: "Este prospecto todavía no llenó el filtro rápido" }, { status: 400 });
  }

  const resumenFiltro = resumenRespuestasFiltro(filtro.respuestas, monedaDesdePais(prospecto.pais));

  const { system, mensaje } = construirPromptAnalisisRapido({
    nombreProspecto: prospecto.nombre,
    empresa: prospecto.empresa,
    redesSociales: prospecto.redes_sociales,
    resumenFiltro,
  });

  const client = new Anthropic();

  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 4000,
      system,
      messages: [{ role: "user", content: mensaje }],
      output_config: { format: zodOutputFormat(AnalisisRapidoSchema) },
    });
    if (!response.parsed_output) {
      return NextResponse.json({ error: "La IA no devolvió un análisis válido" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, analisis: response.parsed_output });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error llamando a la IA" },
      { status: 502 },
    );
  }
}
