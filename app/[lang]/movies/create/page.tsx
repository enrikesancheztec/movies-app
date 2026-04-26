"use client";

import { use, useEffect, useRef, useState } from "react";
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
import { MAX_DESCRIPTION_LENGTH } from "@/utils/movie-validator";

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

type SummaryItem = {
  key: string;
  text?: string;
  onFocus: () => void;
};

function FieldError({ id, text }: { readonly id: string; readonly text?: string }) {
  if (!text) {
    return null;
  }

  return (
    <p id={id} className="text-sm font-medium text-red-600" aria-live="polite">
      {text}
    </p>
  );
}

function ErrorSummary({ show, items }: { readonly show: boolean; readonly items: ReadonlyArray<SummaryItem> }) {
  if (!show) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
    >
      <p className="font-semibold">Please review the highlighted fields before saving.</p>
      {items.map((item, index) => {
        if (!item.text) {
          return null;
        }

        return (
          <button
            key={item.key}
            type="button"
            onClick={item.onFocus}
            className={`${index === 0 ? "mt-2" : "mt-1"} block text-left underline underline-offset-2`}
          >
            • {item.text}
          </button>
        );
      })}
    </div>
  );
}

function translateMovieValidationError(dict: Dictionary | null, message?: string): string | undefined {
  if (!message || !dict) {
    return message;
  }

  const v = dict.movies.create.validation;
  const exactMessages: Record<string, string> = {
    "Title is required": v.nameRequired,
    "Release date is required": v.launchDateRequired,
    "Duration is required": v.durationRequired,
    "Duration must be a positive number": v.durationPositive,
    "Please select a rating": v.ratingRequired,
    "Please select a producer": v.producerRequired,
  };

  if (exactMessages[message]) {
    return exactMessages[message];
  }

  if (message.startsWith("Description must be at most")) {
    return v.descriptionMaxLength;
  }

  return message;
}

