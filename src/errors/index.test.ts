/**
 * Unit tests for error classes
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  UpgatesError,
  ConfigurationError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  NetworkError,
  RateLimitError,
  ReadonlyError,
  formatError,
} from './index.js';

describe('Error Classes', () => {
  describe('UpgatesError', () => {
    it('should create base error with code', () => {
      const error = new UpgatesError('Test error', 'TEST_CODE');
      assert.strictEqual(error.name, 'UpgatesError');
      assert.strictEqual(error.code, 'TEST_CODE');
      assert.strictEqual(error.message, 'Test error');
    });
  });

  describe('ConfigurationError', () => {
    it('should create configuration error', () => {
      const error = new ConfigurationError('Invalid config');
      assert.strictEqual(error.name, 'ConfigurationError');
      assert.strictEqual(error.code, 'CONFIG_ERROR');
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error', () => {
      const error = new AuthenticationError('Auth failed');
      assert.strictEqual(error.name, 'AuthenticationError');
      assert.strictEqual(error.code, 'AUTH_ERROR');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with field', () => {
      const error = new ValidationError('Invalid email', 'email');
      assert.strictEqual(error.name, 'ValidationError');
      assert.strictEqual(error.code, 'VALIDATION_ERROR');
      assert.strictEqual(error.field, 'email');
    });
  });

  describe('ReadonlyError', () => {
    it('should create readonly error with operation', () => {
      const error = new ReadonlyError('Write not allowed', 'create_order');
      assert.strictEqual(error.name, 'ReadonlyError');
      assert.strictEqual(error.code, 'READONLY_MODE');
      assert.strictEqual(error.operation, 'create_order');
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with retry time', () => {
      const error = new RateLimitError('Too many requests', 60);
      assert.strictEqual(error.name, 'RateLimitError');
      assert.strictEqual(error.retryAfter, 60);
    });
  });

  describe('formatError', () => {
    it('should format basic error', () => {
      const error = new UpgatesError('Test error', 'TEST');
      const formatted = formatError(error);
      assert.ok(formatted.includes('UpgatesError'));
      assert.ok(formatted.includes('[TEST]'));
      assert.ok(formatted.includes('Test error'));
    });

    it('should format validation error with field', () => {
      const error = new ValidationError('Invalid value', 'email');
      const formatted = formatError(error);
      assert.ok(formatted.includes('(field: email)'));
    });

    it('should format readonly error with operation', () => {
      const error = new ReadonlyError('Write blocked', 'create_order');
      const formatted = formatError(error);
      assert.ok(formatted.includes('(operation: create_order)'));
    });

    it('should format rate limit error with retry time', () => {
      const error = new RateLimitError('Too many requests', 120);
      const formatted = formatError(error);
      assert.ok(formatted.includes('(retry after: 120s)'));
    });
  });
});
