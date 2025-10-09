/**
 * Configuration management and validation
 */

import { UpgatesConfig } from '../types.js';
import { ConfigurationError } from '../errors/index.js';

/**
 * Load and validate configuration from environment variables
 */
export function loadConfig(): UpgatesConfig {
  const apiUrl = process.env.UPGATES_API_URL;
  const apiUsername = process.env.UPGATES_API_USERNAME;
  const apiPassword = process.env.UPGATES_API_PASSWORD;

  // Validate required variables
  if (!apiUrl) {
    throw new ConfigurationError('UPGATES_API_URL environment variable is required');
  }

  if (!apiUsername) {
    throw new ConfigurationError('UPGATES_API_USERNAME environment variable is required');
  }

  if (!apiPassword) {
    throw new ConfigurationError('UPGATES_API_PASSWORD environment variable is required');
  }

  // Validate URL format
  try {
    new URL(apiUrl);
  } catch (error) {
    throw new ConfigurationError(`Invalid UPGATES_API_URL: ${apiUrl}`);
  }

  // Parse optional settings
  const timeout = process.env.UPGATES_TIMEOUT
    ? parseInt(process.env.UPGATES_TIMEOUT, 10)
    : 30000;

  const anonymizeData = process.env.UPGATES_ANONYMIZE_DATA === 'true';
  const readonlyMode = process.env.UPGATES_READONLY === 'true';

  if (isNaN(timeout) || timeout <= 0) {
    throw new ConfigurationError('UPGATES_TIMEOUT must be a positive number');
  }

  return {
    apiUrl,
    apiUsername,
    apiPassword,
    timeout,
    anonymizeData,
    readonlyMode,
  };
}

/**
 * Get safe configuration (without sensitive data) for logging
 */
export function getSafeConfig(config: UpgatesConfig): Partial<UpgatesConfig> {
  return {
    apiUrl: config.apiUrl,
    timeout: config.timeout,
    anonymizeData: config.anonymizeData,
    readonlyMode: config.readonlyMode,
    // apiUsername and apiPassword are intentionally omitted
  };
}

/**
 * Validate configuration object
 */
export function validateConfig(config: UpgatesConfig): void {
  if (!config.apiUrl) {
    throw new ConfigurationError('API URL is required');
  }

  if (!config.apiUsername) {
    throw new ConfigurationError('API Username is required');
  }

  if (!config.apiPassword) {
    throw new ConfigurationError('API Password is required');
  }

  try {
    new URL(config.apiUrl);
  } catch (error) {
    throw new ConfigurationError(`Invalid API URL: ${config.apiUrl}`);
  }

  if (config.timeout !== undefined && (config.timeout <= 0 || isNaN(config.timeout))) {
    throw new ConfigurationError('Timeout must be a positive number');
  }
}
