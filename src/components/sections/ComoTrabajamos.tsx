"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Table, TableHead, TableBody, Th, Tr, Td } from "@/components/ui/Table";
import { RESPONSABILIDADES, METODO_4_PASOS } from "@/data/comoTrabajamos";

export function ComoTrabajamos() {
  return (
    <section id="como-funciona" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Cómo trabajamos"
          title="Tú pones el negocio. Nosotros, el orden."
          description="Trabajamos contigo, no por ti. Así tu negocio aprende, ahorras dinero y nadie conoce mejor tu marca que tú."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <Table>
            <TableHead>
              <Th>biwov se encarga de</Th>
              <Th>Tú te encargas de</Th>
            </TableHead>
            <TableBody>
              {RESPONSABILIDADES.map((fila) => (
                <Tr key={fila.biwov}>
                  <Td className="text-white/90">{fila.biwov}</Td>
                  <Td className="text-text-secondary">{fila.cliente}</Td>
                </Tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-5 sm:grid-cols-2">
          {METODO_4_PASOS.map((paso, i) => (
            <motion.div
              key={paso.numero}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <GlassCard className="flex h-full items-start gap-4 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                  {paso.numero}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{paso.titulo}</h3>
                  <p className="mt-1 text-xs text-text-secondary">{paso.detalle}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
