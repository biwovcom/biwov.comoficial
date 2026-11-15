import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PROPUESTAS_CLIENTES, copPropuesta } from "@/data/propuestasClientes";
import { CopiarEnlace } from "./CopiarEnlace";

export const metadata = { title: "Propuestas | Panel biwov" };

/** Propuestas a la medida (landing + contrato para firmar) que viven en data/propuestasClientes.ts. */
export default function PropuestasPage() {
  const lista = [...PROPUESTAS_CLIENTES].reverse(); // la más reciente primero
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Propuestas a la medida</h1>
      <p className="mt-1 text-sm text-text-secondary">
        {lista.length} propuesta{lista.length === 1 ? "" : "s"}. Cada una tiene su página para el cliente, con la
        inversión y el contrato para firmar en línea. Cuando el cliente firma, aparece en &quot;Compras de planes&quot;.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {lista.map((p, i) => {
          const ruta = `/propuesta/${p.slug}`;
          return (
            <GlassCard key={p.slug} className="flex flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                {i === 0 && <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">Más reciente</span>}
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-text-secondary">{p.sector}</span>
                <span className="text-xs text-text-secondary">v{p.version} · {p.slug}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white">{p.titulo}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{p.subtitulo}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-text-secondary">Valor total del contrato</p>
                  <p className="text-lg font-semibold text-accent">{copPropuesta(p.pago.totalContrato)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Duración</p>
                  <p className="text-lg font-semibold text-white">{p.duracionMeses} {p.duracionMeses === 1 ? "mes" : "meses"}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-text-secondary">
                {p.pago.lineas.map((l) => (
                  <li key={l.titulo} className="flex justify-between gap-3">
                    <span>{l.titulo}</span>
                    <span className="whitespace-nowrap text-white">{copPropuesta(l.valor)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2 pt-1">
                <Link href={ruta} target="_blank" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-[#03101b]">
                  Ver propuesta
                </Link>
                <CopiarEnlace ruta={ruta} titulo={p.titulo} />
              </div>
            </GlassCard>
          );
        })}
      </div>
      <p className="mt-8 text-xs text-text-secondary">
        Las cotizaciones rápidas con paquetes están en <Link href="/panel/paquetes" className="text-accent hover:underline">Paquetes</Link>.
      </p>
    </div>
  );
}
