import type { MovieRating } from "./movie-rating";

/**
 * Movie entity representing a movie object from the backend API.
 * Maps to the MovieVO schema from the Movies API.
 *
 * Example:
 * ```ts
 * const movie: Movie = {
 *   id: 1,
 *   name: "The Godfather",
 *   launchDate: "1972-03-24",
 *   duration: 175,
 *   rating: "R",
 *   description: "The aging patriarch..."
 * };
 * ```
 */
export type Movie = {
  /**
   * Unique identifier for the movie (assigned by backend).
   * Omitted when creating new movies.
   */
  id?: number;

  /**
   * Movie title/name.
   */
  name: string;

  /**
   * Release date in ISO 8601 format (YYYY-MM-DD).
   */
  launchDate: string;

  /**
   * Movie duration in minutes.
   */
  duration: number;

  /**
   * MPAA rating classification.
   */
  rating: MovieRating;

  /**
   * Full description or synopsis of the movie.
   * Optional. When provided, must not exceed 1000 characters.
   */
  description?: string;

  /**
   * ID of the producer associated with this movie.
   */
  producerId?: number;
};
