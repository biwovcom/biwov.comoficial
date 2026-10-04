export type PlanId = "esencial" | "crecimiento" | "escala";

export interface SituacionNegocio {
  id: string;
  situacion: string;
  tecnica: string;
  plan: PlanId;
}

export const SITUACIONES_NEGOCIO: SituacionNegocio[] = [
  {
    id: "contenido",
    situacion: "Publico contenido, pero no sé si estoy haciendo lo correcto",
    tecnica: "Diagnóstico de redes · estrategia de contenido",
    plan: "esencial",
  },
  {
    id: "conocimiento",
    situacion: "Quiero que más gente me conozca y me escriba",
    tecnica: "Pauta en Meta · campañas de mensajes",
    plan: "esencial",
  },
  {
    id: "pagina",
    situacion:
      "Necesito una página hecha para que me compren, me escriban, agenden una cita o dejen sus datos",
    tecnica: "Landing page · formulario · embudo",
    plan: "crecimiento",
  },
  {
    id: "aprendizaje-pauta",
    situacion: "Quiero que la publicidad aprenda quién me compra y me traiga más gente así",
    tecnica: "Píxel · API de conversiones · remarketing",
    plan: "crecimiento",
  },
  {
    id: "curiosos",
    situacion: "Me escriben muchos curiosos y pierdo tiempo con quien no va a comprar",
    tecnica: "Filtro · asistente con IA · leads calificados",
    plan: "crecimiento",
  },
  {
    id: "lista-clientes",
    situacion: "Necesito una lista organizada de todos mis clientes, sin perder ninguno",
    tecnica: "CRM · etapas de venta",
    plan: "escala",
  },
  {
    id: "seguimiento-automatico",
    situacion: "Quiero que el seguimiento se haga solo y que mis clientes vuelvan a comprar",
    tecnica: "Automatizaciones · email marketing · WhatsApp",
    plan: "escala",
  },
];

export const NOMBRES_PLAN: Record<PlanId, string> = {
  esencial: "Esencial",
  crecimiento: "Crecimiento",
  escala: "Escala",
};
