export interface RedHistorialEntrada {
  id: string;
  prospecto_id: string;
  fecha: string;
  red_social: string;
  periodo_dias: number; // 30 o 90, el periodo que cubre esta medición en el panel de Instagram
  seguidores: number | null;
  seguidos: number | null;
  alcance_promedio: number | null; // "Espectadores" en el panel de Instagram
  visualizaciones: number | null;
  interacciones: number | null;
  cuentas_interactuaron: number | null;
  visitas_perfil: number | null;
  suma_vistas_piezas: number | null;
  num_piezas: number | null;
  pct_reels: number | null;
  pct_historias: number | null;
  pct_publicaciones: number | null;
  pct_no_seguidores: number | null;
  notas: string | null;
  created_at: string;
}

export const REDES_SUGERIDAS = ["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn"];

export interface MetricasCalculadas {
  alcanceDiario: number | null;
  alcanceMensual90: number | null;
  vistasPromedioPorPieza: number | null;
  engagementSobreAlcance: number | null;
  engagementSobreVisualizaciones: number | null;
  interaccionesPorPieza: number | null;
  engagementPorPublicacionSobreSeguidores: number | null;
  proporcionSeguidosSeguidores: number | null;
  frecuencia: number | null;
}

/** Las 8 fórmulas del panel de redes, aplicadas a una medición. Null cuando falta el dato base. */
export function calcularMetricas(e: RedHistorialEntrada): MetricasCalculadas {
  const dias = e.periodo_dias || 30;
  const alcance = e.alcance_promedio ?? null;
  const visualizaciones = e.visualizaciones ?? null;
  const interacciones = e.interacciones ?? null;
  const seguidores = e.seguidores ?? null;
  const seguidos = e.seguidos ?? null;
  const numPiezas = e.num_piezas ?? null;
  const sumaVistasPiezas = e.suma_vistas_piezas ?? null;

  const interaccionesPorPieza =
    interacciones !== null && numPiezas ? interacciones / numPiezas : null;

  return {
    alcanceDiario: alcance !== null ? alcance / dias : null,
    alcanceMensual90: alcance !== null && dias === 90 ? alcance / 3 : null,
    vistasPromedioPorPieza: sumaVistasPiezas !== null && numPiezas ? sumaVistasPiezas / numPiezas : null,
    engagementSobreAlcance: interacciones !== null && alcance ? (interacciones / alcance) * 100 : null,
    engagementSobreVisualizaciones:
      interacciones !== null && visualizaciones ? (interacciones / visualizaciones) * 100 : null,
    interaccionesPorPieza,
    engagementPorPublicacionSobreSeguidores:
      interaccionesPorPieza !== null && seguidores ? (interaccionesPorPieza / seguidores) * 100 : null,
    proporcionSeguidosSeguidores: seguidos !== null && seguidores ? seguidos / seguidores : null,
    frecuencia: visualizaciones !== null && alcance ? visualizaciones / alcance : null,
  };
}

export type NivelSemaforo = "rojo" | "naranja" | "amarillo" | "verde";

export const COLOR_SEMAFORO: Record<NivelSemaforo, { dot: string; text: string; badge: string; label: string }> = {
  rojo: { dot: "bg-red-500", text: "text-red-300", badge: "border-red-500/40 bg-red-500/10", label: "Alerta roja" },
  naranja: {
    dot: "bg-orange-500",
    text: "text-orange-300",
    badge: "border-orange-500/40 bg-orange-500/10",
    label: "Alerta naranja",
  },
  amarillo: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    badge: "border-amber-400/40 bg-amber-400/10",
    label: "Alerta amarilla",
  },
  verde: {
    dot: "bg-emerald-500",
    text: "text-emerald-300",
    badge: "border-emerald-500/40 bg-emerald-500/10",
    label: "Verde — cumple",
  },
};

export interface Medidor {
  nivel: NivelSemaforo;
  referencia: string;
  /** La escala completa de cortes, para mostrarla siempre como referencia (no solo el nivel en el que caíste). */
  escala: { nivel: NivelSemaforo; texto: string }[];
}

/**
 * Umbrales de referencia (benchmarks generales de la industria, no una regla
 * exacta): sirven para ubicarte, no para juzgar una cuenta chica igual que una
 * grande. Cuando no hay un corte estándar conocido, la fórmula no trae medidor.
 */
function medidor(valor: number, cortes: [number, NivelSemaforo][], mensajes: string[]): Medidor {
  const escala = cortes.map((c, i) => ({ nivel: c[1], texto: mensajes[i] }));
  for (let i = 0; i < cortes.length; i++) {
    if (valor < cortes[i][0]) return { nivel: cortes[i][1], referencia: mensajes[i], escala };
  }
  const ultimo = cortes[cortes.length - 1];
  return { nivel: ultimo[1], referencia: mensajes[mensajes.length - 1], escala };
}

