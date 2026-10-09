export type EstadoCreativo = "por_hacer" | "en_progreso" | "hecho";
export type SubcategoriaCreativo = "historia" | "reel" | "feed";

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
  reel: "Reel",
  feed: "Feed",
};

/** Colores vivos para identificar de un vistazo qué tipo de pieza es, en el calendario y las tarjetas. */
export const COLOR_SUBCATEGORIA: Record<SubcategoriaCreativo | "sin_seccion", { dot: string; badge: string }> = {
  historia: { dot: "bg-fuchsia-500", badge: "border-fuchsia-500/40 bg-fuchsia-500/15 text-fuchsia-300" },
  reel: { dot: "bg-orange-500", badge: "border-orange-500/40 bg-orange-500/15 text-orange-300" },
  feed: { dot: "bg-cyan-400", badge: "border-cyan-400/40 bg-cyan-400/15 text-cyan-300" },
  sin_seccion: { dot: "bg-white/30", badge: "border-border-glass bg-white/[0.03] text-text-secondary" },
};
