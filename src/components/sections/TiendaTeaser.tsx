"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const FOTOS_PREVIEW = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=70",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=70",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=500&q=70",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=70",
];

export function TiendaTeaser() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-10 rounded-[2.5rem] border border-border-glass bg-white/[0.02] p-8 md:grid-cols-[1fr_auto] md:p-14"
        >
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Tienda biwov_
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Arma tu ecosistema digital
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
              Elige un plan mensual o agrega servicios sueltos — como en una tienda, a tu propio
              ritmo.
            </p>
            <div className="mt-8">
              <Link href="/tienda">
                <Button size="lg">Ver la tienda</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 md:w-72">
            {FOTOS_PREVIEW.map((foto, i) => (
              <div
                key={foto}
                className={`relative aspect-square overflow-hidden rounded-xl ${i % 2 === 1 ? "mt-4" : ""}`}
              >
                <Image src={foto} alt="" fill sizes="80px" className="object-cover" />
                <div className="absolute inset-0 bg-[#0a2642]/25" />
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
