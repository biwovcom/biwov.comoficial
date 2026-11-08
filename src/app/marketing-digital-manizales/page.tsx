import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PLANES } from "@/data/planes";
import { NIVELES_PRODUCCION } from "@/data/addOns";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";

const URL = "https://biwov.com/marketing-digital-manizales";
const TITULO = "Agencia de marketing digital en Manizales";
const DESCRIPCION =
  "biwov es una agencia de marketing digital en Manizales: campañas en Meta, páginas web, producción de contenido, WhatsApp y automatización con IA para negocios de Caldas y el Eje Cafetero. Precios publicados.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  keywords: [
    "marketing digital Manizales",
    "agencia de marketing digital Manizales",
    "agencia de publicidad Manizales",
    "páginas web Manizales",
    "community manager Manizales",
    "marketing digital Caldas",
    "publicidad en Facebook e Instagram Manizales",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: `${TITULO} | biwov`,
    description: DESCRIPCION,
    url: URL,
    type: "website",
    locale: "es_CO",
    siteName: "biwov",
    images: ["/kathe-banner.png"],
  },
};

const cop = (n: number) => `$${n.toLocaleString("es-CO")}`;

const SERVICIOS = [
  {
    titulo: "Campañas en Meta Ads",
    texto: "Montamos y optimizamos tus campañas de Facebook e Instagram para que te escriban personas de Manizales y de todo Colombia que sí pueden comprar.",
  },
  {
    titulo: "Páginas web y tiendas",
    texto: "Landing pages, sitios y tiendas virtuales conectadas a WhatsApp y a tus campañas, con hosting y dominio el primer año.",
  },
  {
    titulo: "Producción de contenido",
    texto: "Grabamos fotos, reels y B-Roll en Manizales con guion y dirección creativa, para que tengas contenido de varias semanas en una jornada.",
  },
  {
    titulo: "WhatsApp, CRM e IA",
    texto: "Asistentes con inteligencia artificial que responden, filtran a los curiosos y te pasan a los interesados, con seguimiento automático.",
  },
];

const PREGUNTAS = [
  {
    pregunta: "¿Cuánto cuesta el marketing digital en Manizales?",
    respuesta: `En biwov los planes mensuales van desde ${cop(PLANES[0].precioDesde.cop)} COP (Plan ${PLANES[0].nombre}) hasta ${cop(PLANES[PLANES.length - 1].precioDesde.cop)} COP (Plan ${PLANES[PLANES.length - 1].nombre}), y una jornada de producción de contenido arranca en ${cop(NIVELES_PRODUCCION[0].precio.cop)} COP. La inversión en pauta se paga aparte, directamente a Meta.`,
  },
  {
    pregunta: "¿Trabajan solo con negocios de Manizales?",
    respuesta:
      "No. La producción de contenido presencial la hacemos en Manizales y alrededores, y la estrategia, las campañas, las páginas web y las automatizaciones las trabajamos de forma virtual con negocios de toda Colombia y Latinoamérica.",
  },
  {
    pregunta: "¿Qué hace diferente a biwov de otras agencias de Manizales?",
    respuesta:
      "No vendemos servicios sueltos: conectamos contenido, publicidad, página web, WhatsApp y CRM en un solo sistema, publicamos nuestros precios y trabajamos contigo para que tu negocio aprenda, no solo para entregar piezas.",
  },
  {
    pregunta: "¿Cuánto tiempo tarda en verse resultados?",
    respuesta:
      "Las campañas en Meta empiezan a dar datos útiles en una o dos semanas. Para ver una tendencia estable y optimizar con criterio, planeamos mínimo tres a seis meses; por eso los planes tienen un compromiso mínimo de 6 meses.",
  },
];

