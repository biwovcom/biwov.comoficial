/**
 * Motor de precios de biwov.
 * Los costos internos NUNCA se exponen al cliente: solo se usan para calcular
 * precios y para bloquear cualquier cotización que caiga por debajo del piso de costo.
 */

export type EcosistemaId = "start" | "growth" | "enterprise";

export const PARAMETROS = {
  margenAlaCarte: 0.4,
  minimoOrden: 150_000,
  comisionComercial: 0.35,
  comisionAplicaAPlanes: true,
  comisionAplicaASitioWeb: true,
  comisionAplicaAlaCarte: false,
};

/** precio = costo / (1 - margen). Dividir (no sumar) garantiza el margen real buscado. */
export function calcularPrecioDesdeCosto(
  costoInterno: number,
  margen: number = PARAMETROS.margenAlaCarte,
): number {
  const bruto = costoInterno / (1 - margen);
  return Math.round(bruto / 1000) * 1000;
}

export const COSTOS_INTERNOS = {
  edicionVideoSimple: 120_000,
  edicionVideoPromedio: 135_000,
  edicionVideoElaborado: 150_000,
  /** Costo por video cuando el proveedor edita un bloque de 4 videos/mes. */
  edicionVideoBloque4: 90_000,
  /** Costo por video cuando el proveedor edita un bloque de 8 videos/mes. */
  edicionVideoBloque8: 78_000,
  imagen: 15_000,
  carrusel: 25_000,
  grabacionJornada2h: 280_000,
  grabacionJornada3h: 350_000,
  dominioHostingAnual: 300_000,
  gestionCampanaMes: 400_000,
  publicacionPresencia: 450_000,
  publicacionCrecimiento: 600_000,
} as const;

/**
 * Inversión publicitaria mínima que el cliente paga directo a Meta/Google
 * (no a biwov) para que una campaña tenga sentido. Aplica desde el
 * Ecosistema START.
 */
export const INVERSION_PUBLICITARIA_MINIMA = 500_000;

export interface ItemAlaCarte {
  id: string;
  nombre: string;
  precio: number;
  costoInterno: number;
  unidad: string;
  nota?: string;
}

const PRECIO_IMAGEN = calcularPrecioDesdeCosto(COSTOS_INTERNOS.imagen);
const PRECIO_CARRUSEL = calcularPrecioDesdeCosto(COSTOS_INTERNOS.carrusel);

/**
 * Precios finales al cliente, derivados de costoInterno / (1 - margen). Los
 * packs son el precio unitario × cantidad (sin descuento adicional): si se
 * quiere ofrecer descuento por volumen, ajustar aquí explícitamente.
 */
export const PRECIOS_ALA_CARTE: ItemAlaCarte[] = [
  {
    id: "video-1",
    nombre: "Edición 1 video (promedio)",
    precio: 225_000,
    costoInterno: COSTOS_INTERNOS.edicionVideoPromedio,
    unidad: "video",
  },
  {
    id: "imagen-1",
    nombre: "1 imagen (dentro de pack)",
    precio: PRECIO_IMAGEN,
    costoInterno: COSTOS_INTERNOS.imagen,
    unidad: "imagen",
    nota: "Solo disponible en pack. No se vende suelta.",
  },
  {
    id: "pack-5-imagenes",
    nombre: "Pack 5 imágenes",
    precio: PRECIO_IMAGEN * 5,
    costoInterno: COSTOS_INTERNOS.imagen * 5,
    unidad: "pack",
  },
  {
    id: "pack-10-imagenes",
    nombre: "Pack 10 imágenes",
    precio: PRECIO_IMAGEN * 10,
    costoInterno: COSTOS_INTERNOS.imagen * 10,
    unidad: "pack",
  },
  {
    id: "carrusel-1",
    nombre: "1 carrusel",
    precio: PRECIO_CARRUSEL,
    costoInterno: COSTOS_INTERNOS.carrusel,
    unidad: "carrusel",
    nota: "Solo disponible en pack. No se vende suelto.",
  },
  {
    id: "pack-3-carruseles",
    nombre: "Pack 3 carruseles",
    precio: PRECIO_CARRUSEL * 3,
    costoInterno: COSTOS_INTERNOS.carrusel * 3,
    unidad: "pack",
  },
  {
    id: "grabacion-2h",
    nombre: "Jornada de grabación 2h",
    precio: 467_000,
    costoInterno: COSTOS_INTERNOS.grabacionJornada2h,
    unidad: "jornada",
    nota: "Se cobra aparte. Una jornada produce 4 a 8 videos.",
  },
  {
    id: "grabacion-3h",
    nombre: "Jornada de grabación 3h",
    precio: 583_000,
    costoInterno: COSTOS_INTERNOS.grabacionJornada3h,
    unidad: "jornada",
    nota: "Se cobra aparte. Una jornada produce 4 a 8 videos.",
  },
];

