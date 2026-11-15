/**
 * Portafolio de planes ESTÁNDAR para clientes (biwov.com/planes).
 * Vitrina simple para empresarios, en escalera de valor. La tienda (/tienda) sigue
 * siendo el catálogo completo de Kathe para cotizar todo lo demás.
 *
 * Precios en COP. En pantalla se convierten a USD con la TRM del día, salvo que el
 * plan tenga `usd` fijo. Cambiar precios SOLO aquí: carrusel, detalle, PDF y la
 * landing /agencia-ia leen este archivo.
 */

/** Permanencia mínima de todos los planes mensuales. */
export const MESES_MINIMOS = 4;

/** Formas de pago de los planes mensuales (mismo esquema en planes, tienda y agentes). */
export const FORMAS_PAGO = [
  { id: "mensual", nombre: "Pago mes a mes", meses: 1, descuento: 0, nota: "Sin descuento" },
  { id: "contrato", nombre: `Pago de los ${MESES_MINIMOS} meses por adelantado`, meses: MESES_MINIMOS, descuento: 0.1, nota: "10% de descuento" },
  { id: "anual", nombre: "Pago anual por adelantado", meses: 12, descuento: 0.2, nota: "20% de descuento" },
] as const;

/**
 * Costos de terceros: lo que NO es mano de obra de biwov y paga el cliente directo a cada plataforma.
 * Se muestra resumido en cada plan y completo al dar clic en "Ver costos de plataformas y políticas".
 */
export const POLITICA_COSTOS_TERCEROS = {
  resumen:
    "El valor del plan es nuestra mano de obra. Los costos de las plataformas (pauta, mensajes, tokens de IA y herramientas externas) los paga el cliente directamente a cada plataforma.",
  incluye: [
    "El montaje inicial (configuración, integración y pruebas)",
    "La mensualidad de la herramienta cuando el plan lo dice expresamente",
    "El dominio, solo cuando la automatización lo requiere y solo durante el primer año",
  ],
  noIncluye: [
    "Pauta publicitaria: se paga directo a Meta, Google o TikTok con la tarjeta del cliente",
    "Mensajes de WhatsApp API: Meta cobra por cada mensaje que se envía y, desde el 1 de octubre de 2026, también por los mensajes de servicio que se responden",
    "Tokens de IA: el consumo de los agentes que conversan como humanos lo cobra la plataforma de IA según el uso",
    "Envíos de email marketing por encima del plan gratuito de la plataforma de correo",
    "Herramientas externas adicionales (plataformas, licencias, bancos de imágenes o música) que el cliente decida usar",
    "Renovación del dominio desde el segundo año",
  ],
  meta: [
    "Meta (Facebook, Instagram y WhatsApp) define y cambia sus tarifas y políticas sin previo aviso. Los cobros los hace Meta directamente al medio de pago del cliente.",
    "WhatsApp API cobra por mensaje según el tipo de plantilla (marketing, utilidad, autenticación) y el país del contacto. Los valores son de centavos de dólar por mensaje.",
    "Las cuentas publicitarias deben cumplir las políticas de Meta; una cuenta restringida por políticas no es responsabilidad de biwov, aunque acompañamos el proceso de apelación.",
    "Solo se envían mensajes masivos a contactos que aceptaron recibirlos (Ley 1581 de protección de datos en Colombia y políticas de WhatsApp).",
  ],
};

export type EscalonId = "aprende" | "asesoria" | "ejecucion" | "automatizacion" | "agentes";

export interface Escalon {
  id: EscalonId;
  nombre: string;
  lema: string;
}

export const ESCALONES: Escalon[] = [
  { id: "aprende", nombre: "Aprende", lema: "Para conocernos: aprende un tema concreto y aplícalo hoy." },
  { id: "asesoria", nombre: "Te asesoro", lema: "Te damos la estrategia y los lineamientos; tú o tu equipo ejecutan." },
  { id: "ejecucion", nombre: "Lo hacemos por ti", lema: "Estrategia, contenido y campañas hechos por nuestro equipo." },
  { id: "automatizacion", nombre: "Automatiza", lema: "Que tu empresa responda y venda aunque no estés." },
  { id: "agentes", nombre: "Agentes de IA", lema: "Tu propia agencia de agentes de IA, con la memoria de tu marca." },
];

