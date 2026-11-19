/**
 * Lectura de una cuenta de Instagram con solo el usuario, por la API oficial de Meta (Business Discovery).
 * Funciona con cuentas profesionales (empresa o creador). Usa la cuenta de Instagram de biwov para consultar.
 *
 * Variables en Vercel:
 *  - META_IG_TOKEN: token de larga duración de la página de Facebook conectada al Instagram de biwov
 *  - META_IG_USER_ID: id de la cuenta de Instagram profesional de biwov
 *  - META_GRAPH_VERSION (opcional, por defecto v23.0)
 */

export type PostIG = {
  caption: string;
  tipo: "REELS" | "FEED" | "CAROUSEL" | "OTRO";
  likes: number;
  comentarios: number;
  fecha: string;
  enlace: string;
};

export type CuentaIG = {
  usuario: string;
  nombre: string;
  bio: string;
  web: string;
  foto: string;
  seguidores: number;
  siguiendo: number;
  publicaciones: number;
  posts: PostIG[];
};

export type LecturaIG =
  | { ok: true; cuenta: CuentaIG }
  | { ok: false; motivo: "sin_configurar" | "no_encontrada" | "error" };

/** Limpia lo que escribe la persona: @usuario, instagram.com/usuario, espacios… */
export function limpiarUsuario(entrada: string): string | null {
  let u = entrada.trim();
  const m = u.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  if (m) u = m[1];
  u = u.replace(/^@+/, "").replace(/\/+$/, "").trim().toLowerCase();
  return /^[a-z0-9._]{1,30}$/.test(u) ? u : null;
}

type MediaMeta = {
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  like_count?: number;
  comments_count?: number;
  timestamp?: string;
  permalink?: string;
};

type PostApify = {
  caption?: string;
  type?: string;
  productType?: string;
  likesCount?: number;
  commentsCount?: number;
  timestamp?: string;
  url?: string;
};

/**
 * Segunda forma de leer la cuenta, sin configurar nada en Meta: Apify (actor
 * "Instagram Profile Scraper"). Lee cualquier perfil público, también los
 * personales. Variable en Vercel: APIFY_TOKEN. Cuesta centavos de dólar por perfil.
 */
async function leerConApify(usuario: string, token: string): Promise<LecturaIG> {
  const url = `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=90`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [usuario], resultsLimit: 25 }),
      cache: "no-store",
      signal: AbortSignal.timeout(100000),
    });
    if (!r.ok) return { ok: false, motivo: "error" };
    const items = (await r.json()) as Record<string, unknown>[];
    const b = items?.[0];
    if (!b || b.error || !b.username) return { ok: false, motivo: "no_encontrada" };
    if (b.private) return { ok: false, motivo: "no_encontrada" };
    const posts: PostIG[] = ((b.latestPosts as PostApify[]) || []).slice(0, 25).map((m) => ({
      caption: (m.caption || "").slice(0, 600),
      tipo:
        m.productType === "clips" ? "REELS"
        : m.type === "Sidecar" ? "CAROUSEL"
        : m.type === "Image" || m.type === "Video" ? "FEED"
        : "OTRO",
      likes: Math.max(0, m.likesCount ?? 0),
      comentarios: m.commentsCount ?? 0,
      fecha: m.timestamp || "",
      enlace: m.url || "",
    }));
    return {
      ok: true,
      cuenta: {
        usuario: String(b.username),
        nombre: String(b.fullName ?? ""),
        bio: String(b.biography ?? ""),
        web: String(b.externalUrl ?? ""),
        foto: String(b.profilePicUrlHD ?? b.profilePicUrl ?? ""),
        seguidores: Number(b.followersCount ?? 0),
        siguiendo: Number(b.followsCount ?? 0),
        publicaciones: Number(b.postsCount ?? 0),
        posts,
      },
    };
  } catch {
    return { ok: false, motivo: "error" };
  }
}

export async function leerCuentaIG(usuario: string): Promise<LecturaIG> {
  const token = process.env.META_IG_TOKEN;
  const igId = process.env.META_IG_USER_ID;
  const version = process.env.META_GRAPH_VERSION || "v23.0";
  const apify = process.env.APIFY_TOKEN;
  if (!token || !igId) return apify ? leerConApify(usuario, apify) : { ok: false, motivo: "sin_configurar" };
  const meta = await leerConMeta(usuario, token, igId, version);
  // Cuentas personales (Meta no las lee) o fallas: se intenta con Apify si está configurado
  return !meta.ok && apify ? leerConApify(usuario, apify) : meta;
}

async function leerConMeta(usuario: string, token: string, igId: string, version: string): Promise<LecturaIG> {

  const campos =
    `business_discovery.username(${usuario}){username,name,biography,website,profile_picture_url,` +
    `followers_count,follows_count,media_count,` +
    `media.limit(25){caption,media_type,media_product_type,like_count,comments_count,timestamp,permalink}}`;
  const url = `https://graph.facebook.com/${version}/${igId}?fields=${encodeURIComponent(campos)}&access_token=${encodeURIComponent(token)}`;

  try {
    const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
    const j = await r.json();
    const b = j?.business_discovery;
    if (!r.ok || !b) {
      // Meta responde 400 cuando la cuenta no existe o es personal (no profesional)
      return { ok: false, motivo: r.status === 400 ? "no_encontrada" : "error" };
    }
    const posts: PostIG[] = ((b.media?.data as MediaMeta[]) || []).map((m) => ({
      caption: (m.caption || "").slice(0, 600),
      tipo:
        m.media_product_type === "REELS" ? "REELS"
        : m.media_type === "CAROUSEL_ALBUM" ? "CAROUSEL"
        : m.media_type === "IMAGE" || m.media_type === "VIDEO" ? "FEED"
        : "OTRO",
      likes: m.like_count ?? 0,
      comentarios: m.comments_count ?? 0,
      fecha: m.timestamp || "",
      enlace: m.permalink || "",
    }));
    return {
      ok: true,
      cuenta: {
        usuario: b.username || usuario,
        nombre: b.name || "",
        bio: b.biography || "",
        web: b.website || "",
        foto: b.profile_picture_url || "",
        seguidores: b.followers_count ?? 0,
        siguiendo: b.follows_count ?? 0,
        publicaciones: b.media_count ?? 0,
        posts,
      },
    };
  } catch {
    return { ok: false, motivo: "error" };
  }
}
