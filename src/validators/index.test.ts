/**
 * Unit tests for validators
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateDateFormat,
  validateDateRange,
  validatePagination,
  validateId,
} from './index.js';
import { ValidationError } from '../errors/index.js';

describe('Validators', () => {
  describe('validateDateFormat', () => {
    it('should accept valid date format', () => {
      assert.doesNotThrow(() => validateDateFormat('2025-10-09', 'testDate'));
    });

    it('should reject invalid date format', () => {
      assert.throws(
        () => validateDateFormat('2025/10/09', 'testDate'),
        ValidationError
      );
    });

    it('should reject invalid date values', () => {
      assert.throws(
        () => validateDateFormat('2025-13-45', 'testDate'),
        ValidationError
      );
    });
  });

  describe('validateDateRange', () => {
    it('should accept valid date range', () => {
      assert.doesNotThrow(() =>
        validateDateRange('2025-01-01', '2025-12-31')
      );
    });

    it('should reject when dateFrom is after dateTo', () => {
      assert.throws(
        () => validateDateRange('2025-12-31', '2025-01-01'),
        ValidationError
      );
    });
  });

  describe('validatePagination', () => {
    it('should accept valid pagination', () => {
      assert.doesNotThrow(() =>
        validatePagination({ page: 1, limit: 50 })
      );
    });

    it('should reject page < 1', () => {
      assert.throws(
        () => validatePagination({ page: 0 }),
        ValidationError
      );
    });

    it('should reject limit > 1000', () => {
      assert.throws(
        () => validatePagination({ limit: 1001 }),
        ValidationError
      );
    });
  });

  describe('validateId', () => {
    it('should accept valid IDs', () => {
      assert.doesNotThrow(() => validateId('product-123', 'productId'));
      assert.doesNotThrow(() => validateId('ABC_123', 'productId'));
    });

    it('should reject invalid characters', () => {
      assert.throws(
        () => validateId('product@123', 'productId'),
        ValidationError
      );
    });

    it('should reject empty ID', () => {
      assert.throws(
        () => validateId('', 'productId'),
        ValidationError
      );
    });
  });
});
