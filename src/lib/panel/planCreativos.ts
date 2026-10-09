export type EstadoCreativo = "por_hacer" | "en_progreso" | "hecho";
export type SubcategoriaCreativo = "historia" | "reel" | "feed";
export type EtapaEmbudo = "tofu" | "mofu" | "bofu";

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
  etapa_embudo: EtapaEmbudo | null;
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

/**
 * TOFU/MOFU/BOFU: en qué parte del embudo está cada creativo. La mezcla ideal
 * (para medir la "temperatura" del contenido del mes) es 60-70% TOFU, 20-30%
 * MOFU y alrededor de 10% BOFU — la mayoría debe atraer, poco debe empujar a comprar.
 */
export const ETAPAS_EMBUDO: Record<
  EtapaEmbudo,
  { label: string; descripcion: string; idealMin: number; idealMax: number }
> = {
  tofu: {
    label: "TOFU",
    descripcion: "Atracción (tope del embudo): gente que apenas te descubre, contenido de valor o entretenimiento.",
    idealMin: 60,
    idealMax: 70,
  },
  mofu: {
    label: "MOFU",
    descripcion: "Consideración (medio del embudo): ya te conocen y están evaluando si les sirves.",
    idealMin: 20,
    idealMax: 30,
  },
  bofu: {
    label: "BOFU",
    descripcion: "Conversión (fondo del embudo): listos para comprar, contenido de oferta o cierre.",
    idealMin: 5,
    idealMax: 15,
  },
};

export const COLOR_ETAPA_EMBUDO: Record<EtapaEmbudo, { dot: string; badge: string; barra: string }> = {
  tofu: { dot: "bg-sky-400", badge: "border-sky-400/40 bg-sky-400/15 text-sky-300", barra: "bg-sky-400" },
  mofu: { dot: "bg-violet-500", badge: "border-violet-500/40 bg-violet-500/15 text-violet-300", barra: "bg-violet-500" },
  bofu: { dot: "bg-rose-500", badge: "border-rose-500/40 bg-rose-500/15 text-rose-300", barra: "bg-rose-500" },
};
