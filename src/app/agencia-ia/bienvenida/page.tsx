import type { Metadata } from "next";
import { FooterClaro, HeaderClaro } from "@/components/claro/ChromeClaro";
import { PORTAL_CLIENTES } from "@/data/hotmart";

export const metadata: Metadata = {
  title: "¡Bienvenido a biwov Agentes! | biwov",
  description: "Tu compra quedó lista. Así entras a tu oficina de agentes de IA.",
  robots: { index: false },
};

const PASOS = [
  { t: "Revisa tu correo", p: "Hotmart te envió el comprobante de tu compra. Usa ese mismo correo para entrar." },
  { t: "Entra a tu oficina", p: "Toca el botón de abajo y elige \"Primera vez: crear mi cuenta\". Escribe el correo de tu compra y crea tu contraseña." },
  { t: "Haz el recorrido", p: "Allen, tu coordinador, te muestra en un minuto para qué sirve cada botón." },
  { t: "Cuéntanos de tu marca", p: "Responde el cuestionario de inicio: con eso tu equipo construye la memoria de tu marca y empieza a trabajar." },
];

export default function Bienvenida() {
  return (
    <div className="min-h-screen bg-white text-[#0a2642]">
      <HeaderClaro cta="Soporte" mensaje="Hola, acabo de comprar biwov Agentes y necesito ayuda para entrar." />
      <section className="bg-[#0a2642] px-5 py-20 text-center text-white">
        <span className="rounded-full bg-[#c6f432] px-4 py-1 text-sm font-bold text-[#0a2642]">Compra confirmada</span>
        <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-extrabold md:text-6xl">
          ¡Bienvenido a tu agencia de agentes<span className="text-[#c6f432]">_</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">Tu oficina se está preparando. En pocos minutos puedes entrar con el correo de tu compra.</p>
        <a href={PORTAL_CLIENTES} className="mt-9 inline-flex rounded-full bg-[#c6f432] px-9 py-4 font-bold text-[#0a2642] transition-transform hover:-translate-y-0.5">
          Entrar a mi oficina →
        </a>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {PASOS.map((s, i) => (
            <div key={s.t} className="flex gap-4 rounded-2xl border border-[#0a2642]/10 p-6">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#c6f432] font-heading font-extrabold">{i + 1}</span>
              <div>
                <h2 className="font-heading text-xl font-extrabold">{s.t}</h2>
                <p className="mt-1 text-[#0a2642]/65">{s.p}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#0a2642]/60">
          Si en 15 minutos no puedes entrar, escríbenos por WhatsApp y te ayudamos.
        </p>
      </section>
      <FooterClaro />
    </div>
  );
}
