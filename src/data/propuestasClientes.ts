/**
 * Propuestas hechas a la medida de un cliente puntual. Cada una vive en
 * biwov.com/propuesta/<slug>: un link privado (no aparece en el menú, ni en el
 * sitemap, ni en Google) con el plan, el formulario, el contrato que se llena
 * solo y la firma. Lo que la clienta firma llega al panel, en "Compras".
 *
 * Para una propuesta nueva: copia el bloque, cambia el slug y los textos.
 */

export interface ContratistaBiwov {
  nombre: string;
  cedula: string;
  ciudad: string;
  celular: string;
  correo: string;
}

export const CONTRATISTA: ContratistaBiwov = {
  nombre: "Katherine Usma Aristizábal",
  cedula: "1.053.843.098",
  ciudad: "Manizales",
  celular: "313 312 5157",
  correo: "biwov.com@gmail.com",
};

export interface BloqueIncluye {
  titulo: string;
  items: string[];
}

export interface EtapaPlan {
  cuando: string;
  titulo: string;
  detalle: string[];
}

export interface HerramientaCliente {
  nombre: string;
  uso: string;
  costoAprox: string;
}

export interface PropuestaCliente {
  slug: string;
  version: string;
  titulo: string;
  subtitulo: string;
  sector: string;
  duracionMeses: number;
  /** Tarjetas del inicio de la landing (máximo 4). */
  tarjetas: { etiqueta: string; valor: string }[];
  /** Texto de la cláusula "Objeto". */
  objeto: string;
  /** Párrafo inicial de la cláusula "Plan de trabajo y metodología". */
  metodologia: string;
  /** Párrafo después de los compromisos del cliente. */
  notaCompromisos: string;
  /** Plataformas de terceros que se nombran en la cláusula de políticas. */
  plataformas: string;
  /** Párrafo propio del sector (ej. publicidad en salud). Opcional. */
  parrafoSector?: string;
  /** Sobre qué información se guarda reserva. */
  reservaSobre: string;
  /** Etiqueta del campo de empresa en el formulario. */
  etiquetaEmpresa: string;
  herramientasTitulo: string;
  herramientasSubtitulo: string;
  herramientasIntro: string;
  incluye: BloqueIncluye[];
  plan: EtapaPlan[];
  compromisosCliente: string[];
  herramientas: HerramientaCliente[];
  pago: {
    totalContrato: number;
    /** Título grande de la sección Inversión. */
    titulo: string;
    subtitulo: string;
    /** Párrafo de la cláusula "Valor y forma de pago". */
    clausula: string;
    lineas: { titulo: string; valor: number; detalle: string[] }[];
  };
  noIncluye: string[];
}

