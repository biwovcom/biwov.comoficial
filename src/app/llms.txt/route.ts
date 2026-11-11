import { PLANES, DURACION_MINIMA_MESES } from "@/data/planes";
import { LINEAS } from "@/data/lineas";
import { EXTRAS_COTIZABLES, CATEGORIAS_POR_LINEA } from "@/data/extrasCotizables";
import { articulosOrdenados } from "@/data/blog";

/**
 * llms.txt generado desde los mismos datos del sitio: así los buscadores con
 * IA siempre leen los precios vigentes y todos los artículos del blog.
 */
export const dynamic = "force-static";

const cop = (n: number) => `$${n.toLocaleString("es-CO")} COP`;

export function GET() {
  const catalogo = LINEAS.map((linea) => {
    const planes = PLANES.filter((p) => p.linea === linea.id)
      .map((p) => `- **${p.nombre}** (${cop(p.precioDesde.cop)}/mes): ${p.resumen} ${p.paraQuien}`)
      .join("\n");
    const servicios = CATEGORIAS_POR_LINEA[linea.id]
      .map((cat) => {
        const items = EXTRAS_COTIZABLES.filter((e) => e.categoria === cat)
          .map(
            (e) =>
              `- ${e.nombre}: ${e.desde ? "desde " : ""}${cop(e.precioCop)}${e.periodicidad === "mensual" ? "/mes" : " (pago único)"}${e.descripcion ? `. ${e.descripcion}` : ""}`,
          )
          .join("\n");
        return `### ${cat}\n\n${items}`;
      })
      .join("\n\n");
    return `## ${linea.numero}. ${linea.nombre} — ${linea.etiqueta}\n\n${linea.promesa}\n\n${[planes, servicios].filter(Boolean).join("\n\n")}`;
  }).join("\n\n");

  const articulos = articulosOrdenados()
    .map((a) => `- [${a.titulo}](https://biwov.com/blog/${a.slug}): ${a.enResumen}`)
    .join("\n");

  const texto = `# biwov

> biwov es una agencia de marketing digital y automatización para negocios pequeños y medianos en Colombia y Latinoamérica. Conecta redes sociales, publicidad en Meta, WhatsApp, páginas web, CRM e inteligencia artificial en un solo sistema para que un negocio atraiga clientes, les venda y les haga seguimiento sin que el dueño tenga que estar en todo.

## Quiénes somos

- Fundadora: Katherine Usma Aristizábal (Kathe Digital), implementadora de ecosistemas digitales. Perfil: https://biwov.com/kathe
- Con sede en Manizales (Caldas, Colombia). Producción de contenido presencial en Manizales y el Eje Cafetero; estrategia, campañas, páginas web y automatizaciones de forma virtual para toda Colombia y Latinoamérica.
- Página local: https://biwov.com/marketing-digital-manizales
- Fundada en agosto de 2023. Más de 10 negocios acompañados.

## Qué resolvemos

- Negocios que publican en redes pero no convierten ese interés en ventas.
- Mensajes de WhatsApp que se pierden o se atienden tarde, sin seguimiento.
- Publicidad en Meta (Facebook e Instagram) sin estrategia ni medición.
- Falta de una página web que convierta visitas en contactos y de un CRM que ordene a los clientes.
- Tareas repetitivas que se pueden automatizar con inteligencia artificial.

## Servicios y precios

Los planes mensuales tienen un compromiso mínimo de ${DURACION_MINIMA_MESES} meses y se pagan por anticipado. La pauta publicitaria, las licencias y el consumo de las plataformas se pagan aparte.

${catalogo}

## Asesoría personalizada

- Sesión 1 a 1 de 90 minutos con Kathe, con análisis previo del negocio.

Precios en pesos colombianos; no incluyen IVA ni retenciones. Precios vigentes y en dólares: https://biwov.com/tienda

## Blog (guías de marketing digital)

${articulos}

## Contacto

- Sitio web: https://biwov.com
- WhatsApp: +57 313 312 5157
- Instagram: https://www.instagram.com/biwov_/

## Páginas principales

- https://biwov.com — inicio: servicios, casos de éxito y preguntas frecuentes
- https://biwov.com/tienda — planes y servicios con precios
- https://biwov.com/blog — blog de marketing digital
- https://biwov.com/kathe — perfil de la fundadora
- https://biwov.com/politica-datos — política de tratamiento de datos
`;

  return new Response(texto, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
