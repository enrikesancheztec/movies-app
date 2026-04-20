"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  getClientDictionary,
  locales,
  type Dictionary,
  type Locale,
} from "@/lib/client-dictionaries";
import { useProducers } from "@/hooks/useProducers";

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

/**
 * Reusable loading indicator for async producers UI states.
 */
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
    </div>
  );
}

/**
 * Type guard for locale values used by client-side dictionary loading.
 */
function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Localized producers listing page.
 */
export default function ProducersPage({
  params,
}: {
  readonly params: Promise<{ readonly lang: string }>;
}) {
  const { lang } = use(params);
  const [dict, setDict] = useState<Dictionary | null>(null);
  const { producers, loading, error } = useProducers();
  const invalidLocale = !isSupportedLocale(lang);

  useEffect(() => {
    if (!isSupportedLocale(lang)) {
      return;
    }

    getClientDictionary(lang).then((resolvedDict) => {
      setDict(resolvedDict);
    });
  }, [lang]);

  if (invalidLocale) {
    return (
      <section className="space-y-6">
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-red-600">
            {dict?.producers.invalidLanguage ?? "Invalid language"}
          </p>
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

  const copy = dict.producers;

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="px-5 py-8 text-center">
          <p className="text-sm font-medium text-red-600">
            {copy.errorLoading}: {error.message}
          </p>
        </div>
      );
    }

    if (producers.length === 0) {
      return (
        <div className="px-5 py-8 text-center">
          <p className="text-sm font-medium text-slate-600">{copy.emptyState}</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid gap-4 p-4 md:hidden">
          {producers.map((producer, index) => {
            const key = `${producer.id ?? "no-id"}-${producer.name}-${index}`;
            const rowTestId =
              producer.id !== undefined ? `producer-row-${producer.id}` : `producer-row-no-id-${index}`;

            return (
              <article
                key={key}
                data-testid={rowTestId}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.nameColumn}
                  </p>
                  <h3 className="text-base font-semibold text-slate-900">{producer.name}</h3>
                </div>

                {producer.id !== undefined && (
                  <div className="mt-4 flex justify-end">
                    <Link
                      data-testid="view-producer-details"
                      href={`/${lang}/producers/${producer.id}`}
                      title={`${dict.home.detailsTooltip} ${producer.name}`}
                      aria-label={`${dict.home.detailsTooltip} ${producer.name}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                    >
                      <EyeIcon />
                      <span>{dict.home.detailsAction}</span>
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {copy.nameColumn}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {dict.home.actionColumn}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {producers.map((producer, index) => {
                const key = `${producer.id ?? "no-id"}-${producer.name}-${index}`;
                const rowTestId =
                  producer.id !== undefined ? `producer-row-${producer.id}` : `producer-row-no-id-${index}`;

                return (
                  <tr key={key} data-testid={rowTestId} className="transition hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 lg:px-6 lg:py-4 xl:text-base">
                      {producer.name}
                    </td>
                    <td className="px-4 py-3 text-right lg:px-6 lg:py-4">
                      {producer.id !== undefined && (
                        <Link
                          data-testid="view-producer-details"
                          href={`/${lang}/producers/${producer.id}`}
                          title={`${dict.home.detailsTooltip} ${producer.name}`}
                          aria-label={`${dict.home.detailsTooltip} ${producer.name}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600 xl:px-4"
                        >
                          <EyeIcon />
                          <span>{dict.home.detailsAction}</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
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
            {copy.title}
          </h1>
          <p className="text-sm text-slate-600">{copy.subtitle}</p>
        </div>
        <Link
          href={`/${lang}/producers/create`}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 whitespace-nowrap"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
            <path
              d="M8 1.5v13m6.5-6.5h-13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>{copy.title.includes("Crear") ? "Crear Productor" : "Create Producer"}</span>
        </Link>
      </div>

      <div
        data-testid="producers-list"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-slate-900">{copy.featuredTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{copy.featuredSubtitle}</p>
        </div>

        {renderContent()}
      </div>
    </section>
  );
}
