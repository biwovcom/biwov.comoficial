import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/panel/Sidebar";

/**
 * Segunda capa de defensa además de middleware.ts: si por lo que sea llega
 * una petición sin sesión hasta aquí, la rebota igual.
 */
export default async function PanelAppLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/panel/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-base md:flex-row print:bg-white">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-10 print:p-0">
        {children}
      </main>
    </div>
  );
}
