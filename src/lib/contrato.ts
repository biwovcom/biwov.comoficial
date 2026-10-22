export type TipoContrato = "plan" | "sitio-web" | "produccion" | "campana-meta";

export const VERSION_CONTRATO: Record<TipoContrato, string> = {
  plan: "2026-10-22-v5",
  "sitio-web": "2026-10-22-v1",
  produccion: "2026-10-22-v1",
  "campana-meta": "2026-10-22-v1",
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
