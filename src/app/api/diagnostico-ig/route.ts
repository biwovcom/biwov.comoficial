import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { avisarKathe } from "@/lib/avisoTelegram";
import { leerCuentaIG, limpiarUsuario } from "@/lib/diagnosticoIG/instagram";
import { calcularMetricas, calcularPuntajes, metricasDesdeRespuestas, validarRespuestas } from "@/lib/diagnosticoIG/analizar";
import { generarDiagnosticoIA } from "@/lib/diagnosticoIG/ia";
import { diagnosticoPorReglas } from "@/lib/diagnosticoIG/reglas";
import { TIPO_HISTORIAL, type RegistroDiagnostico } from "@/lib/diagnosticoIG/registro";

/**
 * Endpoint PÚBLICO del embudo "Diagnóstico de Instagram gratis" (biwov.com/diagnostico-instagram).
 * 1) Guarda el contacto (base de datos: nombre, correo y WhatsApp) como lead en el panel.
 * 2) Lee la cuenta por la API de Meta y calcula métricas y puntajes reales.
 * 3) La IA escribe el diagnóstico (parte gratis + parte de pago, que queda bloqueada).
 * 4) Avisa a Kathe por Telegram. Devuelve el id del resultado.
 * Si todavía no hay token de Meta o la cuenta es personal, el contacto queda guardado igual y el diagnóstico se hace a mano.
 */
export const maxDuration = 300;

