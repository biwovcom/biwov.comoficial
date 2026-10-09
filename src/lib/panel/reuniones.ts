export interface TareaReunion {
  id: string;
  texto: string;
  hecho: boolean;
}

export interface Reunion {
  id: string;
  prospecto_id: string;
  fecha: string;
  hora: string | null;
  notas: string | null;
  plan_trabajo: string | null;
  tareas_cliente: TareaReunion[];
  tareas_kathe: TareaReunion[];
  created_at: string;
}
