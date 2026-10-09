export interface PlanCampana {
  id: string;
  prospecto_id: string;
  mes: string; // siempre día 1 del mes, ej. 2026-09-01
  ticket_promedio: number | null;
  moneda: "COP" | "USD" | null;
  objetivo_conversion: string | null;
  presupuesto_diario: number | null;
  presupuesto_mensual: number | null;
  cpa_maximo: number | null;
  num_conjuntos: number | null;
  num_creativos_objetivo: number | null;
  publico: string | null;
  evento_calificacion: string | null;
  oferta_principal: string | null;
  objetivo_mes: string | null;
  resultado_mes: string | null;
  aprobado: boolean;
  aprobado_en: string | null;
}

/** Normaliza cualquier fecha al día 1 del mes, en formato YYYY-MM-01. */
export function primerDiaDelMes(anio: number, mes: number): string {
  const mesTexto = String(mes).padStart(2, "0");
  return `${anio}-${mesTexto}-01`;
}

export const OPCIONES_OBJETIVO_CONVERSION = [
  "Ventas directas (e-commerce / checkout)",
  "Leads (formulario)",
  "Mensajes (WhatsApp / DM)",
  "Tráfico calificado a landing",
];
