import { PLANES_BRANDING, type EcosistemaId } from "./precios";

export type Trayectoria = "nueva" | "uno-tres" | "mas-tres";

export type ObjetivoPrincipal =
  | "clientes"
  | "ventas"
  | "tiempo"
  | "personalizada";

export type RedSocial =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "whatsapp"
  | "web"
  | "publicidad"
  | "ninguna";

export type PlataformaConSeguidores = "instagram" | "facebook" | "tiktok";

export type RangoSeguidores =
  | "menos-1k"
  | "1k-2k"
  | "2k-4k"
  | "4k-5k"
  | "5k-20k"
  | "mas-20k";

export type GestionLeads = "nada" | "excel" | "crm-basico" | "crm-avanzado";

export type RangoPresupuesto = "menos-1m" | "1m-3m" | "3m-5m" | "mas-5m";

export type EstadoBranding = "completo" | "incompleto" | "nada";

export const ESTADOS_BRANDING: Record<EstadoBranding, string> = {
  completo: "Sí, tengo logo, colores y tipografías definidos",
  incompleto: "Tengo algo, pero está incompleto o desactualizado",
  nada: "No tengo nada de identidad de marca todavía",
};

export interface RespuestasDiagnostico {
  nombre: string;
  empresa: string;
  whatsapp: string;
  email: string;
  tipoNegocio?: string;
  trayectoria: Trayectoria;
  redes: RedSocial[];
  seguidores: Partial<Record<PlataformaConSeguidores, RangoSeguidores>>;
  gestionLeads: GestionLeads;
  brandingEstado: EstadoBranding;
  objetivo: ObjetivoPrincipal;
  presupuesto: RangoPresupuesto;
  urgencia?: string;
}

export const CAMINOS: Record<ObjetivoPrincipal, { titulo: string; incluye: string[] }> = {
  clientes: {
    titulo: "Quiero conseguir más clientes",
    incluye: [
      "Estrategia",
      "Creación de contenido",
      "Redes Sociales",
      "Meta Ads",
      "Google Ads",
      "Landing Pages",
      "Automatizaciones",
    ],
  },
  ventas: {
    titulo: "Quiero vender más",
    incluye: [
      "CRM",
      "Embudos",
      "Seguimiento",
      "WhatsApp",
      "Agenda",
      "Automatizaciones",
      "IA",
    ],
  },
  tiempo: {
    titulo: "Quiero ahorrar tiempo",
    incluye: [
      "Automatizaciones",
      "CRM",
      "IA",
      "Integraciones",
      "Gestión comercial",
      "Procesos automáticos",
    ],
  },
  personalizada: {
    titulo: "Necesito una solución más avanzada",
    incluye: [
      "CRM avanzado",
      "Embudos en GoHighLevel",
      "Automatizaciones avanzadas",
      "IA aplicada",
      "Integraciones entre tus herramientas",
      "Estrategia a la medida",
    ],
  },
};

export const TRAYECTORIAS: Record<Trayectoria, string> = {
  nueva: "Estoy recién empezando",
  "uno-tres": "Entre 1 y 3 años operando",
  "mas-tres": "Más de 3 años operando",
};

export const REDES_SOCIALES: { id: RedSocial; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "web", label: "Página web" },
  { id: "publicidad", label: "Ya invierto en publicidad paga" },
  { id: "ninguna", label: "Ninguna todavía" },
];

export const RANGOS_SEGUIDORES: Record<RangoSeguidores, string> = {
  "menos-1k": "Menos de 1.000",
  "1k-2k": "1.000 – 2.000",
  "2k-4k": "2.000 – 4.000",
  "4k-5k": "4.000 – 5.000",
  "5k-20k": "5.000 – 20.000",
  "mas-20k": "Más de 20.000",
};

const RANGOS_SEGUIDORES_BAJOS: RangoSeguidores[] = ["menos-1k", "1k-2k"];

export const GESTIONES_LEADS: Record<GestionLeads, string> = {
  nada: "No tengo ningún sistema, se me pierden mensajes",
  excel: "Los anoto en Excel o cuaderno",
  "crm-basico": "Tengo un CRM básico",
  "crm-avanzado": "Tengo un CRM avanzado y proceso definido",
};

