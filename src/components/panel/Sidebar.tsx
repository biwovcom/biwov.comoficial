"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Clock,
  CreditCard,
  Menu,
  Package,
  Users2,
  UserPlus,
  X,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const LINKS = [
  { href: "/panel/prospectos", label: "Prospectos", icon: Users2 },
  { href: "/panel/prospectos/nuevo", label: "Nuevo prospecto", icon: UserPlus },
  { href: "/panel/cotizaciones", label: "Cotizaciones", icon: Calculator },
  { href: "/panel/paquetes", label: "Paquetes", icon: Package },
  { href: "/panel/compras", label: "Compras de planes", icon: CreditCard },
  { href: "/panel/guia", label: "Guía rápida", icon: BookOpen },
  { href: "/panel/tiempos", label: "Tiempos", icon: Clock },
];

function Logo() {
  return (
    <span className="text-xl font-bold text-white">
      <span className="font-logo">biwov</span>
      <span className="ml-2 text-sm font-normal text-text-secondary">panel</span>
    </span>
  );
}

function NavLinks({ onNavegar }: { onNavegar?: () => void }) {
  return (
    <nav className="flex-1 space-y-1">
      {LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavegar}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <Icon size={18} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {/* Barra superior en móvil, con botón para abrir el menú */}
      <div className="flex items-center justify-between border-b border-border-glass bg-bg-base/95 p-4 backdrop-blur-sm md:hidden">
        <Link href="/panel/prospectos">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          className="text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Menú deslizable en móvil */}
      {abierto && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <aside className="flex h-full w-72 max-w-[85vw] flex-col border-r border-border-glass bg-bg-base p-5">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar menú"
                className="text-text-secondary hover:text-white"
              >
                <X size={22} />
              </button>
            </div>
            <NavLinks onNavegar={() => setAbierto(false)} />
            <LogoutButton />
          </aside>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="flex-1 bg-black/60"
          />
        </div>
      )}

      {/* Sidebar fija en escritorio */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border-glass bg-white/[0.02] p-5 md:flex">
        <Link href="/panel/prospectos" className="mb-8 px-2">
          <Logo />
        </Link>
        <NavLinks />
        <LogoutButton />
      </aside>
    </>
  );
}
