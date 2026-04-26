"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
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

function SaveIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M3 2.75h8.5L13.25 4.5v8.75H3V2.75Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M5.25 2.75V6h5V2.75" stroke="currentColor" strokeWidth="1.25" />
      <rect x="5" y="9" width="6" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function inputClass(hasError: boolean) {
  return `block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
      : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
  }`;
}

export default function CreateMoviePage({
  params,
}: {
  readonly params: Promise<{ readonly lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { values, errors, isSubmitting, submitError, setField, submit, cancel } = useCreateMovie();
  const { producers, loading: producersLoading } = useProducers();

  const nameRef = useRef<HTMLInputElement | null>(null);
  const launchDateRef = useRef<HTMLInputElement | null>(null);
  const durationRef = useRef<HTMLInputElement | null>(null);
  const ratingRef = useRef<HTMLSelectElement | null>(null);
  const producerRef = useRef<HTMLSelectElement | null>(null);

  const invalidLocale = !isSupportedLocale(lang);

  useEffect(() => {
    if (!isSupportedLocale(lang)) return;
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  // Focus first invalid field after a failed submit attempt
  useEffect(() => {
    if (!hasSubmitted) return;
    if (errors.name) { nameRef.current?.focus(); return; }
    if (errors.launchDate) { launchDateRef.current?.focus(); return; }
    if (errors.duration) { durationRef.current?.focus(); return; }
    if (errors.rating) { ratingRef.current?.focus(); return; }
    if (errors.producerId) { producerRef.current?.focus(); }
  }, [errors.name, errors.launchDate, errors.duration, errors.rating, errors.producerId, hasSubmitted]);

  const translateError = useCallback(
    (message?: string): string | undefined => {
      if (!message || !dict) return message;
      const v = dict.movies.create.validation;
      if (message === "Title is required") return v.nameRequired;
      if (message === "Release date is required") return v.launchDateRequired;
      if (message === "Duration is required") return v.durationRequired;
      if (message === "Duration must be a positive number") return v.durationPositive;
      if (message === "Please select a rating") return v.ratingRequired;
      if (message === "Please select a producer") return v.producerRequired;
      if (message.startsWith("Description must be at most")) return v.descriptionMaxLength;
      return message;
    },
    [dict]
  );

  if (invalidLocale) {
    return (
      <section className="space-y-6">
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-red-600">{dict?.movies.create.invalidLanguage ?? "Invalid language"}</p>
        </div>
      </section>
    );
  }

  if (!dict) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        </div>
      </section>
    );
  }

  const c = dict.movies.create;
  const hasErrors = Object.keys(errors).length > 0;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasSubmitted(true);
    const movie = await submit();
    if (movie) {
      router.push(`/${lang}`);
    }
  }

  function handleCancel() {
    cancel();
    router.push(`/${lang}`);
  }

  return (
    <section className="space-y-6">
      {/* Page header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          {dict.home.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {c.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{c.subtitle}</p>
      </div>

      {/* Form card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6 lg:p-8">

          {/* Error summary banner */}
          {hasSubmitted && hasErrors && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              <p className="font-semibold">Please review the highlighted fields before saving.</p>
              {errors.name && (
                <button type="button" onClick={() => nameRef.current?.focus()} className="mt-2 block text-left underline underline-offset-2">
                  • {translateError(errors.name)}
                </button>
              )}
              {errors.launchDate && (
                <button type="button" onClick={() => launchDateRef.current?.focus()} className="mt-1 block text-left underline underline-offset-2">
                  • {translateError(errors.launchDate)}
                </button>
              )}
              {errors.duration && (
                <button type="button" onClick={() => durationRef.current?.focus()} className="mt-1 block text-left underline underline-offset-2">
                  • {translateError(errors.duration)}
                </button>
              )}
              {errors.rating && (
                <button type="button" onClick={() => ratingRef.current?.focus()} className="mt-1 block text-left underline underline-offset-2">
                  • {translateError(errors.rating)}
                </button>
              )}
              {errors.producerId && (
                <button type="button" onClick={() => producerRef.current?.focus()} className="mt-1 block text-left underline underline-offset-2">
                  • {translateError(errors.producerId)}
                </button>
              )}
              {errors.description && (
                <p className="mt-1">• {translateError(errors.description)}</p>
              )}
            </div>
          )}

          {/* Row 1: Title + Release Date */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
                {c.nameLabel} <span className="text-red-600">*</span>
              </label>
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                autoComplete="off"
                placeholder={c.namePlaceholder}
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClass(Boolean(errors.name))}
              />
              {errors.name && (
                <p id="name-error" className="text-sm font-medium text-red-600" aria-live="polite">
                  {translateError(errors.name)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="launchDate" className="block text-sm font-semibold text-slate-800">
                {c.launchDateLabel} <span className="text-red-600">*</span>
              </label>
              <input
                ref={launchDateRef}
                id="launchDate"
                name="launchDate"
                type="date"
                value={values.launchDate}
                onChange={(e) => setField("launchDate", e.target.value)}
                aria-invalid={Boolean(errors.launchDate)}
                aria-describedby={errors.launchDate ? "launchDate-error" : undefined}
                className={inputClass(Boolean(errors.launchDate))}
              />
              {errors.launchDate && (
                <p id="launchDate-error" className="text-sm font-medium text-red-600" aria-live="polite">
                  {translateError(errors.launchDate)}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Duration + Rating */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-semibold text-slate-800">
                {c.durationLabel} <span className="text-red-600">*</span>
              </label>
              <input
                ref={durationRef}
                id="duration"
                name="duration"
                type="number"
                min={1}
                value={values.duration}
                onChange={(e) => setField("duration", e.target.value)}
                aria-invalid={Boolean(errors.duration)}
                aria-describedby={errors.duration ? "duration-error" : undefined}
                className={inputClass(Boolean(errors.duration))}
              />
              {errors.duration && (
                <p id="duration-error" className="text-sm font-medium text-red-600" aria-live="polite">
                  {translateError(errors.duration)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="rating" className="block text-sm font-semibold text-slate-800">
                {c.ratingLabel} <span className="text-red-600">*</span>
              </label>
              <select
                ref={ratingRef}
                id="rating"
                name="rating"
                value={values.rating}
                onChange={(e) => setField("rating", e.target.value)}
                aria-invalid={Boolean(errors.rating)}
                aria-describedby={errors.rating ? "rating-error" : undefined}
                className={inputClass(Boolean(errors.rating))}
              >
                <option value="">{c.ratingPlaceholder}</option>
                {MOVIE_RATINGS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.rating && (
                <p id="rating-error" className="text-sm font-medium text-red-600" aria-live="polite">
                  {translateError(errors.rating)}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Producer (full width) */}
          <div className="space-y-2">
            <label htmlFor="producerId" className="block text-sm font-semibold text-slate-800">
              {c.producerLabel} <span className="text-red-600">*</span>
            </label>
            <select
              ref={producerRef}
              id="producerId"
              name="producerId"
              value={values.producerId}
              disabled={producersLoading}
              onChange={(e) => setField("producerId", e.target.value)}
              aria-invalid={Boolean(errors.producerId)}
              aria-describedby={errors.producerId ? "producerId-error" : undefined}
              className={inputClass(Boolean(errors.producerId))}
            >
              <option value="">
                {producersLoading ? c.producersLoading : c.producerPlaceholder}
              </option>
              {producers.map((p) => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>
            {errors.producerId && (
              <p id="producerId-error" className="text-sm font-medium text-red-600" aria-live="polite">
                {translateError(errors.producerId)}
              </p>
            )}
          </div>

          {/* Row 4: Description (full width) */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-800">
              {c.descriptionLabel}
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              maxLength={1000}
              placeholder={c.descriptionPlaceholder}
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "description-error" : "description-help"}
              className={inputClass(Boolean(errors.description))}
            />
            <div className="flex items-center justify-between">
              <p id="description-help" className="text-xs text-slate-500">{c.descriptionHelper}</p>
              <p className="text-xs text-slate-500">{values.description.length}/1000</p>
            </div>
            {errors.description && (
              <p id="description-error" className="text-sm font-medium text-red-600" aria-live="polite">
                {translateError(errors.description)}
              </p>
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {submitError.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <CancelIcon />
              <span>{c.cancel}</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <SaveIcon />
              <span>{isSubmitting ? c.saving : c.save}</span>
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}

