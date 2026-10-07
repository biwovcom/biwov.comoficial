export type Moneda = "COP" | "USD";

export interface PrecioDual {
  cop: number;
  usd: number;
}

export function formatMoneda(valor: PrecioDual, moneda: Moneda): string {
  if (moneda === "USD") {
    return `US$${valor.usd.toLocaleString("en-US")}`;
  }
  return `$${valor.cop.toLocaleString("es-CO")} COP`;
}

/** Muestra ambas monedas a la vez, ej. "$900.000 COP (≈US$225)". */
export function formatMonedaAmbas(valor: PrecioDual): string {
  return `$${valor.cop.toLocaleString("es-CO")} COP (≈US$${valor.usd.toLocaleString("en-US")})`;
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
