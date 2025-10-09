/**
 * Custom error classes for better error handling
 */

/**
 * Base error class for all Upgates-related errors
 */
export class UpgatesError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'UpgatesError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Configuration error - thrown when configuration is invalid or missing
 */
export class ConfigurationError extends UpgatesError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR');
    this.name = 'ConfigurationError';
  }
}

/**
 * Authentication error - thrown when API authentication fails
 */
export class AuthenticationError extends UpgatesError {
  constructor(message: string) {
    super(message, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

/**
 * Validation error - thrown when input validation fails
 */
export class ValidationError extends UpgatesError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Not found error - thrown when a resource is not found
 */
export class NotFoundError extends UpgatesError {
  constructor(message: string, public readonly resourceType?: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Network error - thrown when API requests fail due to network issues
 */
export class NetworkError extends UpgatesError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: any
  ) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * Rate limit error - thrown when API rate limits are exceeded
 */
export class RateLimitError extends UpgatesError {
  constructor(
    message: string,
    public readonly retryAfter?: number
  ) {
    super(message, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

/**
 * Readonly error - thrown when write operations are attempted in readonly mode
 */
export class ReadonlyError extends UpgatesError {
  constructor(
    message: string,
    public readonly operation?: string
  ) {
    super(message, 'READONLY_MODE');
    this.name = 'ReadonlyError';
  }
}

/**
 * Convert unknown errors to UpgatesError
 */
export function toUpgatesError(error: unknown): UpgatesError {
  if (error instanceof UpgatesError) {
    return error;
  }

  if (error instanceof Error) {
    return new UpgatesError(error.message);
  }

  return new UpgatesError(String(error));
}

/**
 * Format error for user-friendly display
 */
export function formatError(error: UpgatesError): string {
  const parts = [error.name];

  if (error.code) {
    parts.push(`[${error.code}]`);
  }

  parts.push(error.message);

  if (error instanceof ValidationError && error.field) {
    parts.push(`(field: ${error.field})`);
  }

  if (error instanceof NetworkError && error.statusCode) {
    parts.push(`(status: ${error.statusCode})`);
  }

  if (error instanceof RateLimitError && error.retryAfter) {
    parts.push(`(retry after: ${error.retryAfter}s)`);
  }

  if (error instanceof ReadonlyError && error.operation) {
    parts.push(`(operation: ${error.operation})`);
  }

  return parts.join(' ');
}
