export interface ComplementoItem {
  label: string;
  precio: string;
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
    titulo: "Producción de contenido",
    detalle: "Fotografía y video profesional para tu marca, en 3 niveles según tu necesidad.",
    tipo: "produccion",
  },
  {
    titulo: "Páginas web adicionales",
    detalle:
      "Páginas web (landing pages, en inglés) para un nuevo producto, evento o lanzamiento: una sola pantalla enfocada en lograr una acción puntual.",
    items: [
      {
        label: "Página web para recolectar base de datos (solo captura de leads)",
        precio: "$1.000.000 COP (página) + $100.000 COP (dominio) + US$33/mes (herramienta)",
      },
      { label: "Página web de agendamiento", precio: "Costo por definir" },
      { label: "Página web de ventas de producto", precio: "Costo por definir" },
    ],
    nota: "El valor de la herramienta mensual puede cambiar si el proveedor ajusta sus precios; queda estipulado en el contrato.",
  },
  {
    titulo: "Creación de campaña publicitaria",
    detalle: "Para cuando solo necesitas que te armemos y optimicemos la campaña, sin un plan completo.",
    items: [
      {
        label:
          "Montaje mínimo de 6 creativos o contenidos (tú nos pasas los videos; nosotros damos los lineamientos de los textos del anuncio)",
        precio: "$400.000 COP",
      },
      { label: "Informe y análisis de la campaña (se comparte cada semana, al finalizar la semana)", precio: "Incluido" },
      { label: "Optimización de la campaña publicitaria", precio: "Incluido" },
    ],
  },
  {
    titulo: "Asesoría personalizada",
    detalle:
      "Una sesión 1 a 1 con Kathe si prefieres una guía puntual para ejecutar tú misma, en vez de un plan completo.",
    items: [
      { label: "Sesión de asesoría personalizada (90 minutos)", precio: "US$97 · pago único" },
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
