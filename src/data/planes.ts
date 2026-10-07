import type { PrecioDual } from "@/lib/moneda";

export interface Plan {
  id: "esencial" | "crecimiento" | "escala";
  nombre: string;
  claim: string;
  paraQuien: string;
  incluye: string[];
  precioDesde: PrecioDual;
  montajeInicial: PrecioDual;
  pautaSugerida: PrecioDual;
}

// Valores en USD son una referencia aproximada (tasa ~4.000 COP/USD).
// Ajusta estos números directamente aquí si quieres precios distintos en dólares.
export const PLANES: Plan[] = [
  {
    id: "esencial",
    nombre: "Esencial",
    claim: "Ordena y empieza a atraer",
    paraQuien:
      "Para negocios que ya publican pero sin estrategia, o que quieren empezar a pautar con orden.",
    incluye: [
      "Diagnóstico de tu negocio y tus redes",
      "Plan de trabajo con tareas semanales",
      "Ideas y guiones para 3 videos por semana, más guías para historias",
      "Guía para optimizar tu WhatsApp Business, Instagram y Facebook",
      "1 a 2 campañas de publicidad en Meta creadas y manejadas por nosotros",
      "Guía en creación de comunidad",
      "2 sesiones de acompañamiento al mes y reporte mensual",
      "Guías y herramientas de IA para automatizar tus procesos",
    ],
    precioDesde: { cop: 900000, usd: 225 },
    montajeInicial: { cop: 600000, usd: 150 },
    pautaSugerida: { cop: 500000, usd: 125 },
  },
  {
    id: "crecimiento",
    nombre: "Crecimiento",
    claim: "Atrae interesados que sí pueden comprar",
    paraQuien:
      "Para negocios que ya tienen contenido o publicidad, pero les falta estrategia, orden y medir.",
    incluye: [
      "Todo lo del Plan Esencial",
      "Oferta y textos de venta revisados",
      "1 página hecha para que te escriban, agenden o dejen sus datos",
      "Configuración para que la publicidad aprenda quién te compra",
      "2 campañas: para atraer y para volver a impactar a quien ya te vio",
      "Asistente con IA que filtra a los curiosos y te pasa los interesados",
      "Guías y herramientas de IA para automatizar tus procesos",
    ],
    precioDesde: { cop: 1500000, usd: 375 },
    montajeInicial: { cop: 1800000, usd: 450 },
    pautaSugerida: { cop: 1000000, usd: 250 },
  },
  {
    id: "escala",
    nombre: "Escala",
    claim: "Que ningún cliente se pierda",
    paraQuien:
      "Para negocios que ya venden y quieren un sistema que atraiga, atienda y haga seguimiento.",
    incluye: [
      "Todo lo del Plan Crecimiento",
      "Lista organizada de todos tus clientes con etapas de venta",
      "Seguimiento automático por WhatsApp y correo",
      "Correos para que tus clientes vuelvan a comprar y te recomienden",
      "Hasta 3 campañas activas y estrategia de remarketing",
      "Reporte del camino completo, desde el anuncio hasta la venta",
      "Guías y herramientas de IA para automatizar tus procesos",
    ],
    precioDesde: { cop: 2400000, usd: 600 },
    montajeInicial: { cop: 3200000, usd: 800 },
    pautaSugerida: { cop: 2000000, usd: 500 },
  },
];
