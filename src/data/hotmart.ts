/**
 * Links de pago de Hotmart para biwov Agentes.
 * Pega aquí el link de checkout de cada plan (Hotmart → Producto → Links de venta).
 * Mientras esté vacío, el botón "Activar" abre WhatsApp como antes.
 */
export const HOTMART_CHECKOUT: Record<string, string> = {
  "agentes-esencial": "",
  "agentes-pro": "",
};

/** Portal donde el cliente inicia sesión después de comprar. */
export const PORTAL_CLIENTES = "https://biwov-oficina.web.app";

export const checkoutDe = (slug: string) => HOTMART_CHECKOUT[slug] || "";
