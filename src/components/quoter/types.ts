import type {
  EstadoBranding,
  GestionLeads,
  ObjetivoPrincipal,
  PlataformaConSeguidores,
  RangoPresupuesto,
  RangoSeguidores,
  RedSocial,
  Trayectoria,
} from "@/lib/clasificacion";

export interface FormularioDiagnostico {
  nombre?: string;
  empresa?: string;
  whatsapp?: string;
  email?: string;
  tipoNegocio?: string;
  trayectoria?: Trayectoria;
  redes?: RedSocial[];
  seguidores?: Partial<Record<PlataformaConSeguidores, RangoSeguidores>>;
  gestionLeads?: GestionLeads;
  brandingEstado?: EstadoBranding;
  objetivo?: ObjetivoPrincipal;
  presupuesto?: RangoPresupuesto;
  urgencia?: string;
}

export type VistaCotizador = "form" | "enviado";
