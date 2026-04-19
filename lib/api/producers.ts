import axios, { AxiosInstance, AxiosError } from "axios";
import type { Producer } from "@/types/producer";

/**
 * Shared Axios client for Producers API requests.
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
 * Fetch all producers from the backend API.
 * @returns Promise<Producer[]> - Array of producers
 * @throws Error if API request fails
 */
export async function getProducers(): Promise<Producer[]> {
  try {
    const response = await apiClient.get<Producer[]>("/producers");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = `Failed to fetch producers: ${axiosError.message}`;
    console.error(message);
    throw new Error(message);
  }
}

/**
 * Default configured Producers API client.
 */
export default apiClient;
