/**
 * Avisos a Kathe por Telegram desde el sitio (bot "Biwov oficina").
 * Variables en Vercel: TELEGRAM_BOT_TOKEN y TELEGRAM_OWNER_ID. Si faltan, no hace nada.
 * Nunca rompe el flujo del cliente: cualquier error se ignora.
 */
export async function avisarKathe(texto: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_OWNER_ID;
  if (!token || !chat) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: texto.slice(0, 3900), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* sin aviso, la compra ya quedó guardada */
  }
}
