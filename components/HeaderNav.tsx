"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { BRUTAL_BORDER, BRUTAL_PILL, BRUTAL_SHADOW } from "@/lib/ui";
import { useDropdown } from "./DropdownProvider";

export function HeaderNav({
  signedIn,
  cartCount,
  authSlot,
}: {
  signedIn: boolean;
  cartCount: number;
  authSlot: ReactNode;
}) {
  const { isOpen: open, toggle, close } = useDropdown("header-nav");

  if (!signedIn) {
    return <div className="flex-none">{authSlot}</div>;
  }

  return (
    <>
      <nav className="hidden items-center gap-2 sm:flex">
        <Link
          href="/panier"
          className={`flex items-center gap-1.5 bg-[#9FD8F5] px-4 py-2 text-sm ${BRUTAL_PILL}`}
        >
          🛒 Panier
          {cartCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#14110F] text-xs text-white">
              {cartCount}
            </span>
          )}
        </Link>
        <Link href="/recipes/new" className={`bg-[#FFD53D] px-4 py-2 text-sm ${BRUTAL_PILL}`}>
          + Ajouter
        </Link>
        {authSlot}
      </nav>

      <div className="relative sm:hidden">
        <button
          type="button"
          onClick={toggle}
          aria-label="Menu"
          className={`relative flex h-10 w-10 flex-none items-center justify-center bg-white text-lg ${BRUTAL_PILL}`}
        >
          ☰
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#14110F] text-[10px] text-white">
              {cartCount}
            </span>
          )}
        </button>

        {open && (
          <div
            className={`absolute right-0 top-full z-20 mt-2 flex w-52 flex-col gap-2 rounded-2xl bg-white p-3 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}
          >
            <Link
              href="/panier"
              onClick={close}
              className={`flex items-center justify-between bg-[#9FD8F5] px-4 py-2 text-sm ${BRUTAL_PILL}`}
            >
              🛒 Panier
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#14110F] text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/recipes/new"
              onClick={close}
              className={`bg-[#FFD53D] px-4 py-2 text-center text-sm ${BRUTAL_PILL}`}
            >
              + Ajouter
            </Link>
            <div onClick={close}>{authSlot}</div>
          </div>
        )}
      </div>
    </>
  );
}
