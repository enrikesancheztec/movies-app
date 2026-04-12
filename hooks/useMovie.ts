"use client";

import { useState, useEffect, useCallback } from "react";
import type { Movie } from "@/types/movie";
import { getMovieById } from "@/lib/api/movies";

/**
 * Return contract for the single movie data hook.
 */
interface UseMovieReturn {
  /** Movie retrieved from the backend API, or null if not yet loaded. */
  movie: Movie | null;
  /** Indicates whether a fetch request is currently in progress. */
  loading: boolean;
  /** Error produced by the last fetch attempt, if any. */
  error: Error | null;
  /** Triggers a new fetch for the movie. */
  refetch: () => Promise<void>;
}

/**
 * React hook for fetching and managing a single movie by ID.
 * @param id - Movie ID to fetch
 * @returns Object containing movie, loading state, error state, and refetch function
 */
export function useMovie(id: number): UseMovieReturn {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMovie = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMovieById(id);
      setMovie(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(errorMessage);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  const refetch = useCallback(async () => {
    await fetchMovie();
  }, [fetchMovie]);

  return { movie, loading, error, refetch };
}
