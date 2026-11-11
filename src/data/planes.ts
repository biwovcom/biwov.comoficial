import type { PrecioDual } from "@/lib/moneda";
import type { LineaId } from "@/data/lineas";

export interface ItemPlan {
  label: string;
  subitems?: string[];
}

export type PlanId =
  | "direccion"
  | "crecimiento-estrategico"
  | "growth-partner"
  | "gestion-esencial"
  | "gestion-crecimiento"
  | "gestion-integral";

export const PLAN_IDS = [
  "direccion",
  "crecimiento-estrategico",
  "growth-partner",
  "gestion-esencial",
  "gestion-crecimiento",
  "gestion-integral",
] as const satisfies readonly PlanId[];

export interface Plan {
  id: PlanId;
  /** Línea de negocio: dirección (tú ejecutas) o gestión (nosotros lo hacemos). */
  linea: Extract<LineaId, "direccion" | "gestion">;
  nombre: string;
  claim: string;
  resumen: string;
  paraQuien: string;
  incluye: ItemPlan[];
  noIncluye: string[];
  precioDesde: PrecioDual;
  /** Los planes nuevos no tienen montaje inicial; se deja en 0. */
  montajeInicial: PrecioDual;
  recomendado?: boolean;
  /** Link de pago real (ej. Hotmart). Mientras no exista, "Comprar ahora" usa el flujo de firma + WhatsApp. */
  linkPago?: string;
}

/** Compromiso mínimo de los planes mensuales. */
export const DURACION_MINIMA_MESES = 3;

const SIN_MONTAJE: PrecioDual = { cop: 0, usd: 0 };

const NO_INCLUYE_DIRECCION = [
  "Diseño gráfico, edición de video, grabación ni publicación (eso lo hace tu equipo)",
  "Responder mensajes de tus clientes",
  "Montaje o gestión de campañas pagas",
  "La inversión en pauta publicitaria",
];

const NO_INCLUYE_GESTION = [
  "Grabación presencial: tú nos envías los videos y fotos, y nosotros los editamos (si quieres que grabemos, suma un paquete de producción)",
  "Responder mensajes comerciales o cerrar ventas",
  "Montaje y gestión de campañas pagas (se suma como adicional)",
  "La inversión en pauta publicitaria",
];

/** Tabla comparativa que ve el cliente para elegir rápido entre los planes de una línea. */
export const COMPARATIVO_PLANES: Record<Plan["linea"], { label: string; valores: string[] }[]> = {
  direccion: [
    { label: "Quién ejecuta", valores: ["Tú o tu equipo", "Tú o tu equipo", "Tu equipo interno"] },
    { label: "Reuniones al mes", valores: ["1", "2", "4"] },
    { label: "Contenidos en el calendario", valores: ["8", "12", "16"] },
    { label: "Guiones de video", valores: ["4", "8", "12"] },
    { label: "Estructuras de carrusel", valores: ["2", "4", "6"] },
    { label: "Estrategia de historias", valores: ["Básica", "Semanal", "Semanal"] },
    { label: "Diagnóstico", valores: ["Inicial", "Completo", "Integral"] },
    { label: "Embudo de contenidos", valores: ["—", "1", "1"] },
    { label: "Flujo comercial", valores: ["—", "Básico", "Avanzado"] },
    { label: "Supervisión de tu equipo", valores: ["—", "—", "Sí"] },
  ],
  gestion: [
    { label: "Quién ejecuta", valores: ["biwov", "biwov", "biwov"] },
    { label: "Redes sociales", valores: ["1", "Hasta 2", "Hasta 3"] },
    { label: "Publicaciones al mes", valores: ["8", "12", "16"] },
    { label: "Diseños gráficos", valores: ["4", "6", "8"] },
    { label: "Reels editados", valores: ["4", "6", "8"] },
    { label: "Historias", valores: ["8", "12", "20"] },
    { label: "Reuniones al mes", valores: ["1", "1", "2"] },
    { label: "Gestión de comunidad", valores: ["—", "—", "Básica"] },
  ],
};