export default function MarketingManizalesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://biwov.com/#negocio-local",
        name: "biwov",
        description: DESCRIPCION,
        url: URL,
        image: "https://biwov.com/kathe-banner.png",
        logo: "https://biwov.com/icon.svg",
        telephone: WHATSAPP_BIWOV,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Manizales",
          addressRegion: "Caldas",
          addressCountry: "CO",
        },
        areaServed: [
          { "@type": "City", name: "Manizales" },
          { "@type": "AdministrativeArea", name: "Caldas" },
          { "@type": "Place", name: "Eje Cafetero" },
          { "@type": "Country", name: "Colombia" },
        ],
        founder: { "@id": "https://biwov.com/kathe#persona" },
        parentOrganization: { "@id": "https://biwov.com/#organizacion" },
        hasOfferCatalog: { "@type": "OfferCatalog", name: "Planes y servicios", url: "https://biwov.com/tienda" },
      },
      {
        "@type": "FAQPage",
        mainEntity: PREGUNTAS.map((p) => ({
          "@type": "Question",
          name: p.pregunta,
          acceptedAnswer: { "@type": "Answer", text: p.respuesta },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://biwov.com" },
          { "@type": "ListItem", position: 2, name: "Marketing digital en Manizales", item: URL },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative isolate flex flex-col overflow-hidden bg-[#03101b] pb-14 pt-[340px] sm:pt-[420px] md:min-h-[min(100svh,900px)] md:justify-center md:pb-20 md:pt-32">
        <div className="absolute inset-x-0 top-0 h-[400px] sm:h-[480px] md:inset-0 md:h-auto">
          <Image
            src="/kathe-banner.png"
            alt="Katherine Usma Aristizábal, fundadora de biwov, agencia de marketing digital en Manizales"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[68%_top] md:object-[right_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#03101b] via-[#03101b]/20 to-transparent md:bg-gradient-to-r md:from-[#03101b] md:via-[#03101b]/75 md:to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-deep to-transparent" />

        <Container className="relative z-10">
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
            Manizales · Caldas · Eje Cafetero
          </span>
          <h1 className="max-w-3xl text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-6xl md:text-[4.25rem]">
            Agencia de marketing digital en <span className="text-accent">Manizales.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-xl md:leading-relaxed">
            Campañas en Meta, páginas web, contenido y automatización con IA conectados en un solo
            sistema para que tu negocio venda más y mejor.
          </p>
          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <a
              href={linkWhatsApp(WHATSAPP_BIWOV, "¡Hola! 👋 Tengo un negocio en Manizales y quiero hablar sobre marketing digital.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-base font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.02] md:text-lg"
            >
              <WhatsAppIcon className="h-6 w-6" />
              Hablemos de tu negocio
            </a>
            <Link
              href="/tienda"
              className="border-b border-white/70 pb-1 text-base text-white transition-colors hover:border-accent hover:text-accent md:text-lg"
            >
              Ver precios
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
              Qué hacemos
            </span>
            <h2 className="text-4xl font-medium leading-[1.04] text-white sm:text-5xl md:text-6xl">
              Marketing digital para negocios de Manizales que quieren vender.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {SERVICIOS.map((s, i) => (
              <article key={s.titulo} className="card-universo rounded-[1.75rem] p-7">
                <span className="text-4xl font-medium tracking-[-0.04em] text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-medium text-white">{s.titulo}</h3>
                <p className="mt-2 text-base leading-relaxed text-white/60">{s.texto}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-20">
        <Container>
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
            Precios publicados
          </span>
          <h2 className="max-w-3xl text-4xl font-medium leading-[1.04] text-white sm:text-5xl md:text-6xl">
            Sabes cuánto inviertes <span className="text-accent">antes de empezar.</span>
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PLANES.map((p) => (
              <Link
                key={p.id}
                href="/tienda#planes"
                className="card-universo group rounded-[1.75rem] p-8 transition-transform duration-500 hover:-translate-y-1"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Plan</p>
                <h3 className="mt-2 text-3xl font-medium text-white">{p.nombre}</h3>
                <p className="mt-3 text-base text-white/60">{p.claim}</p>
                <p className="mt-8 text-3xl font-semibold tracking-tight text-white">
                  {cop(p.precioDesde.cop)}
                  <span className="text-base font-normal text-white/50"> COP/mes</span>
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <div>
            <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
              Preguntas frecuentes
            </span>
            <h2 className="text-4xl font-medium leading-[1.04] text-white sm:text-5xl md:text-6xl">
              Marketing digital en Manizales
            </h2>
          </div>
          <div className="space-y-3">
            {PREGUNTAS.map((p) => (
              <details key={p.pregunta} className="card-universo group rounded-[1.5rem] px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-white">
                  <h3>{p.pregunta}</h3>
                  <Plus className="h-5 w-5 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="mt-4 text-base leading-relaxed text-white/65">{p.respuesta}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}
