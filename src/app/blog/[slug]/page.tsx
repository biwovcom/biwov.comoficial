import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TarjetaArticulo } from "@/components/blog/TarjetaArticulo";
import { FinalCTA } from "@/components/sections/FinalCTA";
import {
  ARTICULOS,
  AUTOR_BLOG,
  articuloPorSlug,
  articulosOrdenados,
  formatoFechaBlog,
  slugSeccion,
} from "@/data/blog";

const BASE = "https://biwov.com";

export function generateStaticParams() {
  return ARTICULOS.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articuloPorSlug(slug);
  if (!a) return {};
  const url = `${BASE}/blog/${a.slug}`;
  return {
    title: a.titulo,
    description: a.descripcion,
    keywords: a.palabrasClave,
    authors: [{ name: AUTOR_BLOG.nombre, url: AUTOR_BLOG.url }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: a.titulo,
      description: a.descripcion,
      siteName: "biwov",
      locale: "es_CO",
      publishedTime: a.publicado,
      modifiedTime: a.actualizado,
      authors: [AUTOR_BLOG.url],
      section: a.categoria,
      tags: a.palabrasClave,
      images: [{ url: a.imagen, alt: a.imagenAlt }],
    },
    twitter: { card: "summary_large_image", title: a.titulo, description: a.descripcion, images: [a.imagen] },
  };
}

