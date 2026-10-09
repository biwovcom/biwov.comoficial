export interface PlanCreativoEntrada {
  id: string;
  prospecto_id: string;
  categoria: "creativo" | "embudo";
  tipo: string;
  titulo: string | null;
  contenido: string | null;
  link: string | null;
  aprobado: boolean;
  aprobado_en: string | null;
  created_at: string;
}

/** Sugerencias para la pestaña Creativos: ideas, historias, guiones, copys, ofertas. */
export const TIPOS_CREATIVO_SUGERIDOS = [
  "Idea de contenido / referente",
  "Historia",
  "Idea de reel",
  "Guion",
  "Copy",
  "Texto de oferta",
];

/** Sugerencias para la pestaña Embudo y campaña: lo que se le muestra al cliente para aprobar. */
export const TIPOS_EMBUDO_SUGERIDOS = [
  "Estructura del embudo",
  "Estructura de campaña publicitaria",
  "Estrategia de contenido (antes de grabar)",
];
