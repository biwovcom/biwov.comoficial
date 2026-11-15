/**
 * Portafolio de planes ESTÁNDAR para clientes (biwov.com/planes).
 * Es la vitrina simple para empresarios: pocos planes, claros, en escalera de valor.
 * La tienda (/tienda) sigue siendo el catálogo completo para cotizar todo lo demás.
 *
 * Precios en COP. En pantalla se convierten a USD con la TRM del día, salvo que
 * el plan tenga `usd` fijo (ej. la capacitación de US$19).
 * Cambiar precios SOLO aquí: el carrusel, las páginas de detalle y la landing
 * /agencia-ia los leen de este archivo.
 */

export type EscalonId = "aprende" | "asesoria" | "ejecucion" | "automatizacion" | "agentes";

export interface Escalon {
  id: EscalonId;
  nombre: string;
  /** Frase corta que explica el escalón al cliente. */
  lema: string;
}

export const ESCALONES: Escalon[] = [
  { id: "aprende", nombre: "Aprende", lema: "Para conocernos: aprende un tema concreto y aplícalo hoy." },
  { id: "asesoria", nombre: "Te asesoro", lema: "Te enseño y te doy los lineamientos; tú o tu equipo ejecutan." },
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
  /** "una vez", "/mes", "/mes · 4 meses"… */
  unidad: string;
  /** Pago adicional que acompaña al precio principal (instalación, activación…). */
  adicional?: { label: string; precio: number };
  /** Frase de la tarjeta del carrusel. */
  gancho: string;
  /** Para quién es (página de detalle). */
  paraQuien: string[];
  incluye: { grupo: string; items: string[] }[];
  noIncluye: string[];
  /** Cómo funciona, paso a paso. */
  pasos: string[];
  condiciones: string[];
  /** Ícono de lucide-react (nombre) para la tarjeta. */
  icono: "graduation" | "compass" | "users" | "map" | "megaphone" | "rocket" | "crown" | "bot" | "send" | "mail" | "sparkles" | "brain";
  destacado?: boolean;
  /** Texto del botón de WhatsApp. */
  mensajeWhatsApp: string;
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

export const PLANES_CLIENTES: PlanCliente[] = [
  // ───────────── 1 · APRENDE (low ticket) ─────────────
  {
    slug: "capacitacion-express",
    escalon: "aprende",
    ticket: "low",
    nombre: "Capacitación Express",
    precio: 65000,
    usd: 19,
    unidad: "una vez · 2 horas",
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
      {
        grupo: "Para llevarte",
        items: ["Material de apoyo descargable", "Plantilla o checklist del tema", "Grabación disponible por 7 días"],
      },
    ],
    noIncluye: ["Revisión individual de tu empresa (eso es la Asesoría Estratégica 1:1)"],
    pasos: [
      "Eliges la capacitación y la fecha",
      "Pagas y recibes el enlace por WhatsApp o correo",
      "Te conectas, aprendes y aplicas",
      "Si quieres ir más lejos, el valor se abona a una asesoría (ver condiciones)",
    ],
    condiciones: [
      "Cupos limitados por sesión para poder responder preguntas",
      "Si tomas la Asesoría Estratégica 1:1 en los 15 días siguientes, te descontamos el valor de la capacitación",
    ],
    icono: "graduation",
    mensajeWhatsApp: "Hola, quiero la Capacitación Express de 2 horas (US$19). ¿Cuál es la próxima fecha y tema?",
  },
  {
    slug: "asesoria-estrategica",
    escalon: "aprende",
    ticket: "low",
    nombre: "Asesoría Estratégica 1:1",
    precio: 350000,
    unidad: "una vez · 90 minutos",
    gancho: "Una sesión 1 a 1 con Kathe para revisar tu empresa y salir con un plan claro de 15 días.",
    paraQuien: [
      "Empresarios que necesitan claridad: qué hacer primero y en qué orden",
      "Quien ya tiene equipo pero siente que el marketing no da resultados",
    ],
    incluye: [
      {
        grupo: "Antes de la sesión",
        items: ["Análisis de tu empresa y de tus redes", "Cuestionario corto para llegar con todo el contexto"],
      },
      {
        grupo: "En la sesión (90 minutos)",
        items: [
          "Revisión de tu perfil, contenido y forma de vender",
          "Ideas de contenido para tu marca",
          "Lineamientos para implementar tú o tu equipo",
        ],
      },
      { grupo: "Después", items: ["Plan de 15 días con herramientas y acciones concretas", "Resumen escrito de la sesión"] },
    ],
    noIncluye: ["Ejecución, producción de contenido ni montaje de campañas"],
    pasos: ["Agendas y respondes el cuestionario", "Analizamos tu empresa", "Sesión 1 a 1 por videollamada", "Recibes tu plan de 15 días"],
    condiciones: ["Si contratas un plan mensual en los 30 días siguientes, el valor de la asesoría se abona al primer mes"],
    icono: "compass",
    mensajeWhatsApp: "Hola, quiero agendar la Asesoría Estratégica 1:1 de 90 minutos.",
  },

  // ───────────── 2 · TE ASESORO (medio ticket) ─────────────
  {
    slug: "mentoria-empresario",
    escalon: "asesoria",
    ticket: "medio",
    nombre: "Mentoría Empresario 1:1",
    precio: 1290000,
    unidad: "/mes · 4 meses",
    adicional: { label: "Pago de contado (4 meses)", precio: 4490000 },
    gancho: "Una hora a la semana, 1 a 1, durante 4 meses: aprende marketing digital y las herramientas para aplicarlo en tu empresa.",
    paraQuien: [
      "Empresarios que quieren entender y dirigir su marketing, no solo delegarlo",
      "Empresas que tienen a alguien interno que ejecuta y necesita guía",
      "Quien quiere dejar de depender de terceros para lo básico",
    ],
    incluye: [
      {
        grupo: "Las sesiones",
        items: [
          "16 sesiones 1 a 1 de 1 hora (una por semana, durante 4 meses)",
          "Plan de aprendizaje a la medida de tu empresa",
          "Revisión de lo que tu equipo produjo en la semana",
        ],
      },
      {
        grupo: "Lo que aprendes",
        items: [
          "Estrategia: cliente ideal, oferta y propuesta de valor",
          "Contenido: planeación, guiones, copys e historias",
          "Embudo de ventas y seguimiento por WhatsApp",
          "Campañas en Meta: audiencia y ventas, cómo leer los resultados",
        ],
      },
      {
        grupo: "Herramientas que aprendes a manejar",
        items: [
          "Meta Business Suite y Administrador de anuncios",
          "WhatsApp Business (etiquetas, catálogo, respuestas rápidas)",
          "Canva y CapCut para piezas y videos",
          "IA para crear contenido (ChatGPT / Claude)",
          "Metricool para programar y medir",
        ],
      },
      { grupo: "Entre sesiones", items: ["Plantillas y guías de cada tema", "Dudas por WhatsApp (respuesta en máximo 48 horas hábiles)"] },
    ],
    noIncluye: ["Producción de contenido, publicación ni montaje de campañas (lo hace tu equipo con la guía)", "Pauta publicitaria"],
    pasos: [
      "Diagnóstico inicial y plan de los 4 meses",
      "Sesión semanal: aprendes, aplicas y revisamos",
      "Cada mes medimos avances y ajustamos",
      "Al final, tu empresa queda con su sistema de marketing funcionando",
    ],
    condiciones: [
      "Duración: 4 meses (16 sesiones)",
      "Sesiones que se cancelan con menos de 24 horas se toman como dadas",
      "Pago mensual anticipado o de contado con descuento",
    ],
    icono: "users",
    destacado: true,
    mensajeWhatsApp: "Hola, me interesa la Mentoría Empresario 1:1 de 4 meses.",
  },
  {
    slug: "direccion-estrategica",
    escalon: "asesoria",
    ticket: "medio",
    nombre: "Dirección Estratégica",
    precio: 1450000,
    unidad: "/mes",
    gancho: "Te entregamos toda la estrategia y los lineamientos del mes; tu equipo produce y publica.",
    paraQuien: [
      "Empresas con alguien que graba y publica, pero sin dirección estratégica",
      "Quien quiere el criterio de una agencia sin pagar la producción",
    ],
    incluye: [
      { grupo: "Planeación del mes", items: PLANEACION_BASE },
      {
        grupo: "Acompañamiento",
        items: [
          "Calendario de 12 contenidos con su guion y copy",
          "Lineamientos de grabación y de diseño",
          "2 reuniones al mes con tu equipo",
          "Revisión de métricas e informe mensual con recomendaciones",
        ],
      },
    ],
    noIncluye: ["Grabación, edición y diseño de piezas", "Publicación y montaje de campañas", "Responder mensajes", "Pauta publicitaria"],
    pasos: ["Diagnóstico y estrategia", "Entrega del plan del mes", "Tu equipo ejecuta con la guía", "Revisamos resultados y ajustamos"],
    condiciones: ["Mínimo 3 meses", "Pago mensual anticipado"],
    icono: "map",
    mensajeWhatsApp: "Hola, me interesa el plan Dirección Estratégica.",
  },

  // ───────────── 3 · LO HACEMOS POR TI (high ticket) ─────────────
  {
    slug: "campana-lista",
    escalon: "ejecucion",
    ticket: "medio",
    nombre: "Campaña Lista",
    precio: 1690000,
    unidad: "una vez",
    gancho: "Creamos 6 piezas (3 videos y 3 imágenes) y montamos tus campañas de audiencia y de ventas.",
    paraQuien: [
      "Empresas que necesitan vender ya, con publicidad bien hecha",
      "Quien maneja sus redes pero no sabe montar campañas que conviertan",
    ],
    incluye: [
      {
        grupo: "Estrategia",
        items: ["Estrategia de la campaña: oferta, público y mensaje", "Guiones de los 3 videos", "Copys de los anuncios"],
      },
      {
        grupo: "Contenido para la campaña",
        items: ["3 videos (guion, grabación y edición)", "3 imágenes o piezas gráficas", "Adaptación a formatos de historias y feed"],
      },
      {
        grupo: "Campañas en Meta",
        items: [
          "Montaje de campaña de crecimiento de audiencia",
          "Montaje de campaña de ventas (mensajes a WhatsApp)",
          "30 días de seguimiento y optimización",
          "Informe de resultados",
        ],
      },
    ],
    noIncluye: ["Pauta publicitaria (se paga directo a Meta; recomendado desde $20.000 COP diarios)", "Responder mensajes"],
    pasos: ["Diagnóstico y estrategia", "Grabación y producción", "Montaje y lanzamiento", "Optimización durante 30 días e informe"],
    condiciones: ["La grabación es en Manizales o con el material que envíe la empresa", "Pago 50% al iniciar y 50% al lanzar"],
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
    gancho: "Tu área de marketing completa: estrategia, contenido, publicación y campañas. Tú solo atiendes a los clientes.",
    paraQuien: [
      "Empresarios que quieren que todo el marketing funcione sin estar encima",
      "Empresas que necesitan presencia constante y campañas que traigan clientes",
    ],
    incluye: [
      { grupo: "Planeación y estrategia", items: PLANEACION_BASE },
      {
        grupo: "Producción de contenido",
        items: [
          "8 videos al mes (guion, 1 sesión de grabación y edición)",
          "8 piezas gráficas (imágenes o carruseles)",
          "Guiones de historias para la semana",
        ],
      },
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
    noIncluye: ["Responder mensajes de clientes", "Pauta publicitaria (se paga directo a Meta)", "Páginas web o landing pages"],
    pasos: ["Diagnóstico y plan de trabajo", "Grabación del mes", "Publicamos y lanzamos campañas", "Medimos, informamos y ajustamos"],
    condiciones: ["Mínimo 3 meses", "Pago mensual anticipado, en los primeros 5 días del mes"],
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
    gancho: "Para empresas que van en serio: más contenido, más campañas y remarketing para no perder a ningún interesado.",
    paraQuien: ["Empresas con varias líneas de producto o sedes", "Quien ya invierte en pauta y quiere sacarle más rendimiento"],
    incluye: [
      { grupo: "Planeación y estrategia", items: PLANEACION_BASE },
      {
        grupo: "Producción de contenido",
        items: ["12 videos al mes (guion, 2 sesiones de grabación y edición)", "12 piezas gráficas (imágenes o carruseles)", "Guiones de historias diarias"],
      },
      {
        grupo: "Gestión y campañas",
        items: [
          "Publicación en Instagram, Facebook y TikTok",
          "Hasta 4 campañas activas + remarketing a quien ya vio tu contenido",
          "1 envío masivo al mes por WhatsApp o correo a tu base de clientes",
          "Informe quincenal y 2 reuniones al mes",
        ],
      },
    ],
    noIncluye: ["Responder mensajes de clientes", "Pauta publicitaria y costos de mensajes de Meta", "Páginas web o landing pages"],
    pasos: ["Diagnóstico profundo y plan trimestral", "Producción quincenal", "Campañas por etapa del embudo", "Optimización y reportes cada 15 días"],
    condiciones: ["Mínimo 3 meses", "Pago mensual anticipado"],
    icono: "crown",
    mensajeWhatsApp: "Hola, quiero conocer el plan Agencia Elite.",
  },

  // ───────────── 4 · AUTOMATIZA ─────────────
  {
    slug: "chatbot-whatsapp",
    escalon: "automatizacion",
    ticket: "medio",
    nombre: "Chatbot con IA para WhatsApp",
    precio: 450000,
    unidad: "/mes",
    adicional: { label: "Implementación (una vez)", precio: 1290000 },
    gancho: "Responde al instante, de día y de noche, con la información de tu empresa, y te pasa los clientes listos para comprar.",
    paraQuien: ["Empresas que reciben muchos mensajes y no alcanzan a responder", "Quien pierde ventas por responder tarde"],
    incluye: [
      {
        grupo: "Implementación",
        items: [
          "Configuración del chatbot con la información de tu empresa (servicios, precios, horarios, preguntas frecuentes)",
          "Flujos de atención y paso a un asesor humano",
          "Etiquetas para saber quién está listo para comprar",
          "Pruebas y capacitación a tu equipo",
        ],
      },
      { grupo: "Mensualidad", items: ["Licencia de la plataforma incluida", "Ajustes y mejoras del chatbot", "Soporte por WhatsApp"] },
    ],
    noIncluye: ["Costos de mensajes que cobra Meta (centavos de dólar por mensaje)"],
    pasos: ["Recogemos la información de tu empresa", "Configuramos y probamos", "Lo activamos en tu WhatsApp", "Lo mejoramos cada mes"],
    condiciones: ["Mínimo 3 meses de mensualidad", "Requiere un número de WhatsApp dedicado"],
    icono: "bot",
    mensajeWhatsApp: "Hola, quiero un chatbot con IA para el WhatsApp de mi empresa.",
  },
  {
    slug: "mensajes-masivos",
    escalon: "automatizacion",
    ticket: "medio",
    nombre: "Mensajes masivos · WhatsApp API",
    precio: 890000,
    unidad: "/mes",
    adicional: { label: "Activación de WhatsApp API (una vez)", precio: 590000 },
    gancho: "Vuelve a venderle a tus clientes: envíos masivos por WhatsApp desde un número oficial, con varios asesores.",
    paraQuien: ["Empresas con una base de clientes a la que nunca le vuelven a escribir", "Quien quiere promociones, lanzamientos y recompra"],
    incluye: [
      {
        grupo: "Activación",
        items: ["Activación de WhatsApp API con número oficial", "Verificación de la cuenta ante Meta", "Carga y organización de tu base de contactos"],
      },
      {
        grupo: "Cada mes",
        items: [
          "4 envíos masivos (estrategia, texto e imagen)",
          "Plantillas aprobadas por Meta",
          "Segmentación de contactos (clientes, interesados, inactivos)",
          "Informe de entregas, lecturas y respuestas",
        ],
      },
    ],
    noIncluye: ["Costos de mensajes que cobra Meta por cada envío", "Responder las conversaciones que se generen"],
    pasos: ["Activamos tu WhatsApp API", "Organizamos tu base de clientes", "Planeamos y enviamos las campañas", "Medimos y mejoramos"],
    condiciones: ["Mínimo 3 meses", "Solo a contactos que aceptaron recibir mensajes (protección de datos)"],
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
    adicional: { label: "Implementación (una vez)", precio: 990000 },
    gancho: "Correos automáticos que nutren al que no ha comprado y le vuelven a vender al que ya compró.",
    paraQuien: ["Empresas con una base de correos de clientes o interesados", "Negocios de recompra (productos, servicios recurrentes)"],
    incluye: [
      {
        grupo: "Implementación",
        items: ["Configuración de la plataforma de correo", "2 automatizaciones (bienvenida y recompra)", "Plantilla de correo con tu marca"],
      },
      { grupo: "Cada mes", items: ["2 campañas de correo", "2 segmentos de contactos", "Informe de aperturas y clics"] },
    ],
    noIncluye: ["Costo de la plataforma de correo si tu base supera el plan gratuito"],
    pasos: ["Organizamos tu base", "Creamos las automatizaciones", "Enviamos las campañas del mes", "Medimos y ajustamos"],
    condiciones: ["Mínimo 3 meses"],
    icono: "mail",
    mensajeWhatsApp: "Hola, me interesa el plan de Email Marketing.",
  },

  // ───────────── 5 · AGENTES DE IA ─────────────
  {
    slug: "agentes-esencial",
    escalon: "agentes",
    ticket: "medio",
    nombre: "biwov Agentes · Esencial",
    precio: 249000,
    unidad: "/mes",
    adicional: { label: "Instalación y cerebro de tu marca (una vez)", precio: 1490000 },
    gancho: "Tu propio equipo de agentes de IA, entrenado con la memoria de tu marca, para crear tu marketing cuando quieras.",
    paraQuien: ["Empresas que quieren su marketing a la mano sin contratar una agencia", "Equipos pequeños que necesitan producir más con menos"],
    incluye: [
      {
        grupo: "Instalación",
        items: [
          "Instalación de la oficina de agentes en tu computador",
          "Cerebro de tu marca: avatar, servicios, tono, precios y objetivos",
          "Capacitación de 2 horas para tu equipo",
        ],
      },
      {
        grupo: "Tu equipo de agentes",
        items: ["Estratega", "Guionista (método biwov)", "Copywriter", "Creativo de ideas y campañas", "Analista de resultados"],
      },
      { grupo: "Cada mes", items: ["Actualizaciones del sistema y de los métodos", "Mantenimiento de la memoria de tu marca", "Soporte por WhatsApp"] },
    ],
    noIncluye: ["Tu suscripción de Claude (aprox. US$20 al mes, la pagas directo)", "Publicación y pauta"],
    pasos: ["Diagnóstico y cuestionario de tu marca", "Instalamos y cargamos el cerebro", "Tu equipo pide y los agentes entregan", "Cada mes mejoramos la memoria"],
    condiciones: ["Mínimo 3 meses", "1 marca"],
    icono: "brain",
    mensajeWhatsApp: "Hola, quiero mi equipo de agentes de IA (plan Esencial).",
  },
  {
    slug: "agentes-pro",
    escalon: "agentes",
    ticket: "high",
    nombre: "biwov Agentes · Pro",
    precio: 549000,
    unidad: "/mes",
    adicional: { label: "Instalación y cerebro de tu marca (una vez)", precio: 1990000 },
    gancho: "La agencia de agentes completa: más especialistas, varias marcas y acompañamiento mensual de Kathe.",
    paraQuien: ["Empresas con varias marcas o líneas de negocio", "Equipos de marketing que quieren multiplicar su capacidad"],
    incluye: [
      {
        grupo: "Todo lo del plan Esencial, y además",
        items: [
          "Hasta 3 marcas, cada una con su propia memoria",
          "Trafficker (campañas en Meta), auditor de redes y seguimiento comercial",
          "Coordinador que reparte el trabajo entre los agentes",
          "Avisos y tareas por Telegram",
          "1 reunión mensual de mejora con Kathe",
        ],
      },
    ],
    noIncluye: ["Tu suscripción de Claude (aprox. US$20 a US$100 al mes según el uso)", "Publicación y pauta"],
    pasos: ["Diagnóstico de cada marca", "Instalación y entrenamiento", "Tu equipo trabaja con los agentes", "Reunión mensual de mejora"],
    condiciones: ["Mínimo 3 meses"],
    icono: "sparkles",
    destacado: true,
    mensajeWhatsApp: "Hola, quiero conocer el plan biwov Agentes Pro.",
  },
];

export const planClientePorSlug = (slug: string) => PLANES_CLIENTES.find((p) => p.slug === slug);

export const TICKET_LABEL: Record<Ticket, string> = { low: "Para empezar", medio: "Crecimiento", high: "Alto impacto" };
