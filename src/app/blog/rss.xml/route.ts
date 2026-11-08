import { AUTOR_BLOG, articulosOrdenados } from "@/data/blog";

export const dynamic = "force-static";

const BASE = "https://biwov.com";

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const items = articulosOrdenados()
    .map(
      (a) => `    <item>
      <title>${escapar(a.titulo)}</title>
      <link>${BASE}/blog/${a.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${a.slug}</guid>
      <pubDate>${new Date(`${a.publicado}T12:00:00-05:00`).toUTCString()}</pubDate>
      <category>${escapar(a.categoria)}</category>
      <dc:creator>${escapar(AUTOR_BLOG.nombre)}</dc:creator>
      <description>${escapar(a.enResumen)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog de biwov — Marketing digital para negocios</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Guías prácticas de marketing digital, WhatsApp, Meta Ads, páginas web, CRM, contenido, SEO y GEO.</description>
    <language>es-co</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
