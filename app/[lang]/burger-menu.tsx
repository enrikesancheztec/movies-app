"use client";

import { useRef } from "react";
import Link from "next/link";

interface BurgerMenuProps {
  readonly lang: string;
  readonly openMenuLabel: string;
  readonly navigationLabel: string;
  readonly moviesLabel: string;
  readonly producersLabel: string;
}

/**
 * Mobile/desktop burger menu that closes after selecting a navigation option.
 */
export function BurgerMenu({
  lang,
  openMenuLabel,
  navigationLabel,
  moviesLabel,
  producersLabel,
}: BurgerMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  /** Programmatically closes the dropdown after selecting a navigation link. */
  const closeMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className="relative">
      <summary
        aria-label={openMenuLabel}
        title={openMenuLabel}
        className="flex h-10 w-10 cursor-pointer list-none flex-col items-center justify-center gap-1.5 rounded border border-white/40 bg-white/10 transition hover:bg-white/20 [&::-webkit-details-marker]:hidden"
      >
        <span className="h-0.5 w-5 bg-white" />
        <span className="h-0.5 w-5 bg-white" />
        <span className="h-0.5 w-5 bg-white" />
      </summary>
      <div className="absolute left-0 top-12 z-20 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {navigationLabel}
        </p>
        <div className="flex flex-col gap-1">
          <Link
            href={`/${lang}`}
            onClick={closeMenu}
            className="rounded px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {moviesLabel}
          </Link>
          <Link
            href={`/${lang}/producers`}
            onClick={closeMenu}
            className="rounded px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {producersLabel}
          </Link>
        </div>
      </div>
    </details>
  );
}
