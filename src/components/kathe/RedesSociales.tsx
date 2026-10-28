"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { INSTAGRAM_KATHE, TIKTOK_KATHE } from "@/lib/contacto";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-.9-.78-1.46-1.9-1.56-3.14h-3.03v13.44c0 1.57-1.28 2.85-2.85 2.85a2.85 2.85 0 0 1-2.85-2.85 2.85 2.85 0 0 1 2.85-2.85c.27 0 .53.04.78.11V10.3a5.9 5.9 0 0 0-.78-.05 5.89 5.89 0 0 0-5.89 5.89A5.89 5.89 0 0 0 9.16 22a5.89 5.89 0 0 0 5.89-5.86V9.05a7.76 7.76 0 0 0 4.54 1.46V7.48c-.98 0-1.9-.3-2.99-1.07a4.5 4.5 0 0 1-1-.59Z" />
    </svg>
  );
}

interface RedPerfil {
  nombre: string;
  red: "Instagram" | "TikTok";
  usuario: string;
  link: string;
  seguidores: string;
  stat2Label: string;
  stat2Valor: string;
  bio: string;
  gradiente: string;
  colorPlaceholder: string;
}

const PERFILES: RedPerfil[] = [
  {
    nombre: "Kathe digital",
    red: "Instagram",
    usuario: "@kathedigital__",
    link: INSTAGRAM_KATHE,
    seguidores: "1.617",
    stat2Label: "Posts",
    stat2Valor: "—",
    bio: "Marketing digital con propósito. Sistemas para vender con claridad.",
    gradiente: "from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    colorPlaceholder: "bg-[#8134af]/20",
  },
  {
    nombre: "Kathe digital",
    red: "TikTok",
    usuario: "@kathedigital_",
    link: TIKTOK_KATHE,
    seguidores: "1.878",
    stat2Label: "Me gusta",
    stat2Valor: "—",
    bio: "Marketing digital para emprendedores. Contenido real, sin fórmulas vacías.",
    gradiente: "from-[#25F4EE] via-[#111] to-[#FE2C55]",
    colorPlaceholder: "bg-[#FE2C55]/20",
  },
];

function TarjetaRed({ perfil, index }: { perfil: RedPerfil; index: number }) {
  const Icono = perfil.red === "Instagram" ? InstagramIcon : TikTokIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="overflow-hidden rounded-3xl border border-border-glass bg-[#0a2642]"
    >
      <div className={`relative h-20 bg-gradient-to-r ${perfil.gradiente}`}>
        <span className="absolute right-4 top-4 flex items-center gap-1.5 text-sm font-semibold text-white">
          {perfil.red} <Icono className="h-4 w-4" />
        </span>
      </div>

      <div className="px-6 pb-6">
        <div className="-mt-8 flex items-end justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#0a2642] bg-gradient-brand text-lg font-bold text-white">
            KD
          </div>
          <a
            href={perfil.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <Icono className="h-3.5 w-3.5" /> Seguir
          </a>
        </div>

        <p className="mt-3 text-base font-semibold text-white">{perfil.nombre}</p>
        <p className="text-sm text-text-secondary">{perfil.usuario}</p>

        <div className="mt-3 flex gap-6">
          <div>
            <p className="text-base font-bold text-white">{perfil.seguidores}</p>
            <p className="text-[11px] uppercase tracking-wide text-text-secondary">Seguidores</p>
          </div>
          <div>
            <p className="text-base font-bold text-white">{perfil.stat2Valor}</p>
            <p className="text-[11px] uppercase tracking-wide text-text-secondary">{perfil.stat2Label}</p>
          </div>
        </div>

        <p className="mt-3 text-sm text-text-secondary">{perfil.bio}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`flex aspect-square items-center justify-center rounded-xl ${perfil.colorPlaceholder}`}
            >
              <Icono className="h-6 w-6 text-white/40" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function RedesSociales() {
  return (
    <section className="py-16 md:py-20 print:hidden">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-border-glass bg-white/[0.03] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            Sígueme en redes
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
            Contenido diario sobre marketing con propósito
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {PERFILES.map((perfil, i) => (
            <TarjetaRed key={perfil.red} perfil={perfil} index={i} />
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-lg text-center text-xs text-text-secondary">
          Seguidores actualizados manualmente. Las miniaturas son un espacio reservado para las
          publicaciones reales — avísame cuando quieras cambiarlas por capturas de tus posts.
        </p>
      </Container>
    </section>
  );
}
