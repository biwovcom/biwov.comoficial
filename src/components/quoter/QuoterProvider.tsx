"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ObjetivoPrincipal } from "@/lib/clasificacion";

interface QuoterContextValue {
  isOpen: boolean;
  prefillObjetivo: ObjetivoPrincipal | null;
  open: (objetivo?: ObjetivoPrincipal) => void;
  close: () => void;
}

const QuoterContext = createContext<QuoterContextValue | null>(null);

export function QuoterProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillObjetivo, setPrefillObjetivo] = useState<ObjetivoPrincipal | null>(null);

  const open = useCallback((objetivo?: ObjetivoPrincipal) => {
    setPrefillObjetivo(objetivo ?? null);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, prefillObjetivo, open, close }),
    [isOpen, prefillObjetivo, open, close],
  );

  return (
    <QuoterContext.Provider value={value}>{children}</QuoterContext.Provider>
  );
}

export function useQuoter() {
  const ctx = useContext(QuoterContext);
  if (!ctx) throw new Error("useQuoter debe usarse dentro de QuoterProvider");
  return ctx;
}