export type Ticket = "low" | "medio" | "high";

export interface PlanCliente {
  slug: string;
  escalon: EscalonId;
  ticket: Ticket;
  nombre: string;
  /** Precio principal en COP. */
  precio: number;
  /** Si existe, en USD se muestra este valor fijo en vez de convertir con la TRM. */
  usd?: number;
  unidad: string;
  /** true si el precio principal es mensual (aplican formas de pago con descuento y permanencia). */
  mensual: boolean;
  /** Pago que acompaña al precio principal (montaje, mantenimiento…). */
  adicional?: { label: string; precio: number; usd?: number; mensual?: boolean };
  gancho: string;
  paraQuien: string[];
  incluye: { grupo: string; items: string[] }[];
  noIncluye: string[];
  /** Costos de plataformas que asume el cliente en ESTE plan (se ven de una vez). */
  costosTerceros: string[];
  pasos: string[];
  condiciones: string[];
  icono: "graduation" | "compass" | "users" | "map" | "megaphone" | "rocket" | "crown" | "bot" | "send" | "mail" | "sparkles" | "brain" | "message";
  destacado?: boolean;
  mensajeWhatsApp: string;
  /** Demostración visual del plan (chatbot de botones vs. agente conversacional). */
  demo?: "botones" | "conversacional";
}

const PLANEACION_BASE = [
  "Diagnóstico de tu empresa, tu cliente ideal y tu competencia",
  "Estrategia y plan de trabajo del mes",
  "Calendario de contenido",
  "Guiones para cada video",
  "Copys (textos) para cada publicación",
  "Estrategia de historias (qué publicar cada día)",
  "Embudo de ventas: de quien te ve a quien te escribe y te compra",
];

const PERMANENCIA = `Permanencia mínima de ${MESES_MINIMOS} meses`;
const PAGOS = "Pago mes a mes sin descuento, o por adelantado con descuento (10% los 4 meses, 20% el año)";
const PAUTA = "Pauta publicitaria: la pagas directo a Meta con tu tarjeta (recomendado desde $20.000 COP diarios)";

