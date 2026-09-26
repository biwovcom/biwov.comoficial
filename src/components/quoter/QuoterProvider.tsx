"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface QuoterContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const QuoterContext = createContext<QuoterContextValue | null>(null);

export function QuoterProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <QuoterContext.Provider value={value}>{children}</QuoterContext.Provider>;
}

export function useQuoter() {
  const ctx = useContext(QuoterContext);
  if (!ctx) throw new Error("useQuoter debe usarse dentro de QuoterProvider");
  return ctx;
}
