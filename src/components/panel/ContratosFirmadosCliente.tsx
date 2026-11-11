import { FileSignature } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PLANES } from "@/data/planes";
import type { CompraNormalizada } from "@/lib/compras/guardarCompra";

const soloDigitos = (v: string | null | undefined) => (v ?? "").replace(/\D/g, "");

/** Compras firmadas que corresponden a este prospecto (mismo correo o mismo WhatsApp). */
export function comprasDelProspecto(
  compras: CompraNormalizada[],
  prospecto: { email: string | null; whatsapp: string | null },
) {
  const email = prospecto.email?.trim().toLowerCase();
  const tel = soloDigitos(prospecto.whatsapp).slice(-10);
  return compras.filter((c) => {
    if (email && c.email?.trim().toLowerCase() === email) return true;
    const t = soloDigitos(c.whatsapp).slice(-10);
    return tel.length >= 7 && t === tel;
  });
}

function servicio(c: CompraNormalizada) {
  if (c.item_nombre) return c.item_nombre;
  if (c.plan_id) return PLANES.find((p) => p.id === c.plan_id)?.nombre ?? c.plan_id;
  return "—";
}

const texto = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);

export function ContratosFirmadosCliente({ compras }: { compras: CompraNormalizada[] }) {
  if (compras.length === 0) return null;
  return (
    <GlassCard className="p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
        <FileSignature size={16} className="text-accent" /> Contratos firmados
      </h2>
      <ul className="mt-4 space-y-3">
        {compras.map((c) => {
          const snap = c.snapshot;
          const firmado = c.firmas[0]?.created_at ?? c.created_at;
          const filas: [string, string | null][] = [
            ["Servicio", servicio(c)],
            ["Nombre", c.nombre],
            ["Cédula", texto(snap.cedula)],
            ["Correo", c.email],
            ["Teléfono", c.whatsapp],
            ["Empresa", c.empresa],
            ["Fecha de inicio", texto(snap.fechaInicio)],
            ["Valor", `${c.moneda === "USD" ? "US$" : "$"}${Math.round(c.monto).toLocaleString("es-CO")} ${c.moneda}`],
            ["Firmado", new Date(firmado).toLocaleString("es-CO", { timeZone: "America/Bogota" })],
          ];
          return (
            <li key={c.id} className="rounded-xl bg-white/[0.03] p-4">
              <dl className="grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
                {filas
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-text-secondary">{k}</dt>
                      <dd className="text-white">{v}</dd>
                    </div>
                  ))}
              </dl>
              <a
                href={`/contrato-firmado/${c.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#03101b]"
              >
                <FileSignature size={14} /> Ver / descargar contrato firmado
              </a>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
