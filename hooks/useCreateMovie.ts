"use client";

import { useCallback, useMemo, useState } from "react";
import { createMovie } from "@/lib/api/movies";
import type { Movie } from "@/types/movie";
import type { MovieRating } from "@/types/movie-rating";
import { validateMovieForm } from "@/utils/movie-validator";

export type CreateMovieFormValues = {
  name: string;
  launchDate: string;
  duration: string;
  rating: MovieRating | "";
  producerId: string;
  description: string;
};

export type CreateMovieFormErrors = {
  name?: string;
  launchDate?: string;
  duration?: string;
  rating?: string;
  producerId?: string;
  description?: string;
};

const INITIAL_VALUES: CreateMovieFormValues = {
  name: "",
  launchDate: "",
  duration: "",
  rating: "",
  producerId: "",
  description: "",
};

export function useCreateMovie() {
  const [values, setValues] = useState<CreateMovieFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CreateMovieFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [createdMovie, setCreatedMovie] = useState<Movie | null>(null);

  const isValid = useMemo(() => validateMovieForm(values).isValid, [values]);

  const setField = useCallback((field: keyof CreateMovieFormValues, value: string) => {
    setValues((previous) => {
      const next = { ...previous, [field]: value };
      const validation = validateMovieForm(next);
      setErrors(validation.errors);
      return next;
    });
  }, []);

  const submit = useCallback(async (): Promise<Movie | null> => {
    const validation = validateMovieForm(values);
    setErrors(validation.errors);

    if (!validation.isValid) {
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

  const reset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError(null);
    setCreatedMovie(null);
    setIsSubmitting(false);
  }, []);

  const cancel = reset;

  return { values, errors, isValid, isSubmitting, submitError, createdMovie, setField, submit, reset, cancel };
}
