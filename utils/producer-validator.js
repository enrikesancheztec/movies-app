/**
 * Maximum allowed length for producer profile text.
 */
export const MAX_PROFILE_LENGTH = 2000;

/**
 * Validates producer name.
 * Rule: name is mandatory.
 *
 * @param {string} name
 * @returns {string | null} Validation message or null when valid.
 */
export function validateProducerName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    return "Name is mandatory";
  }

  return null;
}

/**
 * Validates producer profile.
 * Rule: profile is optional, but max length is 2000 when provided.
 *
 * @param {string | undefined | null} profile
 * @returns {string | null} Validation message or null when valid.
 */
export function validateProducerProfile(profile) {
  if (profile === undefined || profile === null || profile.length === 0) {
    return null;
  }

  if (typeof profile !== "string") {
    return "Profile must be a string";
  }

  if (profile.length > MAX_PROFILE_LENGTH) {
    return `Profile must be at most ${MAX_PROFILE_LENGTH} characters`;
  }

  return null;
}

/**
 * Validates full producer form data.
 *
 * @param {{ name?: string; profile?: string }} values
 * @returns {{ errors: { name?: string; profile?: string }; isValid: boolean }}
 */
export function validateProducerForm(values) {
  const nameError = validateProducerName(values?.name ?? "");
  const profileError = validateProducerProfile(values?.profile);

  const errors = {};

  if (nameError) {
    errors.name = nameError;
  }

  if (profileError) {
    errors.profile = profileError;
  }

  return {
    errors,
    isValid: !nameError && !profileError,
  };
}
