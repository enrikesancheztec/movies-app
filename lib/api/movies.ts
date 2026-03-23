import axios, { AxiosInstance, AxiosError } from "axios";
import type { Movie } from "@/types/movie";

/**
 * Shared Axios client for Movies API requests.
 * Uses the public API base URL configured through environment variables.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all movies from the backend API
 * @returns Promise<Movie[]> - Array of movies
 * @throws Error if API request fails
 */
export async function getMovies(): Promise<Movie[]> {
  try {
    const response = await apiClient.get<Movie[]>("/movies");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = `Failed to fetch movies: ${axiosError.message}`;
    console.error(message);
    throw new Error(message);
  }
}

/**
 * Fetch a single movie by ID from the backend API
 * @param id - Movie ID to fetch
 * @returns Promise<Movie> - Movie object with the given ID
 * @throws Error if API request fails or movie not found
 */
export async function getMovieById(id: number): Promise<Movie> {
  try {
    const response = await apiClient.get<Movie>(`/movies/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = `Failed to fetch movie with ID ${id}: ${axiosError.message}`;
    console.error(message);
    throw new Error(message);
  }
}

/**
 * Create a new movie in the backend API
 * @param movie - Movie data without ID (backend assigns it)
 * @returns Promise<Movie> - Created movie with assigned ID
 * @throws Error if API request fails or validation fails
 */
export async function createMovie(
  movie: Omit<Movie, "id">
): Promise<Movie> {
  try {
    const response = await apiClient.post<Movie>("/movies", movie);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = `Failed to create movie: ${axiosError.message}`;
    console.error(message);
    throw new Error(message);
  }
}

/**
 * Default configured Movies API client.
 */
export default apiClient;
