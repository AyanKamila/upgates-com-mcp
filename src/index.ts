#!/usr/bin/env node

/**
 * Upgates MCP Server - Main entry point
 *
 * Model Context Protocol server for Upgates API integration
 */

import { loadConfig, getSafeConfig } from './config/index.js';
import { MCPServer } from './server.js';
import { ConfigurationError, toUpgatesError, formatError } from './errors/index.js';

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    // Load and validate configuration
    console.error('[MCP] Loading configuration...');
    const config = loadConfig();

    // Log safe config (without sensitive data)
    const safeConfig = getSafeConfig(config);
    console.error('[MCP] Configuration loaded:', JSON.stringify(safeConfig, null, 2));

    // Create and start server
    const server = new MCPServer(config);
    await server.start();

    // Setup graceful shutdown handlers
    const shutdown = async (signal: string) => {
      console.error(`[MCP] Received ${signal}, shutting down gracefully...`);
      try {
        await server.stop();
        process.exit(0);
      } catch (error) {
        console.error('[MCP] Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('[MCP] Fatal error during startup:');

    if (error instanceof ConfigurationError) {
      console.error('[MCP] Configuration Error:', error.message);
      console.error('[MCP]');
      console.error('[MCP] Please ensure the following environment variables are set:');
      console.error('[MCP]   - UPGATES_API_URL: Base URL of your Upgates API');
      console.error('[MCP]     Format: https://SHOP-NAME.admin.SERVER-BRAND.upgates.com/api/v2');
      console.error('[MCP]     Find it in: Admin > Doplňky > API');
      console.error('[MCP]');
      console.error('[MCP]   - UPGATES_API_USERNAME: Your API login/username');
      console.error('[MCP]   - UPGATES_API_PASSWORD: Your API key/password');
      console.error('[MCP]     Create access in: Admin > Doplňky > API');
      console.error('[MCP]');
      console.error('[MCP] Optional environment variables:');
      console.error('[MCP]   - UPGATES_TIMEOUT: Request timeout in milliseconds (default: 30000)');
      console.error('[MCP]   - UPGATES_ANONYMIZE_DATA: Enable data anonymization (true/false)');
      console.error('[MCP]');
      console.error('[MCP] Authentication uses HTTP Basic Auth (login:apiKey)');
    } else {
      const upgatesError = toUpgatesError(error);
      console.error('[MCP]', formatError(upgatesError));

      if (upgatesError.stack) {
        console.error('[MCP] Stack trace:', upgatesError.stack);
      }
    }

    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('[MCP] Unhandled error:', error);
  process.exit(1);
});
