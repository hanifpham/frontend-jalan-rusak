import { normalizeHttpError } from './errors';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string | null;
  body?: unknown;
}

let activeAuthToken: string | null = null;

export const setAuthToken = (token: string | null): void => {
  activeAuthToken = token;
};

export const getAuthToken = (): string | null => {
  return activeAuthToken;
};

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    // Default fallback pointing to local backend without hardcoding sensitive endpoints
    return 'http://localhost:8080/api';
  }
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

/**
 * Core HTTP client function using standard fetch.
 * Does NOT invent business endpoints.
 */
export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl}${normalizedEndpoint}`);

  // Query parameter handling
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers = new Headers(options.headers || {});

  // Authorization bearer token handling
  const token = options.token ?? activeAuthToken;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body: BodyInit | undefined = undefined;

  if (options.body !== undefined && options.body !== null) {
    if (
      options.body instanceof FormData ||
      options.body instanceof Blob ||
      options.body instanceof URLSearchParams
    ) {
      body = options.body;
      // Fetch will automatically set correct boundary headers for FormData
    } else {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(options.body);
    }
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      ...options,
      headers,
      body,
    });
  } catch (networkError) {
    throw normalizeHttpError(0, networkError instanceof Error ? networkError.message : 'Koneksi jaringan gagal');
  }

  let parsedData: unknown = null;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      parsedData = await response.json();
    } catch {
      parsedData = null;
    }
  } else {
    try {
      parsedData = await response.text();
    } catch {
      parsedData = null;
    }
  }

  if (!response.ok) {
    throw normalizeHttpError(response.status, parsedData);
  }

  return parsedData as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
