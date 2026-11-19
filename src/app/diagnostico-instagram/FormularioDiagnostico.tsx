"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AtSign, Loader2 } from "lucide-react";

const PASOS_CARGA = ["Revisando tu perfil…", "Midiendo tu constancia y tus formatos…", "Calculando tu interacción…", "Escribiendo tus recomendaciones…"];

export function FormularioDiagnostico() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [f, setF] = useState({ email: "", whatsapp: "", acepto: false });
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enviando) return;
    const t = setInterval(() => setCargando((p) => Math.min(p + 1, PASOS_CARGA.length - 1)), 7000);
    return () => clearInterval(t);
  }, [enviando]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^@?[A-Za-z0-9._]{1,30}$/.test(usuario.trim()) && !/instagram\.com\//i.test(usuario))
      return setError("Escribe un usuario de Instagram válido (por ejemplo @tunegocio).");
    setEnviando(true);
    setCargando(0);
    try {
      const r = await fetch("/api/diagnostico-ig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, ...f }),
      });
      const j = await r.json();
      if (!r.ok || !j.id) throw new Error(j.error || "No pudimos hacer el diagnóstico. Intenta de nuevo.");
      router.push(`/diagnostico-instagram/r/${j.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
      setEnviando(false);
    }
  };

  const campo = "w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c6f432]";

  if (enviando) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-[#c6f432]/40 bg-white/[0.04] p-8 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#c6f432]" />
        <p className="mt-5 text-xl font-semibold">Analizando @{usuario.replace(/^@/, "")}</p>
        <p className="mt-2 text-sm text-white/65">{PASOS_CARGA[cargando]}</p>
        <p className="mt-6 text-xs text-white/40">Tarda entre 30 segundos y 1 minuto. No cierres esta página.</p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.05] p-6 md:p-7">
      <p className="text-lg font-semibold">Haz tu diagnóstico gratis</p>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8fdff0]">Usuario de Instagram de tu negocio</span>
        <div className="relative mt-1">
          <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input required value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="tunegocio" className={`${campo} pl-10`} autoCapitalize="none" autoCorrect="off" />
        </div>
      </label>
      <input required type="tel" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} placeholder="Tu WhatsApp con indicativo (ej. +57 300…)" className={campo} />
      <input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Tu correo" className={campo} />
      <label className="flex items-start gap-2 text-xs text-white/65">
        <input type="checkbox" required checked={f.acepto} onChange={(e) => setF({ ...f, acepto: e.target.checked })} className="mt-0.5" />
        <span>
          Autorizo a biwov a tratar mis datos para enviarme mi diagnóstico y contactarme, según la{" "}
          <Link href="/politica-datos" target="_blank" className="underline">política de tratamiento de datos</Link>.
        </span>
      </label>
      {error && <p className="rounded-2xl bg-red-500/15 p-3 text-sm text-red-200">{error}</p>}
      <button type="submit" className="w-full rounded-2xl bg-[#c6f432] px-5 py-3.5 text-base font-black text-[#03101b] transition-transform hover:scale-[1.01]">
        Ver mi diagnóstico →
      </button>
    </form>
  );
}
