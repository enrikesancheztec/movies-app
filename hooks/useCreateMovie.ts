"use client";

import { useCallback, useMemo, useState } from "react";
import { createMovie } from "@/lib/api/movies";
import type { Movie } from "@/types/movie";
import type { MovieRating } from "@/types/movie-rating";
import { validateMovieForm } from "@/utils/movie-validator";

/**
 * Controlled form values for the Create Movie form.
 * All fields are kept as strings so they bind directly to HTML inputs.
 */
export type CreateMovieFormValues = {
  /** Movie title. */
  name: string;
  /** ISO date string (YYYY-MM-DD) for the theatrical release date. */
  launchDate: string;
  /** Runtime in minutes as a string; converted to a number before submission. */
  duration: string;
  /** MPAA rating value, or empty string when not yet selected. */
  rating: MovieRating | "";
  /** Foreign-key ID of the selected producer as a string. */
  producerId: string;
  /** Optional movie synopsis (max 1 000 characters). */
  description: string;
};

/**
 * Per-field validation error messages for the Create Movie form.
 * A field key is absent when that field has no error.
 */
export type CreateMovieFormErrors = {
  name?: string;
  launchDate?: string;
  duration?: string;
  rating?: string;
  producerId?: string;
  description?: string;
};

/** All form field keys, used to mark every field as touched on submit. */
const ALL_FIELDS: ReadonlyArray<keyof CreateMovieFormValues> = [
  "name",
  "launchDate",
  "duration",
  "rating",
  "producerId",
  "description",
];

const INITIAL_VALUES: CreateMovieFormValues = {
  name: "",
  launchDate: "",
  duration: "",
  rating: "",
  producerId: "",
  description: "",
};

/**
 * Hook that manages form state, per-field touched tracking, validation,
 * and submission for the Create Movie page.
 *
 * Errors are surfaced only for fields the user has interacted with (via
 * `setField` or `touchField`). Calling `submit` marks all fields as touched
 * before returning, so the full error set is visible on a failed attempt.
 *
 * @returns Form state and actions consumed by the Create Movie page.
 */
export function useCreateMovie() {
  const [values, setValues] = useState<CreateMovieFormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<ReadonlySet<keyof CreateMovieFormValues>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [createdMovie, setCreatedMovie] = useState<Movie | null>(null);

  const validation = useMemo(() => validateMovieForm(values), [values]);

  const isValid: boolean = validation.isValid;

  /**
   * Errors restricted to fields the user has already interacted with.
   * After a submit attempt all fields are touched, so all errors are visible.
   */
  const errors = useMemo<CreateMovieFormErrors>(() => {
    const result: CreateMovieFormErrors = {};
    for (const field of touched) {
      const message = (validation.errors as CreateMovieFormErrors)[field];
      if (message) result[field] = message;
    }
    return result;
  }, [validation.errors, touched]);

  /**
   * Updates a single form field and marks it as touched so its validation
   * error (if any) becomes visible immediately.
   *
   * @param field - The form field to update.
   * @param value - The new string value from the input element.
   */
  const setField = useCallback((field: keyof CreateMovieFormValues, value: string) => {
    setTouched((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Marks a field as touched without changing its value.
   * Call this from an `onBlur` handler so the field's error appears as soon
   * as the user leaves it without filling it in.
   *
   * @param field - The form field to mark as touched.
   */
  const touchField = useCallback((field: keyof CreateMovieFormValues) => {
    setTouched((prev) => {
      if (prev.has(field)) return prev;
      const next = new Set(prev);
      next.add(field);
      return next;
    });
  }, []);

  /**
   * Validates the form and, when valid, submits it to the API.
   * All fields are marked as touched before validation so the full error set
   * surfaces on a failed attempt (double-submit is blocked by `isSubmitting`).
   *
   * @returns The newly created {@link Movie} on success, or `null` on
   * validation failure or API error.
   */
  const submit = useCallback(async (): Promise<Movie | null> => {
    setTouched(new Set(ALL_FIELDS));

    const currentValidation = validateMovieForm(values);
    if (!currentValidation.isValid) {
      return null;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const movie = await createMovie({
        name: values.name.trim(),
        launchDate: values.launchDate,
        duration: Number(values.duration),
        rating: values.rating as MovieRating,
        producerId: Number(values.producerId),
        ...(values.description.trim() ? { description: values.description.trim() } : {}),
      });
      setCreatedMovie(movie);
      return movie;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error occurred");
      setSubmitError(error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  /**
   * Resets all form state (values, touched, errors, submission state) back
   * to their initial values.
   */
  const reset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setTouched(new Set());
    setSubmitError(null);
    setCreatedMovie(null);
    setIsSubmitting(false);
  }, []);

  /** Alias for `reset`. Use when the user explicitly cancels the form. */
  const cancel = reset;

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    submitError,
    createdMovie,
    setField,
    touchField,
    submit,
    reset,
    cancel,
  };
}
