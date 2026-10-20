export interface MensajePlantilla {
  id: string;
  etapa: string;
  titulo: string | null;
  contenido: string;
  created_at: string;
}

/**
 * Sugerencias de etapa, no una lista cerrada: Kathe puede escribir cualquier
 * otra etapa nueva. El orden aquí es el orden en que se muestran los grupos.
 */
export const ETAPAS_MENSAJE_SUGERIDAS = [
  "Mensaje en frío",
  "Invitación a videollamada",
  "Preguntas para la reunión",
  "Seguimiento",
  "Cierre / objeciones",
];
