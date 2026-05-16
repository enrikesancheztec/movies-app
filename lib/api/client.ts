import axios, { AxiosInstance } from "axios";

/**
 * Next.js inlines NEXT_PUBLIC_* values into client bundles during build.
 * Keep the lookup behind one boundary so a later runtime-config strategy
 * can replace this implementation without touching each API module.
 */
export function getPublicApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
}

export function createApiClient(): AxiosInstance {
  return axios.create({
    baseURL: getPublicApiBaseUrl(),
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}