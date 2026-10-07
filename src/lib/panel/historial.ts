export interface HistorialEntrada {
  id: string;
  prospecto_id: string;
  tipo: string;
  contenido: string;
  created_at: string;
}

/** Sugerencias de tipo, no una lista cerrada: Kathe puede escribir cualquier otra cosa. */
export const TIPOS_HISTORIAL_SUGERIDOS = [
  "Diagnóstico redes sociales",
  "Diagnóstico de la empresa",
  "Llamada",
  "Reunión",
  "Seguimiento",
  "Nota general",
];
