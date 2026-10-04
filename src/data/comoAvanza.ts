export interface FaseAvance {
  momento: string;
  titulo: string;
  detalle: string;
}

export const COMO_AVANZA: FaseAvance[] = [
  {
    momento: "Semanas 1 y 2",
    titulo: "Diagnóstico y plan",
    detalle:
      "Revisamos tu negocio, ordenamos tus redes y dejamos listas las primeras tareas y guiones.",
  },
  {
    momento: "Mes 1",
    titulo: "Publicidad en marcha",
    detalle: "La primera campaña sale con el contenido que ya tienes o el que grabas con nuestras guías.",
  },
  {
    momento: "Meses 2 y 3",
    titulo: "Aprender y ajustar",
    detalle:
      "Los números muestran qué mensajes y qué público responden mejor. Ajustamos y dejamos lo que funciona.",
  },
  {
    momento: "Desde el mes 3",
    titulo: "Avanzar de plan",
    detalle:
      "Cuando tu negocio recibe interesados de forma estable, sumamos página, filtro, remarketing y automatización.",
  },
];
