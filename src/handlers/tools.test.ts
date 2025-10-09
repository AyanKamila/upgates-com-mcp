/**
 * Unit tests for tool handlers
 */

import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { handleToolRequest } from './tools.js';
import { UpgatesClient } from '../upgates-client.js';
import { ReadonlyError, NotFoundError } from '../errors/index.js';

describe('Tool Handlers', () => {
  describe('handleToolRequest', () => {
    it('should throw ReadonlyError for write operations in readonly mode', async () => {
      // Create a mock client with readonly mode enabled
      const mockConfig = {
        apiUrl: 'https://test.upgates.com/api/v2',
        apiUsername: 'test',
        apiPassword: 'test',
        readonlyMode: true,
      };
      const client = new UpgatesClient(mockConfig);

      // Test that write operations are blocked
      const writeOperations = [
        'create_order',
        'update_orders',
        'delete_orders',
        'create_products',
        'update_products',
        'delete_products',
      ];

      for (const operation of writeOperations) {
        await assert.rejects(
          async () => handleToolRequest(operation, client, {}),
          ReadonlyError,
          `Should block ${operation} in readonly mode`
        );
      }
    });

    it('should throw NotFoundError for unknown tool', async () => {
      const mockConfig = {
        apiUrl: 'https://test.upgates.com/api/v2',
        apiUsername: 'test',
        apiPassword: 'test',
        readonlyMode: false,
      };
      const client = new UpgatesClient(mockConfig);

      await assert.rejects(
        async () => handleToolRequest('unknown_tool', client, {}),
        NotFoundError
      );
    });
  });
});