const soloDigitos = (s: string) => s.replace(/\D/g, "");

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "El servicio no está disponible. Intenta más tarde." }, { status: 500 });

  let body: { usuario?: string; nombre?: string; email?: string; whatsapp?: string; acepto?: boolean; respuestas?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const usuario = limpiarUsuario(body.usuario || "");
  const nombre = (body.nombre || "").trim().slice(0, 80) || (usuario ? `@${usuario}` : "");
  const email = (body.email || "").trim().toLowerCase().slice(0, 120);
  const whatsapp = (body.whatsapp || "").trim().slice(0, 30);
  if (!usuario) return NextResponse.json({ error: "Escribe un usuario de Instagram válido (por ejemplo @tunegocio)." }, { status: 400 });
  if (nombre.length < 2) return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Escribe un correo válido." }, { status: 400 });
  if (soloDigitos(whatsapp).length < 7) return NextResponse.json({ error: "Escribe tu WhatsApp con indicativo." }, { status: 400 });
  if (!body.acepto) return NextResponse.json({ error: "Debes autorizar el tratamiento de tus datos para continuar." }, { status: 400 });
  const respuestas = validarRespuestas(body.respuestas);

  // 1) Contacto: si ya existe (mismo correo) se reutiliza; si no, se crea como lead
  const ahora = new Date().toISOString();
  let prospectoId: string | null = null;
  const { data: existentes } = await supabase.from("prospectos").select("id").ilike("email", email).limit(1);
  prospectoId = existentes?.[0]?.id ?? null;
  if (!prospectoId) {
    const { data, error } = await supabase
      .from("prospectos")
      .insert({
        nombre,
        email,
        whatsapp,
        redes_sociales: `@${usuario}`,
        notas: `Instagram: https://www.instagram.com/${usuario}/`,
        canal_origen: "Diagnóstico Instagram (web)",
        categoria: "lead",
        paso_actual: "nuevo",
        acepto_tratamiento_datos: true,
        acepto_tratamiento_datos_en: ahora,
      })
      .select("id")
      .single();
    if (error || !data) return NextResponse.json({ error: "No pudimos guardar tus datos. Intenta de nuevo." }, { status: 500 });
    prospectoId = data.id;
  }

  // Evita repetir (y pagar IA de más): mismo correo y misma cuenta en las últimas 24 horas → mismo resultado
  const { data: previos } = await supabase
    .from("prospecto_historial")
    .select("id, contenido, created_at")
    .eq("prospecto_id", prospectoId)
    .eq("tipo", TIPO_HISTORIAL)
    .order("created_at", { ascending: false })
    .limit(5);
  const reciente = (previos || []).find((h) => {
    try {
      const r = JSON.parse(h.contenido) as RegistroDiagnostico;
      return r.usuario === usuario && r.estado === "listo" && Date.now() - new Date(h.created_at).getTime() < 86400000;
    } catch {
      return false;
    }
  });
  if (reciente) return NextResponse.json({ ok: true, id: reciente.id });

  // 2 y 3) Lectura de la cuenta, métricas y diagnóstico
  const lectura = await leerCuentaIG(usuario);
  let registro: RegistroDiagnostico;
  if (lectura.ok) {
    const metricas = calcularMetricas(lectura.cuenta);
    const puntajes = calcularPuntajes(metricas);
    let ia = null;
    let iaError: string | undefined;
    try {
      ia = await generarDiagnosticoIA(lectura.cuenta, metricas, puntajes, "datos", respuestas);
      if (!ia) iaError = "La IA no devolvió un diagnóstico válido";
    } catch (e) {
      iaError = e instanceof Error ? e.message.slice(0, 300) : "error"; // los puntajes reales se muestran igual
    }
    if (!ia) ia = diagnosticoPorReglas(metricas, puntajes, respuestas?.vende);
    registro = {
      version: 1, usuario, fecha: ahora, estado: "listo", fuente: "datos",
      cuenta: { nombre: lectura.cuenta.nombre, foto: lectura.cuenta.foto, seguidores: lectura.cuenta.seguidores, publicaciones: lectura.cuenta.publicaciones },
      metricas, puntajes, ia, iaError, desbloqueado: false, plan: null,
    };
  } else if (respuestas) {
    // Sin lectura de la cuenta (todavía sin token de Meta, o cuenta personal): diagnóstico al instante con sus respuestas
    const metricas = metricasDesdeRespuestas(respuestas);
    const puntajes = calcularPuntajes(metricas);
    const cuentaLigera = { usuario, nombre: "", bio: "", web: "", foto: "", seguidores: metricas.seguidores, siguiendo: 0, publicaciones: 0, posts: [] };
    let ia = null;
    let iaError: string | undefined;
    try {
      ia = await generarDiagnosticoIA(cuentaLigera, metricas, puntajes, "respuestas", respuestas);
      if (!ia) iaError = "La IA no devolvió un diagnóstico válido";
    } catch (e) {
      iaError = e instanceof Error ? e.message.slice(0, 300) : "error";
    }
    if (!ia) ia = diagnosticoPorReglas(metricas, puntajes, respuestas.vende);
    registro = { version: 1, usuario, fecha: ahora, estado: "listo", fuente: "respuestas", metricas, puntajes, ia, iaError, desbloqueado: false, plan: null };
  } else {
    registro = { version: 1, usuario, fecha: ahora, estado: lectura.motivo === "no_encontrada" ? "no_encontrada" : "pendiente", desbloqueado: false, plan: null };
  }

  const { data: hist, error: errHist } = await supabase
    .from("prospecto_historial")
    .insert({ prospecto_id: prospectoId, tipo: TIPO_HISTORIAL, contenido: JSON.stringify(registro) })
    .select("id")
    .single();
  if (errHist || !hist) return NextResponse.json({ error: "No pudimos guardar tu diagnóstico. Intenta de nuevo." }, { status: 500 });

  // 4) Aviso a Kathe
  const sitio = process.env.NEXT_PUBLIC_SITE_URL || "https://biwov-comoficial.vercel.app";
  await avisarKathe(
    `🔎 Diagnóstico de Instagram nuevo\n@${usuario} · ${nombre}\n${email} · ${whatsapp}\n` +
      (registro.estado === "listo"
        ? `Puntaje: ${registro.puntajes?.total}/100 (${registro.fuente === "respuestas" ? "con sus respuestas" : "datos reales de la cuenta"})${registro.iaError ? ` · texto con reglas fijas porque la IA falló (${registro.iaError.includes("credit balance") ? "SIN CRÉDITOS en la API de Anthropic: recarga en console.anthropic.com" : registro.iaError.slice(0, 120)})` : ""}`
        : registro.estado === "no_encontrada"
          ? "⚠️ La cuenta no se pudo leer (personal o no existe): hazlo a mano y escríbele."
          : "⚠️ Falta el token de Meta: haz el diagnóstico a mano y escríbele en menos de 24 h.") +
      `\nResultado: ${sitio}/diagnostico-instagram/r/${hist.id}`,
  );

  return NextResponse.json({ ok: true, id: hist.id });
}
