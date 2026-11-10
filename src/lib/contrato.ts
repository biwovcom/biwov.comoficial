export type TipoContrato = "plan" | "sitio-web" | "produccion" | "campana-meta";

export const VERSION_CONTRATO: Record<TipoContrato, string> = {
  plan: "2026-11-10-v7",
  "sitio-web": "2026-11-10-v2",
  produccion: "2026-11-10-v2",
  "campana-meta": "2026-11-10-v2",
};

export const NOMBRE_TIPO_CONTRATO: Record<TipoContrato, string> = {
  plan: "Plan de biwov",
  "sitio-web": "Sitio web o landing page",
  produccion: "Producción de contenido o video",
  "campana-meta": "Gestión de campaña en Meta",
};

export function esTipoContrato(valor: string | null | undefined): valor is TipoContrato {
  return valor === "plan" || valor === "sitio-web" || valor === "produccion" || valor === "campana-meta";
}
