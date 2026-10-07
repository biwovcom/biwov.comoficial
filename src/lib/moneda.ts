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
