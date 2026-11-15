/**
 * Webhook de Hotmart (versión 2.0.0) para las ventas de biwov Agentes.
 * Hotmart → esta ruta → colección "compras" de la oficina (Firebase biwov-oficina).
 * El motor de agentes toma la compra, crea el proyecto con la plantilla de instalación
 * y le da al cliente acceso a su portal (o se lo quita si cancela o pide reembolso).
 *
 * Variables en Vercel: HOTMART_HOTTOK (lo da Hotmart en Herramientas → Webhook) y COMPRAS_CLAVE.
 */
export const dynamic = "force-dynamic";

const PROYECTO_FIREBASE = "biwov-oficina";

type HotmartWebhook = {
  id?: string;
  event?: string;
  data?: {
    buyer?: { email?: string; name?: string };
    product?: { id?: number | string; name?: string };
    purchase?: { transaction?: string; status?: string };
    subscription?: { subscriber?: { code?: string } };
  };
};

const texto = (v: unknown) => ({ stringValue: String(v ?? "").slice(0, 300) });

export async function POST(req: Request) {
  const hottok = process.env.HOTMART_HOTTOK;
  const clave = process.env.COMPRAS_CLAVE;
  if (!hottok || !clave) return Response.json({ ok: false, error: "webhook sin configurar" }, { status: 503 });
  if (req.headers.get("x-hotmart-hottok") !== hottok) return Response.json({ ok: false }, { status: 401 });

  let body: HotmartWebhook;
  try {
    body = (await req.json()) as HotmartWebhook;
  } catch {
    return Response.json({ ok: false, error: "json inválido" }, { status: 400 });
  }

  const evento = String(body.event || "");
  const email = String(body.data?.buyer?.email || "").trim().toLowerCase();
  const producto = String(body.data?.product?.name || "");
  const transaccion = String(body.data?.purchase?.transaction || body.data?.subscription?.subscriber?.code || body.id || Date.now());
  const plan = /pro/i.test(producto) ? "pro" : "esencial";
  if (!evento || !email) return Response.json({ ok: true, ignorado: true });

  const id = `${transaccion}-${evento}`.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 140);
  const url = `https://firestore.googleapis.com/v1/projects/${PROYECTO_FIREBASE}/databases/(default)/documents/compras?documentId=${encodeURIComponent(id)}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        clave: texto(clave),
        evento: texto(evento),
        email: texto(email),
        nombre: texto(body.data?.buyer?.name),
        producto: texto(producto),
        plan: texto(plan),
        transaccion: texto(transaccion),
        procesada: { booleanValue: false },
        creada: { timestampValue: new Date().toISOString() },
      },
    }),
  });
  // 409 = Hotmart reenvió el mismo aviso: ya estaba guardado
  if (!r.ok && r.status !== 409) {
    console.error("hotmart → compras:", r.status, await r.text());
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
