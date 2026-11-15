import {
  Bot, Brain, Compass, MessageSquareMore, Crown, GraduationCap, MapIcon, Megaphone, Mail, Rocket, Send, Sparkles, Users,
  type LucideIcon,
} from "lucide-react";
import type { PlanCliente } from "@/data/portafolioClientes";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";

export const ICONOS_PLAN: Record<PlanCliente["icono"], LucideIcon> = {
  graduation: GraduationCap,
  compass: Compass,
  users: Users,
  map: MapIcon,
  megaphone: Megaphone,
  rocket: Rocket,
  crown: Crown,
  bot: Bot,
  send: Send,
  mail: Mail,
  sparkles: Sparkles,
  brain: Brain,
  message: MessageSquareMore,
};

/** Precio del plan en la moneda elegida (respeta el USD fijo si el plan lo tiene). */
export function precioPlan(plan: { precio: number; usd?: number }, moneda: Moneda, trm: number) {
  if (moneda === "USD" && plan.usd) return `US$${plan.usd}`;
  return formatCopEnMoneda(plan.precio, moneda, trm);
}

/** Degradados de cabecera por escalón (marca biwov: azul profundo + cian). */
export const FONDO_ESCALON: Record<PlanCliente["escalon"], string> = {
  aprende: "from-[#e6f9fd] via-[#c9f1fa] to-[#8fdff0]",
  asesoria: "from-[#dfeaf3] via-[#b9d0e2] to-[#8fb3c9]",
  ejecucion: "from-[#0a2642] via-[#11416b] to-[#00c2e8]",
  automatizacion: "from-[#e8f3ef] via-[#c6e6dc] to-[#7fcbb4]",
  agentes: "from-[#1a1446] via-[#2e2a7a] to-[#00c2e8]",
};
