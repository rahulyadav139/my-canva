/**
 * ErrorCode
 * -----------
 * Centralized error code enum for application-wide error handling.
 * Each code maps to a specific error scenario, often corresponding to HTTP status codes.
 * Use these codes for consistent error reporting and handling across backend and frontend.
 */
export enum ErrorCode {
  // --- Input & Validation Errors (4xx) ---
  /** 400: Generic malformed request */
  BAD_REQUEST = 'BAD_REQUEST',
  /** 422: Semantic/field validation error */
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  // --- Rate Limiting (429) ---
  /** 429: Too many requests (rate limiting) */
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // --- Network/Transport Issues (Client-side only) ---
  /** Local: Request didn’t reach server */
  NETWORK_FAILURE = 'NETWORK_FAILURE',
  /** Local: Server didn’t respond in time */
  TIMEOUT = 'TIMEOUT',

  // --- Generic Client Error (Catch-all) ---
  CLIENT_ERROR = 'CLIENT_ERROR',

  // --- Authentication Errors (401) ---
  /** 401: Generic unauthorized error */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /** 401: Session/JWT expired */
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  /** 401: Malformed, tampered, or revoked token */
  TOKEN_INVALID = 'TOKEN_INVALID',

  // --- Authorization Errors (403) ---
  /** 403: Valid authentication, but no permission */
  PERMISSION_DENIED = 'PERMISSION_DENIED',

  // --- Not Found Errors (404) ---
  /** 404: Resource not found */
  NOT_FOUND = 'NOT_FOUND',

  // --- Conflict Errors (409) ---
  /** 409: Resource conflict (duplicates, already processed, etc.) */
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',

  // --- Server Errors (5xx) ---
  /** 500: Internal server error */
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  /** 500: Database operation failed */
  DATABASE_ERROR = 'DATABASE_ERROR',
  /** 500: External service/API error */
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  /** 500: Server-side timeout */
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  /** 503: Service unavailable */
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // --- Fallback/Unknown ---
  /** Unknown/unclassified error */
  UNKNOWN = 'UNKNOWN',
}
