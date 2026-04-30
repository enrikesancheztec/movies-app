/**
 * Valid MPAA rating values for movies.
 */
export const VALID_RATINGS = ["G", "PG", "PG_13", "R", "NC_17"];

/**
 * Maximum allowed length for movie description text.
 */
export const MAX_DESCRIPTION_LENGTH = 1000;

/**
 * Validates the movie title.
 * Rule: name is mandatory and must not be blank.
 *
 * @param {string} name
 * @returns {string | null} Validation message or null when valid.
 */
export function validateMovieName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    return "Title is required";
  }
  return null;
}

/**
 * Validates the theatrical release date.
 * Rule: launchDate is mandatory and must not be blank.
 *
 * @param {string} launchDate
 * @returns {string | null} Validation message or null when valid.
 */
export function validateLaunchDate(launchDate) {
  if (typeof launchDate !== "string" || launchDate.trim().length === 0) {
    return "Release date is required";
  }
  return null;
}

/**
 * Validates the runtime in minutes.
 * Rules: duration is mandatory; must be a finite positive number when provided.
 *
 * @param {string | number} duration
 * @returns {string | null} Validation message or null when valid.
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
 * Validates the MPAA rating.
 * Rule: value must be one of the entries in {@link VALID_RATINGS}.
 *
 * @param {string} rating
 * @returns {string | null} Validation message or null when valid.
 */
export function validateRating(rating) {
  if (!rating || !VALID_RATINGS.includes(rating)) {
    return "Please select a rating";
  }
  return null;
}

/**
 * Validates the selected producer.
 * Rule: a producer must be chosen (non-empty value).
 *
 * @param {string} producerId
 * @returns {string | null} Validation message or null when valid.
 */
export function validateProducerId(producerId) {
  if (!producerId || producerId === "") {
    return "Please select a producer";
  }
  return null;
}

/**
 * Validates the movie synopsis.
 * Rule: description is optional, but must not exceed {@link MAX_DESCRIPTION_LENGTH} characters when provided.
 *
 * @param {string | undefined | null} description
 * @returns {string | null} Validation message or null when valid.
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
 * @returns {{ errors: { name?: string; launchDate?: string; duration?: string; rating?: string; producerId?: string; description?: string }; isValid: boolean }}
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
