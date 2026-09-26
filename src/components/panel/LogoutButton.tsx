"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  const salir = async () => {
    setSaliendo(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/panel/login");
    router.refresh();
  };

  return (
    <button
      onClick={salir}
      disabled={saliendo}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
    >
      <LogOut size={16} />
      {saliendo ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}
