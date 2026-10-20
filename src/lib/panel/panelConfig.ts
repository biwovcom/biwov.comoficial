export type Moneda = "COP" | "USD";

export interface RangoPresupuestoPanel {
  id: string;
  etiqueta: string;
  /** true = este rango alcanza para el plan más económico (START). */
  calificaComoSuficiente: boolean;
}

/**
 * ⚠️ Pendiente de ajustar cuando definas los precios reales de tus planes:
 * marca calificaComoSuficiente en los rangos que sí alcanzan para tu plan
 * START. No hay conversión entre COP y USD, son dos escalas independientes.
 */
export const RANGOS_PRESUPUESTO: Record<Moneda, RangoPresupuestoPanel[]> = {
  COP: [
    { id: "menos-1m", etiqueta: "Menos de $1.000.000", calificaComoSuficiente: false },
    { id: "1m-2m", etiqueta: "Entre $1.000.000 y $2.000.000", calificaComoSuficiente: true },
    { id: "2m-3m", etiqueta: "Entre $2.000.000 y $3.000.000", calificaComoSuficiente: true },
    { id: "4m-5m", etiqueta: "Entre $4.000.000 a $5.000.000", calificaComoSuficiente: true },
  ],
  USD: [
    { id: "menos-300", etiqueta: "Menos de $300/mes", calificaComoSuficiente: false },
    { id: "300-800", etiqueta: "Entre $300 y $800/mes", calificaComoSuficiente: true },
    { id: "800-1500", etiqueta: "Entre $800 y $1.500/mes", calificaComoSuficiente: true },
    { id: "mas-1500", etiqueta: "Más de $1.500/mes", calificaComoSuficiente: true },
  ],
};

/** ⚠️ Pendiente: pega aquí tus links reales. */
export const LINKS_PANEL = {
  formulario: "",
  calendario: "https://calendar.app.google/axxmw4mjpv5YBCqBA",
  comunidad: "",
  contenidoGratuito: "",
};

