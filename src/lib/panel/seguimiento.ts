export interface EtapaSeguimientoInfo {
  /** Texto exacto que se guarda en prospectos.seguimiento cuando aplica esta etapa. */
  nombre: string;
  plazo: string;
  /** Días desde fecha_ultimo_seguimiento para considerar que ya toca el siguiente paso. Null = etapa final, no aplica. */
  diasObjetivo: number | null;
  objetivo: string;
  canal: string;
  enfoque: string;
}

/**
 * Secuencia de seguimiento post-presentación/propuesta definida por Kathe.
 * "No dio respuesta" es la etapa final: se deja quieto, no vuelve a sonar vencido.
 */
export const ETAPAS_SEGUIMIENTO: EtapaSeguimientoInfo[] = [
  {
    nombre: "Primer seguimiento",
    plazo: "A las 24 horas",
    diasObjetivo: 1,
    objetivo: "Agradecer y enviar recursos extra o la grabación.",
    canal: "WhatsApp / Correo",
    enfoque:
      "Valor y cortesía: comparte la presentación limpia, un resumen ejecutivo o un caso de éxito similar.",
  },
  {
    nombre: "Segundo seguimiento",
    plazo: "A los 3 o 4 días",
    diasObjetivo: 4,
    objetivo: "Resolver dudas técnicas o de implementación.",
    canal: "WhatsApp / Llamada corta",
    enfoque: "Acompañamiento: saber si le surgió alguna duda analizando los entregables o los tiempos.",
  },
  {
    nombre: "Tercer seguimiento",
    plazo: "A los 7 días",
    diasObjetivo: 7,
    objetivo: "Checar estatus de decisión o prioridades.",
    canal: "WhatsApp",
    enfoque:
      "Estrategia / urgencia suave: pregunta cómo va el proyecto o si hay algún ajuste que deban hacerle a la propuesta.",
  },
  {
    nombre: "Cuarto seguimiento",
    plazo: "A los 12-14 días",
    diasObjetivo: 14,
    objetivo: "Último intento activo antes de archivar.",
    canal: "Llamada o WhatsApp final",
    enfoque: "Cierre elegante: ofrece reevaluar fechas o entender si el proyecto se pausó.",
  },
  {
    nombre: "No dio respuesta",
    plazo: "—",
    diasObjetivo: null,
    objetivo: "Se deja quieto. Si vuelve a escribir, se retoma desde el primer seguimiento.",
    canal: "—",
    enfoque: "Sin más seguimiento activo por ahora.",
  },
];

export const NOMBRES_ETAPAS_SEGUIMIENTO = ETAPAS_SEGUIMIENTO.map((e) => e.nombre);

export function infoEtapa(seguimiento: string | null | undefined): EtapaSeguimientoInfo | null {
  if (!seguimiento) return null;
  return ETAPAS_SEGUIMIENTO.find((e) => e.nombre === seguimiento) ?? null;
}

export function diasDesde(fecha: string | null | undefined): number | null {
  if (!fecha) return null;
  const ms = Date.now() - new Date(`${fecha}T00:00:00`).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

/** true si ya pasó el plazo de la etapa actual y toca pasar al siguiente seguimiento. */
export function estaVencido(
  seguimiento: string | null | undefined,
  fechaUltimoSeguimiento: string | null | undefined,
): boolean {
  const info = infoEtapa(seguimiento);
  if (!info || info.diasObjetivo === null) return false;
  const dias = diasDesde(fechaUltimoSeguimiento);
  if (dias === null) return false;
  return dias >= info.diasObjetivo;
}

/** La siguiente etapa de la secuencia, o null si ya se está en la última o no aplica. */
export function siguienteEtapa(seguimiento: string | null | undefined): string | null {
  if (!seguimiento) return ETAPAS_SEGUIMIENTO[0].nombre;
  const i = ETAPAS_SEGUIMIENTO.findIndex((e) => e.nombre === seguimiento);
  if (i === -1 || i === ETAPAS_SEGUIMIENTO.length - 1) return null;
  return ETAPAS_SEGUIMIENTO[i + 1].nombre;
}
