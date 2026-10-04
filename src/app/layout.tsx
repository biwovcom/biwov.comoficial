import type { Metadata } from "next";
import { Poppins, MuseoModerno } from "next/font/google";
import "./globals.css";
import { QuoterProvider } from "@/components/quoter/QuoterProvider";
import { SiteChrome } from "@/components/layout/SiteChrome";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const museoModerno = MuseoModerno({
  variable: "--font-museo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biwov.com"),
  title: "biwov — Todo tu negocio conectado",
  description:
    "biwov conecta tus redes, tu WhatsApp, tus ventas y la inteligencia artificial en un solo sistema, para que tu negocio venda más sin que tengas que hacerlo todo tú.",
  keywords: [
    "negocio conectado",
    "automatización",
    "CRM",
    "marketing digital",
    "ventas por WhatsApp",
    "biwov",
  ],
  openGraph: {
    title: "biwov — Todo tu negocio conectado",
    description:
      "No vendemos servicios sueltos. Conectamos tus herramientas para que trabajen juntas: atraer clientes, venderles y automatizar lo repetitivo.",
    url: "https://biwov.com",
    siteName: "biwov",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "biwov — Todo tu negocio conectado",
    description:
      "Conectamos tus redes, tu WhatsApp y tus ventas para que tu negocio crezca sin que tengas que hacerlo todo tú.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} ${museoModerno.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg-base">
        <QuoterProvider>
          <SiteChrome>{children}</SiteChrome>
        </QuoterProvider>
      </body>
    </html>
  );
}
