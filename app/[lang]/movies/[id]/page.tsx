"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { MovieRating } from "@/types/movie-rating";
import { useMovie } from "@/hooks/useMovie";
import { getClientDictionary, locales } from "@/lib/client-dictionaries";

// ── Rating badge ──────────────────────────────────────────────────────────────
const RATING_STYLES: Record<MovieRating, string> = {
  G: "bg-green-100 text-green-800 border border-green-300",
  PG: "bg-blue-100 text-blue-800 border border-blue-300",
  PG_13: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  R: "bg-orange-100 text-orange-800 border border-orange-300",
  NC_17: "bg-red-100 text-red-800 border border-red-300",
};

/**
 * Displays a color-coded MPAA rating badge.
 * Colors: G → green, PG → blue, PG-13 → yellow, R → orange, NC-17 → red.
 */
function RatingBadge({ rating }: { readonly rating: MovieRating }) {
  const label = rating.replace("_", "-");
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${RATING_STYLES[rating]}`}
    >
      {label}
    </span>
  );
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
 * @param value - Field value; accepts strings or React nodes (e.g. badges).
 */
function DetailRow({ label, value }: { readonly label: string; readonly value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="text-base font-semibold text-slate-800">{value}</p>
    </div>
  );
}

// ── Loading spinner ───────────────────────────────────────────────────────────
/** Centered spinner displayed while the movie data is being fetched. */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
/**
 * Full-screen detail page for a single movie.
 * Fetches data via {@link useMovie} and renders a hero banner + metadata card.
 * Supports `en-US` and `es-MX` locales through the client dictionary.
 *
 * Route: `/{lang}/movies/{id}`
 */
export default function MovieDetailPage({
  params,
}: {
  readonly params: Promise<{ readonly lang: string; readonly id: string }>;
}) {
  const { lang, id } = use(params);
  const { movie, loading, error } = useMovie(Number(id));
  const [dict, setDict] = useState<Awaited<ReturnType<typeof getClientDictionary>> | null>(null);

  useEffect(() => {
    if (!locales.includes(lang as never)) return;
    getClientDictionary(lang as "en-US" | "es-MX").then(setDict);
  }, [lang]);

  const d = dict?.detail;
  const locale = lang === "es-MX" ? "es-MX" : "en-US";

  return (
    <div className="min-h-screen -mx-4 -my-6 bg-slate-100">
      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="relative border-b border-slate-800 bg-slate-900 px-4 pb-20 pt-12">
        {/* Back button */}
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeftIcon />
            <span>{d?.backAction ?? "..."}</span>
          </Link>
        </div>

        {/* Title */}
        <div className="mx-auto mt-8 max-w-5xl">
          {loading || !movie ? (
            <div className="h-10 w-64 animate-pulse rounded bg-white/10" />
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-300">
                {new Date(movie.launchDate).getFullYear()}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {movie.name}
              </h1>
              <div className="mt-4">
                <RatingBadge rating={movie.rating} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 -mt-10 pb-12">
        <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
            <h2 className="text-lg font-semibold text-slate-800">{d?.titleLabel ?? "Details"}</h2>
          </div>

          <div className="p-6 sm:p-8">
          {loading && <LoadingSpinner />}

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
              {d?.errorLoading ?? "Error"}: {error.message}
            </p>
          )}

          {!loading && !error && !movie && (
            <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-600">
              {d?.notFound}
            </p>
          )}

          {!loading && !error && movie && (
            <>
              {/* Metadata grid: 1 col on mobile, 2 col on sm+ */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DetailRow label={d?.titleLabel ?? ""} value={movie.name} />
                <DetailRow
                  label={d?.releaseDateLabel ?? ""}
                  value={new Date(movie.launchDate).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
                <DetailRow
                  label={d?.durationLabel ?? ""}
                  value={`${movie.duration} ${d?.durationUnit ?? "min"}`}
                />
                <DetailRow
                  label={d?.ratingLabel ?? ""}
                  value={<RatingBadge rating={movie.rating} />}
                />
              </div>

              <hr className="my-6 border-slate-200" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {d?.descriptionLabel}
                </p>
                <p className="mt-2 leading-relaxed text-slate-700">{movie.description}</p>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
