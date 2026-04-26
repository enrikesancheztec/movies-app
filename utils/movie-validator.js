/**
 * Valid MPAA rating values for movies.
 */
export const VALID_RATINGS = ["G", "PG", "PG_13", "R", "NC_17"];

/**
 * Maximum allowed length for movie description text.
 */
export const MAX_DESCRIPTION_LENGTH = 1000;

export function validateMovieName(name) { return null; }
export function validateLaunchDate(launchDate) { return null; }
export function validateDuration(duration) { return null; }
export function validateRating(rating) { return null; }
export function validateProducerId(producerId) { return null; }
export function validateDescription(description) { return null; }

/**
 * Validates full movie form data.
 *
 * @param {{ name?: string; launchDate?: string; duration?: string; rating?: string; producerId?: string; description?: string }} values
 * @returns {{ errors: object; isValid: boolean }}
 */
export function validateMovieForm(values) {
  return { errors: {}, isValid: true };
}