export const PLANES_CLIENTES: PlanCliente[] = [
  // ───────────── 1 · APRENDE ─────────────
  {
    slug: "capacitacion-express",
    escalon: "aprende",
    ticket: "low",
    nombre: "Capacitación Express",
    precio: 190000,
    unidad: "una vez · 2 horas",
    mensual: false,
    gancho: "Dos horas en vivo para aprender un tema de marketing que puedes aplicar en tu empresa ese mismo día.",
    paraQuien: [
      "Empresarios que quieren entender un tema puntual antes de invertir más",
      "Equipos comerciales o de marketing que necesitan una base común",
      "Quien quiere conocer la forma de trabajar de biwov sin un compromiso grande",
    ],
    incluye: [
      {
        grupo: "La capacitación",
        items: [
          "2 horas en vivo por videollamada, con un tema concreto (por ejemplo: vender por WhatsApp, guiones que venden, campañas en Meta, IA para tu empresa)",
          "Ejemplos reales y paso a paso para aplicar",
          "Espacio de preguntas en vivo",
        ],
      },
      { grupo: "Para llevarte", items: ["Material de apoyo descargable", "Plantilla o checklist del tema", "Grabación disponible por 7 días"] },
    ],
    noIncluye: ["Revisión individual de tu empresa (eso es la Asesoría Estratégica 1:1)"],
    costosTerceros: [],
    pasos: ["Eliges la capacitación y la fecha", "Pagas y recibes el enlace", "Te conectas, aprendes y aplicas", "Si quieres ir más lejos, el valor se abona a una asesoría"],
    condiciones: ["Cupos limitados por sesión para poder responder preguntas", "Si tomas la Asesoría Estratégica 1:1 en los 15 días siguientes, te descontamos el valor de la capacitación"],
    icono: "graduation",
    mensajeWhatsApp: "Hola, quiero la Capacitación Express de 2 horas. ¿Cuál es la próxima fecha y tema?",
  },
  {
    slug: "asesoria-estrategica",
    escalon: "aprende",
    ticket: "low",
    nombre: "Asesoría Estratégica 1:1",
    precio: 350000,
    unidad: "una vez · 90 minutos",
    mensual: false,
    gancho: "Una sesión 1 a 1 con Kathe para revisar tu empresa y salir con un plan claro de 15 días.",
    paraQuien: ["Empresarios que necesitan claridad: qué hacer primero y en qué orden", "Quien ya tiene equipo pero siente que el marketing no da resultados"],
    incluye: [
      { grupo: "Antes de la sesión", items: ["Análisis de tu empresa y de tus redes", "Cuestionario corto para llegar con todo el contexto"] },
      { grupo: "En la sesión (90 minutos)", items: ["Revisión de tu perfil, contenido y forma de vender", "Ideas de contenido para tu marca", "Lineamientos para implementar tú o tu equipo"] },
      { grupo: "Después", items: ["Plan de 15 días con herramientas y acciones concretas", "Resumen escrito de la sesión"] },
    ],
    noIncluye: ["Ejecución, producción de contenido ni montaje de campañas"],
    costosTerceros: [],
    pasos: ["Agendas y respondes el cuestionario", "Analizamos tu empresa", "Sesión 1 a 1 por videollamada", "Recibes tu plan de 15 días"],
    condiciones: ["Si contratas un plan mensual en los 30 días siguientes, el valor de la asesoría se abona al primer mes"],
    icono: "compass",
    mensajeWhatsApp: "Hola, quiero agendar la Asesoría Estratégica 1:1 de 90 minutos.",
  },

  // ───────────── 2 · TE ASESORO ─────────────
  {
    slug: "direccion-estrategica",
    escalon: "asesoria",
    ticket: "medio",
    nombre: "Dirección Estratégica",
    precio: 1250000,
    unidad: "/mes · 4 meses",
    mensual: true,
    gancho: "Te entregamos la estrategia y los lineamientos de cada mes, te enseñamos las herramientas y tu equipo ejecuta.",
    paraQuien: [
      "Empresarios que quieren entender y dirigir su marketing, no solo delegarlo",
      "Empresas con alguien que graba y publica, pero sin dirección estratégica",
      "Quien quiere el criterio de una agencia sin pagar la producción",
    ],
    incluye: [
      { grupo: "Planeación de cada mes", items: PLANEACION_BASE },
      {
        grupo: "Acompañamiento",
        items: [
          "Calendario de 12 contenidos al mes, con su guion y copy",
          "Lineamientos de grabación y de diseño",
          "1 sesión semanal de 1 hora con tu equipo (16 en los 4 meses)",
          "Revisión de lo que tu equipo produjo y de las métricas; informe mensual con recomendaciones",
        ],
      },
      {
        grupo: "Herramientas que aprende a manejar tu equipo",
        items: [
          "Meta Business Suite y Administrador de anuncios",
          "WhatsApp Business (etiquetas, catálogo, respuestas rápidas)",
          "Canva y CapCut para piezas y videos",
          "IA para crear contenido (ChatGPT / Claude) y Metricool para programar y medir",
        ],
      },
    ],
    noIncluye: ["Grabación, edición y diseño de piezas", "Publicación y montaje de campañas", "Responder mensajes"],
    costosTerceros: [PAUTA, "Herramientas de pago que tu equipo decida usar (planes pagos de Canva, CapCut, Metricool o IA)"],
    pasos: ["Diagnóstico y estrategia de los 4 meses", "Entrega del plan del mes", "Sesión semanal: tu equipo ejecuta con la guía", "Revisamos resultados y ajustamos"],
    condiciones: [`Duración: ${MESES_MINIMOS} meses`, PAGOS, "Sesiones canceladas con menos de 24 horas se toman como dadas"],
    icono: "map",
    destacado: true,
    mensajeWhatsApp: "Hola, me interesa el plan Dirección Estratégica de 4 meses.",
  },

  // ───────────── 3 · LO HACEMOS POR TI ─────────────
  {
    slug: "campana-lista",
    escalon: "ejecucion",
    ticket: "medio",
    nombre: "Campaña Lista",
    precio: 880000,
    unidad: "montaje · una vez",
    mensual: false,
    adicional: { label: "Mantenimiento de la campaña", precio: 400000, mensual: true },
    gancho: "Creamos 6 piezas (3 videos y 3 imágenes), montamos tus campañas de audiencia y de ventas, y las mantenemos cada mes.",
    paraQuien: ["Empresas que necesitan vender ya, con publicidad bien hecha", "Quien maneja sus redes pero no sabe montar campañas que conviertan"],
    incluye: [
      { grupo: "Estrategia", items: ["Estrategia de la campaña: oferta, público y mensaje", "Guiones de los 3 videos", "Copys de los anuncios"] },
      { grupo: "Contenido para la campaña", items: ["3 videos (guion y edición; grabación con tu material o aparte)", "3 imágenes o piezas gráficas", "Adaptación a formatos de historias y feed"] },
      { grupo: "Montaje (pago único)", items: ["Campaña de crecimiento de audiencia", "Campaña de ventas (mensajes a WhatsApp)", "Revisión de píxel y eventos"] },
      { grupo: "Mantenimiento (mensual)", items: ["Seguimiento y optimización semanal", "Cambio de anuncios que se desgastan", "Informe mensual de resultados"] },
    ],
    noIncluye: ["Grabación presencial (se cotiza aparte)", "Responder mensajes"],
    costosTerceros: [PAUTA],
    pasos: ["Diagnóstico y estrategia", "Producción de las 6 piezas", "Montaje y lanzamiento", "Mantenimiento y optimización cada mes"],
    condiciones: ["Montaje: 50% al iniciar y 50% al lanzar", `Mantenimiento: ${PERMANENCIA.toLowerCase()}`, PAGOS],
    icono: "megaphone",
    mensajeWhatsApp: "Hola, quiero el plan Campaña Lista (3 videos + 3 imágenes + campañas).",
  },
  {
    slug: "agencia-completa",
    escalon: "ejecucion",
    ticket: "high",
    nombre: "Agencia Completa",
    precio: 2990000,
    unidad: "/mes",
    mensual: true,
    gancho: "Tu área de marketing completa: estrategia, contenido, publicación y campañas. Tú solo atiendes a los clientes.",
    paraQuien: ["Empresarios que quieren que todo el marketing funcione sin estar encima", "Empresas que necesitan presencia constante y campañas que traigan clientes"],
    incluye: [
      { grupo: "Planeación y estrategia", items: PLANEACION_BASE },
      { grupo: "Producción de contenido", items: ["8 videos al mes (guion, 1 sesión de grabación y edición)", "8 piezas gráficas (imágenes o carruseles)", "Guiones de historias para la semana"] },
      {
        grupo: "Gestión",
        items: [
          "Programación y publicación en Instagram, Facebook y TikTok",
          "Campaña de crecimiento de audiencia y campaña de ventas (montaje y optimización)",
          "Informe mensual de resultados",
          "1 reunión mensual de estrategia",
        ],
      },
    ],
    noIncluye: ["Responder mensajes de clientes", "Páginas web o landing pages"],
    costosTerceros: [PAUTA],
    pasos: ["Diagnóstico y plan de trabajo", "Grabación del mes", "Publicamos y lanzamos campañas", "Medimos, informamos y ajustamos"],
    condiciones: [PERMANENCIA, PAGOS],
    icono: "rocket",
    destacado: true,
    mensajeWhatsApp: "Hola, quiero el plan Agencia Completa para mi empresa.",
  },
  {
    slug: "agencia-elite",
    escalon: "ejecucion",
    ticket: "high",
    nombre: "Agencia Elite",
    precio: 4490000,
    unidad: "/mes",
    mensual: true,
    gancho: "Para empresas que van en serio: más contenido, más campañas y remarketing para no perder a ningún interesado.",
    paraQuien: ["Empresas con varias líneas de producto o sedes", "Quien ya invierte en pauta y quiere sacarle más rendimiento"],
    incluye: [
      { grupo: "Planeación y estrategia", items: PLANEACION_BASE },
      { grupo: "Producción de contenido", items: ["12 videos al mes (guion, 2 sesiones de grabación y edición)", "12 piezas gráficas (imágenes o carruseles)", "Guiones de historias diarias"] },
      {
        grupo: "Gestión y campañas",
        items: [
          "Publicación en Instagram, Facebook y TikTok",
          "Hasta 4 campañas activas + remarketing a quien ya vio tu contenido",
          "1 envío masivo al mes por WhatsApp o correo a tu base de clientes",
          "Análisis de creatividades: qué anuncio funciona y por qué",
          "Informe quincenal y 2 reuniones al mes",
        ],
      },
    ],
    noIncluye: ["Responder mensajes de clientes", "Páginas web o landing pages"],
    costosTerceros: [PAUTA, "Costo de cada mensaje del envío masivo por WhatsApp (lo cobra Meta) o del correo si supera el plan gratuito"],
    pasos: ["Diagnóstico profundo y plan trimestral", "Producción quincenal", "Campañas por etapa del embudo", "Optimización y reportes cada 15 días"],
    condiciones: [PERMANENCIA, PAGOS],
    icono: "crown",
    mensajeWhatsApp: "Hola, quiero conocer el plan Agencia Elite.",
  },

  // ───────────── 4 · AUTOMATIZA ─────────────
  {
    slug: "chatbot-basico",
    escalon: "automatizacion",
    ticket: "medio",
    nombre: "Chatbot básico de botones",
    precio: 290000,
    unidad: "/mes",
    mensual: true,
    adicional: { label: "Montaje inicial (una vez)", precio: 790000 },
    gancho: "Tu cliente toca un botón y recibe la respuesta al instante: precios, horarios, ubicación, catálogo o pasar a un asesor.",
    paraQuien: ["Empresas con preguntas repetidas que quitan tiempo", "Quien quiere responder de inmediato sin pagar IA"],
    incluye: [
      { grupo: "Montaje", items: ["Menú de opciones con botones (hasta 8 respuestas)", "Bienvenida, horario y mensaje fuera de horario", "Paso a un asesor humano", "Pruebas y capacitación a tu equipo"] },
      { grupo: "Mensualidad", items: ["Licencia de la plataforma del chatbot", "Cambios de textos y opciones", "Soporte por WhatsApp"] },
    ],
    noIncluye: ["Respuestas libres como un humano (eso es el Agente con IA)", "Responder las conversaciones que pasan al asesor"],
    costosTerceros: ["Mensajes de WhatsApp API: Meta cobra cada mensaje enviado y, desde octubre de 2026, también los de servicio. Los paga el cliente directo a Meta"],
    pasos: ["Definimos las preguntas frecuentes", "Armamos el menú de botones", "Lo activamos en tu WhatsApp", "Ajustamos cada mes"],
    condiciones: [PERMANENCIA, PAGOS, "Requiere un número de WhatsApp dedicado"],
    icono: "message",
    demo: "botones",
    mensajeWhatsApp: "Hola, quiero un chatbot básico de botones para mi WhatsApp.",
  },
  {
    slug: "agente-ia-whatsapp",
    escalon: "automatizacion",
    ticket: "high",
    nombre: "Agente con IA para WhatsApp",
    precio: 590000,
    unidad: "/mes",
    mensual: true,
    adicional: { label: "Montaje y entrenamiento (una vez)", precio: 1990000 },
    gancho: "Un agente que conversa como una persona, entiende lo que le escriben, responde con la información de tu empresa y te pasa los clientes listos para comprar.",
    paraQuien: ["Empresas con muchos mensajes y preguntas distintas", "Quien pierde ventas por responder tarde o de noche"],
    incluye: [
      {
        grupo: "Montaje y entrenamiento",
        items: [
          "Entrenamiento con la información de tu empresa (servicios, precios, horarios, preguntas frecuentes, objeciones)",
          "Personalidad y tono de tu marca",
          "Etiquetas para saber quién está listo para comprar y paso a un asesor",
          "Pruebas y capacitación a tu equipo",
        ],
      },
      { grupo: "Mensualidad", items: ["Licencia de la plataforma", "Ajustes y nuevo entrenamiento cada mes", "Revisión de conversaciones y mejoras", "Soporte por WhatsApp"] },
    ],
    noIncluye: ["Cierre de ventas por parte de biwov"],
    costosTerceros: [
      "Tokens de IA: cada respuesta del agente consume tokens que cobra la plataforma de IA según el uso. Los paga el cliente directo",
      "Mensajes de WhatsApp API: Meta cobra cada mensaje enviado y, desde octubre de 2026, también los de servicio",
    ],
    pasos: ["Recogemos la información de tu empresa", "Entrenamos y probamos el agente", "Lo activamos en tu WhatsApp", "Lo mejoramos cada mes con conversaciones reales"],
    condiciones: [PERMANENCIA, PAGOS, "Requiere un número de WhatsApp dedicado"],
    icono: "bot",
    demo: "conversacional",
    mensajeWhatsApp: "Hola, quiero un agente con IA que responda el WhatsApp de mi empresa.",
  },
  {
    slug: "mensajes-masivos",
    escalon: "automatizacion",
    ticket: "medio",
    nombre: "Mensajes masivos · WhatsApp API",
    precio: 890000,
    unidad: "montaje · una vez",
    mensual: false,
    adicional: { label: "Mensualidad", precio: 550000, mensual: true },
    gancho: "Vuelve a venderle a tus clientes: envíos masivos por WhatsApp desde un número oficial, con varios asesores.",
    paraQuien: ["Empresas con una base de clientes a la que nunca le vuelven a escribir", "Quien quiere promociones, lanzamientos y recompra"],
    incluye: [
      { grupo: "Montaje (pago único)", items: ["Activación de WhatsApp API con número oficial", "Verificación de la cuenta ante Meta", "Carga y organización de tu base de contactos"] },
      { grupo: "Cada mes", items: ["4 envíos masivos (estrategia, texto e imagen)", "Plantillas aprobadas por Meta", "Segmentación de contactos (clientes, interesados, inactivos)", "Informe de entregas, lecturas y respuestas"] },
    ],
    noIncluye: ["Responder las conversaciones que se generen"],
    costosTerceros: ["Cada mensaje enviado y cada respuesta de servicio tienen un costo que cobra Meta directamente al cliente (centavos de dólar por mensaje, según el tipo de plantilla)"],
    pasos: ["Activamos tu WhatsApp API", "Organizamos tu base de clientes", "Planeamos y enviamos las campañas", "Medimos y mejoramos"],
    condiciones: [`Mensualidad: ${PERMANENCIA.toLowerCase()}`, PAGOS, "Solo a contactos que aceptaron recibir mensajes (protección de datos)"],
    icono: "send",
    mensajeWhatsApp: "Hola, me interesan los mensajes masivos por WhatsApp API.",
  },
  {
    slug: "email-marketing",
    escalon: "automatizacion",
    ticket: "medio",
    nombre: "Email Marketing",
    precio: 390000,
    unidad: "/mes",
    mensual: true,
    adicional: { label: "Montaje inicial (una vez)", precio: 990000 },
    gancho: "Correos automáticos que nutren al que no ha comprado y le vuelven a vender al que ya compró.",
    paraQuien: ["Empresas con una base de correos de clientes o interesados", "Negocios de recompra (productos, servicios recurrentes)"],
    incluye: [
      { grupo: "Montaje", items: ["Configuración de la plataforma de correo", "2 automatizaciones (bienvenida y recompra)", "Plantilla de correo con tu marca"] },
      { grupo: "Cada mes", items: ["2 campañas de correo", "2 segmentos de contactos", "Informe de aperturas y clics"] },
    ],
    noIncluye: ["Redacción de más de 2 campañas al mes"],
    costosTerceros: ["La plataforma de correo cobra según el número de contactos y envíos cuando se supera su plan gratuito. Lo paga el cliente directo"],
    pasos: ["Organizamos tu base", "Creamos las automatizaciones", "Enviamos las campañas del mes", "Medimos y ajustamos"],
    condiciones: [PERMANENCIA, PAGOS],
    icono: "mail",
    mensajeWhatsApp: "Hola, me interesa el plan de Email Marketing.",
  },

  // ───────────── 5 · AGENTES DE IA (precios de referencia Vilma.AI) ─────────────
  {
    slug: "agentes-esencial",
    escalon: "agentes",
    ticket: "low",
    nombre: "biwov Agentes · Esencial",
    precio: 129000,
    usd: 37,
    unidad: "/mes",
    mensual: true,
    adicional: { label: "Instalación y cerebro de tu marca (una vez)", precio: 490000 },
    gancho: "Tu propio equipo de agentes de IA, entrenado con la memoria de tu marca, para crear tu marketing cuando quieras.",
    paraQuien: ["Empresas que quieren su marketing a la mano sin contratar una agencia", "Equipos pequeños que necesitan producir más con menos"],
    incluye: [
      { grupo: "Instalación", items: ["Instalación de la oficina de agentes", "Cerebro de tu marca: avatar, servicios, tono, precios y objetivos", "Capacitación de 2 horas para tu equipo"] },
      { grupo: "Tu equipo de agentes", items: ["Estratega", "Guionista (método biwov)", "Copywriter", "Creativo de ideas y campañas", "Analista de resultados"] },
      { grupo: "Cada mes", items: ["1 marca", "Actualizaciones del sistema y de los métodos", "Mantenimiento de la memoria de tu marca", "Soporte por WhatsApp"] },
    ],
    noIncluye: ["Publicación y pauta"],
    costosTerceros: ["Tu suscripción de Claude (desde aprox. US$20 al mes según el uso), que pagas directo a Anthropic"],
    pasos: ["Diagnóstico y cuestionario de tu marca", "Instalamos y cargamos el cerebro", "Tu equipo pide y los agentes entregan", "Cada mes mejoramos la memoria"],
    condiciones: [PERMANENCIA, PAGOS],
    icono: "brain",
    mensajeWhatsApp: "Hola, quiero mi equipo de agentes de IA (plan Esencial).",
  },
  {
    slug: "agentes-pro",
    escalon: "agentes",
    ticket: "medio",
    nombre: "biwov Agentes · Pro",
    precio: 229000,
    usd: 67,
    unidad: "/mes",
    mensual: true,
    adicional: { label: "Instalación y cerebro de tus marcas (una vez)", precio: 790000 },
    gancho: "La agencia de agentes completa: más especialistas, varias marcas, diseñador de marca y acompañamiento mensual de Kathe.",
    paraQuien: ["Empresas con varias marcas o líneas de negocio", "Equipos de marketing que quieren multiplicar su capacidad"],
    incluye: [
      {
        grupo: "Todo lo del plan Esencial, y además",
        items: [
          "Hasta 3 marcas, cada una con su propia memoria",
          "Diseñador de marca: estudia tu empresa y propone logo, paleta, tipografías y manual",
          "Trafficker (campañas en Meta), auditor de redes y seguimiento comercial",
          "Radar de novedades digitales cada semana",
          "Coordinador que reparte el trabajo y avisos por Telegram",
          "1 reunión mensual de mejora con Kathe",
        ],
      },
    ],
    noIncluye: ["Publicación y pauta"],
    costosTerceros: ["Tu suscripción de Claude (aprox. US$20 a US$100 al mes según el uso), que pagas directo a Anthropic"],
    pasos: ["Diagnóstico de cada marca", "Instalación y entrenamiento", "Tu equipo trabaja con los agentes", "Reunión mensual de mejora"],
    condiciones: [PERMANENCIA, PAGOS],
    icono: "sparkles",
    destacado: true,
    mensajeWhatsApp: "Hola, quiero conocer el plan biwov Agentes Pro.",
  },
];

export const planClientePorSlug = (slug: string) => PLANES_CLIENTES.find((p) => p.slug === slug);

export const TICKET_LABEL: Record<Ticket, string> = { low: "Para empezar", medio: "Crecimiento", high: "Alto impacto" };

/** Total en COP de un plan mensual según la forma de pago (aplica el descuento). */
export function totalSegunPago(mensualCop: number, formaId: (typeof FORMAS_PAGO)[number]["id"]) {
  const f = FORMAS_PAGO.find((x) => x.id === formaId)!;
  const total = Math.round((mensualCop * f.meses * (1 - f.descuento)) / 1000) * 1000;
  return { total, meses: f.meses, porMes: Math.round(total / f.meses / 1000) * 1000, ahorro: mensualCop * f.meses - total };
}
