"use client";

import { useState, useEffect, useCallback } from "react";
import type { Movie } from "@/types/movie";
import { getMovies } from "@/lib/api/movies";

/**
 * Return contract for the movies data hook.
 */
interface UseMoviesReturn {
  /** Movies retrieved from the backend API. */
  movies: Movie[];
  /** Indicates whether a fetch request is currently in progress. */
  loading: boolean;
  /** Error produced by the last fetch attempt, if any. */
  error: Error | null;
  /** Triggers a new fetch for the movies collection. */
  refetch: () => Promise<void>;
}

/**
 * React hook for fetching and managing movies data from the API
 * @returns Object containing movies array, loading state, error state, and refetch function
 */
export function useMovies(): UseMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /** Fetch movies and synchronize local hook state. */
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMovies();
      setMovies(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(errorMessage);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  /** Public refetch handler exposed to consumers of the hook. */
  const refetch = useCallback(async () => {
    await fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, refetch };
}
