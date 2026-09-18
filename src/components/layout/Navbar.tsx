"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#ecosistemas", label: "Ecosistemas" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#casos", label: "Casos de éxito" },
  { href: "#testimonios", label: "Testimonios" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useQuoter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border-glass bg-bg-base/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-18 items-center justify-between py-4">
        <a href="#" className="text-xl font-bold tracking-tight text-white">
          biwov<span className="text-accent">_</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Button size="md" onClick={() => open()}>
          Agenda una asesoría
        </Button>
      </Container>
    </header>
  );
}
