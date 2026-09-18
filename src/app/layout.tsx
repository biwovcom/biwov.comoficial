import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { QuoterProvider } from "@/components/quoter/QuoterProvider";
import { QuoterModal } from "@/components/quoter/QuoterModal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biwov.com"),
  title: "biwov — Ecosistemas Digitales Inteligentes",
  description:
    "biwov diseña Ecosistemas Digitales Inteligentes: marketing, ventas, automatización e inteligencia artificial conectados para que tu negocio crezca de forma organizada y escalable.",
  keywords: [
    "ecosistema digital",
    "transformación digital",
    "automatización",
    "CRM",
    "marketing digital",
    "biwov",
  ],
  openGraph: {
    title: "biwov — Ecosistemas Digitales Inteligentes",
    description:
      "No vendemos servicios aislados. Diseñamos sistemas donde cada herramienta trabaja en conjunto para atraer clientes, automatizar procesos y aumentar las ventas.",
    url: "https://biwov.com",
    siteName: "biwov",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "biwov — Ecosistemas Digitales Inteligentes",
    description:
      "Diseñamos Ecosistemas Digitales Inteligentes para que tu negocio crezca con procesos organizados y escalables.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg-base">
        <QuoterProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <QuoterModal />
        </QuoterProvider>
      </body>
    </html>
  );
}
