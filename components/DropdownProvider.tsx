"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface DropdownContextValue {
  openId: string | null;
  toggle: (id: string) => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export function DropdownProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <DropdownContext.Provider
      value={{
        openId,
        toggle: (id) => setOpenId((cur) => (cur === id ? null : id)),
        close: () => setOpenId(null),
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdown(id: string) {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("useDropdown must be used within a DropdownProvider");
  return {
    isOpen: ctx.openId === id,
    toggle: () => ctx.toggle(id),
    close: ctx.close,
  };
}
