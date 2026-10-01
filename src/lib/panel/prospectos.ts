export type PasoActual =
  | "nuevo"
  | "filtro"
  | "llamada"
  | "diagnostico"
  | "analisis"
  | "propuesta_enviada"
  | "ganado"
  | "perdido";

export type Semaforo = "verde" | "amarillo" | "rojo";

export type Categoria = "contacto" | "lead" | "prospecto";

export const NOMBRES_PASO: Record<PasoActual, string> = {
  nuevo: "Nuevo",
  filtro: "Filtro rápido",
  llamada: "Llamada agendada",
  diagnostico: "Diagnóstico",
  analisis: "Análisis IA",
  propuesta_enviada: "Propuesta enviada",
  ganado: "Ganado",
  perdido: "Perdido",
};

export const NOMBRES_CATEGORIA: Record<Categoria, string> = {
  contacto: "Contacto",
  lead: "Lead",
  prospecto: "Prospecto",
};

/** Reutiliza las variantes de color que ya tiene <Badge>. */
export const BADGE_VARIANTE_CATEGORIA: Record<Categoria, "neutral" | "amarillo" | "accent"> = {
  contacto: "neutral",
  lead: "amarillo",
  prospecto: "accent",
};

export interface Prospecto {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string | null;
  tipo_negocio: string | null;
  redes_sociales: string | null;
  whatsapp: string;
  email: string | null;
  pais: string | null;
  ciudad: string | null;
  canal_origen: string | null;
  notas: string | null;
  link_redes_prospecto: string | null;
  que_quiere_resolver: string | null;
  paso_actual: PasoActual;
  semaforo: Semaforo | null;
  categoria: Categoria | null;
  nicho_mercado: string | null;
}

export interface NuevoProspectoInput {
  nombre: string;
  empresa?: string;
  tipoNegocio?: string;
  redesSociales?: string;
  whatsapp: string;
  email?: string;
  pais?: string;
  ciudad?: string;
  canal_origen?: string;
  notas?: string;
  categoria?: Categoria;
  nichoMercado?: string;
}
