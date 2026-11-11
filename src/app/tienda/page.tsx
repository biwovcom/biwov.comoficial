import type { Metadata } from "next";
import { TiendaExperiencia } from "@/components/sections/TiendaExperiencia";
import { PLANES } from "@/data/planes";
import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";

const catalogoJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Planes y servicios de biwov",
  url: "https://biwov.com/tienda",
  itemListElement: [
    ...PLANES.map((p) => ({
      "@type": "Offer",
      name: `Plan ${p.nombre}`,
      description: `${p.resumen} ${p.paraQuien}`,
      price: p.precioDesde.cop,
      priceCurrency: "COP",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.precioDesde.cop,
        priceCurrency: "COP",
        unitText: "MONTH",
      },
      itemOffered: { "@type": "Service", name: `Plan ${p.nombre}`, provider: { "@id": "https://biwov.com/#organizacion" } },
    })),
    ...EXTRAS_COTIZABLES.map((e) => ({
      "@type": "Offer",
      name: `${e.categoria}: ${e.nombre}`,
      description: e.descripcion,
      price: e.precioCop,
      priceCurrency: "COP",
      itemOffered: { "@type": "Service", name: e.nombre, category: e.categoria, provider: { "@id": "https://biwov.com/#organizacion" } },
    })),
  ],
};

export const metadata: Metadata = {
  title: "Tienda: planes y servicios de marketing digital con precios",
  description:
    "Precios publicados de planes mensuales de dirección estratégica y gestión de redes, producción de video, automatización con WhatsApp e IA, email marketing, páginas web y campañas en Meta para negocios en Colombia.",
  alternates: {
    canonical: "https://biwov.com/tienda",
  },
};

export default function TiendaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogoJsonLd) }} />
      <TiendaExperiencia />
    </>
  );
}
