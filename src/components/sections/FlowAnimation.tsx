"use client";

import { motion } from "framer-motion";
import {
  Camera,
  Megaphone,
  LayoutTemplate,
  Users,
  Workflow,
  MessageCircle,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NODOS = [
  { label: "Redes Sociales", Icon: Camera },
  { label: "Publicidad", Icon: Megaphone },
  { label: "Landing Page", Icon: LayoutTemplate },
  { label: "CRM", Icon: Users },
  { label: "Automatizaciones", Icon: Workflow },
  { label: "WhatsApp", Icon: MessageCircle },
  { label: "Ventas", Icon: ShoppingCart },
  { label: "Fidelización", Icon: Heart },
];

export function FlowAnimation({ className }: { className?: string }) {
  const duracionTotal = NODOS.length * 0.5;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-2 gap-y-6 md:flex-nowrap md:gap-x-1",
        className,
      )}
    >
      {NODOS.map((nodo, i) => (
        <div key={nodo.label} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border-glass bg-white/[0.03] backdrop-blur-md md:h-16 md:w-16"
              animate={{
                borderColor: [
                  "rgba(50,153,204,0.15)",
                  "rgba(50,153,204,0.15)",
                  "#3299CC",
                  "rgba(50,153,204,0.15)",
                  "rgba(50,153,204,0.15)",
                ],
                boxShadow: [
                  "0 0 0px rgba(50,153,204,0)",
                  "0 0 0px rgba(50,153,204,0)",
                  "0 0 30px rgba(50,153,204,0.8)",
                  "0 0 0px rgba(50,153,204,0)",
                  "0 0 0px rgba(50,153,204,0)",
                ],
              }}
              transition={{
                duration: duracionTotal,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
                times: [0, 0.15, 0.3, 0.45, 1],
              }}
            >
              <nodo.Icon className="h-6 w-6 text-accent md:h-7 md:w-7" />
            </motion.div>
            <span className="max-w-16 text-center text-[11px] leading-tight text-text-secondary md:max-w-20">
              {nodo.label}
            </span>
          </div>
          {i < NODOS.length - 1 && (
            <div className="mx-1 hidden h-px w-6 bg-border-glass md:block lg:w-10" />
          )}
        </div>
      ))}
    </div>
  );
}
