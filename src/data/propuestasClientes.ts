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
  fechaInicio: string;
  fechaFin: string;
  duracionMeses: number;
  valorMensual: number;
  incluye: BloqueIncluye[];
  plan: EtapaPlan[];
  compromisosCliente: string[];
  herramientas: HerramientaCliente[];
  pago: {
    totalContrato: number;
    canje: { concepto: string; valor: number };
    saldo: { valor: number; condiciones: string[] };
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
  fechaInicio: "15 de noviembre de 2026",
  fechaFin: "15 de febrero de 2027",
  duracionMeses: 3,
  valorMensual: 1_000_000,
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
      cuando: "Desde el 15 de noviembre",
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
      cuando: "15 de febrero de 2027",
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
    { nombre: "Claude Code (suscripción de Claude)", uso: "Edición de videos con inteligencia artificial", costoAprox: "$60.000 a $80.000 COP al mes, aprox." },
    { nombre: "ChatGPT", uso: "Creación de imágenes (opcional)", costoAprox: "$20.000 COP al mes, aprox." },
    { nombre: "Pauta en Meta", uso: "Inversión de las campañas, pagada directo a Meta", costoAprox: "La define la clienta" },
  ],
  pago: {
    totalContrato: 3_000_000,
    canje: { concepto: "Tratamiento de ortodoncia para Katherine Usma Aristizábal (pago único)", valor: 2_060_000 },
    saldo: {
      valor: 940_000,
      condiciones: [
        "Se paga en efectivo después del tercer mes.",
        "70% ($658.000) anticipado, el 15 de febrero de 2027.",
        "30% ($282.000) al finalizar el proceso.",
      ],
    },
  },
  noIncluye: [
    "Grabación y edición de los videos (las hace la clienta, con nuestra guía).",
    "Inversión en pauta de Meta ni costo de las herramientas o suscripciones.",
    "Respuesta de mensajes comerciales ni atención a pacientes.",
    "Desplazamientos fuera de Manizales.",
  ],
};

export const PROPUESTAS_CLIENTES: PropuestaCliente[] = [ORTODONCIA];

export function propuestaPorSlug(slug: string): PropuestaCliente | undefined {
  return PROPUESTAS_CLIENTES.find((p) => p.slug === slug);
}

export const copPropuesta = (n: number) => `$${n.toLocaleString("es-CO")}`;
