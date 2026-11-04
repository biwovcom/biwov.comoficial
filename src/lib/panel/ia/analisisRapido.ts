import { z } from "zod";
import type { RespuestaLegible } from "@/lib/panel/filtroRapido";
import { PLANES } from "@/data/planes";
import { EXTRAS_COTIZABLES, type CategoriaExtra } from "@/data/extrasCotizables";

const fmtCop = (n: number) => `$${n.toLocaleString("es-CO")} COP`;

export const AnalisisRapidoSchema = z.object({
  etapaNegocio: z.enum(["empezando", "vende-irregular", "vende-estable-escalar"]),
  resumenCorto: z.string(),

  planRecomendado: z.object({
    plan: z.enum(["esencial", "crecimiento", "escala"]),
    justificacion: z.string(),
  }),

  extrasRecomendados: z.array(
    z.object({
      nombre: z.string(),
      categoria: z.enum([
        "Producción de contenido",
        "Grabación y edición de video",
        "Páginas web",
        "Campaña en Meta",
      ]),
      obligatorio: z.boolean(),
      justificacion: z.string(),
    }),
  ),
});

export type AnalisisRapido = z.infer<typeof AnalisisRapidoSchema>;

const SYSTEM_PROMPT = `Actúa como un Director de Marketing Digital Senior de biwov_, una agencia que diseña "Ecosistemas Digitales Inteligentes". Un visitante acaba de llenar un filtro rápido en el sitio web (no un diagnóstico completo). Con esa poca información, dale una primera lectura honesta y recomienda el plan real y los extras reales que más le convienen, en español simple y directo.

Guía para elegir el plan según la etapa del negocio:
- Si no tiene presencia digital ordenada o apenas está empezando → Plan Esencial. No le recomiendes página web ni automatizaciones todavía — sería gastar en algo que no va a aprovechar aún.
- Si ya tiene algo de contenido o pauta pero le llegan interesados sin calificar, o quiere automatizar el seguimiento → Plan Crecimiento.
- Si ya cumple sus metas de ventas de forma constante y quiere escalar → Plan Escala.

Para "extrasRecomendados": marca "obligatorio: true" solo en lo que necesita sí o sí; todo lo demás que podría ayudar pero no es indispensable va con "obligatorio: false". Como la información es limitada (solo el filtro rápido, sin diagnóstico completo), sé conservadora: recomienda pocos extras y solo los muy evidentes. Nunca inventes datos que la persona no dio — si hace falta más información para estar segura, dilo en "resumenCorto".

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

export function construirPromptAnalisisRapido(params: {
  nombreProspecto: string;
  empresa: string | null;
  redesSociales: string | null;
  resumenFiltro: RespuestaLegible[];
}) {
  const mensaje = `PROSPECTO: ${params.nombreProspecto}${params.empresa ? ` — ${params.empresa}` : ""}
Redes sociales: ${params.redesSociales?.trim() || "(sin datos)"}

## Filtro rápido (lo único que respondió)
${params.resumenFiltro.map((r) => `- ${r.pregunta}: ${r.respuesta}`).join("\n")}

## Catálogo real de biwov_ (para planRecomendado y extrasRecomendados)
${formatearCatalogoReal()}`;

  return { system: SYSTEM_PROMPT, mensaje };
}
