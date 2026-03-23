/**
 * Movie rating classification enum (MPAA ratings).
 * Represents the content rating of a movie.
 *
 * - G: General Audiences
 * - PG: Parental Guidance
 * - PG_13: Parents Strongly Cautioned (13+)
 * - R: Restricted (17+)
 * - NC_17: Adults Only (18+)
 */
export type MovieRating = "G" | "PG" | "PG_13" | "R" | "NC_17";

/**
 * All valid movie ratings.
 * Useful for form selectors, dropdowns, and validation.
 */
export const MOVIE_RATINGS: MovieRating[] = ["G", "PG", "PG_13", "R", "NC_17"];
