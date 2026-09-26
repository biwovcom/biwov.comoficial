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
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 md:p-10">{children}</main>
    </div>
  );
}
