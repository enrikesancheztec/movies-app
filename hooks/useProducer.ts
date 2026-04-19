"use client";

import { useState, useEffect, useCallback } from "react";
import type { Producer } from "@/types/producer";
import { getProducerById } from "@/lib/api/producers";

/**
 * Return contract for the single producer data hook.
 */
interface UseProducerReturn {
  /** Producer retrieved from the backend API, or null if not yet loaded. */
  producer: Producer | null;
  /** Indicates whether a fetch request is currently in progress. */
  loading: boolean;
  /** Error produced by the last fetch attempt, if any. */
  error: Error | null;
  /** Triggers a new fetch for the producer. */
  refetch: () => Promise<void>;
}

/**
 * React hook for fetching and managing a single producer by ID.
 * @param id - Producer ID to fetch
 * @returns Object containing producer, loading state, error state, and refetch function
 */
export function useProducer(id: number): UseProducerReturn {
  const [producer, setProducer] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducer = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducerById(id);
      setProducer(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err : new Error("Unknown error occurred");
      setError(errorMessage);
      setProducer(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProducer();
  }, [fetchProducer]);

  const refetch = useCallback(async () => {
    await fetchProducer();
  }, [fetchProducer]);

  return { producer, loading, error, refetch };
}
