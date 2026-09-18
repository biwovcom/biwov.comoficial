export interface Testimonio {
  id: string;
  nombre: string;
  rol: string;
  tipo: "video" | "texto";
  contenido: string;
  videoUrl?: string;
}

export const TESTIMONIOS: Testimonio[] = [
  {
    id: "carolina-morales-1",
    nombre: "Carolina Morales",
    rol: "Carolina Morales Academy — Campeona Mundial de Microblading 2025",
    tipo: "video",
    contenido:
      "Testimonio en video sobre extensiones de pestañas, cursos y procedimientos.",
    videoUrl: "#",
  },
  {
    id: "carolina-morales-2",
    nombre: "Alumna Carolina Morales Academy",
    rol: "Estudiante de curso de procedimientos",
    tipo: "video",
    contenido: "Testimonio en video sobre la experiencia dentro de la academia.",
    videoUrl: "#",
  },
];
