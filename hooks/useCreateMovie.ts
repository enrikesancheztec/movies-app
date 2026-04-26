"use client";

import { useState } from "react";
import { createMovie } from "@/lib/api/movies";
import type { Movie } from "@/types/movie";
import type { MovieRating } from "@/types/movie-rating";

export type CreateMovieFormValues = {
  name: string;
  launchDate: string;
  duration: string;
  rating: MovieRating | "";
  producerId: string;
  description: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMovie, setCreatedMovie] = useState<Movie | null>(null);

  function setField(field: keyof CreateMovieFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(): Promise<Movie | null> {
    setIsSubmitting(true);
    const movie = await createMovie({
      name: values.name,
      launchDate: values.launchDate,
      duration: Number(values.duration),
      rating: values.rating as MovieRating,
      producerId: Number(values.producerId),
      ...(values.description.trim() ? { description: values.description } : {}),
    });
    setCreatedMovie(movie);
    setIsSubmitting(false);
    return movie;
  }

  return { values, isSubmitting, createdMovie, setField, submit };
}
