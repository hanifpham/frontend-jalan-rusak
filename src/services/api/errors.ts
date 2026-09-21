/**
 * Standardized API Error representation.
 * Normalizes HTTP status codes, error payloads, and network failures.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly errors?: Record<string, string[] | string> | undefined;
  public readonly raw?: unknown;

  constructor(
    status: number,
    message: string,
    errors?: Record<string, string[] | string>,
    raw?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.raw = raw;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Normalizes an unknown HTTP response or body into a strongly-typed ApiError.
 */
export function normalizeHttpError(status: number, body: unknown): ApiError {
  let message = `Permintaan gagal dengan status ${status}`;
  let errors: Record<string, string[] | string> | undefined = undefined;

  if (typeof body === 'string' && body.trim().length > 0) {
    message = body;
  } else if (typeof body === 'object' && body !== null) {
    const record = body as Record<string, unknown>;

    if (typeof record['error'] === 'string' && record['error'].length > 0) {
      message = record['error'];
    } else if (typeof record['message'] === 'string' && record['message'].length > 0) {
      message = record['message'];
    }

    if (typeof record['errors'] === 'object' && record['errors'] !== null) {
      errors = record['errors'] as Record<string, string[] | string>;
    }
  }

  // Fallback messages for standard civic/admin HTTP statuses if none supplied
  if (!message || message.startsWith('Permintaan gagal')) {
    switch (status) {
      case 400:
        message = 'Format data permintaan tidak valid.';
        break;
      case 401:
        message = 'Sesi login telah berakhir atau tidak sah. Silakan masuk kembali.';
        break;
      case 403:
        message = 'Anda tidak memiliki hak akses untuk tindakan ini.';
        break;
      case 404:
        message = 'Sumber data yang dicari tidak ditemukan.';
        break;
      case 409:
        message = 'Terjadi konflik pada data yang dikirimkan.';
        break;
      case 422:
        message = 'Data yang dikirimkan gagal divalidasi.';
        break;
      case 500:
      case 502:
      case 503:
        message = 'Terjadi kendala pada peladen backend ROADIS.';
        break;
    }
  }

  return new ApiError(status, message, errors, body);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isUnauthorizedError(error: unknown): boolean {
  return isApiError(error) && error.status === 401;
}

export function isForbiddenError(error: unknown): boolean {
  return isApiError(error) && error.status === 403;
}

export function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.status === 404;
}
