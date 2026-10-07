import type { PrecioDual } from "@/lib/moneda";

export interface ItemPlan {
  label: string;
  subitems?: string[];
}

export interface Plan {
  id: "esencial" | "crecimiento" | "escala";
  nombre: string;
  claim: string;
  resumen: string;
  paraQuien: string;
  incluye: ItemPlan[];
  precioDesde: PrecioDual;
  montajeInicial: PrecioDual;
  pautaSugerida: PrecioDual;
}

export const DURACION_MINIMA_MESES = 6;

// Valores en USD son una referencia aproximada (tasa ~4.000 COP/USD).
// Ajusta estos números directamente aquí si quieres precios distintos en dólares.
export const PLANES: Plan[] = [
  {
    id: "esencial",
    nombre: "Esencial",
    claim: "Ordena y empieza a atraer",
    resumen: "Tu WhatsApp organizado, con asistente y primeras campañas corriendo con orden.",
    paraQuien:
      "Para negocios que ya publican pero sin estrategia, o que quieren empezar a pautar con orden.",
    incluye: [
      {
        label: "Plan de trabajo con tareas semanales",
        subitems: [
          "Diagnóstico de tu negocio y tus redes",
          "Ideas y guiones para 3 videos por semana, más guías para historias",
          "Guía para optimizar tu WhatsApp Business, Instagram y Facebook",
          "Guía en creación de comunidad",
        ],
      },
      { label: "1 a 2 campañas de publicidad en Meta creadas y manejadas por nosotros" },
      { label: "2 sesiones de acompañamiento al mes y reporte mensual" },
      { label: "Guías y herramientas de IA para automatizar tus procesos" },
    ],
    precioDesde: { cop: 900000, usd: 225 },
    montajeInicial: { cop: 600000, usd: 150 },
    pautaSugerida: { cop: 500000, usd: 125 },
  },
  {
    id: "crecimiento",
    nombre: "Crecimiento",
    claim: "Atrae interesados que sí pueden comprar",
    resumen: "Seguimiento ordenado y una oferta clara para convertir a quien ya te vio.",
    paraQuien:
      "Para negocios que ya tienen contenido o publicidad, pero les falta estrategia, orden y medir.",
    incluye: [
      { label: "Todo lo del Plan Esencial" },
      { label: "1 página hecha para que te escriban, agenden o dejen sus datos" },
      { label: "Asistente con IA que filtra a los curiosos y te pasa los interesados" },
    ],
    precioDesde: { cop: 1900000, usd: 475 },
    montajeInicial: { cop: 1800000, usd: 450 },
    pautaSugerida: { cop: 1000000, usd: 250 },
  },
  {
    id: "escala",
    nombre: "Escala",
    claim: "Que ningún cliente se pierda",
    resumen: "Lista organizada de clientes y mensajes para que nadie se quede sin respuesta.",
    paraQuien:
      "Para negocios que ya venden y quieren un sistema que atraiga, atienda y haga seguimiento.",
    incluye: [
      { label: "Todo lo del Plan Crecimiento" },
      {
        label: "Seguimiento automático por WhatsApp y correo",
        subitems: ["Lista organizada de todos tus clientes con etapas de venta"],
      },
      { label: "Correos para que tus clientes vuelvan a comprar y te recomienden" },
      { label: "Hasta 3 campañas activas y estrategia de remarketing" },
      { label: "Reporte del camino completo, desde el anuncio hasta la venta" },
      { label: "Guías y herramientas de IA para automatizar tus procesos" },
    ],
    precioDesde: { cop: 2400000, usd: 600 },
    montajeInicial: { cop: 3800000, usd: 950 },
    pautaSugerida: { cop: 2000000, usd: 500 },
  },
];
