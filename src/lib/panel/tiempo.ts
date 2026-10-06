export interface RegistroTiempo {
  id: string;
  created_at: string;
  fecha: string;
  categoria: string;
  proyecto: string | null;
  horas: number;
  notas: string | null;
}

export interface NuevoRegistroTiempoInput {
  fecha?: string;
  categoria: string;
  proyecto?: string;
  horas: number;
  notas?: string;
}

/** Punto de partida editable — Kathe puede escribir cualquier otra categoría. */
export const CATEGORIAS_TIEMPO_SUGERIDAS = [
  "Flujo / automatización",
  "Sitio web",
  "Landing page",
  "Campaña publicitaria",
  "Contenido",
  "CRM / configuración",
  "Diseño",
  "Diagnóstico de cliente",
  "Otro",
];

export interface ResumenCategoria {
  categoria: string;
  totalHoras: number;
  promedioHoras: number;
  cantidad: number;
}

export function resumenPorCategoria(registros: RegistroTiempo[]): ResumenCategoria[] {
  const mapa = new Map<string, { total: number; cantidad: number }>();
  for (const r of registros) {
    const actual = mapa.get(r.categoria) ?? { total: 0, cantidad: 0 };
    actual.total += r.horas;
    actual.cantidad += 1;
    mapa.set(r.categoria, actual);
  }
  return Array.from(mapa.entries())
    .map(([categoria, { total, cantidad }]) => ({
      categoria,
      totalHoras: total,
      promedioHoras: total / cantidad,
      cantidad,
    }))
    .sort((a, b) => b.totalHoras - a.totalHoras);
}

export interface ResumenProyecto {
  proyecto: string;
  totalHoras: number;
  cantidad: number;
}

/** Cuánto tiempo acumulado llevas invertido en cada proyecto/empresa, sumando todos sus registros. */
export function resumenPorProyecto(registros: RegistroTiempo[]): ResumenProyecto[] {
  const mapa = new Map<string, { total: number; cantidad: number }>();
  for (const r of registros) {
    const proyecto = r.proyecto?.trim();
    if (!proyecto) continue;
    const actual = mapa.get(proyecto) ?? { total: 0, cantidad: 0 };
    actual.total += r.horas;
    actual.cantidad += 1;
    mapa.set(proyecto, actual);
  }
  return Array.from(mapa.entries())
    .map(([proyecto, { total, cantidad }]) => ({ proyecto, totalHoras: total, cantidad }))
    .sort((a, b) => b.totalHoras - a.totalHoras);
}
