/**
 * Upgates API client - handles API communication
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { UpgatesConfig, RequestOptions, ApiResponse } from './types.js';
import {
  AuthenticationError,
  NetworkError,
  RateLimitError,
  toUpgatesError,
} from './errors/index.js';

/**
 * Upgates API client class
 */
export class UpgatesClient {
  private client: AxiosInstance;
  private config: UpgatesConfig;

  constructor(config: UpgatesConfig) {
    this.config = config;

    // Create axios instance with base configuration
    // Upgates API uses HTTP Basic Authentication
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout || 30000,
      auth: {
        username: config.apiUsername,
        password: config.apiPassword,
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleApiError(error)
    );
  }

  /**
   * Make a GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(endpoint, { params });
      return this.formatResponse(response.data);
    } catch (error) {
      throw toUpgatesError(error);
    }
  }

  /**
   * Make a POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(endpoint, data);
      return this.formatResponse(response.data);
    } catch (error) {
      throw toUpgatesError(error);
    }
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(endpoint, data);
      return this.formatResponse(response.data);
    } catch (error) {
      throw toUpgatesError(error);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(endpoint, { params });
      return this.formatResponse(response.data);
    } catch (error) {
      throw toUpgatesError(error);
    }
  }

  /**
   * Make a generic request
   */
  async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request({
        method: options.method,
        url: options.endpoint,
        params: options.params,
        data: options.data,
        headers: options.headers,
      });

      return this.formatResponse(response.data);
    } catch (error) {
      throw toUpgatesError(error);
    }
  }

  /**
   * Format API response
   */
  private formatResponse<T>(data: any): ApiResponse<T> {
    // If the API already returns data in the expected format, use it
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    // Otherwise, wrap the data
    return {
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: AxiosError): never {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      // Authentication errors
      if (status === 401 || status === 403) {
        throw new AuthenticationError(
          data?.message || 'Authentication failed. Please check your API credentials.'
        );
      }

      // Rate limiting
      if (status === 429) {
        const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10);
        throw new RateLimitError(
          'API rate limit exceeded. Please try again later.',
          retryAfter
        );
      }

      // Other API errors
      throw new NetworkError(
        data?.message || `API request failed with status ${status}`,
        status,
        data
      );
    }

    // Network errors (no response)
    if (error.request) {
      throw new NetworkError(
        'Network error: Unable to reach the API server. Please check your connection.',
        undefined,
        error.message
      );
    }

    // Other errors
    throw new NetworkError(error.message || 'An unexpected error occurred');
  }

  /**
   * Anonymize sensitive data if configured
   */
  private anonymizeData(data: any): any {
    if (!this.config.anonymizeData || !data) {
      return data;
    }

    // Create a deep copy to avoid modifying the original
    const anonymized = JSON.parse(JSON.stringify(data));

    // List of fields to anonymize - comprehensive for Upgates API
    const sensitiveFields = new Set([
      // Email fields
      'email',
      'customer_email',

      // Phone fields
      'phone',
      'phoneNumber',
      'phone_number',
      'fax',

      // Name fields
      'firstname',
      'surname',
      'firstname_invoice',
      'surname_invoice',
      'firstname_postal',
      'surname_postal',
      'customer_name',
      'name',
      'company',
      'company_name',
      'company_postal',

      // Address fields
      'street',
      'street_invoice',
      'street_postal',
      'city',
      'city_invoice',
      'city_postal',
      'state',
      'state_invoice',
      'state_postal',
      'zip',
      'zip_invoice',
      'zip_postal',
      'zip_code',
      'address',

      // Business identifiers
      'ico',
      'dic',
      'company_number',
      'vat_number',

      // Personal identifiers
      'customer_note',
      'internal_note',
      'note',
      'nickname',
      'degree',
      'salutation',
      'declension',

      // Other sensitive
      'code',
      'customer_code',
      'im',
      'bank_account',
      'account_number',
      'iban',
      'swift',
      'specific_symbol',
      'variable_symbol',
    ]);

    // Additional patterns to anonymize
    const anonymizeByPattern = (key: string): boolean => {
      const lowerKey = key.toLowerCase();
      return (
        lowerKey.includes('name') ||
        lowerKey.includes('email') ||
        lowerKey.includes('phone') ||
        lowerKey.includes('address') ||
        lowerKey.includes('street') ||
        lowerKey.includes('city') ||
        lowerKey.includes('zip')
      );
    };

    const anonymizeObject = (obj: any): void => {
      if (!obj || typeof obj !== 'object') {
        return;
      }

      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach(anonymizeObject);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          anonymizeObject(obj[key]);
        } else if (sensitiveFields.has(key) || anonymizeByPattern(key)) {
          // Keep null/undefined values as is
          if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
            obj[key] = '***ANONYMIZED***';
          }
        }
      }
    };

    anonymizeObject(anonymized);
    return anonymized;
  }

  /**
   * Get anonymized data (public method for use in handlers)
   */
  public getAnonymizedData<T>(data: T): T {
    return this.anonymizeData(data);
  }

  /**
   * Check if data anonymization is enabled
   */
  public isAnonymizationEnabled(): boolean {
    return this.config.anonymizeData || false;
  }

  /**
   * Get API base URL
   */
  public getBaseUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Check if readonly mode is enabled
   */
  public isReadonlyMode(): boolean {
    return this.config.readonlyMode || false;
  }
}