const medidorEngagementSeguidores = (v: number) =>
  medidor(
    v,
    [
      [1, "rojo"],
      [3, "naranja"],
      [6, "amarillo"],
      [Infinity, "verde"],
    ],
    [
      "Menos de 1%: bajo, necesita trabajo.",
      "Entre 1% y 3%: promedio, es lo más típico.",
      "Entre 3% y 6%: bueno.",
      "Más de 6%: excelente.",
    ],
  );

const medidorEngagementAlcance = (v: number) =>
  medidor(
    v,
    [
      [10, "rojo"],
      [20, "naranja"],
      [30, "amarillo"],
      [Infinity, "verde"],
    ],
    [
      "Menos de 10%: bajo.",
      "Entre 10% y 20%: promedio.",
      "Entre 20% y 30%: bueno.",
      "Más de 30%: excelente.",
    ],
  );

const medidorEngagementVisualizaciones = (v: number) =>
  medidor(
    v,
    [
      [1, "rojo"],
      [3, "naranja"],
      [5, "amarillo"],
      [Infinity, "verde"],
    ],
    [
      "Menos de 1%: bajo.",
      "Entre 1% y 3%: promedio.",
      "Entre 3% y 5%: bueno.",
      "Más de 5%: excelente.",
    ],
  );

/** Aquí "menos" es mejor, así que se evalúa en orden inverso. */
function medidorSeguidosSeguidores(v: number): Medidor {
  const escala: Medidor["escala"] = [
    { nivel: "verde", texto: "1 o menos: sano." },
    { nivel: "amarillo", texto: "Entre 1 y 2 veces: en el límite." },
    { nivel: "naranja", texto: "Entre 2 y 5 veces: alto, cuídalo." },
    { nivel: "rojo", texto: 'Más de 5 veces: se ve como "pidiendo seguidores".' },
  ];
  if (v > 5) return { nivel: "rojo", referencia: escala[3].texto, escala };
  if (v > 2) return { nivel: "naranja", referencia: escala[2].texto, escala };
  if (v > 1) return { nivel: "amarillo", referencia: escala[1].texto, escala };
  return { nivel: "verde", referencia: escala[0].texto, escala };
}

const medidorNoSeguidores = (v: number) =>
  medidor(
    v,
    [
      [20, "rojo"],
      [40, "naranja"],
      [60, "amarillo"],
      [Infinity, "verde"],
    ],
    [
      "Menos de 20%: casi no te ve gente nueva.",
      "Entre 20% y 40%: moderado.",
      "Entre 40% y 60%: bueno.",
      "Más de 60%: muy buena exposición a audiencia nueva.",
    ],
  );

export interface FilaFormula {
  label: string;
  valor: number | null;
  unidad: string;
  explicacion: string;
  formula: string;
  medidor?: Medidor;
}

/** Arma las filas listas para mostrar, con la fórmula y la explicación en simple de cada una. */
export function filasFormulas(e: RedHistorialEntrada): FilaFormula[] {
  const m = calcularMetricas(e);
  const filas: FilaFormula[] = [
    {
      label: "Alcance diario promedio",
      valor: m.alcanceDiario,
      unidad: "personas/día",
      formula: "Alcance ÷ días del periodo",
      explicacion: "Cuántas personas distintas te ven cada día, en promedio. Depende del tamaño de tu cuenta, sin corte único.",
    },
    {
      label: "Alcance mensual estimado",
      valor: m.alcanceMensual90,
      unidad: "personas/mes",
      formula: "Alcance (90 días) ÷ 3",
      explicacion:
        "Solo con datos de 90 días. Es aproximado: si alguien te vio en dos meses distintos, Instagram lo cuenta una sola vez.",
    },
    {
      label: "Vistas promedio por pieza",
      valor: m.vistasPromedioPorPieza,
      unidad: "vistas",
      formula: "Suma de vistas de las piezas ÷ número de piezas",
      explicacion: "En promedio, cuánto ve cada publicación o historia que subes. Sin corte único: compáralo contigo mismo en el tiempo.",
    },
    {
      label: "Engagement sobre alcance",
      valor: m.engagementSobreAlcance,
      unidad: "%",
      formula: "(Interacciones ÷ Alcance) × 100",
      explicacion: "De cada 100 personas que te vieron, cuántas interacciones obtuviste.",
      medidor: m.engagementSobreAlcance !== null ? medidorEngagementAlcance(m.engagementSobreAlcance) : undefined,
    },
    {
      label: "Engagement sobre visualizaciones",
      valor: m.engagementSobreVisualizaciones,
      unidad: "%",
      formula: "(Interacciones ÷ Visualizaciones) × 100",
      explicacion: "De cada 100 veces que se vio tu contenido, cuántas veces alguien interactuó.",
      medidor:
        m.engagementSobreVisualizaciones !== null
          ? medidorEngagementVisualizaciones(m.engagementSobreVisualizaciones)
          : undefined,
    },
    {
      label: "Interacciones por pieza",
      valor: m.interaccionesPorPieza,
      unidad: "interacciones",
      formula: "Interacciones ÷ número de piezas",
      explicacion: "En promedio, cuántas interacciones recibe cada publicación. Sin corte único.",
    },
    {
      label: "Engagement por publicación sobre seguidores",
      valor: m.engagementPorPublicacionSobreSeguidores,
      unidad: "%",
      formula: "(Interacciones por pieza ÷ Seguidores) × 100",
      explicacion: "El estándar de la industria para comparar cuentas entre sí (hasta desde afuera).",
      medidor:
        m.engagementPorPublicacionSobreSeguidores !== null
          ? medidorEngagementSeguidores(m.engagementPorPublicacionSobreSeguidores)
          : undefined,
    },
    {
      label: "Seguidos ÷ seguidores",
      valor: m.proporcionSeguidosSeguidores,
      unidad: "x",
      formula: "Seguidos ÷ Seguidores",
      explicacion: "Lo sano es menos de 1, como mucho 2. Más que eso se ve como \"pidiendo seguidores\".",
      medidor:
        m.proporcionSeguidosSeguidores !== null ? medidorSeguidosSeguidores(m.proporcionSeguidosSeguidores) : undefined,
    },
    {
      label: "Frecuencia",
      valor: m.frecuencia,
      unidad: "veces",
      formula: "Visualizaciones ÷ Espectadores (alcance)",
      explicacion: "Cuántas veces en promedio te vio cada persona (visualizaciones ÷ espectadores).",
    },
  ];

  if (e.pct_no_seguidores !== null && e.pct_no_seguidores !== undefined) {
    filas.push({
      label: "% de vistas de no seguidores",
      valor: e.pct_no_seguidores,
      unidad: "%",
      formula: "Dato directo del panel (Estadísticas → Audiencia)",
      explicacion: "Qué tanto te está mostrando Instagram a gente nueva que todavía no te sigue.",
      medidor: medidorNoSeguidores(e.pct_no_seguidores),
    });
  }

  return filas;
}

