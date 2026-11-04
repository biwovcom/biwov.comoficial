export interface ItemPropuesta {
  nombre: string;
  descripcion?: string;
  incluye?: string[];
  noIncluye?: string[];
  precio: string;
  periodicidad?: "mensual" | "único";
}

export interface TotalPropuesta {
  label: string;
  valor: string;
}

export interface DiagnosticoPropuesta {
  /** Qué se encontró en el diagnóstico/auditoría del cliente. */
  situacion: string;
  /** Por qué este plan/extras resuelve esa situación. */
  porQue: string;
  /** Para qué — el resultado u objetivo que se espera lograr. */
  paraQue: string;
}

export interface PropuestaImprimibleProps {
  titulo: string;
  subtitulo?: string;
  cliente?: { nombre?: string; empresa?: string };
  diagnostico?: DiagnosticoPropuesta;
  items: ItemPropuesta[];
  totales: TotalPropuesta[];
  formasPago: string[];
  validez?: string;
  notas?: string[];
}
