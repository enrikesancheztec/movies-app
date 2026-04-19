"use client";

import { useState, useEffect, useCallback } from "react";
import type { Producer } from "@/types/producer";
import { getProducers } from "@/lib/api/producers";

/**
 * Return contract for the producers data hook.
 */
interface UseProducersReturn {
  /** Producers retrieved from the backend API. */
  producers: Producer[];
  /** Indicates whether a fetch request is currently in progress. */
  loading: boolean;
  /** Error produced by the last fetch attempt, if any. */
  error: Error | null;
  /** Triggers a new fetch for the producers collection. */
  refetch: () => Promise<void>;
}

/**
 * React hook for fetching and managing producers data from the API.
 * @returns Object containing producers array, loading state, error state, and refetch function
 */
export function useProducers(): UseProducersReturn {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /** Fetch producers and synchronize local hook state. */
  const fetchProducers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducers();
      setProducers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(errorMessage);
      setProducers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducers();
  }, [fetchProducers]);

  /** Public refetch handler exposed to consumers of the hook. */
  const refetch = useCallback(async () => {
    await fetchProducers();
  }, [fetchProducers]);

  return { producers, loading, error, refetch };
}