export default function CreateMoviePage({
  params,
}: {
  readonly params: Promise<{ readonly lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [dict, setDict] = useState<Dictionary | null>(null);

  const {
    values,
    errors,
    isValid,
    isSubmitting,
    submitError,
    setField,
    touchField,
    submit,
    cancel,
  } = useCreateMovie();

  const { producers, loading: producersLoading } = useProducers();

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const launchDateInputRef = useRef<HTMLInputElement | null>(null);
  const durationInputRef = useRef<HTMLInputElement | null>(null);
  const ratingInputRef = useRef<HTMLSelectElement | null>(null);
  const producerInputRef = useRef<HTMLSelectElement | null>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const invalidLocale = !isSupportedLocale(lang);

  const translateValidationError = (message?: string): string | undefined =>
    translateMovieValidationError(dict, message);

  useEffect(() => {
    if (!isSupportedLocale(lang)) {
      return;
    }

    getClientDictionary(lang).then((resolvedDict) => {
      setDict(resolvedDict);
    });
  }, [lang]);

  useEffect(() => {
    if (!hasSubmitted) {
      return;
    }

    const firstInvalidRef = [
      { hasError: Boolean(errors.name), ref: nameInputRef },
      { hasError: Boolean(errors.launchDate), ref: launchDateInputRef },
      { hasError: Boolean(errors.duration), ref: durationInputRef },
      { hasError: Boolean(errors.rating), ref: ratingInputRef },
      { hasError: Boolean(errors.producerId), ref: producerInputRef },
    ].find((field) => field.hasError)?.ref;

    if (firstInvalidRef) {
      firstInvalidRef.current?.focus();
    }
  }, [errors.name, errors.launchDate, errors.duration, errors.rating, errors.producerId, hasSubmitted]);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    const created = await submit();

    if (created) {
      router.push(`/${lang}`);
    }
  };

  const handleCancel = () => {
    cancel();
    router.push(`/${lang}`);
  };

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

  const copy = dict.movies.create;
  const nameErrorText = translateValidationError(errors.name);
  const launchDateErrorText = translateValidationError(errors.launchDate);
  const durationErrorText = translateValidationError(errors.duration);
  const ratingErrorText = translateValidationError(errors.rating);
  const producerIdErrorText = translateValidationError(errors.producerId);
  const descriptionErrorText = translateValidationError(errors.description);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          {dict.home.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {copy.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {copy.subtitle}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6 lg:p-8">
          <ErrorSummary
            show={Boolean(
              hasSubmitted
                && (nameErrorText
                  || launchDateErrorText
                  || durationErrorText
                  || ratingErrorText
                  || producerIdErrorText
                  || descriptionErrorText)
            )}
            items={[
              { key: "name", text: nameErrorText, onFocus: () => nameInputRef.current?.focus() },
              { key: "launchDate", text: launchDateErrorText, onFocus: () => launchDateInputRef.current?.focus() },
              { key: "duration", text: durationErrorText, onFocus: () => durationInputRef.current?.focus() },
              { key: "rating", text: ratingErrorText, onFocus: () => ratingInputRef.current?.focus() },
              { key: "producer", text: producerIdErrorText, onFocus: () => producerInputRef.current?.focus() },
              { key: "description", text: descriptionErrorText, onFocus: () => descriptionInputRef.current?.focus() },
            ]}
          />

          {/* Row 1: Title + Release Date */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
                {copy.nameLabel} <span className="text-red-600">*</span>
              </label>
              <p id="name-help" className="text-xs text-slate-500">
                This field is required.
              </p>
              <input
                ref={nameInputRef}
                data-testid="movie-name-input"
                id="name"
                name="name"
                type="text"
                required
                autoComplete="off"
                value={values.name}
                onChange={(event) => setField("name", event.target.value)}
                onBlur={() => touchField("name")}
                placeholder={copy.namePlaceholder}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={nameErrorText ? "name-help name-error" : "name-help"}
                className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                    : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
                }`}
              />
              <FieldError id="name-error" text={nameErrorText} />
            </div>

            <div className="space-y-2">
              <label htmlFor="launchDate" className="block text-sm font-semibold text-slate-800">
                {copy.launchDateLabel} <span className="text-red-600">*</span>
              </label>
              <input
                ref={launchDateInputRef}
                data-testid="movie-launch-date-input"
                id="launchDate"
                name="launchDate"
                type="date"
                required
                value={values.launchDate}
                onChange={(event) => setField("launchDate", event.target.value)}
                onBlur={() => touchField("launchDate")}
                aria-invalid={Boolean(errors.launchDate)}
                aria-describedby={launchDateErrorText ? "launchDate-error" : undefined}
                className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                  errors.launchDate
                    ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                    : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
                }`}
              />
              <FieldError id="launchDate-error" text={launchDateErrorText} />
            </div>
          </div>

          {/* Row 2: Duration + Rating */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-semibold text-slate-800">
                {copy.durationLabel} <span className="text-red-600">*</span>
              </label>
              <input
                ref={durationInputRef}
                data-testid="movie-duration-input"
                id="duration"
                name="duration"
                type="number"
                required
                min={1}
                value={values.duration}
                onChange={(event) => setField("duration", event.target.value)}
                onBlur={() => touchField("duration")}
                aria-invalid={Boolean(errors.duration)}
                aria-describedby={durationErrorText ? "duration-error" : undefined}
                className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                  errors.duration
                    ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                    : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
                }`}
              />
              <FieldError id="duration-error" text={durationErrorText} />
            </div>

            <div className="space-y-2">
              <label htmlFor="rating" className="block text-sm font-semibold text-slate-800">
                {copy.ratingLabel} <span className="text-red-600">*</span>
              </label>
              <select
                ref={ratingInputRef}
                data-testid="movie-rating-select"
                id="rating"
                name="rating"
                required
                value={values.rating}
                onChange={(event) => setField("rating", event.target.value)}
                onBlur={() => touchField("rating")}
                aria-invalid={Boolean(errors.rating)}
                aria-describedby={ratingErrorText ? "rating-error" : undefined}
                className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                  errors.rating
                    ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                    : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
                }`}
              >
                <option value="">{copy.ratingPlaceholder}</option>
                {MOVIE_RATINGS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <FieldError id="rating-error" text={ratingErrorText} />
            </div>
          </div>

          {/* Row 3: Producer (full width) */}
          <div className="space-y-2">
            <label htmlFor="producerId" className="block text-sm font-semibold text-slate-800">
              {copy.producerLabel} <span className="text-red-600">*</span>
            </label>
            <select
              ref={producerInputRef}
              data-testid="movie-producer-select"
              id="producerId"
              name="producerId"
              required
              value={values.producerId}
              disabled={producersLoading}
              onChange={(event) => setField("producerId", event.target.value)}
              onBlur={() => touchField("producerId")}
              aria-invalid={Boolean(errors.producerId)}
              aria-describedby={producerIdErrorText ? "producerId-error" : undefined}
              className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                errors.producerId
                  ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                  : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
              }`}
            >
              <option value="">
                {producersLoading ? copy.producersLoading : copy.producerPlaceholder}
              </option>
              {producers.map((p) => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>
            <FieldError id="producerId-error" text={producerIdErrorText} />
          </div>

          {/* Row 4: Description (full width) */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-800">
              {copy.descriptionLabel}
            </label>
            <textarea
              ref={descriptionInputRef}
              data-testid="movie-description-input"
              id="description"
              name="description"
              rows={5}
              maxLength={MAX_DESCRIPTION_LENGTH}
              placeholder={copy.descriptionPlaceholder}
              value={values.description}
              onChange={(event) => setField("description", event.target.value)}
              onBlur={() => touchField("description")}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={descriptionErrorText ? "description-help description-error" : "description-help"}
              className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                  : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
              }`}
            />
            <div className="flex items-center justify-between">
              <p id="description-help" className="text-xs text-slate-500">
                {copy.descriptionHelper}
              </p>
              <p className="text-xs text-slate-500">
                {values.description.length}/{MAX_DESCRIPTION_LENGTH}
              </p>
            </div>
            <FieldError id="description-error" text={descriptionErrorText} />
          </div>

          {submitError && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {submitError.message}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              data-testid="cancel-button"
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <CancelIcon />
              <span>{copy.cancel}</span>
            </button>

            <button
              data-testid="save-movie-button"
              type="submit"
              disabled={!isValid || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <SaveIcon />
              <span>{isSubmitting ? copy.saving : copy.save}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

