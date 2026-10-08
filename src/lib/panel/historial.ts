export interface HistorialEntrada {
  id: string;
  prospecto_id: string;
  parent_id: string | null;
  tipo: string;
  contenido: string;
  created_at: string;
}

/** Sugerencias para los recuadros que se agregan dentro de una nota existente. */
export const TIPOS_RESPUESTA_SUGERIDOS = ["Respuesta", "Resumen", "Plan de acción", "Seguimiento"];

/** Sugerencias de tipo, no una lista cerrada: Kathe puede escribir cualquier otra cosa. */
export const TIPOS_HISTORIAL_SUGERIDOS = [
  "Diagnóstico redes sociales",
  "Diagnóstico de la empresa",
  "Llamada",
  "Reunión",
  "Seguimiento",
  "Nota general",
];
