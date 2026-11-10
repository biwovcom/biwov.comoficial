export const CIFRAS_KATHE = [
  { valor: "~7x", etiqueta: "Retorno en pauta para FashionLash ($700 mil → $5 millones COP)" },
  { valor: "+10", etiqueta: "Clientes atendidos" },
  { valor: "3 años", etiqueta: "Con biwov_ (desde agosto 2023)" },
];

export interface HitoTrayectoria {
  anio: string;
  titulo: string;
  detalle: string;
}

export const TRAYECTORIA: HitoTrayectoria[] = [
  {
    anio: "2022",
    titulo: "Graduada en Administración de Negocios Internacionales",
    detalle:
      "Living House (Manizales): manejo de redes sociales, creación de contenido y campañas publicitarias.",
  },
  {
    anio: "2023",
    titulo: "Fundo biwov_ (agosto)",
    detalle:
      "Sitios web en WordPress, tiendas virtuales en PrestaShop. Formación en UX/UI, HTML y CSS.",
  },
  {
    anio: "2024",
    titulo: "Especialización en landing pages",
    detalle: "Enfocadas en conversión.",
  },
  {
    anio: "2025",
    titulo: "Ecosistemas y lanzamientos",
    detalle:
      "GoHighLevel, email marketing, WhatsApp API, píxel de Meta, lanzamientos, webinars, VSL, embudos evergreen, Hotmart y Centralize. Gestión con ClickUp, Jira y Slack. Coordinación logística de 3 workshops presenciales de marketing digital en Manizales (~15 asistentes por evento).",
  },
  {
    anio: "2026",
    titulo: "Chatbots con IA",
    detalle: "Integrados a tiendas virtuales y ecosistemas completos.",
  },
];

export interface PasoComoTrabajo {
  numero: number;
  titulo: string;
  frase: string;
}

export const COMO_TRABAJO: PasoComoTrabajo[] = [
  {
    numero: 1,
    titulo: "Diagnóstico",
    frase: "Analizamos tu negocio, las herramientas que ya usas y hasta dónde quieres crecer.",
  },
  {
    numero: 2,
    titulo: "Diseño del plan",
    frase: "Definimos qué piezas necesitas y cómo se van a conectar entre sí.",
  },
  {
    numero: 3,
    titulo: "Implementación",
    frase: "Construimos cada pieza: contenido, canales, CRM, sitio web y publicidad.",
  },
  {
    numero: 4,
    titulo: "Automatización",
    frase: "Conectamos todo con automatizaciones e IA para que el sistema trabaje por ti.",
  },
  {
    numero: 5,
    titulo: "Escala",
    frase: "Medimos, ajustamos y seguimos creciendo de la mano con tu negocio.",
  },
];

export interface ClienteKathe {
  nombre: string;
  descripcion: string;
  resultado?: string;
  url?: string;
}

export const CLIENTES_KATHE: ClienteKathe[] = [
  {
    nombre: "FashionLash",
    descripcion: "Creación de contenido y pauta.",
    resultado: "Inversión de $700 mil COP con retorno de $5 millones COP.",
  },
  {
    nombre: "Essenia Spa Termales El Otoño",
    descripcion: "Marketing digital, crecimiento de audiencia, campañas y contenido.",
  },
  {
    nombre: "Vortis",
    descripcion: "Capacitaciones en masajes. Marketing digital, crecimiento de audiencia, campañas y contenido.",
  },
  {
    nombre: "321 Space Cleaners",
    descripcion: "Estados Unidos. Sitio web.",
  },
  {
    nombre: "Almacén Sanandresito",
    descripcion: "Manejo de redes sociales y campañas publicitarias.",
  },
  {
    nombre: "Living House",
    descripcion: "Manejo de redes sociales.",
    resultado: "Nos volvieron a contratar al terminar el primer ciclo.",
  },
  {
    nombre: "Cafenet",
    descripcion: "Actualización del sitio web y asesorías personalizadas.",
  },
  {
    nombre: "Firmas de abogados",
    descripcion: "Sitios web profesionales.",
  },
];

export interface ItemFormacion {
  /** Institución o evento, se muestra como "logo". */
  institucion: string;
  /** Estilo del logo (color y tipografía) para que se vea llamativo. */
  estilo: "udemy" | "invictus" | "hotmart" | "polisura" | "javi" | "silicon" | "neutro";
  detalle: string;
  tipo: "Curso" | "Conferencia" | "Evento" | "Mentoría" | "Formación";
}

export const PROFESION_KATHE = "Administradora de Negocios Internacionales";

export const CONOCIMIENTOS_KATHE = [
  "UX y UI",
  "Marketing digital",
  "HTML y CSS",
  "Pauta en Meta",
  "Contenido para pauta",
  "CRM y automatización",
  "Lanzamientos digitales",
];

export const FORMACION_KATHE: ItemFormacion[] = [
  { institucion: "Udemy", estilo: "udemy", tipo: "Curso", detalle: "UX y UI" },
  { institucion: "Udemy", estilo: "udemy", tipo: "Curso", detalle: "Marketing digital" },
  { institucion: "Udemy", estilo: "udemy", tipo: "Curso", detalle: "HTML y CSS" },
  { institucion: "Polisura", estilo: "polisura", tipo: "Curso", detalle: "Cursos de marketing digital" },
  { institucion: "Invictus", estilo: "invictus", tipo: "Conferencia", detalle: "Conferencias de negocios y marketing" },
  { institucion: "Hotmart", estilo: "hotmart", tipo: "Conferencia", detalle: "Conferencias de lanzamientos y productos digitales" },
  { institucion: "Mentes Millonarias", estilo: "javi", tipo: "Evento", detalle: "Evento y curso de Javi Rodríguez" },
  { institucion: "El Silicon Valley", estilo: "silicon", tipo: "Evento", detalle: "Comunidad y eventos de tecnología" },
  { institucion: "Fabián Castro G", estilo: "neutro", tipo: "Mentoría", detalle: "Mentoría en negocios digitales" },
  { institucion: "Bárbara Bruna", estilo: "neutro", tipo: "Formación", detalle: "Contenido para pauta" },
  { institucion: "Juan Ads", estilo: "neutro", tipo: "Formación", detalle: "Campañas publicitarias" },
];

export interface GrupoHerramientas {
  categoria: string;
  items: string[];
}

export const HERRAMIENTAS_KATHE: GrupoHerramientas[] = [
  { categoria: "Gestión", items: ["ClickUp", "Jira", "Slack"] },
  { categoria: "Web", items: ["WordPress", "PrestaShop", "HTML", "CSS"] },
  { categoria: "CRM y automatización", items: ["GoHighLevel", "Centralize", "WhatsApp API", "n8n", "Chatbots"] },
  { categoria: "Ventas y lanzamientos", items: ["Hotmart", "Webinars", "VSL", "Evergreen", "Email marketing"] },
  { categoria: "Pauta", items: ["Meta Ads", "Píxel de Meta"] },
  { categoria: "Inteligencia artificial", items: ["Claude", "OpenAI", "Gemini"] },
];
