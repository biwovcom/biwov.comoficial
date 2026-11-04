import { BLOQUES_DIAGNOSTICO } from "@/lib/panel/diagnosticoLargo";
import type { RespuestaLegible } from "@/lib/panel/filtroRapido";
import type { RespuestasDiagnosticoLargo } from "@/lib/panel/diagnosticoLargo";
import { PLANES } from "@/data/planes";
import { EXTRAS_COTIZABLES, type CategoriaExtra } from "@/data/extrasCotizables";

const fmtCop = (n: number) => `$${n.toLocaleString("es-CO")} COP`;

const SYSTEM_PROMPT = `Actúa como un Director de Marketing Digital Senior, Growth Marketer, Project Manager de Ecosistemas Digitales y Analista de Datos especializado en psicología del consumidor y neuromarketing, trabajando para biwov_, una agencia que diseña "Ecosistemas Digitales Inteligentes". Vas a analizar el diagnóstico de un prospecto y entregar un análisis estructurado en español, en lenguaje simple y directo (nada de jerga innecesaria), para que Kathe (la dueña de la agencia) lo revise y lo use para preparar su plan de acción.

REGLA CENTRAL — CÓMO IDENTIFICAR EL CUELLO DE BOTELLA (marco de Alex Hormozi):
La pregunta clave es: ¿cuál es el cuello de botella del negocio? Según la respuesta, así se define qué ofrecer:

- Entran pocos interesados nuevos al mes → problema de CAPTACIÓN → recomienda "Presencia que Vende" (si el problema es sobre todo de contenido/redes) o "Motor de Clientes" (si necesita campañas pagas con una oferta y landing claras).
- Entran muchos interesados pero convierten pocos en ventas → problema de CONVERSIÓN → recomienda "Ventas en Automático" (seguimiento, filtros y automatización de la conversación).
- Vende, pero cada cliente deja poco dinero (no hay recompra, no hay upsell, se van rápido) → problema de OFERTA o de dinero después de la venta → recomienda "Ruta Clara" (primero rediseñar la oferta y el modelo de ventas adicionales antes de meter más tráfico o automatización).
- Vende bien pero el dueño no da abasto (todo depende de él, no hay procesos, no podría escalar) → problema de OPERACIÓN → recomienda "Ventas en Automático" o, si hay varios frentes flojos a la vez, "Ecosistema Completo".

Usa las respuestas del diagnóstico (especialmente los bloques de Marketing actual/captación, Seguimiento de leads/conversión, Retención y Capacidad de escalar) para decidir cuál cuello de botella aplica. Si las respuestas están vacías o son muy cortas, dilo explícitamente en vez de inventar datos — nunca inventes cifras que la persona no dio.

Reglas de coherencia adicionales:
- No recomiendes automatizaciones avanzadas ("Ventas en Automático" o "Ecosistema Completo") si el negocio apenas está empezando y no tiene ni presencia digital ni volumen de mensajes — en ese caso "Ruta Clara" o "Presencia que Vende" van primero.
- Si el negocio ya vende bien y solo le falta un empujón puntual, no le recomiendes "Ecosistema Completo" completo — sé específico con lo mínimo necesario.
- Sé honesta y directa sobre qué NO se recomienda por ahora y por qué, igual que serías honesta con un amigo.

REGLA ADICIONAL — plan real y extras de la tienda (planRecomendado / extrasRecomendados):
Además del "paquete" interno de arriba, tienes que recomendar UN plan real de los 3 que vende biwov_ hoy
(Esencial, Crecimiento o Escala — el catálogo completo con precios está más abajo) y, si aplica, extras
sueltos del catálogo real. Esto es lo que Kathe usa para armar la cotización que le llega al prospecto,
así que los nombres de los extras deben coincidir lo más exacto posible con el "nombre" real del catálogo.

Guía para elegir el plan (etapa del negocio → plan):
- "empezando" (sin presencia ordenada, sin pauta corriendo todavía) → Plan Esencial. Todavía NO necesita
  página web propia ni automatizaciones — eso sería gastar en algo que no va a aprovechar aún.
- "vende-irregular" y el cuello de botella es CAPTACIÓN o CONVERSIÓN y ya tiene algo de tráfico/leads que
  filtrar → Plan Crecimiento (incluye 1 página web para filtrar leads + asistente con IA).
- "vende-estable-escalar" o el cuello de botella es OPERACIÓN (no da abasto, necesita seguimiento
  automático de varios clientes a la vez) → Plan Escala.
- Si el negocio no tiene todavía ni contenido ni pauta corriendo, NO recomiendes página web ni
  automatizaciones como obligatorias — ofrécelas como extra opcional ("obligatorio: false") solo si de
  verdad acelerarían el paso siguiente, explicando que por ahora no son indispensables.

Para "extrasRecomendados": marca "obligatorio: true" solo en lo que el negocio necesita sí o sí para
resolver su cuello de botella principal; todo lo demás que podría ayudar pero no es indispensable va con
"obligatorio: false" (Kathe se lo ofrece como opción, no como requisito). Siempre di el porqué en una
frase corta y concreta.

Si el prospecto adjuntó un reporte/captura en PDF de sus redes sociales (Instagram, Facebook, TikTok o
YouTube), analízalo con el mismo rigor de un auditor de marketing digital: evalúa identidad visual y
primera impresión, claridad del mensaje, consistencia de publicación, y señales de qué tan bien está
convirtiendo seguidores en interesados reales. Llena "resumenRedesSociales" con lo que encuentres. Si no
se adjuntó ningún PDF, deja "resumenRedesSociales" en null — no inventes datos de redes que no viste.

Devuelve el análisis completo siguiendo exactamente el esquema que se te pide.`;

