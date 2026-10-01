export interface EnlaceDetectado {
  etiqueta: string;
  valor: string;
  href: string | null;
}

interface Plataforma {
  patron: RegExp;
  etiqueta: string;
  construir: (valor: string) => string;
}

function limpiarHandle(valor: string): string {
  return valor.trim().replace(/^@/, "").split(/\s+/)[0];
}

function pareceUrl(valor: string): boolean {
  return /^(https?:\/\/)?(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}(\/\S*)?$/i.test(valor.trim());
}

function normalizarUrl(valor: string): string {
  const t = valor.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function pareceEmail(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
}

const PLATAFORMAS: Plataforma[] = [
  {
    patron: /instagram/i,
    etiqueta: "Instagram",
    construir: (v) => (pareceUrl(v) ? normalizarUrl(v) : `https://instagram.com/${limpiarHandle(v)}`),
  },
  {
    patron: /tiktok/i,
    etiqueta: "TikTok",
    construir: (v) =>
      pareceUrl(v) ? normalizarUrl(v) : `https://www.tiktok.com/@${limpiarHandle(v)}`,
  },
  {
    patron: /facebook/i,
    etiqueta: "Facebook",
    construir: (v) => (pareceUrl(v) ? normalizarUrl(v) : `https://facebook.com/${limpiarHandle(v)}`),
  },
  {
    patron: /linkedin/i,
    etiqueta: "LinkedIn",
    construir: (v) =>
      pareceUrl(v) ? normalizarUrl(v) : `https://www.linkedin.com/company/${limpiarHandle(v)}`,
  },
  {
    patron: /youtube/i,
    etiqueta: "YouTube",
    construir: (v) => (pareceUrl(v) ? normalizarUrl(v) : `https://youtube.com/@${limpiarHandle(v)}`),
  },
  {
    patron: /google/i,
    etiqueta: "Google",
    construir: (v) =>
      pareceUrl(v) ? normalizarUrl(v) : `https://www.google.com/search?q=${encodeURIComponent(v)}`,
  },
  {
    patron: /^(p[aá]gina\s*)?web$|^sitio\s*web$|^website$/i,
    etiqueta: "Sitio web",
    construir: (v) => normalizarUrl(v),
  },
  {
    patron: /whatsapp/i,
    etiqueta: "WhatsApp",
    construir: (v) => `https://wa.me/${v.replace(/\D/g, "")}`,
  },
];

function detectarPlataforma(etiquetaCruda: string): Plataforma | null {
  return PLATAFORMAS.find((p) => p.patron.test(etiquetaCruda)) ?? null;
}

/**
 * Convierte texto libre tipo "Instagram: usuario" (una por línea) en enlaces
 * que abren directo la red, el sitio web o el correo. Lo que no reconoce lo
 * deja igual, como texto plano, para no perder ningún dato que haya escrito.
 */
export function extraerEnlaces(texto: string | null | undefined): EnlaceDetectado[] {
  if (!texto || !texto.trim()) return [];

  return texto
    .split(/\n+/)
    .map((linea) => linea.trim())
    .filter(Boolean)
    .map((linea): EnlaceDetectado => {
      const match = linea.match(/^([^:]{2,40}):\s*(.+)$/);
      if (match) {
        const [, etiquetaCruda, valor] = match;
        const plataforma = detectarPlataforma(etiquetaCruda.trim());
        if (plataforma) {
          return { etiqueta: plataforma.etiqueta, valor: valor.trim(), href: plataforma.construir(valor) };
        }
        if (pareceUrl(valor)) {
          return { etiqueta: etiquetaCruda.trim(), valor: valor.trim(), href: normalizarUrl(valor) };
        }
        if (pareceEmail(valor)) {
          return { etiqueta: etiquetaCruda.trim(), valor: valor.trim(), href: `mailto:${valor.trim()}` };
        }
        return { etiqueta: etiquetaCruda.trim(), valor: valor.trim(), href: null };
      }

      if (pareceUrl(linea)) {
        return { etiqueta: "Enlace", valor: linea, href: normalizarUrl(linea) };
      }
      if (pareceEmail(linea)) {
        return { etiqueta: "Correo", valor: linea, href: `mailto:${linea}` };
      }
      return { etiqueta: "", valor: linea, href: null };
    });
}
