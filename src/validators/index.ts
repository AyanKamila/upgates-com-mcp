/**
 * Input validation utilities
 */

import { ValidationError } from '../errors/index.js';

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDateFormat(date: string, fieldName: string = 'date'): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    throw new ValidationError(
      `Invalid date format for ${fieldName}. Expected YYYY-MM-DD, got: ${date}`,
      fieldName
    );
  }

  // Validate that it's a real date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new ValidationError(
      `Invalid date value for ${fieldName}: ${date}`,
      fieldName
    );
  }
}

/**
 * Validate date range
 */
export function validateDateRange(
  dateFrom: string | undefined,
  dateTo: string | undefined
): void {
  if (dateFrom) {
    validateDateFormat(dateFrom, 'dateFrom');
  }

  if (dateTo) {
    validateDateFormat(dateTo, 'dateTo');
  }

  if (dateFrom && dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (from > to) {
      throw new ValidationError(
        'dateFrom must be before or equal to dateTo',
        'dateRange'
      );
    }
  }
}

/**
 * Validate status value
 */
export function validateStatus(
  status: string,
  validStatuses: string[],
  fieldName: string = 'status'
): void {
  if (!validStatuses.includes(status)) {
    throw new ValidationError(
      `Invalid ${fieldName}. Expected one of: ${validStatuses.join(', ')}. Got: ${status}`,
      fieldName
    );
  }
}

/**
 * Validate order direction
 */
export function validateOrderDirection(
  direction: string,
  fieldName: string = 'orderDirection'
): void {
  const validDirections = ['asc', 'desc'];

  if (!validDirections.includes(direction.toLowerCase())) {
    throw new ValidationError(
      `Invalid ${fieldName}. Expected 'asc' or 'desc', got: ${direction}`,
      fieldName
    );
  }
}

/**
 * Validate numeric range
 */
export function validateNumericRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'value'
): void {
  if (isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a number`, fieldName);
  }

  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}, got: ${value}`,
      fieldName
    );
  }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(params: {
  page?: number;
  limit?: number;
  offset?: number;
}): void {
  if (params.page !== undefined) {
    validateNumericRange(params.page, 1, Number.MAX_SAFE_INTEGER, 'page');
  }

  if (params.limit !== undefined) {
    validateNumericRange(params.limit, 1, 1000, 'limit');
  }

  if (params.offset !== undefined) {
    validateNumericRange(params.offset, 0, Number.MAX_SAFE_INTEGER, 'offset');
  }
}

/**
 * Validate required field
 */
export function validateRequired(
  value: any,
  fieldName: string
): void {
  if (value === undefined || value === null || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string = 'value'
): void {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`, fieldName);
  }

  if (value.length < minLength || value.length > maxLength) {
    throw new ValidationError(
      `${fieldName} length must be between ${minLength} and ${maxLength} characters, got: ${value.length}`,
      fieldName
    );
  }
}

/**
 * Validate ID format (alphanumeric with dashes and underscores)
 */
export function validateId(id: string, fieldName: string = 'id'): void {
  validateRequired(id, fieldName);

  const idRegex = /^[a-zA-Z0-9_-]+$/;

  if (!idRegex.test(id)) {
    throw new ValidationError(
      `Invalid ${fieldName} format. Must contain only alphanumeric characters, dashes, and underscores`,
      fieldName
    );
  }

  validateStringLength(id, 1, 100, fieldName);
}

/**
 * Validate email format
 */
export function validateEmail(email: string, fieldName: string = 'email'): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ValidationError(
      `Invalid email format for ${fieldName}: ${email}`,
      fieldName
    );
  }
}

/**
 * Validate array parameter
 */
export function validateArray(
  value: any,
  fieldName: string = 'array',
  minLength: number = 0,
  maxLength: number = Number.MAX_SAFE_INTEGER
): void {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`, fieldName);
  }

  if (value.length < minLength || value.length > maxLength) {
    throw new ValidationError(
      `${fieldName} length must be between ${minLength} and ${maxLength}, got: ${value.length}`,
      fieldName
    );
  }
}