// Valores en USD son una referencia aproximada (tasa ~4.000 COP/USD).
export const PLANES: Plan[] = [
  // ───────────── Línea 01 · Dirección estratégica (el cliente ejecuta) ─────────────
  {
    id: "direccion",
    linea: "direccion",
    nombre: "Dirección",
    claim: "Orden y orientación para empezar",
    resumen: "Te decimos qué publicar, cómo y cuándo. Tú lo ejecutas.",
    paraQuien:
      "Para emprendedores y negocios que necesitan orden y orientación para empezar a trabajar su marketing con estrategia.",
    incluye: [
      { label: "1 reunión estratégica al mes (60 minutos)" },
      { label: "Diagnóstico inicial de tus canales digitales" },
      {
        label: "Calendario mensual de 8 contenidos",
        subitems: ["4 guiones para videos cortos", "2 estructuras de carrusel", "Estrategia básica de historias"],
      },
      { label: "Lineamientos de comunicación y tono de marca" },
      { label: "Guía de publicación y recomendaciones" },
      { label: "Informe mensual de indicadores" },
    ],
    noIncluye: NO_INCLUYE_DIRECCION,
    precioDesde: { cop: 850000, usd: 215 },
    montajeInicial: SIN_MONTAJE,
  },
  {
    id: "crecimiento-estrategico",
    linea: "direccion",
    nombre: "Crecimiento Estratégico",
    claim: "Un sistema de marketing que tu equipo pueda ejecutar",
    resumen: "Estrategia, guiones, embudo y acompañamiento cada 15 días.",
    paraQuien:
      "Para empresas que quieren profesionalizar su comunicación, generar oportunidades de venta y aprender a ejecutar un sistema de contenidos.",
    incluye: [
      { label: "2 sesiones estratégicas al mes" },
      { label: "Diagnóstico completo y optimización de tus redes" },
      {
        label: "Calendario mensual de 12 contenidos",
        subitems: ["8 guiones de reels", "4 estructuras de carrusel", "Estrategia semanal de historias"],
      },
      { label: "1 embudo de contenidos (atraer, generar confianza y vender)" },
      { label: "Flujo comercial básico para hacer seguimiento a tus interesados" },
      { label: "Guías para grabar con celular" },
      { label: "Lineamientos de diseño y copywriting" },
      { label: "Revisión de métricas e informe mensual con recomendaciones" },
      { label: "Soporte por WhatsApp en horario laboral" },
    ],
    noIncluye: NO_INCLUYE_DIRECCION,
    precioDesde: { cop: 1450000, usd: 365 },
    montajeInicial: SIN_MONTAJE,
    recomendado: true,
  },
  {
    id: "growth-partner",
    linea: "direccion",
    nombre: "Growth Partner",
    claim: "Dirección para tu equipo de marketing y ventas",
    resumen: "Dirigimos, supervisamos y optimizamos el trabajo de tu equipo.",
    paraQuien:
      "Para empresas con equipo interno de marketing o ventas que necesitan dirección, supervisión y optimización.",
    incluye: [
      { label: "4 reuniones de seguimiento al mes (una por semana)" },
      { label: "Diagnóstico integral de marketing y ventas" },
      { label: "Planeación estratégica mensual" },
      {
        label: "Calendario mensual de hasta 16 contenidos",
        subitems: ["12 guiones y estructuras de contenido", "6 estructuras de carrusel", "Estrategia semanal de historias"],
      },
      { label: "Estrategia de captación y conversión" },
      { label: "Flujo comercial avanzado y seguimiento de leads" },
      { label: "Supervisión de tu equipo interno" },
      { label: "Revisión de tus campañas y embudos actuales" },
      { label: "Tablero de indicadores" },
      { label: "Plan de optimización mensual" },
    ],
    noIncluye: [...NO_INCLUYE_DIRECCION, "Desarrollo tecnológico (páginas, CRM o automatizaciones)"],
    precioDesde: { cop: 2300000, usd: 575 },
    montajeInicial: SIN_MONTAJE,
  },

  // ───────────── Línea 02 · Gestión de marketing (biwov ejecuta) ─────────────
  {
    id: "gestion-esencial",
    linea: "gestion",
    nombre: "Gestión Esencial",
    claim: "Tu red social al día, sin que tengas que hacerlo tú",
    resumen: "1 red social con 8 publicaciones y 8 historias al mes.",
    paraQuien: "Para negocios que necesitan mantener una presencia digital organizada y constante.",
    incluye: [
      { label: "Manejo de 1 red social" },
      {
        label: "8 publicaciones al mes",
        subitems: ["4 diseños gráficos", "4 reels editados con el material que nos envías"],
      },
      { label: "8 historias al mes" },
      { label: "Calendario de contenidos, copywriting y llamados a la acción" },
      { label: "Programación y publicación" },
      { label: "1 reunión mensual de seguimiento" },
      { label: "Informe mensual" },
    ],
    noIncluye: NO_INCLUYE_GESTION,
    precioDesde: { cop: 1850000, usd: 465 },
    montajeInicial: SIN_MONTAJE,
  },
  {
    id: "gestion-crecimiento",
    linea: "gestion",
    nombre: "Gestión Crecimiento",
    claim: "Comunicación constante que genera oportunidades",
    resumen: "Hasta 2 redes con 12 publicaciones y 12 historias al mes.",
    paraQuien:
      "Para empresas que quieren comunicar con constancia y generar oportunidades comerciales.",
    incluye: [
      { label: "Manejo de hasta 2 redes sociales" },
      {
        label: "12 publicaciones al mes",
        subitems: ["6 diseños gráficos", "6 reels editados con el material que nos envías"],
      },
      { label: "12 historias al mes" },
      { label: "Estrategia de contenido mensual" },
      { label: "Guiones y copywriting" },
      { label: "Programación y publicación" },
      { label: "Optimización de tus perfiles" },
      { label: "Revisión de indicadores e informe mensual" },
      { label: "1 reunión mensual de seguimiento" },
    ],
    noIncluye: NO_INCLUYE_GESTION,
    precioDesde: { cop: 2650000, usd: 665 },
    montajeInicial: SIN_MONTAJE,
    recomendado: true,
  },
  {
    id: "gestion-integral",
    linea: "gestion",
    nombre: "Gestión Integral",
    claim: "Delega gran parte de tu operación digital",
    resumen: "Hasta 3 redes con 16 publicaciones, 20 historias y gestión básica de comunidad.",
    paraQuien: "Para empresas que necesitan delegar gran parte de su operación digital.",
    incluye: [
      { label: "Manejo de hasta 3 redes sociales" },
      {
        label: "16 publicaciones al mes",
        subitems: ["8 diseños gráficos", "8 reels editados con el material que nos envías"],
      },
      { label: "20 historias al mes" },
      { label: "Planeación estratégica mensual" },
      { label: "Guiones y copywriting" },
      { label: "Programación y publicación" },
      {
        label: "Gestión básica de comunidad",
        subitems: [
          "Respuestas básicas a comentarios y mensajes, en horario laboral definido",
          "No incluye atención comercial ilimitada ni cierre de ventas",
        ],
      },
      { label: "2 reuniones mensuales de seguimiento" },
      { label: "Informe de resultados y oportunidades de mejora" },
    ],
    noIncluye: NO_INCLUYE_GESTION.filter((n) => !n.startsWith("Responder")),
    precioDesde: { cop: 3900000, usd: 975 },
    montajeInicial: SIN_MONTAJE,
  },
];
