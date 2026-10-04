export interface PasoCamino {
  numero: number;
  pasa: string;
  posible: string;
}

export const EL_CAMINO: PasoCamino[] = [
  { numero: 1, pasa: "Te descubre en redes o en un anuncio", posible: "Contenido y publicidad" },
  { numero: 2, pasa: "Revisa tu perfil y le gusta lo que ve", posible: "Redes ordenadas y Google" },
  { numero: 3, pasa: "Deja sus datos o te habla", posible: "Página de contacto y WhatsApp" },
  { numero: 4, pasa: "Recibe respuesta rápida y clara", posible: "WhatsApp organizado y asistente" },
  { numero: 5, pasa: "Agenda, cotiza o paga", posible: "Seguimiento y oferta clara" },
  { numero: 6, pasa: "Compra otra vez o te recomienda", posible: "Lista de clientes y mensajes" },
];

export const PASOS_CAMINO_TITULO = ["Te ve", "Confía", "Te escribe", "Lo atiendes", "Te compra", "Vuelve"];

export const ETIQUETAS_CAMINO = [
  "contenido",
  "pauta",
  "landing page",
  "píxel",
  "CRM",
  "automatización",
  "email marketing",
];