export const RANGOS_PRESUPUESTO: Record<
  RangoPresupuesto,
  { etiqueta: string; techo: number | null }
> = {
  "menos-1m": { etiqueta: "Menos de $1.000.000/mes", techo: 1_000_000 },
  "1m-3m": { etiqueta: "Entre $1.000.000 y $3.000.000/mes", techo: 3_000_000 },
  "3m-5m": { etiqueta: "Entre $3.000.000 y $5.000.000/mes", techo: 5_000_000 },
  "mas-5m": { etiqueta: "Más de $5.000.000/mes", techo: null },
};

export interface Diagnostico {
  problema: string;
  solucion: string;
  ajusteExpectativas?: string;
}

export interface ResultadoClasificacion {
  ecosistema: EcosistemaId;
  camino: ObjetivoPrincipal;
  modulosSugeridos: string[];
  presupuestoMensualDeclarado: number | null;
  diagnostico: Diagnostico;
  brandingRecomendado?: { nombre: string; precio: number };
  /** true si no tiene Instagram ni Facebook: hay que crearlas desde cero, no solo optimizarlas. */
  requiereCreacionDeRedes: boolean;
}

const PLATAFORMAS_BASE: PlataformaConSeguidores[] = ["instagram", "facebook", "tiktok"];

function tieneRedesActivas(redes: RedSocial[]): boolean {
  return redes.some((r) => r === "instagram" || r === "facebook" || r === "tiktok");
}

/** true si las cuentas que tiene existen pero con muy pocos seguidores (presencia recién creada, sin audiencia real). */
function presenciaEsIncipiente(r: RespuestasDiagnostico): boolean {
  const activas = PLATAFORMAS_BASE.filter((p) => r.redes.includes(p));
  if (activas.length === 0) return false;
  return activas.every((p) => {
    const rango = r.seguidores[p];
    return rango !== undefined && RANGOS_SEGUIDORES_BAJOS.includes(rango);
  });
}

/** true si no tiene ni Instagram ni Facebook: hay que crearlas desde cero (más trabajo que optimizar). */
function requiereCreacionDeRedes(r: RespuestasDiagnostico): boolean {
  return !r.redes.includes("instagram") && !r.redes.includes("facebook");
}

/**
 * Deriva el ecosistema a partir de señales reales (trayectoria, presencia
 * digital, tamaño de audiencia, gestión de leads) en vez de una etapa
 * autodeclarada — así se evita, por ejemplo, recomendar CRM y automatización
 * a un negocio que apenas está empezando y todavía necesita lo básico: orden,
 * estrategia, contenido, WhatsApp y un CRM inicial.
 */
function derivarEcosistema(r: RespuestasDiagnostico): EcosistemaId {
  const sinBaseDigital = r.redes.includes("ninguna") || !tieneRedesActivas(r.redes);
  const esNegocioNuevo = r.trayectoria === "nueva";

  if (sinBaseDigital || esNegocioNuevo || presenciaEsIncipiente(r)) {
    return "start";
  }

  const esComplejo = r.objetivo === "personalizada" || r.gestionLeads === "crm-avanzado";
  if (esComplejo) {
    return "enterprise";
  }

  return "growth";
}

function esProspectoDeBajaViabilidad(r: RespuestasDiagnostico): boolean {
  return r.gestionLeads === "nada" && r.presupuesto === "menos-1m";
}

const PROBLEMA_POR_GESTION: Record<GestionLeads, string> = {
  nada: "Hoy los mensajes y clientes nuevos se te pueden estar perdiendo porque no tienes ningún sistema que los organice y les dé seguimiento.",
  excel: "Llevas el control en Excel o a mano: funciona a medias, pero te quita tiempo y es fácil que un cliente se te escape sin que te des cuenta.",
  "crm-basico": "Ya tienes algo de estructura, pero probablemente no está conectada con el resto de tu operación (redes, WhatsApp, publicidad).",
  "crm-avanzado": "Tienes herramientas avanzadas, pero es probable que no estén del todo aprovechadas ni conectadas entre sí.",
};

