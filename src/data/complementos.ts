export interface ComplementoItem {
  label: string;
  precio?: string;
  /** Si tiene valor, el precio se convierte en vivo a USD con la TRM del día (reemplaza a "precio" en pantalla). */
  precioCop?: number;
}

export interface Complemento {
  titulo: string;
  detalle: string;
  items?: ComplementoItem[];
  nota?: string;
  tipo?: "produccion";
  /** Link de agendamiento (Google Calendar) para los complementos que se agendan antes de confirmar la compra. */
  linkAgendar?: string;
  textoBotonAgendar?: string;
}

export const COMPLEMENTOS: Complemento[] = [
  {
    titulo: "Asesoría personalizada",
    detalle:
      "Una sesión 1 a 1 con Kathe si prefieres una guía puntual para ejecutar tú mismo, en vez de un plan mensual.",
    items: [
      { label: "Sesión de asesoría personalizada (90 minutos)" },
      { label: "Análisis de tu negocio y tus redes antes de la sesión", precio: "Incluido" },
      { label: "Ideas de contenido para tu marca", precio: "Incluido" },
      { label: "Lineamientos y guía para implementar tú misma/o", precio: "Incluido" },
      { label: "Temas puntuales por mejorar en tu negocio", precio: "Incluido" },
      { label: "Plan de 15 días para escalar tu negocio, con herramientas y estrategias para implementar", precio: "Incluido" },
    ],
    nota: "Al agendar, cuéntanos sobre tu negocio: con esa información llegamos a la sesión ya con el análisis hecho.",
    linkAgendar: "https://calendar.app.google/rCqA6ayJGPRHHJuX9",
    textoBotonAgendar: "Agendar mi asesoría",
  },
];
