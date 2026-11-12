"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, CloudUpload, Copy, Download, Send } from "lucide-react";
import type { DocumentosCliente } from "@/data/documentosClientes";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { linkWhatsApp } from "@/lib/panel/whatsapp";

/**
 * Cuestionario en línea: las respuestas se guardan en este navegador
 * mientras la persona escribe (puede cerrar y volver) y se envían por
 * WhatsApp, por correo o se descargan en PDF.
 */
export function CuestionarioCliente({ d, porProspecto = false }: { d: DocumentosCliente; porProspecto?: boolean }) {
  const KEY = `biwov-cuestionario-${d.slug}`;
  const preguntas = useMemo(
    () => d.cuestionario.grupos.flatMap((g) => g.preguntas),
    [d],
  );
  const [resp, setResp] = useState<string[]>(() => preguntas.map(() => ""));
  const [copiado, setCopiado] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(KEY) || "null");
      if (Array.isArray(guardado)) setResp(preguntas.map((_, i) => guardado[i] ?? ""));
    } catch {}
    setListo(true);
  }, [KEY, preguntas]);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(resp));
    } catch {}
  }, [KEY, resp, listo]);

  const respondidas = resp.filter((r) => r.trim()).length;
  const total = preguntas.length;

  // Guardado en el panel de biwov: automático 2,5 s después de dejar de escribir
  const [estadoNube, setEstadoNube] = useState<"" | "guardando" | "ok" | "error">("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const respRef = useRef(resp);
  respRef.current = resp;
  const tocado = useRef(false);

  const guardarNube = useCallback(
    async (final = false) => {
      setEstadoNube("guardando");
      try {
        const r = await fetch("/api/documentos/cuestionario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...(porProspecto ? { prospectoId: d.prospectoId } : { slug: d.slug }), respuestas: respRef.current, enviado: final }),
          keepalive: true,
        });
        setEstadoNube(r.ok ? "ok" : "error");
        return r.ok;
      } catch {
        setEstadoNube("error");
        return false;
      }
    },
    [d.slug, d.prospectoId, porProspecto],
  );

  useEffect(() => {
    if (!listo || !tocado.current) return;
    const t = setTimeout(() => guardarNube(enviado), 2500);
    return () => clearTimeout(t);
  }, [resp, listo, guardarNube, enviado]);

  const enviar = async () => {
    setEnviando(true);
    const ok = await guardarNube(true);
    setEnviando(false);
    if (ok) setEnviado(true);
  };

  const texto = () => {
    let n = 0;
    const partes = d.cuestionario.grupos.map((g) => {
      const qs = g.preguntas.map((q) => {
        const i = n++;
        return `${i + 1}. ${q}\n→ ${resp[i].trim() || "(sin respuesta)"}`;
      });
      return `*${g.titulo.toUpperCase()}*\n${qs.join("\n\n")}`;
    });
    return `Cuestionario de inicio · ${d.cliente}\n\n${partes.join("\n\n")}`;
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {}
  };

  let contador = 0;

  return (
    <>
      <div className="sticky top-0 z-20 border-b border-border-glass bg-bg-deep/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 md:px-8">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${(respondidas / total) * 100}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-xs font-semibold text-text-secondary">
            {respondidas} de {total} respondidas
            {estadoNube === "guardando" && " · Guardando…"}
            {estadoNube === "ok" && " · Guardado ✓"}
            {estadoNube === "error" && " · Sin conexión: guardado en este dispositivo"}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-24 md:px-8 print:hidden">
        {d.cuestionario.grupos.map((g) => (
          <section key={g.titulo} className="mt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {g.titulo}
            </h2>
            <div className="mt-4 space-y-5">
              {g.preguntas.map((q) => {
                const i = contador++;
                return (
                  <div key={i} className="card-universo rounded-3xl p-5 md:p-6">
                    <label htmlFor={`q${i}`} className="flex gap-3 text-[15px] font-medium leading-relaxed text-white">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-[#03101b]">
                        {i + 1}
                      </span>
                      {q}
                    </label>
                    <textarea
                      id={`q${i}`}
                      rows={3}
                      value={resp[i]}
                      onChange={(e) => {
                        const v = e.target.value;
                        tocado.current = true;
                        setResp((r) => r.map((x, j) => (j === i ? v : x)));
                      }}
                      placeholder="Escribe tu respuesta…"
                      className="mt-4 w-full resize-y rounded-2xl border border-border-glass bg-white/5 px-4 py-3 text-[15px] leading-relaxed text-white placeholder:text-white/35 focus:border-accent focus:outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-14 rounded-[1.75rem] bg-white p-7 text-[#03101b] print:hidden">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">Enviar respuestas</h2>
          <p className="mt-2 text-sm text-[#0a2642]/80">
            Tus respuestas nos llegan y se guardan automáticamente mientras escribes, así que puedes
            continuar después. Cuando termines, pulsa “Enviar respuestas”.
            {respondidas < total && ` Te faltan ${total - respondidas} preguntas; si alguna no aplica, escribe “no aplica”.`}
          </p>
          {enviado ? (
            <p className="mt-5 rounded-2xl bg-[#e9f8fc] px-4 py-3 text-sm font-semibold text-[#0a2642]">
              ✅ ¡Recibimos tus respuestas! Si cambias algo, se actualiza solo.
            </p>
          ) : (
            estadoNube === "error" && (
              <p className="mt-5 rounded-2xl bg-[#fdecec] px-4 py-3 text-sm text-[#7a1f1f]">
                No pudimos enviar en este momento. Revisa tu conexión e inténtalo de nuevo, o usa “Descargar PDF”.
              </p>
            )
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={enviar}
              disabled={enviando || respondidas === 0}
              className="inline-flex items-center gap-2 rounded-full bg-[#03101b] px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] disabled:opacity-50"
            >
              <CloudUpload size={16} /> {enviando ? "Enviando…" : enviado ? "Enviar de nuevo" : "Enviar respuestas"}
            </button>
            <a
              href={linkWhatsApp(WHATSAPP_BIWOV, `Hola, ya respondí el cuestionario de inicio (${d.cliente}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#03101b]/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#03101b]"
            >
              <Send size={16} /> Avisar por WhatsApp
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-[#03101b]/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#03101b]"
            >
              <Download size={16} /> Descargar PDF
            </button>
            <button
              type="button"
              onClick={copiar}
              className="inline-flex items-center gap-2 rounded-full border border-[#03101b]/25 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#03101b]"
            >
              {copiado ? <Check size={16} /> : <Copy size={16} />} {copiado ? "Copiado" : "Copiar respuestas"}
            </button>
          </div>
          <p className="mt-4 text-xs text-[#0a2642]/60">
            “Descargar PDF” te deja una copia de tus respuestas.
          </p>
        </section>
      </div>
      {/* Versión para imprimir o guardar en PDF: fondo blanco, sin tarjetas,
          cada pregunta con su respuesta completa (las largas pueden seguir en
          la página siguiente sin cortarse). */}
      <style>{`@media print { @page { size: letter; margin: 16mm 15mm; } html, body { background: #fff !important; color-scheme: light !important; } }`}</style>
      <div className="hidden text-[#10233a] print:block" style={{ fontSize: "10.5pt", lineHeight: 1.5 }}>
        <div style={{ background: "#0a2642", color: "#fff", padding: "14px 18px", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
          <div style={{ fontSize: "20pt", fontWeight: 800 }}>
            biwov<span style={{ color: "#00c2e8" }}>_</span>
          </div>
          <div style={{ fontSize: "8pt", letterSpacing: "0.18em", color: "#8fb3c9" }}>MARKETING DIGITAL · ESTRATEGIA · CONTENIDO</div>
        </div>
        <h1 style={{ fontSize: "18pt", fontWeight: 800, color: "#0a2642", margin: "16px 0 2px" }}>Cuestionario de inicio</h1>
        <p style={{ margin: "0 0 14px", fontWeight: 600, color: "#4b6178" }}>
          {d.cliente} · {respondidas} de {total} preguntas respondidas
        </p>
        {(() => {
          let k = 0;
          return d.cuestionario.grupos.map((g) => (
            <div key={g.titulo}>
              <h2 style={{ fontSize: "11.5pt", color: "#fff", background: "#0a2642", padding: "5px 10px", margin: "16px 0 8px", breakAfter: "avoid", pageBreakAfter: "avoid", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                {g.titulo}
              </h2>
              {g.preguntas.map((q) => {
                const i = k++;
                return (
                  <div key={i} style={{ margin: "0 0 10px" }}>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, breakAfter: "avoid", pageBreakAfter: "avoid" }}>
                      {i + 1}. {q}
                    </p>
                    <p style={{ margin: 0, padding: "6px 10px", border: "1px solid #b9d3e2", borderRadius: 4, whiteSpace: "pre-wrap", overflowWrap: "anywhere", minHeight: resp[i].trim() ? undefined : 48, orphans: 3, widows: 3 }}>
                      {resp[i].trim()}
                    </p>
                  </div>
                );
              })}
            </div>
          ));
        })()}
        <p style={{ marginTop: 18, paddingTop: 8, borderTop: "2px solid #00c2e8", color: "#4b6178", fontSize: "9pt" }}>
          ¡Gracias por tu tiempo! · biwov_ · biwov.com · WhatsApp +57 313 312 5157
        </p>
      </div>
    </>
  );
}