export interface Plan {
  id: EcosistemaId;
  nombreEcosistema: string;
  nombrePlan: string;
  precioMes: number | null;
  costoInterno: number | null;
  modulos: string[];
}

export const PLANES: Record<EcosistemaId, Plan> = {
  start: {
    id: "start",
    nombreEcosistema: "START",
    nombrePlan: "Presencia Digital",
    precioMes: 2_690_000,
    costoInterno: 1_794_000,
    modulos: [
      "Estrategia y estructura de marca",
      "Contenido y campañas",
      "Gestión de redes sociales",
      "WhatsApp organizado",
      "CRM básico inicial",
    ],
  },
  growth: {
    id: "growth",
    nombreEcosistema: "GROWTH",
    nombrePlan: "Crecimiento y Ventas",
    precioMes: 3_660_000,
    costoInterno: 2_652_000,
    modulos: [
      "Todo lo de Presencia Digital",
      "CRM y embudos de venta",
      "Automatizaciones de seguimiento",
      "WhatsApp y agenda conectados",
      "Publicidad (Meta Ads / Google Ads)",
    ],
  },
  enterprise: {
    id: "enterprise",
    nombreEcosistema: "ENTERPRISE",
    nombrePlan: "Automatización Avanzada",
    precioMes: null,
    costoInterno: null,
    modulos: [
      "Todo lo de Crecimiento y Ventas",
      "Automatizaciones avanzadas e IA",
      "Embudos avanzados en GoHighLevel",
      "Integraciones entre tus herramientas actuales",
      "Acompañamiento estratégico dedicado",
    ],
  },
};

/**
 * ⚠️ PENDIENTE DE CONFIRMAR: precio placeholder. Crear Instagram y Facebook
 * desde cero (configuración, verificación, vinculación, primeros ajustes)
 * implica más trabajo que solo optimizar cuentas existentes — pero no me
 * diste un costo real para esto todavía. Ajusta este valor cuando lo tengas.
 */
export const ADDONS = {
  sitioWeb: {
    id: "sitio-web",
    nombre: "Sitio Web",
    precio: 1_350_000,
    costoInterno: 300_000,
    tipo: "pago-unico" as const,
  },
  creacionRedes: {
    id: "creacion-redes",
    nombre: "Creación de Instagram y Facebook desde cero",
    precio: calcularPrecioDesdeCosto(200_000),
    costoInterno: 200_000,
    tipo: "pago-unico" as const,
  },
};

/** Aplica a todos los planes y precios mostrados al cliente. */
export const NOTA_IMPUESTOS =
  "Los precios no incluyen retención en la fuente ni impuestos: corren por cuenta del cliente.";

export type BrandingPlanId = "basico" | "basico-toolkit" | "identidad-completa";

export interface BrandingPlan {
  id: BrandingPlanId;
  nombre: string;
  precio: number;
  incluye: string[];
}

/**
 * Confirmado: estos valores son lo que cobra la diseñadora (costo interno),
 * por eso se les aplica el margen para llegar al precio final al cliente.
 */
export const BRANDING_VALORES_SON_COSTO_INTERNO = true;

export const PLANES_BRANDING: BrandingPlan[] = [
  {
    id: "basico",
    nombre: "Básico",
    precio: BRANDING_VALORES_SON_COSTO_INTERNO
      ? calcularPrecioDesdeCosto(800_000)
      : 800_000,
    incluye: ["Logo", "Paleta de color", "Tipografías"],
  },
  {
    id: "basico-toolkit",
    nombre: "Básico + Toolkit",
    precio: BRANDING_VALORES_SON_COSTO_INTERNO
      ? calcularPrecioDesdeCosto(1_500_000)
      : 1_500_000,
    incluye: ["Todo lo de Básico", "Plantillas editables"],
  },
  {
    id: "identidad-completa",
    nombre: "Identidad Visual + Manual de Marca",
    precio: BRANDING_VALORES_SON_COSTO_INTERNO
      ? calcularPrecioDesdeCosto(2_000_000)
      : 2_000_000,
    incluye: ["Identidad visual completa", "Manual de marca"],
  },
];

