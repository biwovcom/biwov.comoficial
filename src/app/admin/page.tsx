import { leerLeadsLocales } from "@/lib/localStore";

export const dynamic = "force-dynamic";

function celda(valor: unknown): string {
  if (valor === null || valor === undefined || valor === "") return "—";
  if (Array.isArray(valor)) return valor.join(", ");
  if (typeof valor === "object") return JSON.stringify(valor);
  return String(valor);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const claveConfigurada = process.env.ADMIN_ACCESS_KEY;
  const autorizado = Boolean(claveConfigurada) && key === claveConfigurada;

  if (!autorizado) {
    return (
      <div className="min-h-screen bg-bg-base px-6 py-24 text-white">
        <div className="mx-auto max-w-lg rounded-3xl border border-border-glass bg-white/[0.02] p-8 text-center">
          <h1 className="text-xl font-semibold">Acceso restringido</h1>
          <p className="mt-3 text-sm text-text-secondary">
            {claveConfigurada
              ? "Agrega tu clave en la URL: /admin?key=tu-clave"
              : "Define ADMIN_ACCESS_KEY en tus variables de entorno (.env.local) y vuelve a intentar con /admin?key=tu-clave."}
          </p>
        </div>
      </div>
    );
  }

  const leads = leerLeadsLocales();

  return (
    <div className="min-h-screen bg-bg-base px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Diagnósticos y leads</h1>
            <p className="text-sm text-text-secondary">
              {leads.length} registro{leads.length === 1 ? "" : "s"} guardados localmente.
            </p>
          </div>
          <a
            href={`/api/admin/export?key=${encodeURIComponent(key ?? "")}`}
            className="rounded-full border border-border-glass bg-white/[0.03] px-4 py-2 text-sm hover:bg-white/[0.08]"
          >
            Descargar CSV
          </a>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border-glass">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Ecosistema</th>
                <th className="px-4 py-3">Objetivo</th>
                <th className="px-4 py-3">Presupuesto</th>
                <th className="px-4 py-3">Canal</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-text-secondary">
                    Todavía no hay diagnósticos registrados.
                  </td>
                </tr>
              )}
              {leads.map((lead, i) => (
                <tr key={i} className="border-t border-border-glass">
                  <td className="px-4 py-3 text-text-secondary">
                    {celda(lead.guardadoEn)?.toString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td className="px-4 py-3">{celda(lead.nombre)}</td>
                  <td className="px-4 py-3">{celda(lead.empresa)}</td>
                  <td className="px-4 py-3">{celda(lead.whatsapp)}</td>
                  <td className="px-4 py-3">{celda(lead.email)}</td>
                  <td className="px-4 py-3 uppercase text-accent">
                    {celda(lead.ecosistema_recomendado)}
                  </td>
                  <td className="px-4 py-3">{celda(lead.objetivo)}</td>
                  <td className="px-4 py-3">{celda(lead.presupuesto)}</td>
                  <td className="px-4 py-3">{celda(lead.canal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
