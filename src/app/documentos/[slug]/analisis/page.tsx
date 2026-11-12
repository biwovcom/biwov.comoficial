import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { DocHeader } from "@/components/documentos/DocHeader";
import { DOCUMENTOS_CLIENTES, documentosPorSlug } from "@/data/documentosClientes";

export const metadata: Metadata = {
  title: "Análisis inicial | biwov",
  description: "Análisis inicial privado de redes sociales y publicidad, preparado por biwov.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export function generateStaticParams() {
  return DOCUMENTOS_CLIENTES.map((d) => ({ slug: d.slug }));
}
export const dynamicParams = false;

export default async function AnalisisPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = documentosPorSlug(slug);
  if (!d) notFound();
  const a = d.analisis;

  return (
    <div className="min-h-screen overflow-x-clip bg-bg-deep text-white">
      <DocHeader volver={{ href: `/documentos/${d.slug}`, texto: "Documentos" }} />

      <section className="mx-auto max-w-5xl px-4 pt-12 md:px-8 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {d.cliente} · {d.fecha}
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
          Análisis inicial
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-text-secondary">{a.resumen}</p>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {a.cifras.map((c) => (
            <div key={c.etiqueta} className="card-universo rounded-3xl p-5">
              <p className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{c.valor}</p>
              <p className="mt-2 text-sm font-semibold">{c.etiqueta}</p>
              {c.nota && <p className="mt-0.5 text-xs text-text-secondary">{c.nota}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-16 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Calificación de cada canal</p>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {a.calificaciones.map((c) => (
            <div key={c.canal} className="card-universo rounded-3xl p-6">
              <p className="text-sm font-semibold text-white/85">{c.canal}</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-accent">{c.nota}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{c.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-16 md:px-8">
        <div className="rounded-[1.75rem] bg-white p-7 text-[#03101b] md:p-9">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#03101b]">
              <Sparkles className="h-5 w-5 text-accent" />
            </span>
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">{a.funciona.titulo}</h2>
          </div>
          <ul className="mt-6 space-y-3">
            {a.funciona.items.map((it) => (
              <li key={it} className="flex gap-3 text-[15px] leading-relaxed text-[#0a2642]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#0a8fb0]" /> {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-16 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Observaciones y oportunidades</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">Dónde podemos crecer</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {a.oportunidades.map((o, k) => (
            <div key={o.titulo} className="card-universo rounded-[1.75rem] p-7">
              <p className="text-xs font-semibold text-accent">0{k + 1}</p>
              <h3 className="mt-1 text-xl font-semibold">{o.titulo}</h3>
              <ul className="mt-4 space-y-2.5">
                {o.items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-white/85">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 pt-16 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Próximos pasos</p>
        <ol className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {a.proximos.map((p, i) => (
            <li key={p} className="card-universo flex gap-4 rounded-3xl p-5">
              <span className="text-3xl font-semibold text-accent">{i + 1}</span>
              <span className="text-[15px] leading-relaxed text-white/85">{p}</span>
            </li>
          ))}
        </ol>
        <Link
          href={`/documentos/${d.slug}/cuestionario`}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#03101b] transition-transform hover:scale-[1.03]"
        >
          Responder el cuestionario <ArrowRight size={16} />
        </Link>
        <p className="mt-10 text-xs text-text-secondary">
          Datos tomados el {d.fecha} de Instagram, Facebook y el Administrador de anuncios de Meta (últimos 30
          días y gasto histórico). Preparado por biwov_.
        </p>
      </section>
    </div>
  );
}