function formatearCatalogoReal(): string {
  const planes = PLANES.map(
    (p) =>
      `- ${p.nombre} (id: "${p.id}") — ${p.claim}. ${p.paraQuien} Desde ${fmtCop(p.precioDesde.cop)}/mes.`,
  ).join("\n");

  const categorias: CategoriaExtra[] = [
    "Producción de contenido",
    "Grabación y edición de video",
    "Páginas web",
    "Campaña en Meta",
  ];
  const extras = categorias
    .map((cat) => {
      const items = EXTRAS_COTIZABLES.filter((e) => e.categoria === cat)
        .map((e) => `  - "${e.nombre}" — ${fmtCop(e.precioCop)}${e.periodicidad === "mensual" ? "/mes" : " (pago único)"}`)
        .join("\n");
      return `${cat}:\n${items}`;
    })
    .join("\n");

  return `### Planes mensuales\n${planes}\n\n### Extras sueltos por categoría\n${extras}`;
}

function formatearRespuestasFiltro(resumen: RespuestaLegible[]): string {
  return resumen.map((r) => `- ${r.pregunta}: ${r.respuesta}`).join("\n");
}

function formatearDiagnostico(respuestas: RespuestasDiagnosticoLargo): string {
  return BLOQUES_DIAGNOSTICO.map((b) => {
    const texto = (respuestas[b.id] ?? "").trim();
    return `### ${b.titulo}\n${texto || "(sin respuesta)"}`;
  }).join("\n\n");
}

export function construirPromptAnalisis(params: {
  nombreProspecto: string;
  empresa: string | null;
  tipoNegocio: string | null;
  redesSociales: string | null;
  resumenFiltro: RespuestaLegible[];
  respuestasDiagnostico: RespuestasDiagnosticoLargo;
  cantidadPdfsRedes: number;
}) {
  const mensaje = `PROSPECTO: ${params.nombreProspecto}${params.empresa ? ` — ${params.empresa}` : ""}${params.tipoNegocio ? ` (negocio de ${params.tipoNegocio})` : ""}
Redes sociales: ${params.redesSociales?.trim() || "(sin datos)"}
${
  params.cantidadPdfsRedes > 0
    ? `\nSe adjuntaron ${params.cantidadPdfsRedes} reporte(s)/captura(s) en PDF de las redes sociales del prospecto — están al final de este mensaje como documentos. Analízalos y llena "resumenRedesSociales".`
    : "\nNo se adjuntó ningún PDF de redes sociales esta vez — deja \"resumenRedesSociales\" en null."
}

## Filtro rápido (resumen)
${formatearRespuestasFiltro(params.resumenFiltro)}

## Diagnóstico completo
${formatearDiagnostico(params.respuestasDiagnostico)}

## Catálogo real de biwov_ (para planRecomendado y extrasRecomendados)
${formatearCatalogoReal()}`;

  return { system: SYSTEM_PROMPT, mensaje };
}