const ORTODONCIA: PropuestaCliente = {
  slug: "ortodoncia-bw26",
  version: "propuesta-ortodoncia-2026-11-10-v1",
  titulo: "Plan de crecimiento digital",
  subtitulo:
    "Campañas, comunidad y contenido para que más personas conozcan tu consultorio, confíen en ti y agenden.",
  sector: "Consultorio de ortodoncia",
  duracionMeses: 3,
  tarjetas: [
    { etiqueta: "Contenido", valor: "12 guiones + 3 reels por semana" },
    { etiqueta: "Duración", valor: "3 meses (mínimo)" },
    { etiqueta: "Inversión", valor: "$1.000.000 / mes" },
    { etiqueta: "Acompañamiento", valor: "1 reunión virtual por semana" },
  ],
  objeto:
    "LA CONTRATISTA prestará a LA CONTRATANTE el servicio de dirección y acompañamiento en marketing digital descrito en este contrato (plan de crecimiento digital), con campañas publicitarias en Meta, lineamientos para generar comunidad, guiones de contenido, configuración de herramientas e implementación de inteligencia artificial, durante 3 meses.",
  metodologia:
    "Primero se planea y después se ejecuta. Una vez firmado el contrato se inicia el diagnóstico, la revisión de redes sociales y de configuraciones, y se envía a LA CONTRATANTE el plan de trabajo con la planeación, la ejecución y los objetivos. La instalación de herramientas se hace de manera presencial y el acompañamiento continúa con una reunión virtual a la semana.",
  notaCompromisos:
    "La grabación y la edición de los videos son responsabilidad de LA CONTRATANTE. LA CONTRATISTA la guiará durante todo el proceso y le enseñará marketing digital para que pueda trabajarlo de la mejor manera posible. Los guiones o piezas que no se graben o publiquen en el mes no se acumulan.",
  plataformas:
    "Meta, Instagram, Facebook, WhatsApp, Claude, ChatGPT, entre otras",
  parrafoSector:
    "Los anuncios de servicios de salud deben cumplir las políticas de publicidad de Meta y las normas colombianas sobre publicidad de servicios de salud; LA CONTRATANTE responde por la veracidad de lo que se anuncia de su consultorio.",
  reservaSobre: "la información del negocio y de los pacientes",
  etiquetaEmpresa: "Nombre del consultorio (opcional)",
  herramientasTitulo: "Herramientas",
  herramientasSubtitulo: "Pagas tú, directo al proveedor",
  herramientasIntro:
    "LA CONTRATANTE paga directamente las herramientas que necesita. LA CONTRATISTA la asesora y le instala el programa.",
  incluye: [
    {
      titulo: "Campañas publicitarias en Meta",
      items: [
        "Campaña de crecimiento de audiencia: para que más personas de tu zona conozcan el consultorio y te sigan.",
        "Campaña de ventas: para convertir esa audiencia en mensajes y citas agendadas.",
        "Configuración de públicos, presupuestos y creativos con los videos e imágenes del mes.",
        "Seguimiento y optimización de las campañas durante los 3 meses.",
        "Informes de resultados de las campañas: alcance, seguidores, mensajes, costo por resultado y recomendaciones.",
      ],
    },
    {
      titulo: "Estrategia y comunidad",
      items: [
        "Diagnóstico inicial: revisión de redes sociales, perfil, contenido y configuraciones actuales.",
        "Plan de trabajo con la planeación, la ejecución y los objetivos de cada mes, enviado antes de empezar.",
        "Lineamientos durante los 3 meses para generar comunidad: qué publicar, cómo responder y cómo conversar con tu audiencia.",
        "Contenido orgánico primero y, cuando esté probado, se lleva a pauta pagada.",
      ],
    },
    {
      titulo: "Contenido",
      items: [
        "12 guiones de video escritos para tu consultorio (en total, durante los 3 meses).",
        "Guía para grabar mínimo 3 reels a la semana: qué grabar, cómo grabarlo y cómo editarlo.",
        "Apoyo con las imágenes: ideas, indicaciones y revisión de las piezas gráficas.",
      ],
    },
    {
      titulo: "Herramientas e inteligencia artificial",
      items: [
        "Implementación y configuración de las herramientas de trabajo para tener un ecosistema digital conectado.",
        "Instalación presencial de Claude Code (IA) para que tú misma edites tus videos, con asesoría paso a paso.",
        "Asesoría para crear imágenes con inteligencia artificial (ChatGPT).",
      ],
    },
    {
      titulo: "Acompañamiento y formación",
      items: [
        "Instalación y arranque de manera presencial.",
        "1 reunión virtual a la semana para dar lineamientos, estrategia y guía.",
        "Acompañamiento para cualquier duda que tengas durante el proceso.",
        "Formación en marketing digital durante el proceso, para que puedas trabajarlo de la mejor manera posible.",
      ],
    },
  ],
  plan: [
    {
      cuando: "Al firmar el contrato",
      titulo: "Diagnóstico y arranque",
      detalle: [
        "Firmado el contrato, empezamos con el diagnóstico y la revisión de tus redes sociales.",
        "Revisamos y ajustamos las configuraciones de tus cuentas.",
        "Instalación presencial de las herramientas (Claude Code y demás).",
        "Te enviamos el plan de trabajo: planeación, ejecución y objetivos.",
      ],
    },
    {
      cuando: "Mes 1",
      titulo: "Contenido orgánico y comunidad",
      detalle: [
        "Primero se planea y después se ejecuta: recibes la planeación antes de grabar.",
        "Guiones del mes y grabación de mínimo 3 reels a la semana.",
        "Lineamientos de comunidad y reunión virtual semanal.",
      ],
    },
    {
      cuando: "Meses 2 y 3",
      titulo: "Campañas de audiencia y de ventas",
      detalle: [
        "El contenido que mejor funcionó se lleva a pauta.",
        "Campaña de crecimiento de audiencia y campaña de ventas activas.",
        "Informes de campañas, ajustes y nuevos guiones.",
      ],
    },
    {
      cuando: "Al cumplir el tercer mes",
      titulo: "Evaluación y continuidad",
      detalle: [
        "Revisamos los resultados de los 3 meses.",
        "Decidimos juntas si se le da continuidad al proceso y cómo.",
      ],
    },
  ],
  compromisosCliente: [
    "Grabar mínimo 3 reels a la semana con los guiones y la guía que recibe.",
    "Encargarse de la grabación y la edición de los videos (biwov la guía y le enseña en el proceso).",
    "Pagar directamente las herramientas que necesita y la inversión en pauta de Meta.",
    "Dar acceso a sus redes sociales, al administrador comercial de Meta y a las herramientas necesarias.",
    "Asistir a la reunión virtual semanal y aprobar la planeación antes de publicar.",
  ],
  herramientas: [
    {
      nombre: "Claude Code (suscripción de Claude)",
      uso: "Edición de videos con inteligencia artificial",
      costoAprox: "$60.000 a $80.000 COP al mes, aprox.",
    },
    {
      nombre: "ChatGPT",
      uso: "Creación de imágenes (opcional)",
      costoAprox: "$20.000 COP al mes, aprox.",
    },
    {
      nombre: "Pauta en Meta",
      uso: "Inversión de las campañas, pagada directo a Meta",
      costoAprox: "La define la clienta",
    },
  ],
  pago: {
    totalContrato: 3_000_000,
    titulo: "$1.000.000",
    subtitulo: "al mes",
    clausula:
      "El valor del servicio es de $1.000.000 COP mensuales, para un total de $3.000.000 COP por los 3 meses. Se paga así:",
    lineas: [
      {
        titulo: "Canje",
        valor: 2_060_000,
        detalle: [
          "Tratamiento de ortodoncia para Katherine Usma Aristizábal (pago único), que se abona al valor de este contrato.",
        ],
      },
      {
        titulo: "Saldo en efectivo",
        valor: 940_000,
        detalle: [
          "Se paga en efectivo después del tercer mes.",
          "70% ($658.000) anticipado, el día en que se cumple el tercer mes.",
          "30% ($282.000) al finalizar el proceso.",
        ],
      },
    ],
  },
  noIncluye: [
    "Grabación y edición de los videos (las hace la clienta, con nuestra guía).",
    "Inversión en pauta de Meta ni costo de las herramientas o suscripciones.",
    "Respuesta de mensajes comerciales ni atención a pacientes.",
    "Desplazamientos fuera de Manizales.",
  ],
};

