"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateProducer } from "@/hooks/useCreateProducer";
import {
  getClientDictionary,
  locales,
  type Dictionary,
  type Locale,
} from "@/lib/client-dictionaries";
import { MAX_PROFILE_LENGTH } from "@/utils/producer-validator";

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

export default function CreateProducerPage({
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
    submit,
    cancel,
  } = useCreateProducer();

  const invalidLocale = !isSupportedLocale(lang);

  useEffect(() => {
    if (!isSupportedLocale(lang)) {
      return;
    }

    getClientDictionary(lang).then((resolvedDict) => {
      setDict(resolvedDict);
    });
  }, [lang]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = await submit();

    if (created) {
      router.push(`/${lang}/producers`);
    }
  };

  const handleCancel = () => {
    cancel();
    router.push(`/${lang}/producers`);
  };

  if (invalidLocale) {
    return (
      <section className="space-y-6">
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-red-600">Invalid language</p>
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

  const profileLength = values.profile.length;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          {dict.home.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create Producer
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Fill in producer information and save when all validations pass.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6 lg:p-8">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Enter producer name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                  : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
              }`}
            />
            {errors.name && (
              <p id="name-error" className="text-sm font-medium text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="profile" className="block text-sm font-semibold text-slate-800">
              Profile
            </label>
            <textarea
              id="profile"
              name="profile"
              value={values.profile}
              onChange={(event) => setField("profile", event.target.value)}
              placeholder="Enter producer profile (optional)"
              rows={6}
              aria-invalid={Boolean(errors.profile)}
              aria-describedby={errors.profile ? "profile-error" : "profile-help"}
              className={`block w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                errors.profile
                  ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-200"
                  : "border-slate-300 bg-white focus:border-blue-400 focus:ring-blue-200"
              }`}
            />
            <div className="flex items-center justify-between">
              <p id="profile-help" className="text-xs text-slate-500">
                Optional. Maximum {MAX_PROFILE_LENGTH} characters.
              </p>
              <p className="text-xs text-slate-500">
                {profileLength}/{MAX_PROFILE_LENGTH}
              </p>
            </div>
            {errors.profile && (
              <p id="profile-error" className="text-sm font-medium text-red-600">
                {errors.profile}
              </p>
            )}
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
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <CancelIcon />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <SaveIcon />
              <span>{isSubmitting ? "Saving..." : "Save"}</span>
            </button>
          </div>

          <div className="pt-2 text-right">
            <Link
              href={`/${lang}/producers`}
              className="text-xs font-semibold text-slate-500 underline underline-offset-2 hover:text-slate-700"
            >
              Back to producers
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
