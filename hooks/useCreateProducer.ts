"use client";

import { useCallback, useMemo, useState } from "react";
import { createProducer } from "@/lib/api/producers";
import type { Producer } from "@/types/producer";
import { validateProducerForm } from "@/utils/producer-validator";

/**
 * Producer form values managed by the create hook.
 */
export type CreateProducerFormValues = {
  name: string;
  profile: string;
};

/**
 * Validation errors for producer create form fields.
 */
export type CreateProducerFormErrors = {
  name?: string;
  profile?: string;
};

/**
 * Return contract for create-producer hook consumers.
 */
interface UseCreateProducerReturn {
  /** Current form values. */
  values: CreateProducerFormValues;
  /** Validation errors by field. */
  errors: CreateProducerFormErrors;
  /** Indicates whether form is currently valid. */
  isValid: boolean;
  /** Indicates whether a create request is in progress. */
  isSubmitting: boolean;
  /** Error from the last submit attempt, if any. */
  submitError: Error | null;
  /** Successfully created producer from the backend, if available. */
  createdProducer: Producer | null;
  /** Updates a single form field and revalidates the form. */
  setField: (field: keyof CreateProducerFormValues, value: string) => void;
  /** Submits the form when valid and returns created producer. */
  submit: () => Promise<Producer | null>;
  /** Resets values, validation state, and submit state. */
  reset: () => void;
  /** Alias of reset intended for cancel action wiring. */
  cancel: () => void;
}

const INITIAL_VALUES: CreateProducerFormValues = {
  name: "",
  profile: "",
};

/**
 * React hook for managing producer create form state and submission flow.
 * Integrates frontend validation through the vanilla JS validator utility.
 */
export function useCreateProducer(): UseCreateProducerReturn {
  const [values, setValues] = useState<CreateProducerFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CreateProducerFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [createdProducer, setCreatedProducer] = useState<Producer | null>(null);

  const isValid = useMemo(() => validateProducerForm(values).isValid, [values]);

  const setField = useCallback((field: keyof CreateProducerFormValues, value: string) => {
    setValues((previous) => {
      const next = { ...previous, [field]: value };
      const validation = validateProducerForm(next);
      setErrors(validation.errors);
      return next;
    });
  }, []);

  const submit = useCallback(async (): Promise<Producer | null> => {
    const validation = validateProducerForm(values);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return null;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const trimmedName = values.name.trim();
      const trimmedProfile = values.profile.trim();
      const payload = {
        name: trimmedName,
        ...(trimmedProfile ? { profile: trimmedProfile } : {}),
      };

      const producer = await createProducer(payload);
      setCreatedProducer(producer);
      return producer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error("Unknown error occurred");
      setSubmitError(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [values]);

  const reset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError(null);
    setCreatedProducer(null);
    setIsSubmitting(false);
  }, []);

  const cancel = useCallback(() => {
    reset();
  }, [reset]);

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    submitError,
    createdProducer,
    setField,
    submit,
    reset,
    cancel,
  };
}
