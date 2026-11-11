import { NIVELES_PRODUCCION, PRODUCCION_CONTENIDO } from "@/data/addOns";
import type { LineaId } from "@/data/lineas";
import type { TipoContrato } from "@/lib/contrato";

export type CategoriaExtra =
  | "Producción audiovisual"
  | "Edición y guía de grabación"
  | "Campañas en Meta"
  | "WhatsApp y agentes de IA"
  | "Email marketing"
  | "WhatsApp masivo"
  | "Automatización de procesos"
  | "Páginas web y embudos";

export interface ExtraCotizable {
  id: string;
  nombre: string;
  categoria: CategoriaExtra;
  linea: LineaId;
  tipoContrato: TipoContrato;
  precioCop: number;
  periodicidad: "único" | "mensual";
  /** El precio es un "desde": el valor final depende del alcance. */
  desde?: boolean;
  recomendado?: boolean;
  descripcion?: string;
  incluye?: string[];
  noIncluye?: string[];
  /** Nota corta visible en la tarjeta (ej. el mantenimiento opcional). */
  nota?: string;
}

export const CATEGORIAS_EXTRA: CategoriaExtra[] = [
  "Producción audiovisual",
  "Edición y guía de grabación",
  "Campañas en Meta",
  "WhatsApp y agentes de IA",
  "Email marketing",
  "WhatsApp masivo",
  "Automatización de procesos",
  "Páginas web y embudos",
];

/** Subtítulo que explica cada categoría al cliente (ej. las dos modalidades de producción). */
export const DESCRIPCION_CATEGORIA: Partial<Record<CategoriaExtra, string>> = {
  "Producción audiovisual": "biwov produce: nosotros planificamos, grabamos, dirigimos y editamos.",
  "Edición y guía de grabación": "Tú produces: tú grabas y nosotros te orientamos y editamos. Menor inversión.",
  "Campañas en Meta": "Adicional para cualquier plan o para contratar solo. La pauta se paga directo a Meta.",
  "WhatsApp y agentes de IA": "Implementación única + mantenimiento mensual opcional.",
  "Email marketing": "Implementación única + gestión mensual opcional.",
  "WhatsApp masivo": "Gestión de campañas a tu base de datos autorizada. Los mensajes se pagan según consumo.",
  "Automatización de procesos": "Implementación única + soporte mensual opcional.",
  "Páginas web y embudos": "Proyectos con hosting y dominio el primer año + mantenimiento opcional.",
};

export const CATEGORIAS_POR_LINEA: Record<LineaId, CategoriaExtra[]> = {
  direccion: [],
  gestion: ["Campañas en Meta"],
  produccion: ["Producción audiovisual", "Edición y guía de grabación"],
  automatizacion: ["WhatsApp y agentes de IA", "Email marketing", "WhatsApp masivo", "Automatización de procesos"],
  ecosistemas: ["Páginas web y embudos"],
};

const NO_INCLUYE_CONSUMO = [
  "Licencias de las plataformas (CRM, proveedor de WhatsApp, herramientas de correo o de IA)",
  "Cargos de Meta por mensajes de WhatsApp y consumo de IA (tokens)",
];

const REQUISITOS_BASE_DATOS =
  "Solo se trabaja con bases de datos obtenidas legalmente, con autorización para recibir mensajes comerciales y opción para darse de baja";

const cop = (n: number) => `$${n.toLocaleString("es-CO")}`;

