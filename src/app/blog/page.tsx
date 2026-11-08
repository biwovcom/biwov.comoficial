import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TarjetaArticulo } from "@/components/blog/TarjetaArticulo";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { articulosOrdenados, AUTOR_BLOG } from "@/data/blog";

const URL_BLOG = "https://biwov.com/blog";
const TITULO = "Blog de marketing digital para negocios";
const DESCRIPCION =
  "Guías prácticas de marketing digital para negocios en Colombia y Latinoamérica: WhatsApp Business, Meta Ads, páginas web, CRM, contenido, SEO y GEO para buscadores de IA.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: {
    canonical: URL_BLOG,
    types: { "application/rss+xml": `${URL_BLOG}/rss.xml` },
  },
  openGraph: {
    title: `${TITULO} | biwov`,
    description: DESCRIPCION,
    url: URL_BLOG,
    type: "website",
    locale: "es_CO",
    siteName: "biwov",
  },
  twitter: { card: "summary_large_image", title: `${TITULO} | biwov`, description: DESCRIPCION },
};

export default function BlogPage() {
  const articulos = articulosOrdenados();
  const [destacado, ...resto] = articulos;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${URL_BLOG}#blog`,
        name: "Blog de biwov",
        description: DESCRIPCION,
        url: URL_BLOG,
        inLanguage: "es-CO",
        publisher: { "@type": "Organization", name: "biwov", url: "https://biwov.com" },
        author: { "@type": "Person", name: AUTOR_BLOG.nombre, url: AUTOR_BLOG.url },
        blogPost: articulos.map((a) => ({
          "@type": "BlogPosting",
          headline: a.titulo,
          url: `${URL_BLOG}/${a.slug}`,
          datePublished: a.publicado,
          dateModified: a.actualizado,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://biwov.com" },
          { "@type": "ListItem", position: 2, name: "Blog", item: URL_BLOG },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative isolate overflow-hidden pb-12 pt-36 md:pb-16 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_10%,rgba(0,194,232,0.16),transparent_65%)]" />
        <Container className="relative z-10">
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
            Blog biwov_
          </span>
          <h1 className="max-w-4xl text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl">
            Ideas para que tu negocio <span className="text-accent">venda más y mejor.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-xl">
            Guías prácticas de marketing digital: WhatsApp, publicidad en Meta, páginas web, CRM,
            contenido y cómo aparecer en Google y en los buscadores de inteligencia artificial.
          </p>
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          {destacado && <TarjetaArticulo articulo={destacado} destacado prioridad />}
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resto.map((a) => (
              <TarjetaArticulo key={a.slug} articulo={a} />
            ))}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
