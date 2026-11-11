export type TipoContrato = "plan" | "sitio-web" | "produccion" | "campana-meta" | "automatizacion";

export const TIPOS_CONTRATO: TipoContrato[] = ["plan", "produccion", "automatizacion", "sitio-web", "campana-meta"];

export const VERSION_CONTRATO: Record<TipoContrato, string> = {
  plan: "2026-11-10-v8",
  "sitio-web": "2026-11-10-v3",
  produccion: "2026-11-10-v3",
  "campana-meta": "2026-11-10-v3",
  automatizacion: "2026-11-10-v1",
};

export const NOMBRE_TIPO_CONTRATO: Record<TipoContrato, string> = {
  plan: "Planes mensuales de Dirección estratégica y Gestión de marketing",
  "sitio-web": "Ecosistemas digitales: páginas web y embudos",
  produccion: "Producción de contenido y edición",
  "campana-meta": "Gestión de campañas en Meta",
  automatizacion: "Automatización e inteligencia artificial",
};

export function esTipoContrato(valor: string | null | undefined): valor is TipoContrato {
  return TIPOS_CONTRATO.includes(valor as TipoContrato);
}
