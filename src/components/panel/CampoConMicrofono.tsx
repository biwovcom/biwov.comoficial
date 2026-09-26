"use client";

import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BloqueDiagnostico } from "@/lib/panel/diagnosticoLargo";

interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
}

function obtenerConstructor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as WindowWithSpeechRecognition;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function CampoConMicrofono({
  bloque,
  value,
  onChange,
}: {
  bloque: BloqueDiagnostico;
  value: string;
  onChange: (texto: string) => void;
}) {
  const [grabando, setGrabando] = useState(false);
  const [noSoportado, setNoSoportado] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const alternarDictado = () => {
    if (grabando) {
      recognitionRef.current?.stop();
      setGrabando(false);
      return;
    }

    const Ctor = obtenerConstructor();
    if (!Ctor) {
      setNoSoportado(true);
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "es-CO";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let textoNuevo = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        textoNuevo += event.results[i][0].transcript;
      }
      onChange(value ? `${value} ${textoNuevo}` : textoNuevo);
    };
    recognition.onerror = () => setGrabando(false);
    recognition.onend = () => setGrabando(false);

    recognition.start();
    recognitionRef.current = recognition;
    setGrabando(true);
  };

  return (
    <div className="rounded-2xl border border-border-glass bg-white/[0.02] p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{bloque.titulo}</p>
        <button
          type="button"
          onClick={alternarDictado}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
            grabando
              ? "border-red-500/50 bg-red-500/10 text-red-400"
              : "border-border-glass bg-white/[0.03] text-text-secondary hover:text-white",
          )}
        >
          {grabando ? <Square size={12} /> : <Mic size={12} />}
          {grabando ? "Detener" : "Dictar"}
        </button>
      </div>

      {noSoportado && (
        <p className="mb-2 text-xs text-amber-400">
          Tu navegador no soporta dictado por voz (funciona en Chrome/Edge). Escribe o pega el
          texto transcrito directamente.
        </p>
      )}

      <ul className="mb-3 space-y-0.5">
        {bloque.preguntasGuia.map((p) => (
          <li key={p} className="text-xs text-text-secondary">
            · {p}
          </li>
        ))}
      </ul>

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe, pega texto transcrito, o usa el dictado por voz..."
        className="w-full resize-y rounded-xl border border-border-glass bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-text-secondary/50 outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
