export type Moneda = "COP" | "USD";

/** Tasa de respaldo si la TRM en vivo (/api/trm) no responde o da un dato inválido. */
export const TRM_FALLBACK = 4000;

/** Convierte un valor en COP a la moneda elegida, usando la TRM del día (en vivo o de respaldo). */
export function formatCopEnMoneda(cop: number, moneda: Moneda, trm: number): string {
  if (moneda === "USD") {
    return `US$${Math.round(cop / trm).toLocaleString("en-US")}`;
  }
  return `$${cop.toLocaleString("es-CO")} COP`;
}

export interface PrecioDual {
  cop: number;
  usd: number;
}

export function sumarPrecios(...valores: PrecioDual[]): PrecioDual {
  return {
    cop: valores.reduce((acc, v) => acc + v.cop, 0),
    usd: valores.reduce((acc, v) => acc + v.usd, 0),
  };
}

export function multiplicarPrecio(valor: PrecioDual, factor: number): PrecioDual {
  return { cop: Math.round(valor.cop * factor), usd: Math.round(valor.usd * factor) };
}
