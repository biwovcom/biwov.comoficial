import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  ESCALONES, FORMAS_PAGO, MESES_MINIMOS, POLITICA_COSTOS_TERCEROS, totalSegunPago, type PlanCliente,
} from "@/data/portafolioClientes";

const C = { navy: "#0a2642", cian: "#00c2e8", cianOsc: "#0089a8", gris: "#4b5563", tenue: "#6b7280", borde: "#e5e7eb", fondo: "#f4f9fc" };
const cop = (n: number) => `$${n.toLocaleString("es-CO")} COP`;

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#111827", fontFamily: "Helvetica" },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 18, fontWeight: 700, color: C.navy },
  tag: { fontSize: 8, color: C.tenue },
  barra: { height: 3, backgroundColor: C.cian, borderRadius: 2, marginTop: 10, marginBottom: 16 },
  eyebrow: { fontSize: 8, fontWeight: 700, color: C.cianOsc, letterSpacing: 1, textTransform: "uppercase" },
  titulo: { fontSize: 22, fontWeight: 700, color: C.navy, marginTop: 4 },
  gancho: { fontSize: 11, color: C.gris, marginTop: 6, lineHeight: 1.4 },
  precioBox: { marginTop: 14, padding: 14, borderRadius: 10, backgroundColor: C.navy },
  precio: { fontSize: 20, fontWeight: 700, color: "#ffffff" },
  precioSub: { fontSize: 9.5, color: "#8fdff0", marginTop: 3 },
  h2: { fontSize: 12, fontWeight: 700, color: C.navy, marginTop: 18, marginBottom: 6 },
  grupo: { fontSize: 9.5, fontWeight: 700, color: C.cianOsc, marginTop: 8, marginBottom: 3 },
  item: { flexDirection: "row", marginBottom: 3, lineHeight: 1.35 },
  bullet: { width: 12, color: C.cian, fontWeight: 700 },
  texto: { flex: 1, color: "#1f2937" },
  tabla: { borderWidth: 1, borderColor: C.borde, borderRadius: 8, marginTop: 4 },
  fila: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: C.borde, paddingVertical: 6, paddingHorizontal: 8 },
  celda: { flex: 1, color: "#1f2937" },
  aviso: { marginTop: 10, padding: 10, borderRadius: 8, backgroundColor: C.fondo, color: C.gris, lineHeight: 1.4 },
  pie: { position: "absolute", bottom: 24, left: 36, right: 36, fontSize: 8, color: C.tenue, flexDirection: "row", justifyContent: "space-between" },
});

function Lista({ items, marca = "•" }: { items: string[]; marca?: string }) {
  return (
    <View>
      {items.map((t) => (
        <View key={t} style={s.item}>
          <Text style={s.bullet}>{marca}</Text>
          <Text style={s.texto}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

export function PlanPdfDocument(plan: PlanCliente) {
  const escalon = ESCALONES.find((e) => e.id === plan.escalon)!;
  const mensualBase = plan.mensual ? plan.precio : plan.adicional?.mensual ? plan.adicional.precio : null;
  const hoy = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  return (
    <Document title={`${plan.nombre} · biwov`} author="biwov">
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View>
            <Text style={s.logo}>biwov_</Text>
            <Text style={s.tag}>Agencia de ecosistemas digitales con agentes de IA · Manizales, Colombia</Text>
          </View>
          <Text style={s.tag}>{hoy}</Text>
        </View>
        <View style={s.barra} />
        <Text style={s.eyebrow}>{escalon.nombre}</Text>
        <Text style={s.titulo}>{plan.nombre}</Text>
        <Text style={s.gancho}>{plan.gancho}</Text>

        <View style={s.precioBox}>
          <Text style={s.precio}>
            {cop(plan.precio)} {plan.unidad}
          </Text>
          {plan.adicional && (
            <Text style={s.precioSub}>
              + {plan.adicional.label}: {cop(plan.adicional.precio)}
              {plan.adicional.mensual ? " /mes" : ""}
            </Text>
          )}
        </View>

        <Text style={s.h2}>Todo lo que incluye</Text>
        {plan.incluye.map((g) => (
          <View key={g.grupo} wrap={false}>
            <Text style={s.grupo}>{g.grupo}</Text>
            <Lista items={g.items} marca="•" />
          </View>
        ))}

        {plan.noIncluye.length > 0 && (
          <View wrap={false}>
            <Text style={s.h2}>No incluye</Text>
            <Lista items={plan.noIncluye} marca="–" />
          </View>
        )}

        {mensualBase && (
          <View wrap={false}>
            <Text style={s.h2}>Formas de pago (permanencia mínima de {MESES_MINIMOS} meses)</Text>
            <View style={s.tabla}>
              {FORMAS_PAGO.map((f) => {
                const t = totalSegunPago(mensualBase, f.id);
                return (
                  <View key={f.id} style={s.fila}>
                    <Text style={[s.celda, { flex: 1.6 }]}>{f.nombre}</Text>
                    <Text style={s.celda}>{f.nota}</Text>
                    <Text style={[s.celda, { textAlign: "right", fontWeight: 700 }]}>
                      {f.id === "mensual" ? `${cop(mensualBase)} /mes` : `${cop(t.total)} (${t.meses} meses)`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View wrap={false}>
          <Text style={s.h2}>Costos de plataformas (los paga el cliente)</Text>
          <Text style={{ color: C.gris, marginBottom: 4 }}>{POLITICA_COSTOS_TERCEROS.resumen}</Text>
          {plan.costosTerceros.length > 0 && <Lista items={plan.costosTerceros} />}
          <Text style={s.grupo}>El valor del plan sí incluye</Text>
          <Lista items={POLITICA_COSTOS_TERCEROS.incluye} marca="•" />
        </View>

        <View wrap={false}>
          <Text style={s.h2}>Cómo funciona</Text>
          <Lista items={plan.pasos.map((p, i) => `${i + 1}. ${p}`)} marca="" />
          <Text style={s.h2}>Condiciones</Text>
          <Lista items={plan.condiciones} />
        </View>

        <Text style={s.aviso}>
          Precios en pesos colombianos, sujetos a cambio sin previo aviso. Para contratar escríbenos al WhatsApp +57 313 312 5157: te enviamos el
          contrato para firmar en línea.
        </Text>

        <View style={s.pie} fixed>
          <Text>biwov.com · biwov.com@gmail.com</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