export const EXTRAS_COTIZABLES: ExtraCotizable[] = [
  // ───────────── 03 · Producción audiovisual ─────────────
  ...NIVELES_PRODUCCION.map(
    (nivel): ExtraCotizable => ({
      id: `produccion-${nivel.id}`,
      nombre: `Producción ${nivel.nombre}`,
      categoria: "Producción audiovisual",
      linea: "produccion",
      tipoContrato: "produccion",
      precioCop: nivel.precio.cop,
      periodicidad: "único",
      recomendado: nivel.id === "professional",
      descripcion: `${nivel.tiempoProduccion} de producción. ${nivel.idealPara}`,
      incluye: [
        `${nivel.reels} videos verticales editados y listos para publicar (hasta ${nivel.duracionReel} segundos cada uno)`,
        ...(nivel.fotografias ? [`${nivel.fotografias} fotografías profesionales editadas`] : []),
        ...(nivel.clipsBRoll ? [`${nivel.clipsBRoll} clips de B-Roll (videos de apoyo)`] : []),
        `Sesión de grabación presencial: ${nivel.tiempoProduccion.toLowerCase()}`,
        `Dirección creativa ${nivel.direccionCreativa.toLowerCase()}`,
        nivel.guiones,
        nivel.equipo,
        "Edición profesional y corrección de color",
        "1 ronda de ajustes",
        `Equivale a ${cop(Math.round(nivel.precio.cop / nivel.reels))} por video`,
      ],
      noIncluye: PRODUCCION_CONTENIDO.noIncluye,
    }),
  ),

  // ───────────── 03 · "Tú produces": el cliente graba, biwov orienta y edita ─────────────
  {
    id: "edicion-asesoria-6-guiones",
    nombre: "Asesoría de grabación + 6 guiones",
    categoria: "Edición y guía de grabación",
    linea: "produccion",
    tipoContrato: "produccion",
    precioCop: 450000,
    periodicidad: "único",
    descripcion: "Para que tú grabes con tu celular, con instrucciones claras y guiones listos.",
    incluye: [
      "Asesoría de grabación: luz, encuadre, audio y tomas de apoyo",
      "6 guiones de videos cortos para tu marca",
      "Recomendaciones de publicación",
    ],
    noIncluye: ["Grabación presencial", "Edición de los videos"],
  },
  {
    id: "edicion-direccion-remota",
    nombre: "Dirección de grabación remota",
    categoria: "Edición y guía de grabación",
    linea: "produccion",
    tipoContrato: "produccion",
    precioCop: 250000,
    periodicidad: "único",
    descripcion: "Te dirigimos en vivo por videollamada mientras grabas.",
    incluye: ["1 sesión por videollamada", "Dirección de tomas, encuadre, luz y actitud frente a cámara"],
    noIncluye: ["Edición de los videos", "Desplazamiento presencial"],
  },
  ...[
    { n: 6, precio: 850000 },
    { n: 8, precio: 1050000, recomendado: true },
    { n: 12, precio: 1450000 },
  ].map(
    ({ n, precio, recomendado }): ExtraCotizable => ({
      id: `edicion-${n}-reels`,
      nombre: `Edición de ${n} reels`,
      categoria: "Edición y guía de grabación",
      linea: "produccion",
      tipoContrato: "produccion",
      precioCop: precio,
      periodicidad: "único",
      recomendado,
      descripcion: "Tú grabas y nos envías el material; nosotros lo editamos.",
      incluye: [
        `${n} reels editados con el material que nos envías (hasta 60 segundos cada uno)`,
        "Cortes, subtítulos, música y corrección de color",
        "Entrega en formato vertical, listo para publicar",
        "1 ronda de ajustes por reel",
        `Equivale a ${cop(Math.round(precio / n))} por reel`,
      ],
      noIncluye: ["Grabación presencial", "Publicación en tus redes"],
    }),
  ),

  // ───────────── 02 · Adicional de gestión: campañas en Meta ─────────────
  {
    id: "meta-configuracion",
    nombre: "Configuración inicial de campaña",
    categoria: "Campañas en Meta",
    linea: "gestion",
    tipoContrato: "campana-meta",
    precioCop: 350000,
    periodicidad: "único",
    descripcion: "Dejamos lista tu cuenta publicitaria y tu primera campaña.",
    incluye: [
      "Revisión y configuración de tu cuenta publicitaria y tu página",
      "Instalación o revisión del píxel de Meta",
      "Estructura de la campaña, públicos y anuncios",
    ],
    noIncluye: ["La inversión en pauta (se paga directo a Meta)", "Las piezas creativas"],
  },
  {
    id: "meta-gestion-1-2",
    nombre: "Gestión mensual de 1 a 2 campañas",
    categoria: "Campañas en Meta",
    linea: "gestion",
    tipoContrato: "campana-meta",
    precioCop: 650000,
    periodicidad: "mensual",
    recomendado: true,
    descripcion: "Montamos, seguimos y optimizamos tus campañas cada mes.",
    incluye: [
      "Hasta 2 campañas activas",
      "Seguimiento y optimización durante el mes",
      "Informe mensual de resultados",
      "Requisito: mínimo 6 piezas creativas para arrancar",
      "Permanencia mínima: 3 meses",
    ],
    noIncluye: ["La inversión en pauta (se paga directo a Meta)", "Las piezas creativas"],
  },
  {
    id: "meta-gestion-3-5",
    nombre: "Gestión mensual de 3 a 5 campañas",
    categoria: "Campañas en Meta",
    linea: "gestion",
    tipoContrato: "campana-meta",
    precioCop: 950000,
    periodicidad: "mensual",
    descripcion: "Para negocios con varias ofertas o públicos al mismo tiempo.",
    incluye: [
      "De 3 a 5 campañas activas",
      "Seguimiento y optimización durante el mes",
      "Informe mensual de resultados",
      "Requisito: mínimo 6 piezas creativas para arrancar",
      "Permanencia mínima: 3 meses",
    ],
    noIncluye: ["La inversión en pauta (se paga directo a Meta)", "Las piezas creativas"],
  },
  {
    id: "meta-gestion-avanzada",
    nombre: "Gestión avanzada y optimización",
    categoria: "Campañas en Meta",
    linea: "gestion",
    tipoContrato: "campana-meta",
    precioCop: 1400000,
    periodicidad: "mensual",
    desde: true,
    descripcion: "Más de 5 campañas, pruebas A/B, remarketing y optimización avanzada.",
    incluye: [
      "Más de 5 campañas o estructuras avanzadas",
      "Pruebas de anuncios y públicos",
      "Remarketing y optimización avanzada",
      "Informe mensual de resultados",
      "Permanencia mínima: 3 meses",
    ],
    noIncluye: ["La inversión en pauta (se paga directo a Meta)", "Las piezas creativas"],
  },

  // ───────────── 04 · WhatsApp y agentes de IA ─────────────
  {
    id: "wa-starter",
    nombre: "WhatsApp Starter",
    categoria: "WhatsApp y agentes de IA",
    linea: "automatizacion",
    tipoContrato: "automatizacion",
    precioCop: 1290000,
    periodicidad: "único",
    descripcion: "Tu WhatsApp responde solo lo básico y te pasa a quien necesita un asesor.",
    nota: "Mensualidad del chatbot: $450.000 /mes (incluye la plataforma)",
    incluye: [
      "Configuración del canal",
      "Menú de bienvenida",
      "Hasta 3 flujos automatizados",
      "Hasta 8 preguntas frecuentes",
      "Captura de nombre y teléfono",
      "Derivación a un asesor humano",
      "Pruebas y capacitación",
      "Requiere la mensualidad del chatbot ($450.000 /mes), que incluye la licencia de la plataforma",
    ],
    noIncluye: [
      "La mensualidad del chatbot (se paga aparte cada mes)",
      "Cargos de Meta por mensajes de WhatsApp y consumo de IA (tokens)",
    ],
  },
  {
    id: "wa-starter-mant",
    nombre: "Mensualidad chatbot WhatsApp Starter",
    categoria: "WhatsApp y agentes de IA",
    linea: "automatizacion",
    tipoContrato: "automatizacion",
    precioCop: 450000,
    periodicidad: "mensual",
    descripcion:
      "Pago mensual para que tu chatbot siga funcionando: incluye la licencia de la plataforma, la revisión y los ajustes.",
    incluye: [
      "Licencia mensual de la plataforma del chatbot",
      "Revisión mensual del funcionamiento",
      "Ajustes menores a flujos y respuestas",
      "Soporte en horario laboral",
    ],
    noIncluye: [
      "Cargos de Meta por mensajes de WhatsApp y consumo de IA (tokens)",
      "Licencias de otras herramientas (CRM o correo)",
    ],
  },
  {
    id: "wa-business",
    nombre: "WhatsApp Business",
    categoria: "WhatsApp y agentes de IA",
    linea: "automatizacion",
    tipoContrato: "automatizacion",
    precioCop: 2490000,
    periodicidad: "único",
    recomendado: true,
    descripcion: "Califica a tus interesados, los sigue solo y avisa a tu equipo comercial.",
    nota: "Mantenimiento opcional: $590.000 /mes",
    incluye: [
      "Todo lo del WhatsApp Starter",
      "Hasta 8 flujos automatizados",
      "Captura y calificación de prospectos",
      "Seguimiento automatizado",
      "Integración con CRM",
      "Notificaciones a tu equipo comercial",
      "Hasta 2 rutas de atención",
      "Panel básico de seguimiento",
    ],
    noIncluye: NO_INCLUYE_CONSUMO,
  },
  {
    id: "wa-business-mant",
    nombre: "Mantenimiento WhatsApp Business",
    categoria: "WhatsApp y agentes de IA",
    linea: "automatizacion",
    tipoContrato: "automatizacion",
    precioCop: 590000,
    periodicidad: "mensual",
    descripcion: "Mantenemos, revisamos y optimizamos tu WhatsApp Business cada mes.",
    incluye: ["Revisión mensual de flujos y conversaciones", "Ajustes y optimización", "Soporte en horario laboral"],
    noIncluye: NO_INCLUYE_CONSUMO,
  },
  {
    id: "agente-ia-pro",
    nombre: "Agente IA Pro",
    categoria: "WhatsApp y agentes de IA",
    linea: "automatizacion",
    tipoContrato: "automatizacion",
    precioCop: 4500000,
    periodicidad: "único",
    desde: true,
    descripcion: "Un agente conversacional con IA entrenado con la información de tu negocio.",
    nota: "Mantenimiento opcional: $990.000 /mes",
    incluye: [
      "Agente conversacional con inteligencia artificial",
      "Base de conocimiento con la información de tu empresa",
      "Hasta 12 flujos de trabajo",
      "Calificación inteligente de prospectos",
      "Seguimiento comercial automatizado",
      "Integración con CRM",
      "Transferencia a asesores humanos",
      "Reportes de conversaciones",
      "Pruebas y optimización inicial",
    ],
    noIncluye: NO_INCLUYE_CONSUMO,
  },
  {
    id: "agente-ia-pro-mant",
    nombre: "Mantenimiento Agente IA Pro",
    categoria: "WhatsApp y agentes de IA",
    linea: "automatizacion",
    tipoContrato: "automatizacion",
    precioCop: 990000,
    periodicidad: "mensual",
    descripcion: "Mantenemos, entrenamos y optimizamos tu agente cada mes.",
    incluye: [
      "Actualización de la base de conocimiento",
      "Revisión de conversaciones y ajustes",
      "Reporte mensual",
      "Soporte en horario laboral",
    ],
    noIncluye: NO_INCLUYE_CONSUMO,
  },

  // ───────────── 04 · Email marketing ─────────────
  ...[
    { id: "email-starter", nombre: "Email Starter", impl: 990000, mes: 390000, auto: 2, camp: 2, seg: 2, opt: "básica" },
    { id: "email-business", nombre: "Email Business", impl: 1790000, mes: 690000, auto: 4, camp: 4, seg: 4, opt: "mensual", recomendado: true },
    { id: "email-growth", nombre: "Email Growth", impl: 2990000, mes: 1090000, auto: 6, camp: 8, seg: 6, opt: "avanzada" },
  ].flatMap((e): ExtraCotizable[] => [
    {
      id: e.id,
      nombre: `${e.nombre} (implementación)`,
      categoria: "Email marketing",
      linea: "automatizacion",
      tipoContrato: "automatizacion",
      precioCop: e.impl,
      periodicidad: "único",
      recomendado: e.recomendado,
      descripcion: "Dejamos instalado tu sistema de correo con sus automatizaciones.",
      nota: `Gestión mensual opcional: ${cop(e.mes)} /mes`,
      incluye: [
        "Configuración de la herramienta de correo y de tu base de datos",
        `${e.auto} automatizaciones (ej. bienvenida, seguimiento después de la compra, recordatorios o reactivación)`,
        `${e.seg} segmentos de contactos`,
        "Pruebas y capacitación",
        REQUISITOS_BASE_DATOS,
      ],
      noIncluye: NO_INCLUYE_CONSUMO.slice(0, 1),
    },
    {
      id: `${e.id}-mes`,
      nombre: `${e.nombre} (gestión mensual)`,
      categoria: "Email marketing",
      linea: "automatizacion",
      tipoContrato: "automatizacion",
      precioCop: e.mes,
      periodicidad: "mensual",
      descripcion: "Operamos tu email marketing cada mes.",
      incluye: [
        `${e.camp} campañas de correo al mes`,
        `Mantenimiento de ${e.auto} automatizaciones y ${e.seg} segmentos`,
        `Optimización ${e.opt}`,
        "Reporte mensual",
      ],
      noIncluye: NO_INCLUYE_CONSUMO.slice(0, 1),
    },
  ]),

  // ───────────── 04 · WhatsApp masivo ─────────────
  ...[
    { id: "masivo-starter", nombre: "Campaña masiva Starter", precio: 450000, detalle: ["1 campaña", "1 segmento de contactos", "1 plantilla"] },
    { id: "masivo-business", nombre: "Campaña masiva Business", precio: 790000, detalle: ["2 campañas", "2 segmentos de contactos", "Seguimiento de respuestas"], recomendado: true },
    { id: "masivo-growth", nombre: "Campaña masiva Growth", precio: 1290000, detalle: ["4 campañas", "Segmentación de contactos", "Seguimiento y reporte de resultados"] },
  ].map(
    (m): ExtraCotizable => ({
      id: m.id,
      nombre: m.nombre,
      categoria: "WhatsApp masivo",
      linea: "automatizacion",
      tipoContrato: "automatizacion",
      precioCop: m.precio,
      periodicidad: "único",
      recomendado: m.recomendado,
      descripcion: "Activamos tu base de datos para generar conversaciones de venta por WhatsApp.",
      incluye: [
        ...m.detalle,
        "Plantillas enviadas a aprobación de Meta",
        "Programación de los envíos",
        "Reporte de entrega y resultados",
        "Exclusión de contactos que no quieran recibir mensajes",
        REQUISITOS_BASE_DATOS,
      ],
      noIncluye: [
        "El costo de cada mensaje que cobra Meta y el proveedor de WhatsApp (se paga según consumo)",
        "Bases de datos compradas o sin autorización",
      ],
    }),
  ),

  // ───────────── 04 · Automatización de procesos ─────────────
  ...[
    { id: "proc-sencillo", nombre: "Flujo sencillo", precio: 1200000, ej: "Automatizamos 1 proceso (ej. formulario que registra los leads en tu CRM y avisa a tu vendedor)" },
    { id: "proc-integracion", nombre: "Integración de herramientas", precio: 2200000, ej: "Conectamos de 2 a 3 herramientas para que la información pase sola entre ellas" },
    { id: "proc-comercial", nombre: "Flujo comercial automatizado", precio: 3200000, ej: "Captación, registro, aviso al vendedor y seguimiento de prospectos que no responden", recomendado: true },
    { id: "proc-empresarial", nombre: "Sistema empresarial personalizado", precio: 5500000, ej: "Automatización de varios procesos comerciales y administrativos a la medida", desde: true },
  ].map(
    (p): ExtraCotizable => ({
      id: p.id,
      nombre: p.nombre,
      categoria: "Automatización de procesos",
      linea: "automatizacion",
      tipoContrato: "automatizacion",
      precioCop: p.precio,
      periodicidad: "único",
      desde: p.desde,
      recomendado: p.recomendado,
      descripcion: "Con n8n, Make, CRM y las herramientas que correspondan a tu proyecto.",
      nota: "Soporte mensual opcional: desde $350.000 /mes",
      incluye: [
        p.ej,
        "Número de flujos, integraciones y condiciones definido por escrito en la propuesta",
        "Pruebas y entrega funcionando",
        "Capacitación a tu equipo",
      ],
      noIncluye: NO_INCLUYE_CONSUMO.slice(0, 1),
    }),
  ),
  {
    id: "proc-soporte",
    nombre: "Soporte mensual de automatizaciones",
    categoria: "Automatización de procesos",
    linea: "automatizacion",
    tipoContrato: "automatizacion",
    precioCop: 350000,
    periodicidad: "mensual",
    desde: true,
    descripcion: "Revisamos y mantenemos tus automatizaciones funcionando.",
    incluye: ["Monitoreo de los flujos", "Corrección de fallas", "Ajustes menores", "Soporte en horario laboral"],
    noIncluye: ["Flujos o integraciones nuevas (se cotizan aparte)", ...NO_INCLUYE_CONSUMO.slice(0, 1)],
  },

  // ───────────── 05 · Ecosistemas digitales ─────────────
  ...[
    {
      id: "web-landing-captacion",
      nombre: "Landing de captación",
      precio: 1900000,
      descripcion: "Una página enfocada en que la persona te escriba, agende o deje sus datos.",
      incluye: ["1 página adaptada a celular", "Formulario y botón de acción", "Analítica básica"],
    },
    {
      id: "web-landing-estrategica",
      nombre: "Landing estratégica",
      precio: 2700000,
      recomendado: true,
      descripcion: "Una landing con estructura comercial y textos pensados para vender.",
      incluye: [
        "1 página adaptada a celular",
        "Copywriting y estructura comercial",
        "Formulario e integración con tu CRM, WhatsApp o píxel de Meta",
        "Analítica",
      ],
    },
    {
      id: "web-empresarial",
      nombre: "Web empresarial",
      precio: 4200000,
      descripcion: "El sitio de tu empresa, con hasta 5 secciones.",
      incluye: ["Hasta 5 secciones", "Diseño adaptado a celular", "Formulario de contacto", "SEO básico"],
    },
    {
      id: "web-avanzada",
      nombre: "Web empresarial avanzada",
      precio: 6500000,
      descripcion: "Un sitio más completo, con integraciones y optimización.",
      incluye: [
        "Hasta 10 secciones",
        "Diseño adaptado a celular",
        "Integraciones (CRM, WhatsApp, formularios, analítica)",
        "Optimización de velocidad y SEO",
      ],
    },
    {
      id: "web-embudo",
      nombre: "Embudo de conversión",
      precio: 4500000,
      descripcion: "Landing, formulario y seguimiento automático conectados.",
      incluye: ["Landing page", "Formulario de captación", "Automatización de seguimiento", "Medición del embudo"],
    },
    {
      id: "web-ecosistema",
      nombre: "Ecosistema comercial integrado",
      precio: 7500000,
      desde: true,
      descripcion: "Toda tu estructura para captar, atender, seguir y convertir clientes.",
      incluye: [
        "Landing page",
        "Formulario de captación",
        "CRM",
        "Integración con WhatsApp",
        "Automatización de seguimiento",
        "Panel de indicadores",
        "Capacitación de tu equipo",
      ],
    },
  ].map(
    (w): ExtraCotizable => ({
      id: w.id,
      nombre: w.nombre,
      categoria: "Páginas web y embudos",
      linea: "ecosistemas",
      tipoContrato: "sitio-web",
      precioCop: w.precio,
      periodicidad: "único",
      desde: w.desde,
      recomendado: w.recomendado,
      descripcion: w.descripcion,
      nota: "Mantenimiento web opcional: desde $250.000 /mes",
      incluye: [...w.incluye, "Hosting y dominio incluidos el primer año", "1 ronda de ajustes antes de publicar"],
      noIncluye: [
        "Renovación de hosting y dominio desde el segundo año",
        "Licencias o plantillas de pago y herramientas de terceros",
        "Textos, fotos y logos (los entregas tú, salvo que se coticen aparte)",
      ],
    }),
  ),
  {
    id: "web-mantenimiento",
    nombre: "Mantenimiento web",
    categoria: "Páginas web y embudos",
    linea: "ecosistemas",
    tipoContrato: "sitio-web",
    precioCop: 250000,
    periodicidad: "mensual",
    desde: true,
    descripcion: "Tu sitio actualizado, respaldado y revisado cada mes.",
    incluye: [
      "Actualizaciones técnicas",
      "Copias de seguridad",
      "Revisión técnica mensual",
      "Hasta 2 horas de cambios de contenido al mes",
    ],
    noIncluye: ["Secciones o funciones nuevas (se cotizan aparte)"],
  },
];
