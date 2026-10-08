import Link from "next/link";
import { BookOpen, Calculator, Clock, CreditCard, Package, Users2, UserPlus } from "lucide-react";
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

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border-glass bg-white/[0.02] p-5">
      <Link href="/panel/prospectos" className="mb-8 px-2 text-xl font-bold text-white">
        <span className="font-logo">biwov</span>
        <span className="ml-2 text-sm font-normal text-text-secondary">panel</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <LogoutButton />
    </aside>
  );
}
