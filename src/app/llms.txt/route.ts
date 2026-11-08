import { PLANES } from "@/data/planes";
import { NIVELES_PRODUCCION, PRODUCCION_VIDEO } from "@/data/addOns";
import { COMPLEMENTOS } from "@/data/complementos";
import { articulosOrdenados } from "@/data/blog";

/**
 * llms.txt generado desde los mismos datos del sitio: así los buscadores con
 * IA siempre leen los precios vigentes y todos los artículos del blog.
 */
export const dynamic = "force-static";

const cop = (n: number) => `$${n.toLocaleString("es-CO")} COP`;

export function GET() {
  const planes = PLANES.map(
    (p) =>
      `- **Plan ${p.nombre}** (${cop(p.precioDesde.cop)}/mes, montaje inicial ${cop(p.montajeInicial.cop)}): ${p.resumen} ${p.paraQuien}`,
  ).join("\n");

  const produccion = NIVELES_PRODUCCION.map(
    (n) =>
      `- ${n.nombre} (${cop(n.precio.cop)} por jornada de ${n.tiempoProduccion}): ${n.fotografias} fotografías, ${n.reels} reels y ${n.clipsBRoll} clips de B-Roll.`,
  ).join("\n");

  const videos = PRODUCCION_VIDEO.paquetes
    .map((p) => `- ${p.nombre ?? `${p.cantidadVideos} videos`}: ${cop(p.precio)}${p.esMensual ? " al mes" : ""}`)
    .join("\n");

  const web =
    COMPLEMENTOS.find((c) => c.titulo.startsWith("Páginas web"))
      ?.items?.filter((i) => i.precioCop)
      .map((i) => `- ${i.label}: ${cop(i.precioCop!)}`)
      .join("\n") ?? "";

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

## Planes mensuales (compromiso mínimo de 6 meses)

${planes}

## Producción de contenido (por jornada)

${produccion}

## Grabación y edición de video

${videos}

## Páginas web (incluyen hosting y dominio el primer año)

${web}

## Otros servicios

- Gestión de campaña en Meta: $400.000 COP/mes (la inversión en pauta la paga el cliente directamente a Meta; permanencia mínima 3 meses).
- Asesoría personalizada 1 a 1 de 90 minutos con Kathe.

Precios en pesos colombianos; no incluyen impuestos ni retenciones. Precios vigentes y en dólares: https://biwov.com/tienda

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
