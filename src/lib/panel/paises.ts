import type { Moneda } from "./panelConfig";

export interface PaisConZona {
  pais: string;
  zonaHoraria: string;
}

/** Mercado hispanohablante + EE. UU. (por comunidad latina). "Otro" al final. */
export const PAISES: PaisConZona[] = [
  { pais: "Colombia", zonaHoraria: "America/Bogota (UTC-5)" },
  { pais: "México", zonaHoraria: "America/Mexico_City (UTC-6)" },
  { pais: "España", zonaHoraria: "Europe/Madrid (UTC+1)" },
  { pais: "Argentina", zonaHoraria: "America/Argentina/Buenos_Aires (UTC-3)" },
  { pais: "Chile", zonaHoraria: "America/Santiago (UTC-3/-4)" },
  { pais: "Perú", zonaHoraria: "America/Lima (UTC-5)" },
  { pais: "Ecuador", zonaHoraria: "America/Guayaquil (UTC-5)" },
  { pais: "Venezuela", zonaHoraria: "America/Caracas (UTC-4)" },
  { pais: "Panamá", zonaHoraria: "America/Panama (UTC-5)" },
  { pais: "Costa Rica", zonaHoraria: "America/Costa_Rica (UTC-6)" },
  { pais: "Guatemala", zonaHoraria: "America/Guatemala (UTC-6)" },
  { pais: "República Dominicana", zonaHoraria: "America/Santo_Domingo (UTC-4)" },
  { pais: "Estados Unidos", zonaHoraria: "Varía según el estado" },
  { pais: "Otro", zonaHoraria: "Por confirmar" },
];

/**
 * COP para Colombia, USD para el resto del mercado hispanohablante.
 * Sin país (aún no seleccionado o no informado), se asume Colombia — es el
 * mercado principal de biwov — para no calcular mal el semáforo por falta
 * de dato.
 */
export function monedaDesdePais(pais: string | null | undefined): Moneda {
  if (!pais || pais === "Colombia") return "COP";
  return "USD";
}
