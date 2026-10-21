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
    titulo: "Producción de contenido",
    detalle: "Fotografía y video profesional para tu marca, en 3 niveles según tu necesidad.",
    tipo: "produccion",
  },
  {
    titulo: "Páginas web y sitios web adicionales",
    detalle:
      "Landing page (una sola pantalla enfocada en una acción puntual) o sitio web de varias páginas, según lo que necesites. Todos incluyen hosting y dominio.",
    items: [
      {
        label: "Landing page (1 página, sin conexión API)",
        precio: "$1.129.000 COP",
        precioCop: 1129000,
      },
      {
        label: "Sitio web de 5 páginas",
        precio: "$1.799.000 COP",
        precioCop: 1799000,
      },
      {
        label: "Sitio web de 10 páginas",
        precio: "$2.499.000 COP",
        precioCop: 2499000,
      },
      {
        label: "Conexión por API a la campaña publicitaria (add-on, se integra a cualquiera de los anteriores)",
        precio: "$350.000 COP",
        precioCop: 350000,
      },
    ],
    nota: "Todos incluyen hosting y dominio. La conexión por API es solo la integración técnica para pasar los leads de la página a la campaña; no incluye el montaje completo de GHL ni la gestión de la campaña.",
  },
  {
    titulo: "Campaña publicitaria en Meta",
    detalle: "Para cuando solo necesitas que te armemos y gestionemos la campaña, sin un plan completo.",
    items: [
      {
        label: "Gestión mensual (montaje, seguimiento, optimización, análisis e informe mensual)",
        precio: "$400.000 COP/mes",
        precioCop: 400000,
      },
      { label: "Requisito para arrancar: mínimo 6 piezas creativas (videos o imágenes)", precio: "A cargo del cliente" },
      { label: "Permanencia mínima", precio: "3 meses" },
    ],
    nota: "La inversión en pauta publicitaria la paga el cliente directamente a Meta; no está incluida en el valor de la gestión.",
  },
  {
    titulo: "Asesoría personalizada",
    detalle:
      "Una sesión 1 a 1 con Kathe si prefieres una guía puntual para ejecutar tú misma, en vez de un plan completo.",
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
