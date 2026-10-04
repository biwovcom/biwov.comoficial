export interface ResponsabilidadFila {
  biwov: string;
  cliente: string;
}

export const RESPONSABILIDADES: ResponsabilidadFila[] = [
  { biwov: "Analizar tu negocio y tus redes", cliente: "Contarnos tu negocio y dar los accesos" },
  {
    biwov: "El plan de trabajo y las tareas de cada semana",
    cliente: "Cumplir las tareas acordadas",
  },
  {
    biwov: "Ideas, guiones y guías para videos e historias",
    cliente: "Grabar, editar y publicar tus videos e historias",
  },
  {
    biwov: "Guías para ordenar tu WhatsApp Business",
    cliente: "Organizar tu WhatsApp con esas guías",
  },
  {
    biwov: "Crear y manejar tus campañas de publicidad",
    cliente: "Pagar la publicidad directamente a Meta o Google",
  },
  { biwov: "Medir resultados y decirte qué ajustar", cliente: "Responder rápido a los interesados" },
];

export interface PasoMetodo {
  numero: number;
  titulo: string;
  detalle: string;
}

export const METODO_4_PASOS: PasoMetodo[] = [
  { numero: 1, titulo: "Diagnóstico", detalle: "Entendemos tu negocio, tu cliente y lo que hoy funciona." },
  { numero: 2, titulo: "Plan", detalle: "Te decimos qué hacer, en qué orden y por qué." },
  { numero: 3, titulo: "Acompañamiento", detalle: "Guías, tareas y publicidad funcionando." },
  { numero: 4, titulo: "Medición", detalle: "Cada mes vemos los números y decidimos el siguiente paso." },
];
