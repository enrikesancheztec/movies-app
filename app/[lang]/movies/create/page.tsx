"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateMovie } from "@/hooks/useCreateMovie";
import { useProducers } from "@/hooks/useProducers";
import { MOVIE_RATINGS } from "@/types/movie-rating";
import {
  getClientDictionary,
  locales,
  type Dictionary,
  type Locale,
} from "@/lib/client-dictionaries";

function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export default function CreateMoviePage({
  params,
}: {
  readonly params: Promise<{ readonly lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [dict, setDict] = useState<Dictionary | null>(null);
  const { values, isSubmitting, setField, submit } = useCreateMovie();
  const { producers, loading: producersLoading } = useProducers();

  const invalidLocale = !isSupportedLocale(lang);

  useEffect(() => {
    if (!isSupportedLocale(lang)) {
      return;
    }
    getClientDictionary(lang).then((resolvedDict) => {
      setDict(resolvedDict);
    });
  }, [lang]);

  if (!dict) return null;

  if (invalidLocale) {
    return (
      <main>
        <p>{dict.movies.create.invalidLanguage}</p>
      </main>
    );
  }

  const c = dict.movies.create;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const movie = await submit();
    if (movie) {
      router.push(`/${lang}`);
    }
  }

  return (
    <main>
      <h1>{c.title}</h1>
      <p>{c.subtitle}</p>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="name">{c.nameLabel}</label>
          <input
            id="name"
            type="text"
            placeholder={c.namePlaceholder}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="launchDate">{c.launchDateLabel}</label>
          <input
            id="launchDate"
            type="date"
            value={values.launchDate}
            onChange={(e) => setField("launchDate", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="duration">{c.durationLabel}</label>
          <input
            id="duration"
            type="number"
            min={1}
            value={values.duration}
            onChange={(e) => setField("duration", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="rating">{c.ratingLabel}</label>
          <select
            id="rating"
            value={values.rating}
            onChange={(e) => setField("rating", e.target.value)}
          >
            <option value="">{c.ratingPlaceholder}</option>
            {MOVIE_RATINGS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="producerId">{c.producerLabel}</label>
          <select
            id="producerId"
            value={values.producerId}
            disabled={producersLoading}
            onChange={(e) => setField("producerId", e.target.value)}
          >
            <option value="">
              {producersLoading ? c.producersLoading : c.producerPlaceholder}
            </option>
            {producers.map((p) => (
              <option key={p.id} value={String(p.id)}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">{c.descriptionLabel}</label>
          <textarea
            id="description"
            placeholder={c.descriptionPlaceholder}
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
          />
          <small>{c.descriptionHelper}</small>
        </div>

        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? c.saving : c.save}
          </button>
          <button type="button" onClick={() => router.push(`/${lang}`)}>
            {c.cancel}
          </button>
        </div>

      </form>
    </main>
  );
}
