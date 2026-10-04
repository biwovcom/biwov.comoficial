export interface Plan {
  id: "esencial" | "crecimiento" | "escala";
  nombre: string;
  claim: string;
  paraQuien: string;
  incluye: string[];
  precioDesde: string;
  montajeInicial: string;
  pautaSugerida: string;
}

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
      "Guía para optimizar tu WhatsApp Business",
      "1 campaña de publicidad en Meta creada y manejada por nosotros",
      "2 sesiones de acompañamiento al mes y reporte mensual",
      "Guías y herramientas de IA para automatizar tus procesos",
    ],
    precioDesde: "Desde $900.000 al mes",
    montajeInicial: "+ montaje inicial de $600.000",
    pautaSugerida: "Publicidad aparte, sugerida desde $500.000 al mes.",
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
    precioDesde: "Desde $1.500.000 al mes",
    montajeInicial: "+ montaje inicial de $1.800.000",
    pautaSugerida: "Publicidad aparte, sugerida desde $1.000.000 al mes.",
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
    precioDesde: "Desde $2.400.000 al mes",
    montajeInicial: "+ montaje inicial de $3.200.000",
    pautaSugerida: "Publicidad aparte, sugerida desde $2.000.000 al mes.",
  },
];
