export interface ComplementoItem {
  label: string;
  precio: string;
}

export interface Complemento {
  titulo: string;
  detalle: string;
  items?: ComplementoItem[];
  nota?: string;
  tipo?: "produccion";
}

export const COMPLEMENTOS: Complemento[] = [
  {
    titulo: "Producción de contenido",
    detalle: "Fotografía y video profesional para tu marca, en 3 niveles según tu necesidad.",
    tipo: "produccion",
  },
  {
    titulo: "Páginas adicionales",
    detalle: "Landing pages para un nuevo producto, evento o lanzamiento.",
    items: [
      {
        label: "Landing page para recolectar base de datos (solo captura de leads)",
        precio: "$1.000.000 COP (página) + $100.000 COP (dominio) + US$33/mes (herramienta)",
      },
      { label: "Landing page de agendamiento", precio: "Costo por definir" },
      { label: "Landing page de ventas de producto", precio: "Costo por definir" },
    ],
    nota: "El valor de la herramienta mensual puede cambiar si el proveedor ajusta sus precios; queda estipulado en el contrato.",
  },
  {
    titulo: "Base de datos para prospección",
    detalle: "Listado de empresas de tu sector, organizado y verificado.",
  },
  {
    titulo: "Asesoría Ruta Clara",
    detalle: "Si prefieres solo una guía para ejecutarlo todo tú.",
  },
];
