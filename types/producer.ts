/**
 * Producer entity representing a producer object from the backend API.
 *
 * Example:
 * ```ts
 * const producer: Producer = {
 *   id: 1,
 *   name: "Francis Ford Coppola",
 * };
 * ```
 */
export type Producer = {
  /**
   * Unique identifier for the producer (assigned by backend).
   */
  id?: number;

  /**
   * Producer full name.
   */
  name: string;

  /**
   * Biography or profile description of the producer.
   */
  profile?: string;
};
