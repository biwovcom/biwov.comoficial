export type PasoActual =
  | "nuevo"
  | "filtro"
  | "diagnostico"
  | "analisis"
  | "propuesta_enviada"
  | "ganado"
  | "perdido";

export type Semaforo = "verde" | "amarillo" | "rojo";

export const NOMBRES_PASO: Record<PasoActual, string> = {
  nuevo: "Nuevo",
  filtro: "Filtro rápido",
  diagnostico: "Diagnóstico",
  analisis: "Análisis IA",
  propuesta_enviada: "Propuesta enviada",
  ganado: "Ganado",
  perdido: "Perdido",
};

export interface Prospecto {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string | null;
  whatsapp: string;
  email: string | null;
  pais: string | null;
  ciudad: string | null;
  canal_origen: string | null;
  notas: string | null;
  paso_actual: PasoActual;
  semaforo: Semaforo | null;
}

export interface NuevoProspectoInput {
  nombre: string;
  empresa?: string;
  whatsapp: string;
  email?: string;
  pais?: string;
  ciudad?: string;
  canal_origen?: string;
  notas?: string;
}
