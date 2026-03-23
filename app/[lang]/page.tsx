"use client";

import { getClientDictionary, locales } from "@/lib/client-dictionaries";
import { useMovies } from "@/hooks/useMovies";
import { use, useEffect, useState } from "react";

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M8 3.25V12.75M3.25 8H12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M1.75 8C2.95 5.75 5.17 4.25 8 4.25C10.83 4.25 13.05 5.75 14.25 8C13.05 10.25 10.83 11.75 8 11.75C5.17 11.75 2.95 10.25 1.75 8Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.75" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
    </div>
  );
}

export default function Home({
  params,
}: {
  readonly params: Promise<{ readonly lang: string }>;
}) {
  const { lang } = use(params);
  const [dict, setDict] = useState<any>(null);
  const [dictError, setDictError] = useState(false);
  const { movies, loading, error } = useMovies();

  useEffect(() => {
    // Load dictionary on client side
    if (!locales.includes(lang as any)) {
      setDictError(true);
      return;
    }

    getClientDictionary(lang as "en-US" | "es-MX").then((d) => {
      setDict(d);
    });
  }, [lang]);

  if (dictError) {
    return (
      <section className="space-y-6">
        <div className="text-center py-12">
          <p className="text-sm font-medium text-red-600">Invalid language</p>
        </div>
      </section>
    );
  }

  if (!dict) {
    return (
      <section className="space-y-6">
        <LoadingSpinner />
      </section>
    );
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="px-5 py-8 text-center">
          <p className="text-sm font-medium text-red-600">
            Error loading movies: {error.message}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid gap-4 p-4 md:hidden">
          {movies.map((movie) => (
            <article
              key={movie.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {dict.home.movieColumn}
                </p>
                <h3 className="text-base font-semibold text-slate-900">{movie.name}</h3>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {dict.home.yearColumn}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{new Date(movie.launchDate).getFullYear()}</p>
                </div>

                <button
                  type="button"
                  title={`${dict.home.detailsTooltip} ${movie.name}`}
                  aria-label={`${dict.home.detailsTooltip} ${movie.name}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  <EyeIcon />
                  <span>{dict.home.detailsAction}</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {dict.home.movieColumn}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {dict.home.yearColumn}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {dict.home.actionColumn}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {movies.map((movie) => (
                <tr key={movie.id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 lg:px-6 lg:py-4 xl:text-base">
                    {movie.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 lg:px-6 lg:py-4 xl:text-base">
                    {new Date(movie.launchDate).getFullYear()}
                  </td>
                  <td className="px-4 py-3 text-right lg:px-6 lg:py-4">
                    <button
                      type="button"
                      title={`${dict.home.detailsTooltip} ${movie.name}`}
                      aria-label={`${dict.home.detailsTooltip} ${movie.name}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600 xl:px-4"
                    >
                      <EyeIcon />
                      <span>{dict.home.detailsAction}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            {dict.home.eyebrow}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {dict.home.title}
          </h1>
          <p className="text-sm text-slate-600">{dict.home.subtitle}</p>
        </div>

        <button
          type="button"
          title={dict.home.createMovieTooltip}
          aria-label={dict.home.createMovieTooltip}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <PlusIcon />
          <span>{dict.home.createMovie}</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-slate-900">{dict.home.featuredTitle}</h2>
          <p className="mt-1 text-sm text-slate-500">{dict.home.featuredSubtitle}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            {dict.home.responsiveHint}
          </p>
        </div>

        {renderContent()}
      </div>
    </section>
  );
}