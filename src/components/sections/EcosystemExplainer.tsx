"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SATELITES = [
  { label: "Redes", x: 100, y: 60 },
  { label: "Publicidad", x: 300, y: 60 },
  { label: "CRM", x: 360, y: 200 },
  { label: "IA", x: 300, y: 340 },
  { label: "WhatsApp", x: 100, y: 340 },
  { label: "Web", x: 40, y: 200 },
];

const CENTRO = { x: 200, y: 200 };

export function EcosystemExplainer() {
  return (
    <section id="como-conectamos-todo" className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="¿Cómo funciona?"
          title="Todo conectado. Nada aislado."
          description="Conectamos tus redes, tu WhatsApp, tu página web y tus ventas para que se hablen entre sí — como un solo equipo trabajando para ti, sin que tengas que conectar nada a mano."
        />

        <div className="mx-auto mt-16 max-w-md">
          <svg viewBox="0 0 400 400" className="h-auto w-full">
            {SATELITES.map((s, i) => (
              <motion.line
                key={s.label}
                x1={CENTRO.x}
                y1={CENTRO.y}
                x2={s.x}
                y2={s.y}
                stroke="#3299CC"
                strokeWidth={1.5}
                strokeOpacity={0.5}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              />
            ))}

            {SATELITES.map((s, i) => (
              <motion.g
                key={s.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
              >
                <circle cx={s.x} cy={s.y} r={28} fill="#0D3B66" stroke="#3299CC" strokeWidth={1.5} />
                <text
                  x={s.x}
                  y={s.y + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#FFFFFF"
                  fontFamily="var(--font-poppins), sans-serif"
                >
                  {s.label}
                </text>
              </motion.g>
            ))}

            <motion.g
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <circle cx={CENTRO.x} cy={CENTRO.y} r={46} fill="url(#centroGradiente)" />
              <text
                x={CENTRO.x}
                y={CENTRO.y - 4}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="#FFFFFF"
              >
                Tu negocio
              </text>
              <text x={CENTRO.x} y={CENTRO.y + 12} textAnchor="middle" fontSize={12} fontWeight={600} fill="#FFFFFF">
                conectado
              </text>
            </motion.g>

            <defs>
              <radialGradient id="centroGradiente">
                <stop offset="0%" stopColor="#3299CC" />
                <stop offset="100%" stopColor="#0D3B66" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 max-w-xl text-center text-sm text-text-secondary md:text-base"
        >
          En palabras simples: en vez de contratar por separado un
          community manager, una página web, un CRM y automatizaciones que
          nunca se hablan entre sí, biwov te entrega todo eso funcionando
          como <span className="text-white">un solo equipo</span>. Eso es
          tener todo conectado.
        </motion.p>
      </Container>
    </section>
  );
}
