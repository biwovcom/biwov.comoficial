import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { PropuestaImprimibleProps } from "@/components/propuestas/PropuestaImprimible";

const COLOR = {
  navy: "#0f172a",
  acero: "#2e5b7e",
  cian: "#00c2e8",
  grisTexto: "#374151",
  grisMedio: "#4b5563",
  grisClaro: "#6b7280",
  grisTenue: "#9ca3af",
  borde: "#e5e7eb",
  fondoClaro: "#f3f4f6",
};

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10.5,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logo: { fontSize: 18, fontWeight: 700, color: COLOR.navy },
  tagline: { fontSize: 8.5, color: COLOR.grisClaro, marginTop: 2 },
  fecha: { fontSize: 8.5, color: COLOR.grisClaro },
  divisor: { height: 3, borderRadius: 2, backgroundColor: COLOR.cian, marginTop: 10, marginBottom: 14 },
  eyebrow: { fontSize: 8.5, fontWeight: 700, color: COLOR.cian, textTransform: "uppercase", letterSpacing: 1 },
  titulo: { fontSize: 18, fontWeight: 700, color: COLOR.navy, marginTop: 3 },
  subtitulo: { fontSize: 10.5, color: COLOR.grisMedio, marginTop: 3 },
  cliente: { fontSize: 10, color: COLOR.grisMedio, marginTop: 8 },
  clienteNombre: { fontWeight: 700, color: "#111827" },
  seccionLabel: {
    fontSize: 8.5,
    fontWeight: 700,
    color: COLOR.grisClaro,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 6,
  },
  item: {
    borderWidth: 1,
    borderColor: COLOR.borde,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLOR.acero,
    color: "#ffffff",
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 4,
  },
  itemBody: { flex: 1 },
  itemHeadRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  itemNombre: { fontSize: 11.5, fontWeight: 700, color: COLOR.navy },
  itemPrecio: { fontSize: 10.5, fontWeight: 700, color: COLOR.acero },
  itemDescripcion: { fontSize: 9.5, color: COLOR.grisMedio, marginTop: 3 },
  incluyeItem: { fontSize: 8.5, color: COLOR.grisTexto, marginTop: 2 },
  noIncluyeItem: { fontSize: 8.5, color: COLOR.grisTenue, marginTop: 2 },
  diagnosticoBox: {
    backgroundColor: COLOR.fondoClaro,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.cian,
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
  },
  diagnosticoTexto: { fontSize: 9.5, color: COLOR.grisTexto, lineHeight: 1.4 },
  diagnosticoFila: { marginTop: 8 },
  diagnosticoEtiqueta: { fontSize: 8.5, fontWeight: 700, color: COLOR.acero },
  totalesBox: {
    backgroundColor: COLOR.fondoClaro,
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  totalLabel: { fontSize: 9.5, color: COLOR.grisMedio },
  totalValor: { fontSize: 10, fontWeight: 700, color: COLOR.navy },
  dosColumnas: { flexDirection: "row", gap: 24, marginTop: 14 },
  columna: { flex: 1 },
  listaItem: { fontSize: 9.5, color: COLOR.grisTexto, marginTop: 3 },
  footer: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: COLOR.borde,
    paddingTop: 8,
  },
  footerTexto: { fontSize: 7.5, color: COLOR.grisTenue },
});

export function PropuestaPdfDocument({
  titulo,
  subtitulo,
  cliente,
  diagnostico,
  items,
  totales,
  formasPago,
  validez,
  notas,
}: PropuestaImprimibleProps) {
  const fecha = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Document title={titulo}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.logo}>biwov_</Text>
            <Text style={styles.tagline}>Agencia de Marketing Digital · Kathe Digital</Text>
          </View>
          <Text style={styles.fecha}>{fecha}</Text>
        </View>
        <View style={styles.divisor} />

        <Text style={styles.eyebrow}>Propuesta comercial</Text>
        <Text style={styles.titulo}>{titulo}</Text>
        {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
        {cliente && (cliente.nombre || cliente.empresa) && (
          <Text style={styles.cliente}>
            Para: <Text style={styles.clienteNombre}>{cliente.nombre}</Text>
            {cliente.empresa ? ` · ${cliente.empresa}` : ""}
          </Text>
        )}

        {diagnostico && (
          <View style={styles.diagnosticoBox} wrap={false}>
            <Text style={styles.seccionLabel}>Diagnóstico</Text>
            <Text style={styles.diagnosticoTexto}>{diagnostico.situacion}</Text>
            <View style={styles.diagnosticoFila}>
              <Text style={styles.diagnosticoEtiqueta}>Por qué este plan:</Text>
              <Text style={styles.diagnosticoTexto}>{diagnostico.porQue}</Text>
            </View>
            <View style={styles.diagnosticoFila}>
              <Text style={styles.diagnosticoEtiqueta}>Para qué:</Text>
              <Text style={styles.diagnosticoTexto}>{diagnostico.paraQue}</Text>
            </View>
          </View>
        )}

        <Text style={styles.seccionLabel}>Qué incluye</Text>
        {items.map((item, i) => (
          <View key={`${item.nombre}-${i}`} style={styles.item} wrap={false}>
            <Text style={styles.badge}>{i + 1}</Text>
            <View style={styles.itemBody}>
              <View style={styles.itemHeadRow}>
                <Text style={styles.itemNombre}>{item.nombre}</Text>
                <Text style={styles.itemPrecio}>
                  {item.precio}
                  {item.periodicidad === "mensual" ? " /mes" : ""}
                </Text>
              </View>
              {item.descripcion && <Text style={styles.itemDescripcion}>{item.descripcion}</Text>}
              {item.incluye?.map((inc) => (
                <Text key={inc} style={styles.incluyeItem}>
                  ✓ {inc}
                </Text>
              ))}
              {item.noIncluye?.map((no) => (
                <Text key={no} style={styles.noIncluyeItem}>
                  ✕ {no}
                </Text>
              ))}
            </View>
          </View>
        ))}

        {totales.length > 0 && (
          <View style={styles.totalesBox} wrap={false}>
            <Text style={styles.seccionLabel}>Inversión</Text>
            {totales.map((t) => (
              <View key={t.label} style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t.label}</Text>
                <Text style={styles.totalValor}>{t.valor}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.dosColumnas} wrap={false}>
          <View style={styles.columna}>
            <Text style={styles.seccionLabel}>Forma de pago</Text>
            {formasPago.map((f) => (
              <Text key={f} style={styles.listaItem}>
                • {f}
              </Text>
            ))}
          </View>
          {(validez || (notas && notas.length > 0)) && (
            <View style={styles.columna}>
              <Text style={styles.seccionLabel}>Notas</Text>
              {validez && <Text style={styles.listaItem}>• {validez}</Text>}
              {notas?.map((n) => (
                <Text key={n} style={styles.listaItem}>
                  • {n}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTexto}>
            biwov_ · {titulo} · Kathe Digital · {fecha}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
