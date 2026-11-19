import { articulosOrdenados } from "@/data/blog";

/**
 * llms.txt generado desde los mismos datos del sitio: así los buscadores con
 * IA siempre leen los precios vigentes y todos los artículos del blog.
 */
export const dynamic = "force-static";


export function GET() {
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

## Servicios

- CRM: toda la información de los clientes en un solo lugar y su seguimiento.
- Chatbot: WhatsApp que responde preguntas frecuentes, filtra curiosos y pasa a los interesados a un asesor.
- Email marketing: correos automáticos de bienvenida, seguimiento y recompra.
- Mensajes masivos por WhatsApp: campañas a bases de datos autorizadas.
- Publicidad y campañas publicitarias en Meta (Facebook e Instagram).
- Asesoría de marketing: estrategia, planeación y lineamientos.
- Automatizaciones: herramientas conectadas para que las tareas repetitivas se hagan solas.

Cada servicio se cotiza a la medida por WhatsApp. La pauta publicitaria, las licencias y el consumo de las plataformas se pagan aparte.

## Blog (guías de marketing digital)

${articulos}

## Contacto

- Sitio web: https://biwov.com
- WhatsApp: +57 313 312 5157
- Instagram: https://www.instagram.com/biwov_/

## Páginas principales

- https://biwov.com — inicio: servicios, casos de éxito y preguntas frecuentes
- https://biwov.com/agencia-ia — biwov Agentes: agencia de marketing con agentes de IA y la memoria de cada marca
- https://biwov.com/blog — blog de marketing digital
- https://biwov.com/kathe — perfil de la fundadora
- https://biwov.com/politica-datos — política de tratamiento de datos
`;

  return new Response(texto, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
