export interface RedHistorialEntrada {
  id: string;
  prospecto_id: string;
  fecha: string;
  red_social: string;
  seguidores: number | null;
  alcance_promedio: number | null;
  engagement_rate: number | null;
  notas: string | null;
  created_at: string;
}

export const REDES_SUGERIDAS = ["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn"];