const SOLUCION_POR_ECOSISTEMA: Record<EcosistemaId, string> = {
  start:
    "Te recomendamos el Ecosistema START: primero ponemos en orden tu presencia digital, tu contenido, tu WhatsApp y un CRM básico. La automatización avanzada llega después, cuando esas bases ya están firmes.",
  growth:
    "Te recomendamos el Ecosistema GROWTH: conectamos tu CRM, WhatsApp, publicidad y automatizaciones para que vendas más sin tener que trabajar más horas.",
  enterprise:
    "Te recomendamos el Ecosistema ENTERPRISE: configuramos automatizaciones avanzadas, IA y embudos en GoHighLevel diseñados de forma estratégica para tu operación.",
};

function generarDiagnostico(
  r: RespuestasDiagnostico,
  ecosistema: EcosistemaId,
): Diagnostico {
  const sinPresenciaDigital = r.redes.includes("ninguna") || !tieneRedesActivas(r.redes);

  let problema = PROBLEMA_POR_GESTION[r.gestionLeads];
  if (presenciaEsIncipiente(r)) {
    problema =
      "Tienes cuentas creadas, pero con muy pocos seguidores todavía: en la práctica estás empezando desde cero en cuanto a audiencia real.";
  } else if (sinPresenciaDigital) {
    problema =
      "Todavía no tienes presencia digital activa, lo que limita que nuevos clientes te encuentren y confíen en tu negocio.";
  }

  if (r.tipoNegocio && r.tipoNegocio.trim().length > 0) {
    problema = `Para tu negocio (${r.tipoNegocio.trim()}): ${problema.charAt(0).toLowerCase()}${problema.slice(1)}`;
  }

  const solucion = SOLUCION_POR_ECOSISTEMA[ecosistema];

  const diagnostico: Diagnostico = { problema, solucion };

  if (esProspectoDeBajaViabilidad(r)) {
    diagnostico.ajusteExpectativas =
      "Con el presupuesto declarado, lo más honesto es empezar por una versión ligera y por fases: primero orden y bases, y vamos escalando la inversión a medida que el ecosistema empiece a traer resultados.";
  }

  return diagnostico;
}

function sugerirBranding(brandingEstado: EstadoBranding) {
  if (brandingEstado === "completo") return undefined;
  const id = brandingEstado === "nada" ? "basico" : "basico-toolkit";
  const plan = PLANES_BRANDING.find((b) => b.id === id);
  if (!plan) return undefined;
  return { nombre: plan.nombre, precio: plan.precio };
}

const MODULOS_START_BASE = [
  "Estrategia y estructura de marca",
  "Contenido y campañas",
  "Gestión de redes sociales",
  "WhatsApp organizado",
  "CRM básico inicial",
];

/**
 * Cruza las respuestas del diagnóstico y determina el ecosistema
 * recomendado, los módulos sugeridos y un diagnóstico (problema + solución)
 * en lenguaje simple, listo para mostrarle al prospecto de inmediato.
 */
export function clasificarNegocio(
  respuestas: RespuestasDiagnostico,
): ResultadoClasificacion {
  const ecosistema = derivarEcosistema(respuestas);
  const camino = CAMINOS[respuestas.objetivo];

  let modulosSugeridos: string[];
  if (ecosistema === "start") {
    modulosSugeridos = MODULOS_START_BASE;
  } else {
    const yaTiene = new Set(respuestas.redes);
    const yaTieneLeads = respuestas.gestionLeads !== "nada" && respuestas.gestionLeads !== "excel";
    modulosSugeridos = camino.incluye.filter((modulo) => {
      if (yaTieneLeads && modulo === "CRM") return false;
      if (yaTiene.has("whatsapp") && modulo === "WhatsApp") return false;
      if (yaTiene.has("web") && modulo === "Landing Pages") return false;
      if (yaTiene.has("publicidad") && (modulo === "Meta Ads" || modulo === "Google Ads"))
        return false;
      return true;
    });
  }

  const rango = RANGOS_PRESUPUESTO[respuestas.presupuesto];
  const presupuestoMensualDeclarado = rango.techo;
  const diagnostico = generarDiagnostico(respuestas, ecosistema);
  const brandingRecomendado = sugerirBranding(respuestas.brandingEstado);

  return {
    ecosistema,
    camino: respuestas.objetivo,
    modulosSugeridos,
    presupuestoMensualDeclarado,
    diagnostico,
    brandingRecomendado,
    requiereCreacionDeRedes: requiereCreacionDeRedes(respuestas),
  };
}
