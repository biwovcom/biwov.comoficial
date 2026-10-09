export type EstadoCreativo = "por_hacer" | "en_progreso" | "hecho";
export type SubcategoriaCreativo = "historia" | "feed";

export interface PlanCreativoEntrada {
  id: string;
  prospecto_id: string;
  categoria: "creativo" | "embudo" | "analisis";
  tipo: string;
  titulo: string | null;
  contenido: string | null;
  link: string | null;
  fecha: string | null;
  estado: EstadoCreativo;
  subcategoria: SubcategoriaCreativo | null;
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

/** Sugerencias para la pestaña Análisis y resultados. */
export const TIPOS_ANALISIS_SUGERIDOS = [
  "Análisis de campaña",
  "Análisis de creativo final",
  "Aprendizaje / insight",
];

export const ESTADOS_CREATIVO: Record<EstadoCreativo, { label: string; badge: "neutral" | "amarillo" | "verde" }> = {
  por_hacer: { label: "Por hacer", badge: "neutral" },
  en_progreso: { label: "En progreso", badge: "amarillo" },
  hecho: { label: "Hecho", badge: "verde" },
};

export const SUBCATEGORIAS_CREATIVO: Record<SubcategoriaCreativo, string> = {
  historia: "Historia",
  feed: "Feed",
};
