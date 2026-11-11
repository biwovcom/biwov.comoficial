import { CATEGORIAS_EXTRA } from "@/data/extrasCotizables";
import { PLAN_IDS } from "@/data/planes";
import { z } from "zod";
import type { RespuestaLegible } from "@/lib/panel/filtroRapido";
import { PLANES } from "@/data/planes";
import { EXTRAS_COTIZABLES, type CategoriaExtra } from "@/data/extrasCotizables";

const fmtCop = (n: number) => `$${n.toLocaleString("es-CO")} COP`;

export const AnalisisRapidoSchema = z.object({
  etapaNegocio: z.enum(["empezando", "vende-irregular", "vende-estable-escalar"]),
  resumenCorto: z.string(),

  planRecomendado: z.object({
    plan: z.enum(PLAN_IDS),
    justificacion: z.string(),
  }),

  extrasRecomendados: z.array(
    z.object({
      nombre: z.string(),
      categoria: z.enum(CATEGORIAS_EXTRA as [CategoriaExtra, ...CategoriaExtra[]]),
      obligatorio: z.boolean(),
      justificacion: z.string(),
    }),
  ),
});

export type AnalisisRapido = z.infer<typeof AnalisisRapidoSchema>;

const SYSTEM_PROMPT = `Actúa como un Director de Marketing Digital Senior de biwov_, una agencia que diseña "Ecosistemas Digitales Inteligentes". Un visitante acaba de llenar un filtro rápido en el sitio web (no un diagnóstico completo). Con esa poca información, dale una primera lectura honesta y recomienda el plan real y los extras reales que más le convienen, en español simple y directo.

Guía para elegir el plan:
- Si quiere aprender y ejecutar con su propio equipo, o tiene poco presupuesto → planes de Dirección estratégica ("direccion", "crecimiento-estrategico" o "growth-partner" si ya tiene equipo interno de marketing o ventas).
- Si no tiene tiempo y quiere delegar sus redes → planes de Gestión ("gestion-esencial" con 1 red, "gestion-crecimiento" con hasta 2 redes, "gestion-integral" si quiere delegar casi toda la operación).
- Si apenas está empezando, no le recomiendes páginas web ni automatizaciones como obligatorias; sería gastar en algo que todavía no va a aprovechar.
- Si le llegan muchos mensajes y no da abasto, o quiere seguimiento automático → sugiere como extra WhatsApp Business o Email marketing.
- Si necesita contenido grabado profesionalmente, sugiere Producción Start, Professional o Signature; si graba con su celular, Edición de reels.

Para "extrasRecomendados": marca "obligatorio: true" solo en lo que necesita sí o sí; todo lo demás que podría ayudar pero no es indispensable va con "obligatorio: false". Como la información es limitada (solo el filtro rápido, sin diagnóstico completo), sé conservadora: recomienda pocos extras y solo los muy evidentes. Nunca inventes datos que la persona no dio — si hace falta más información para estar segura, dilo en "resumenCorto".

Devuelve el análisis completo siguiendo exactamente el esquema que se te pide.`;

function formatearCatalogoReal(): string {
  const planes = PLANES.map(
    (p) =>
      `- ${p.nombre} (id: "${p.id}") — ${p.claim}. ${p.paraQuien} Desde ${fmtCop(p.precioDesde.cop)}/mes.`,
  ).join("\n");

  const categorias: CategoriaExtra[] = CATEGORIAS_EXTRA;
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
