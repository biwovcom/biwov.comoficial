import type { Metadata } from "next";
import { Nunito, Inter, MuseoModerno, Montserrat } from "next/font/google";
import "./globals.css";
import { QuoterProvider } from "@/components/quoter/QuoterProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { INSTAGRAM_BIWOV, WHATSAPP_BIWOV } from "@/lib/contacto";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "biwov",
  alternateName: "biwov_",
  url: "https://biwov.com",
  logo: "https://biwov.com/favicon.ico",
  description:
    "Agencia de marketing digital y automatización para negocios en Colombia y Latinoamérica: páginas web, CRM, producción de contenido, campañas en Meta y automatización de WhatsApp conectados en un solo sistema.",
  slogan: "Desde que te ven hasta que pagan.",
  areaServed: ["Colombia", "Latinoamérica"],
  knowsLanguage: "es",
  sameAs: [INSTAGRAM_BIWOV],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: WHATSAPP_BIWOV,
    areaServed: "CO",
    availableLanguage: "Spanish",
  },
  founder: {
    "@type": "Person",
    name: "Katherine Usma Aristizábal",
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const museoModerno = MuseoModerno({
  variable: "--font-museo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Solo para las cotizaciones/propuestas en PDF (el sitio usa Poppins).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biwov.com"),
  title: "biwov — Agencia de marketing digital y automatización en Colombia",
  description:
    "Agencia de marketing digital que conecta tus redes, tu WhatsApp, tu CRM y la inteligencia artificial en un solo sistema: páginas web, producción de contenido, campañas en Meta y automatización de WhatsApp para que tu negocio venda más sin que tengas que hacerlo todo tú.",
  keywords: [
    "agencia de marketing digital",
    "agencia de marketing digital Colombia",
    "automatización de WhatsApp",
    "CRM para negocios",
    "páginas web para negocios",
    "publicidad en Meta",
    "campañas de Facebook e Instagram Ads",
    "producción de contenido para redes sociales",
    "automatización con inteligencia artificial",
    "negocio conectado",
    "biwov",
  ],
  alternates: {
    canonical: "https://biwov.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "biwov — Agencia de marketing digital y automatización en Colombia",
    description:
      "No vendemos servicios sueltos. Conectamos tus herramientas para que trabajen juntas: atraer clientes, venderles y automatizar lo repetitivo.",
    url: "https://biwov.com",
    siteName: "biwov",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "biwov — Agencia de marketing digital y automatización en Colombia",
    description:
      "Conectamos tus redes, tu WhatsApp y tus ventas para que tu negocio crezca sin que tengas que hacerlo todo tú.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${nunito.variable} ${museoModerno.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg-base">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <QuoterProvider>
          <SiteChrome>{children}</SiteChrome>
        </QuoterProvider>
      </body>
    </html>
  );
}
