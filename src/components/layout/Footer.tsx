import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border-glass py-12">
      <Container className="flex flex-col items-center justify-between gap-6 text-sm text-text-secondary md:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">
            biwov<span className="text-accent">_</span>
          </span>
          <span>Ecosistemas Digitales Inteligentes</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/contrato" className="hover:text-white">
            Términos y condiciones
          </Link>
          <a
            href="https://wa.me/57"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            WhatsApp
          </a>
        </div>
        <p>© {new Date().getFullYear()} biwov. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
}