export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articuloPorSlug(slug);
  if (!a) notFound();

  const url = `${BASE}/blog/${a.slug}`;
  const relacionados = articulosOrdenados()
    .filter((x) => x.slug !== a.slug)
    .sort((x, y) => Number(y.categoria === a.categoria) - Number(x.categoria === a.categoria))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#articulo`,
        headline: a.titulo,
        description: a.descripcion,
        abstract: a.enResumen,
        image: a.imagen,
        url,
        mainEntityOfPage: url,
        inLanguage: "es-CO",
        datePublished: a.publicado,
        dateModified: a.actualizado,
        articleSection: a.categoria,
        keywords: a.palabrasClave.join(", "),
        wordCount: [a.enResumen, ...a.secciones.flatMap((s) => [...s.parrafos, ...(s.lista ?? [])])]
          .join(" ")
          .split(/\s+/).length,
        author: {
          "@type": "Person",
          name: AUTOR_BLOG.nombre,
          jobTitle: AUTOR_BLOG.cargo,
          url: AUTOR_BLOG.url,
        },
        publisher: {
          "@type": "Organization",
          name: "biwov",
          url: BASE,
          logo: { "@type": "ImageObject", url: `${BASE}/icon.svg` },
        },
        isPartOf: { "@type": "Blog", "@id": `${BASE}/blog#blog` },
      },
      {
        "@type": "FAQPage",
        mainEntity: a.preguntas.map((p) => ({
          "@type": "Question",
          name: p.pregunta,
          acceptedAnswer: { "@type": "Answer", text: p.respuesta },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
          { "@type": "ListItem", position: 3, name: a.titulo, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="relative isolate overflow-hidden pb-10 pt-32 md:pb-14 md:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_10%,rgba(0,194,232,0.14),transparent_65%)]" />
          <Container className="relative z-10">
            <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm text-white/50">
              <Link href="/blog" className="inline-flex items-center gap-1.5 transition-colors hover:text-accent">
                <ArrowLeft className="h-4 w-4" /> Blog
              </Link>
              <span>/</span>
              <span className="text-accent">{a.categoria}</span>
            </nav>
            <h1 className="mt-6 max-w-5xl text-[2.3rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl md:text-[4rem]">
              {a.titulo}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/65 md:text-xl">{a.descripcion}</p>
            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/15">
                <Image src={AUTOR_BLOG.imagen} alt={AUTOR_BLOG.nombre} fill sizes="48px" className="object-cover object-[74%_15%]" />
              </div>
              <div className="text-sm">
                <Link href="/kathe" className="font-semibold text-white hover:text-accent" rel="author">
                  {AUTOR_BLOG.nombre}
                </Link>
                <p className="text-white/50">
                  <time dateTime={a.publicado}>{formatoFechaBlog(a.publicado)}</time> · {a.minutosLectura} min de lectura
                </p>
              </div>
            </div>
          </Container>
        </header>

        <Container>
          <div className="relative aspect-[21/9] overflow-hidden rounded-[2rem]">
            <Image src={a.imagen} alt={a.imagenAlt} fill priority sizes="(max-width: 1280px) 100vw, 1216px" className="object-cover" />
          </div>
        </Container>

        <Container className="grid gap-12 py-14 md:py-20 lg:grid-cols-[260px_1fr] lg:gap-20">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">En este artículo</p>
              <ol className="mt-5 space-y-3 border-l border-white/10">
                {a.secciones.map((s) => (
                  <li key={s.titulo}>
                    <a
                      href={`#${slugSeccion(s.titulo)}`}
                      className="-ml-px block border-l border-transparent pl-4 text-sm leading-snug text-white/55 transition-colors hover:border-accent hover:text-white"
                    >
                      {s.titulo}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#preguntas-frecuentes"
                    className="-ml-px block border-l border-transparent pl-4 text-sm text-white/55 transition-colors hover:border-accent hover:text-white"
                  >
                    Preguntas frecuentes
                  </a>
                </li>
              </ol>
            </div>
          </aside>

          <div className="max-w-3xl">
            <section aria-label="En resumen" className="card-universo rounded-[1.75rem] p-7 md:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">En resumen</p>
              <p className="mt-4 text-xl font-medium leading-relaxed tracking-[-0.01em] text-white md:text-2xl">
                {a.enResumen}
              </p>
            </section>

            {a.secciones.map((s) => (
              <section key={s.titulo} id={slugSeccion(s.titulo)} className="scroll-mt-28 pt-14">
                <h2 className="text-3xl font-medium leading-[1.1] text-white md:text-[2.4rem]">{s.titulo}</h2>
                {s.parrafos.map((p) => (
                  <p key={p} className="mt-5 text-lg leading-relaxed text-white/70">
                    {p}
                  </p>
                ))}
                {s.lista && (
                  <ul className="mt-6 space-y-3">
                    {s.lista.map((item) => (
                      <li key={item} className="flex gap-3 text-lg leading-relaxed text-white/80">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section id="preguntas-frecuentes" className="scroll-mt-28 pt-16">
              <h2 className="text-3xl font-medium leading-[1.1] text-white md:text-[2.4rem]">Preguntas frecuentes</h2>
              <div className="mt-8 space-y-3">
                {a.preguntas.map((p) => (
                  <details key={p.pregunta} className="card-universo group rounded-[1.5rem] px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-white">
                      <h3>{p.pregunta}</h3>
                      <Plus className="h-5 w-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <p className="mt-4 text-base leading-relaxed text-white/65">{p.respuesta}</p>
                  </details>
                ))}
              </div>
            </section>

            <div className="mt-16 flex items-center gap-5 border-t border-white/10 pt-10">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/15">
                <Image src={AUTOR_BLOG.imagen} alt={AUTOR_BLOG.nombre} fill sizes="64px" className="object-cover object-[74%_15%]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Escrito por</p>
                <Link href="/kathe" className="mt-1 block text-lg font-medium text-white hover:text-accent" rel="author">
                  {AUTOR_BLOG.nombre}
                </Link>
                <p className="text-sm text-white/55">{AUTOR_BLOG.cargo}</p>
              </div>
            </div>
          </div>
        </Container>
      </article>

      {relacionados.length > 0 && (
        <section className="pb-6">
          <Container>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">Sigue leyendo</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relacionados.map((r) => (
                <TarjetaArticulo key={r.slug} articulo={r} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