export interface ResultadoValidacionPiso {
  ok: boolean;
  precioMinimo: number;
}

/** El motor nunca cotiza por debajo del costo del proveedor. */
export function validarPisoDeCosto(
  precioPropuesto: number,
  costoInterno: number,
): ResultadoValidacionPiso {
  return {
    ok: precioPropuesto >= costoInterno,
    precioMinimo: costoInterno,
  };
}

export function cumpleMinimoOrden(subtotal: number): boolean {
  return subtotal >= PARAMETROS.minimoOrden;
}

export interface DesgloseCotizacion {
  plan: Plan;
  setupInicial: number;
  mensualidad: number | null;
  addonsSeleccionados: { nombre: string; precio: number }[];
  totalInicial: number;
  esVersionReducida: boolean;
  notaPresupuesto?: string;
}

/**
 * Genera el desglose de cotización para un plan, aplicando la regla de
 * personalización por presupuesto: si el presupuesto declarado es menor al
 * precio del plan, se ofrece una versión modular más ligera o pago
 * diferido — nunca un precio por debajo del costo interno.
 */
export function generarCotizacion(
  ecosistema: EcosistemaId,
  presupuestoMensualDeclarado: number | null,
  incluirSitioWeb: boolean,
  brandingAddonId?: BrandingPlanId,
  incluirCreacionRedes?: boolean,
): DesgloseCotizacion {
  const plan = PLANES[ecosistema];
  const addonsSeleccionados: { nombre: string; precio: number }[] = [];
  if (incluirSitioWeb) {
    addonsSeleccionados.push({ nombre: ADDONS.sitioWeb.nombre, precio: ADDONS.sitioWeb.precio });
  }
  if (brandingAddonId) {
    const branding = PLANES_BRANDING.find((b) => b.id === brandingAddonId);
    if (branding) {
      addonsSeleccionados.push({ nombre: `Branding — ${branding.nombre}`, precio: branding.precio });
    }
  }
  if (incluirCreacionRedes) {
    addonsSeleccionados.push({
      nombre: ADDONS.creacionRedes.nombre,
      precio: ADDONS.creacionRedes.precio,
    });
  }
  const setupInicial = addonsSeleccionados.reduce((acc, a) => acc + a.precio, 0);

  if (ecosistema === "enterprise" || plan.precioMes === null) {
    return {
      plan,
      setupInicial,
      mensualidad: null,
      addonsSeleccionados,
      totalInicial: setupInicial,
      esVersionReducida: false,
      notaPresupuesto:
        "El alcance y la inversión se definen tras el diagnóstico detallado.",
    };
  }

  let mensualidad = plan.precioMes;
  let esVersionReducida = false;
  let notaPresupuesto: string | undefined;

  if (
    presupuestoMensualDeclarado !== null &&
    presupuestoMensualDeclarado < plan.precioMes &&
    plan.costoInterno !== null
  ) {
    const pisoValidado = validarPisoDeCosto(
      presupuestoMensualDeclarado,
      plan.costoInterno,
    );
    esVersionReducida = true;
    if (pisoValidado.ok) {
      mensualidad = Math.max(presupuestoMensualDeclarado, plan.costoInterno);
      notaPresupuesto =
        "Tu presupuesto es menor al plan completo: te proponemos una versión modular más ligera, o financiar el resto en cuotas.";
    } else {
      mensualidad = plan.precioMes;
      notaPresupuesto =
        "Tu presupuesto declarado está por debajo de lo que cuesta operar este ecosistema. Te proponemos un plan modular reducido o un esquema de pago inicial + cuotas, manteniendo el precio del plan.";
    }
  }

  return {
    plan,
    setupInicial,
    mensualidad,
    addonsSeleccionados,
    totalInicial: setupInicial + mensualidad,
    esVersionReducida,
    notaPresupuesto,
  };
}
