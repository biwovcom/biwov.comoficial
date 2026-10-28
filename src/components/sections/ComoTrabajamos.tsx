"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
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

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {METODO_4_PASOS.map((paso, i) => (
            <motion.div
              key={paso.numero}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative"
            >
              <span className="text-gradient text-3xl font-black">
                {String(paso.numero).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-white">{paso.titulo}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{paso.detalle}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