export const GLOSARIO_METRICAS: { termino: string; explicacion: string }[] = [
  {
    termino: "👀 Visualizaciones",
    explicacion:
      'Cuántas veces se miró tu contenido. Si una persona ve tu Reel 3 veces, cuenta 3 visualizaciones. Es como una vitrina: si la misma señora pasa 3 veces y mira las 3, son 3 "miradas".',
  },
  {
    termino: "🧍 Espectadores (alcance)",
    explicacion:
      "Cuántas personas distintas vieron algo tuyo. La misma señora que pasó 3 veces cuenta como 1 persona. Por eso las visualizaciones siempre son más que el alcance.",
  },
  {
    termino: "❤️ Interacciones",
    explicacion:
      "Me gusta, comentarios, guardados, compartidos y respuestas a historias, todo sumado. Es como cuando alguien entra a la tienda y toca un producto o pregunta un precio, no solo mira.",
  },
  {
    termino: "🙋 Cuentas que interactuaron",
    explicacion:
      "Cuántas personas distintas interactuaron. Si una persona dio 5 me gusta, son 5 interacciones pero 1 cuenta.",
  },
  {
    termino: "👥 Seguidores / Seguidos",
    explicacion:
      "Seguidores son quienes ya te siguen. Seguidos son a quienes tú sigues. Si sigues a muchos más de los que te siguen, la cuenta se ve como si estuviera \"pidiendo seguidores\".",
  },
  {
    termino: "🚪 Visitas al perfil",
    explicacion: "Cuántas veces alguien entró a ver tu perfil completo (foto, bio y publicaciones), no solo una pieza suelta.",
  },
  {
    termino: "🎬 Reels / Historias / Publicaciones",
    explicacion:
      "Qué parte de tu contenido atrae más miradas. Los Reels suelen ser el mejor gancho, las historias desaparecen en 24h, las publicaciones son fotos o carruseles fijos en el perfil.",
  },
];

export const GLOSARIO_TERMINOS_MARKETING: { termino: string; explicacion: string }[] = [
  { termino: "Alcance", explicacion: "Cuántas personas te vieron (igual que espectadores)." },
  {
    termino: "Engagement",
    explicacion: "Qué tanto le importa tu contenido a la gente. Se mide como un % de interacciones.",
  },
  {
    termino: "Frecuencia",
    explicacion: "Cuántas veces en promedio te vio cada persona (visualizaciones ÷ espectadores).",
  },
  { termino: "KPI", explicacion: "Los números que decides vigilar porque te dicen si vas bien, como el marcador de un partido." },
  {
    termino: "ROI",
    explicacion: "Retorno de la inversión: cuánto dinero te dejó lo que invertiste. Si gastas $100 y ganas $300, el ROI es positivo.",
  },
  {
    termino: "CTA",
    explicacion: 'Llamado a la acción: la frase que le dice a la gente qué hacer ("escríbeme", "dale clic", "guarda este post").',
  },
  {
    termino: "Benchmark",
    explicacion: "El número de referencia contra el que te comparas para saber si estás bien o mal.",
  },
];
