"use client";

import { use, useEffect, useState } from "react";
import { getClientDictionary, locales, type Dictionary } from "@/lib/client-dictionaries";
import { useProducers } from "@/hooks/useProducers";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
    </div>
  );
}

export default function ProducersPage({
  params,
}: {
  readonly params: Promise<{ readonly lang: string }>;
}) {
  const { lang } = use(params);
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [dictError, setDictError] = useState(false);
  const { producers, loading, error } = useProducers();

  useEffect(() => {
    if (!locales.includes(lang as any)) {
      setDictError(true);
      return;
    }

    getClientDictionary(lang as "en-US" | "es-MX").then((resolvedDict) => {
      setDict(resolvedDict);
    });
  }, [lang]);

  if (dictError) {
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
          {producers.map((producer) => (
            <article
              key={producer.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {copy.nameColumn}
                </p>
                <h3 className="text-base font-semibold text-slate-900">{producer.name}</h3>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 lg:px-6 xl:py-4">
                  {copy.nameColumn}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {producers.map((producer) => (
                <tr key={producer.id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 lg:px-6 lg:py-4 xl:text-base">
                    {producer.name}
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
            {copy.title}
          </h1>
          <p className="text-sm text-slate-600">{copy.subtitle}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-slate-900">{copy.featuredTitle}</h2>
          <p className="mt-1 text-sm text-slate-600">{copy.featuredSubtitle}</p>
        </div>

        {renderContent()}
      </div>
    </section>
  );
}
