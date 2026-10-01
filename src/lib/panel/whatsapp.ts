export function soloDigitosWhatsApp(whatsapp: string): string {
  return whatsapp.replace(/[^\d]/g, "");
}

export function linkWhatsApp(whatsapp: string, mensaje?: string): string {
  const base = `https://wa.me/${soloDigitosWhatsApp(whatsapp)}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
