import type { MetadataRoute } from "next";

const PRIVADO = ["/panel", "/admin", "/api", "/cotizacion", "/diagnostico"];

/**
 * Se permite explícitamente a los rastreadores de buscadores con IA (GEO):
 * sin esto, algunos no indexan el sitio y biwov no aparece citado en
 * ChatGPT, Perplexity, Claude, Gemini o los resúmenes de Google.
 */
const BOTS_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVADO },
      { userAgent: BOTS_IA, allow: "/", disallow: PRIVADO },
    ],
    sitemap: "https://biwov.com/sitemap.xml",
    host: "https://biwov.com",
  };
}
