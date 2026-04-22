"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useProducer } from "@/hooks/useProducer";
import { getClientDictionary, locales } from "@/lib/client-dictionaries";
import type { Dictionary, Locale } from "@/lib/client-dictionaries";

/**
 * Type guard for locale values used by client-side dictionary loading.
 */
function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

// ── Icons ─────────────────────────────────────────────────────────────────────
/** Left-pointing chevron icon used in the back navigation button. */
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M10 3L5 8l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Detail row ────────────────────────────────────────────────────────────────
/**
 * Renders a labeled metadata field.
 * @param label - Localized field name shown in uppercase.
 * @param value - Field value; accepts strings or React nodes.
 */
function DetailRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="text-base font-semibold text-slate-800">{value}</p>
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────────────────────
/** Centered spinner displayed while the producer data is being fetched. */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
/**
 * Full-screen detail page for a single producer.
 * Fetches data via {@link useProducer} and renders a hero banner + metadata card.
 * Supports `en-US` and `es-MX` locales through the client dictionary.
 *
 * Route: `/{lang}/producers/{id}`
 */
export default function ProducerDetailPage({
  params,
}: {
  readonly params: Promise<{ readonly lang: string; readonly id: string }>;
}) {
  const { lang, id: rawId } = use(params);
  const id = parseInt(rawId, 10);

  const isValidLocale = isSupportedLocale(lang);
  const isValidId = !isNaN(id);

  const { producer, loading, error, refetch } = useProducer(isValidId ? id : 0);
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    if (!isValidLocale) return;
    getClientDictionary(lang as Locale).then(setDict);
  }, [lang, isValidLocale]);

  const d = dict?.producers.detail;

  // ── Invalid locale ────────────────────────────────────────────────────────
  if (!isValidLocale) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="rounded-md border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-medium text-slate-600">
          Invalid language.
        </p>
      </div>
    );
  }

  // ── Invalid ID ────────────────────────────────────────────────────────────
  if (!isValidId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="rounded-md border border-red-200 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">
          Invalid producer ID.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen -mx-4 -my-6 bg-slate-100">
      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="relative border-b border-slate-800 bg-slate-900 px-4 pb-20 pt-12">
        {/* Back button */}
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/${lang}/producers`}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeftIcon />
            <span>{d?.backLink ?? "..."}</span>
          </Link>
        </div>

        {/* Title */}
        <div className="mx-auto mt-8 max-w-5xl">
          {loading || !producer ? (
            <div className="h-10 w-64 animate-pulse rounded bg-white/10" />
          ) : (
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {producer.name}
            </h1>
          )}
        </div>
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 -mt-10 pb-12">
        <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-800">Details</h2>
          </div>

          <div className="p-6 sm:p-8">
            {loading && <LoadingSpinner />}

            {error && (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                  {d?.errorLoading ?? "Error"}: {error.message}
                </p>
                <button
                  onClick={refetch}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && !producer && (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-600">
                  {d?.notFound ?? "Producer not found."}
                </p>
                <Link
                  href={`/${lang}/producers`}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {d?.backLink ?? "Back"}
                </Link>
              </div>
            )}

            {!loading && !error && producer && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DetailRow label={d?.nameLabel ?? "Name"} value={producer.name} />
                {producer.profile && (
                  <div className="md:col-span-2 flex flex-col gap-0.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {d?.profileLabel ?? "Profile"}
                    </p>
                    <p className="text-base leading-relaxed text-slate-700">{producer.profile}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