const CONTENIDO_REDES: PropuestaCliente = {
  slug: "contenido-redes-bw27",
  version: "propuesta-contenido-redes-2026-11-12-v1",
  titulo: "Plan de contenido y crecimiento en redes",
  subtitulo:
    "Estrategia, videos, manejo de redes y campañas para que tu marca se vea profesional, crezca su audiencia y venda más.",
  sector: "Propuesta a la medida",
  duracionMeses: 4,
  tarjetas: [
    { etiqueta: "Videos", valor: "5 el mes 1 · 8 al mes desde el mes 2" },
    { etiqueta: "Duración", valor: "4 meses (mínimo)" },
    { etiqueta: "Inversión", valor: "$530.000 el mes 1 · $1.250.000 / mes" },
    { etiqueta: "Redes", valor: "Instagram, Facebook y TikTok" },
  ],
  objeto:
    "LA CONTRATISTA prestará a LA CONTRATANTE el servicio de estrategia, producción de contenido en video, manejo de redes sociales (Instagram, Facebook y TikTok) y gestión de campañas publicitarias en Meta descrito en este contrato, con asesoría y lineamientos para la empresa, durante 4 meses.",
  metodologia:
    "Primero se planea y después se ejecuta. Los primeros 15 a 20 días se dedican al análisis de la marca, la planeación y la creación de contenido; después se revisan los resultados para crear las campañas publicitarias. Cada mes LA CONTRATANTE recibe la planeación, la ejecución y los objetivos antes de publicar.",
  notaCompromisos:
    "Las fechas de grabación se acuerdan con anticipación y se pueden reprogramar avisando con al menos 48 horas. Los videos que no se graben en el mes por causas de LA CONTRATANTE no se acumulan para el mes siguiente.",
  plataformas: "Meta, Instagram, Facebook, TikTok, entre otras",
  reservaSobre: "la información del negocio y de sus clientes",
  etiquetaEmpresa: "Nombre de la empresa o marca (opcional)",
  herramientasTitulo: "Pauta publicitaria",
  herramientasSubtitulo: "Se paga aparte, directo a Meta",
  herramientasIntro:
    "La inversión en pauta no hace parte del valor del servicio (mano de obra): LA CONTRATANTE la paga directamente a Meta. LA CONTRATISTA la administra y recomienda cuándo escalarla según los resultados.",
  incluye: [
    {
      titulo: "Estrategia y análisis de la marca",
      items: [
        "Análisis de la marca: cómo se ve hoy, qué comunica y a quién le habla.",
        "Revisión de las redes sociales para identificar qué se debe mejorar.",
        "Estrategia de contenido y de comunicación.",
        "Planeación mensual con objetivos claros, enviada antes de ejecutar.",
      ],
    },
    {
      titulo: "Producción de videos",
      items: [
        "Mes 1: 5 videos, grabados en 2 jornadas (3 videos y 2 videos).",
        "Desde el mes 2: 8 videos al mes, grabados en 2 jornadas cada 15 días (4 videos por jornada).",
        "Si se acuerda y se logra, los videos del mes se pueden grabar en una sola jornada.",
        "Videos hablados de hasta 1 minuto cada uno.",
        "Guiones e ideas para cada video.",
        "Edición de los videos para redes sociales.",
      ],
    },
    {
      titulo: "Manejo de redes sociales",
      items: [
        "Manejo de Instagram, Facebook y TikTok.",
        "Publicación (subida) del contenido con sus textos.",
        "Lo que se crea para Instagram y Facebook se replica en TikTok.",
      ],
    },
    {
      titulo: "Campañas publicitarias en Meta",
      items: [
        "Campaña de crecimiento de audiencia: para que más personas conozcan la marca y la sigan.",
        "Campaña de ventas: para convertir esa audiencia en mensajes y clientes.",
        "Arrancan después de los primeros 15 a 20 días, con el contenido ya creado.",
        "Se puede iniciar con una inversión desde $250.000 al mes y escalar según los resultados.",
        "Seguimiento, optimización e informes de resultados.",
      ],
    },
    {
      titulo: "Asesoría y acompañamiento",
      items: [
        "Asesoría y lineamientos para la empresa durante todo el proceso.",
        "1 reunión virtual a la semana para revisar avances, estrategia y próximos pasos.",
        "Acompañamiento para cualquier duda durante el proceso.",
      ],
    },
  ],
  plan: [
    {
      cuando: "Días 1 a 20",
      titulo: "Planeación y creación de contenido",
      detalle: [
        "Análisis de la marca y revisión de redes sociales.",
        "Estrategia, planeación, guiones e ideas.",
        "Grabación de los 5 videos del primer mes y primeras publicaciones.",
      ],
    },
    {
      cuando: "Después del día 20",
      titulo: "Campañas publicitarias",
      detalle: [
        "Revisamos cómo respondió el contenido.",
        "Creamos la campaña de crecimiento de audiencia y la de ventas.",
        "Arrancamos desde $250.000 de pauta y escalamos según resultados.",
      ],
    },
    {
      cuando: "Meses 2 a 4",
      titulo: "8 videos al mes y crecimiento",
      detalle: [
        "2 jornadas de grabación al mes, cada 15 días.",
        "Publicación en Instagram y Facebook, replicada en TikTok.",
        "Optimización de campañas e informes de resultados.",
      ],
    },
    {
      cuando: "Al cumplir el cuarto mes",
      titulo: "Evaluación y continuidad",
      detalle: [
        "Revisamos los resultados de los 4 meses.",
        "Decidimos juntos si se le da continuidad al proceso y cómo.",
      ],
    },
  ],
  compromisosCliente: [
    "Estar disponible en las jornadas de grabación acordadas.",
    "Entregar la información de la marca, productos, precios y promociones.",
    "Dar acceso a sus redes sociales y al administrador comercial de Meta.",
    "Aprobar la planeación y los guiones antes de grabar y publicar.",
    "Pagar directamente a Meta la inversión en pauta (desde $250.000 al mes).",
    "Asistir a la reunión virtual semanal.",
  ],
  herramientas: [
    {
      nombre: "Pauta en Meta",
      uso: "Campañas de crecimiento de audiencia y de ventas",
      costoAprox:
        "Desde $250.000 COP al mes para empezar; se escala según resultados.",
    },
  ],
  pago: {
    totalContrato: 4_280_000,
    titulo: "$530.000",
    subtitulo: "el primer mes · $1.250.000 desde el segundo",
    clausula:
      "El valor del servicio es de $530.000 COP el primer mes y de $1.250.000 COP mensuales del segundo al cuarto mes, para un total de $4.280.000 COP por los 4 meses. Cada mes se paga por anticipado, dentro de los primeros 5 días del mes de servicio. Se paga así:",
    lineas: [
      {
        titulo: "Mes 1 · valor de inicio",
        valor: 530_000,
        detalle: [
          "5 videos, estrategia, planeación, manejo de redes y campañas.",
        ],
      },
      {
        titulo: "Meses 2, 3 y 4 · cada mes",
        valor: 1_250_000,
        detalle: [
          "8 videos al mes y todo el plan.",
          "Total de los meses 2 a 4: $3.750.000.",
        ],
      },
    ],
  },
  noIncluye: [
    "La inversión en pauta de Meta (se paga directo a Meta).",
    "Respuesta de mensajes comerciales ni atención a clientes.",
    "Desplazamientos fuera de Manizales.",
    "Videos adicionales a los del plan del mes.",
  ],
};

export const PROPUESTAS_CLIENTES: PropuestaCliente[] = [
  ORTODONCIA,
  CONTENIDO_REDES,
];

export function propuestaPorSlug(slug: string): PropuestaCliente | undefined {
  return PROPUESTAS_CLIENTES.find((p) => p.slug === slug);
}

export const copPropuesta = (n: number) => `$${n.toLocaleString("es-CO")}`;

/** "2026-11-15" → "15 de noviembre de 2026" (sin líos de zona horaria). */
export function fechaLarga(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  const fecha = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(fecha);
}

/** Suma meses a una fecha "AAAA-MM-DD" y la devuelve en el mismo formato. */
export function sumarMeses(iso: string, meses: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "";
  const fecha = new Date(Date.UTC(+m[1], +m[2] - 1 + meses, +m[3]));
  return fecha.toISOString().slice(0, 10);
}
