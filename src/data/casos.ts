export interface CasoExito {
  id: string;
  cliente: string;
  url: string;
  reto: string;
  solucion: string;
  destacado: string;
}

export const CASOS_EXITO: CasoExito[] = [
  {
    id: "fv-arquitectura",
    cliente: "FV Arquitectura",
    url: "https://fvarquitectura.com.co",
    reto:
      "Una firma con más de 20 años y más de 215 proyectos entregados necesitaba una presencia digital a la altura de su trayectoria.",
    solucion:
      "Sitio corporativo multipágina con galería de obra, integración de WhatsApp y muro de aliados de peso (Licorera de Caldas, Confa, Panamericana).",
    destacado: "Presencia digital a la altura de su trayectoria.",
  },
  {
    id: "carolina-morales-academy",
    cliente: "Carolina Morales Academy",
    url: "https://carolinamoralesacademy.com",
    reto:
      "Construir marca personal y academia para una Campeona Mundial de Microblading 2025.",
    solucion:
      "Plataforma con servicios, academia, reservas, testimonios en video y WhatsApp integrado.",
    destacado: "Plataforma para vender cursos y procedimientos de una artista de nivel mundial.",
  },
  {
    id: "lina-valencia-studio",
    cliente: "Lina Valencia Studio",
    url: "https://linavalenciastudio.com",
    reto:
      "Un estudio y academia de estética (cejas y pestañas) con 8 años de trayectoria necesitaba ordenar su oferta VIP.",
    solucion:
      "Sitio de estudio + academia con marcas asociadas y contacto directo por WhatsApp.",
    destacado: "Formación VIP y marca consolidada en un solo lugar.",
  },
  {
    id: "agentix-webinar",
    cliente: "Orlando Sánchez / AGENTIX",
    url: "https://webinar.orlandosanchezmarketing.com",
    reto: "Captar leads para una masterclass en vivo y automatizar el seguimiento.",
    solucion:
      "Landing de embudo con countdown, formulario integrado, registro por WhatsApp, secciones de problema/beneficios/FAQ y demo de asistente IA.",
    destacado: "Captación de leads + automatización funcionando de punta a punta.",
  },
  {
    id: "ramirez-quintero",
    cliente: "Ramírez Quintero",
    url: "#",
    reto: "Un bufete jurídico y contable necesitaba un sitio a medida, no una plantilla genérica.",
    solucion:
      "Sitio multipágina codificado a medida desde cero: inicio, nosotros, áreas de práctica, blog, contacto y agenda de consulta.",
    destacado: "Desarrollo custom, no solo constructores.",
  },
];
