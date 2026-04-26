/**
 * Valid MPAA rating values for movies.
 */
export const VALID_RATINGS = ["G", "PG", "PG_13", "R", "NC_17"];

/**
 * Maximum allowed length for movie description text.
 */
export const MAX_DESCRIPTION_LENGTH = 1000;

/**
 * @param {string} name
 * @returns {string | null}
 */
export function validateMovieName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    return "Title is required";
  }
  return null;
}

/**
 * @param {string} launchDate
 * @returns {string | null}
 */
export function validateLaunchDate(launchDate) {
  if (typeof launchDate !== "string" || launchDate.trim().length === 0) {
    return "Release date is required";
  }
  return null;
}

/**
 * @param {string | number} duration
 * @returns {string | null}
 */
export function validateDuration(duration) {
  if (duration === "" || duration === null || duration === undefined) {
    return "Duration is required";
  }
  const num = Number(duration);
  if (!Number.isFinite(num) || num < 1) {
    return "Duration must be a positive number";
  }
  return null;
}

/**
 * @param {string} rating
 * @returns {string | null}
 */
export function validateRating(rating) {
  if (!rating || !VALID_RATINGS.includes(rating)) {
    return "Please select a rating";
  }
  return null;
}

/**
 * @param {string} producerId
 * @returns {string | null}
 */
export function validateProducerId(producerId) {
  if (!producerId || producerId === "") {
    return "Please select a producer";
  }
  return null;
}

/**
 * @param {string | undefined | null} description
 * @returns {string | null}
 */
export function validateDescription(description) {
  if (!description || description.length === 0) {
    return null;
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  return null;
}

/**
 * Validates full movie form data.
 *
 * @param {{ name?: string; launchDate?: string; duration?: string; rating?: string; producerId?: string; description?: string }} values
 * @returns {{ errors: object; isValid: boolean }}
 */
export function validateMovieForm(values) {
  const nameError = validateMovieName(values?.name ?? "");
  const launchDateError = validateLaunchDate(values?.launchDate ?? "");
  const durationError = validateDuration(values?.duration ?? "");
  const ratingError = validateRating(values?.rating ?? "");
  const producerIdError = validateProducerId(values?.producerId ?? "");
  const descriptionError = validateDescription(values?.description);

  const errors = {};
  if (nameError) errors.name = nameError;
  if (launchDateError) errors.launchDate = launchDateError;
  if (durationError) errors.duration = durationError;
  if (ratingError) errors.rating = ratingError;
  if (producerIdError) errors.producerId = producerIdError;
  if (descriptionError) errors.description = descriptionError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
