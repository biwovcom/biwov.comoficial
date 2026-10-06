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

export type Categoria = "contacto" | "lead" | "prospecto" | "cliente";

/**
 * Alerta de seguimiento manual — independiente del paso del embudo. Es
 * texto libre (como nicho_mercado): estas son solo sugerencias para no
 * escribir desde cero, Kathe puede escribir cualquier otra etiqueta.
 */
export const SEGUIMIENTO_SUGERIDO = [
  "Pendiente por escribir",
  "Pendiente enviar información",
  "Pendiente enviar cotización",
  "Pendiente agendar llamada",
  "Pendiente confirmar pago",
  "Interesado",
];

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
  cliente: "Cliente",
};

/** Reutiliza las variantes de color que ya tiene <Badge>. */
export const BADGE_VARIANTE_CATEGORIA: Record<Categoria, "neutral" | "amarillo" | "accent" | "verde"> = {
  contacto: "neutral",
  lead: "amarillo",
  prospecto: "accent",
  cliente: "verde",
};

/** Estilo de alerta — se ve distinto a las demás etiquetas para saltar a la vista en la lista. */
export const ESTILO_SEGUIMIENTO = "border-amber-500/50 bg-amber-500/15 text-amber-300";

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
  seguimiento: string | null;
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
