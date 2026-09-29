import type { Moneda } from "./panelConfig";

export interface PaisConZona {
  pais: string;
  zonaHoraria: string;
  indicativo: string;
}

/** Mercado hispanohablante + EE. UU. (por comunidad latina). "Otro" al final. */
export const PAISES: PaisConZona[] = [
  { pais: "Colombia", zonaHoraria: "America/Bogota (UTC-5)", indicativo: "+57" },
  { pais: "México", zonaHoraria: "America/Mexico_City (UTC-6)", indicativo: "+52" },
  { pais: "España", zonaHoraria: "Europe/Madrid (UTC+1)", indicativo: "+34" },
  { pais: "Argentina", zonaHoraria: "America/Argentina/Buenos_Aires (UTC-3)", indicativo: "+54" },
  { pais: "Chile", zonaHoraria: "America/Santiago (UTC-3/-4)", indicativo: "+56" },
  { pais: "Perú", zonaHoraria: "America/Lima (UTC-5)", indicativo: "+51" },
  { pais: "Ecuador", zonaHoraria: "America/Guayaquil (UTC-5)", indicativo: "+593" },
  { pais: "Venezuela", zonaHoraria: "America/Caracas (UTC-4)", indicativo: "+58" },
  { pais: "Panamá", zonaHoraria: "America/Panama (UTC-5)", indicativo: "+507" },
  { pais: "Costa Rica", zonaHoraria: "America/Costa_Rica (UTC-6)", indicativo: "+506" },
  { pais: "Guatemala", zonaHoraria: "America/Guatemala (UTC-6)", indicativo: "+502" },
  { pais: "República Dominicana", zonaHoraria: "America/Santo_Domingo (UTC-4)", indicativo: "+1" },
  { pais: "Estados Unidos", zonaHoraria: "Varía según el estado", indicativo: "+1" },
  { pais: "Otro", zonaHoraria: "Por confirmar", indicativo: "" },
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
