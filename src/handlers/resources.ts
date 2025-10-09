/**
 * Resource request handlers for Upgates API
 */

import { UpgatesClient } from '../upgates-client.js';
import { NotFoundError } from '../errors/index.js';

/**
 * Resource definition interface
 */
export interface ResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

/**
 * List all available resources
 */
export function listResources(): ResourceDefinition[] {
  return [
    {
      uri: 'upgates://system/info',
      name: 'System Information',
      description: 'Information about Upgates MCP server and capabilities',
      mimeType: 'application/json',
    },
    {
      uri: 'upgates://api/endpoints',
      name: 'API Endpoints Overview',
      description: 'Overview of main Upgates API v2 endpoint groups',
      mimeType: 'application/json',
    },
    {
      uri: 'upgates://api/rate-limits',
      name: 'API Rate Limits',
      description: 'Information about API rate limiting and best practices',
      mimeType: 'application/json',
    },
    {
      uri: 'upgates://config/settings',
      name: 'Configuration Settings',
      description: 'Current MCP server configuration (safe view)',
      mimeType: 'application/json',
    },
    {
      uri: 'upgates://api/documentation',
      name: 'API Documentation Links',
      description: 'Links to Upgates API documentation and resources',
      mimeType: 'application/json',
    },
  ];
}

/**
 * Handle reading system info resource
 */
async function readSystemInfo(client: UpgatesClient): Promise<string> {
  const info = {
    name: 'Upgates MCP Server',
    version: '0.1.0',
    description: 'Model Context Protocol server for Upgates e-shop API integration',
    apiVersion: 'v2',
    apiBaseUrl: client.getBaseUrl(),
    features: {
      orders: 'Full CRUD support for orders and order statuses',
      products: 'Full CRUD support for products, variants, and related data',
      customers: 'Customer management and authentication',
      invoices: 'Invoice listing and PDF generation',
      categories: 'Category management with multilingual support',
      labels: 'Product label management',
      availabilities: 'Product availability management',
      manufacturers: 'Manufacturer listing',
      carts: 'Shopping cart monitoring',
      vouchers: 'Discount voucher management',
      webhooks: 'Webhook configuration and event management',
      payments: 'Payment method listing',
      shipments: 'Shipping method and affiliate management',
      languages: 'Multi-language support',
      pricelists: 'Pricelist management',
    },
    capabilities: {
      totalTools: 26,
      totalResources: 5,
      anonymization: client.isAnonymizationEnabled(),
      pagination: 'All list endpoints support pagination',
      filtering: 'Advanced filtering on most endpoints',
      bulkOperations: 'Support for bulk create/update (max 100 items)',
    },
    apiLimits: {
      maxItemsPerRequest: 100,
      maxProductsPerPage: 50,
      maxOrdersPerPage: 100,
      concurrentRequests: 3,
      rateLimiting: 'Varies by plan (Bronze to Exclusive)',
    },
  };

  return JSON.stringify(info, null, 2);
}

/**
 * Handle reading API endpoints resource
 */
async function readApiEndpoints(): Promise<string> {
  const endpoints = {
    description: 'Upgates API v2 main endpoint groups',
    baseUrl: 'https://SHOP-NAME.admin.SERVER-BRAND.upgates.com/api/v2',
    authentication: 'HTTP Basic Authentication (login:apiKey)',
    groups: {
      orders: {
        description: 'Order management - create, update, list, delete orders',
        endpoints: [
          'GET /api/v2/orders',
          'POST /api/v2/orders',
          'PUT /api/v2/orders',
          'DELETE /api/v2/orders',
          'GET /api/v2/orders/{order_number}/history',
        ],
        uniqueIdentifier: 'order_number',
      },
      orderStatuses: {
        description: 'Order status management',
        endpoints: [
          'GET /api/v2/order-statuses',
          'POST /api/v2/order-statuses',
          'PUT /api/v2/order-statuses',
          'DELETE /api/v2/order-statuses/{id}',
        ],
      },
      invoices: {
        description: 'Invoice management',
        endpoints: [
          'GET /api/v2/invoices',
          'GET /api/v2/invoices/{invoice_number}/pdf',
        ],
        uniqueIdentifier: 'invoice_number',
      },
      products: {
        description: 'Product and variant management',
        endpoints: [
          'GET /api/v2/products',
          'GET /api/v2/products/{code}/simple',
          'POST /api/v2/products',
          'PUT /api/v2/products',
          'DELETE /api/v2/products',
          'GET /api/v2/products/prices',
          'GET /api/v2/products/parameters',
          'GET /api/v2/products/variants',
        ],
        uniqueIdentifier: 'code or product_id',
        maxPerPage: 50,
      },
      customers: {
        description: 'Customer management',
        endpoints: [
          'GET /api/v2/customers',
          'POST /api/v2/customers',
          'PUT /api/v2/customers',
          'DELETE /api/v2/customers',
          'POST /api/v2/customers/login',
        ],
        uniqueIdentifier: 'email',
      },
      categories: {
        description: 'Category management',
        endpoints: [
          'GET /api/v2/categories',
          'POST /api/v2/categories',
          'PUT /api/v2/categories',
          'DELETE /api/v2/categories',
        ],
        uniqueIdentifier: 'code or category_id',
      },
      labels: {
        description: 'Product label management (action, new, sale, custom)',
        endpoints: [
          'GET /api/v2/labels',
          'POST /api/v2/labels',
          'DELETE /api/v2/labels/{id}',
        ],
      },
      availabilities: {
        description: 'Product availability management',
        endpoints: [
          'GET /api/v2/availabilities',
          'POST /api/v2/availabilities',
          'PUT /api/v2/availabilities',
          'DELETE /api/v2/availabilities/{id}',
        ],
      },
      manufacturers: {
        description: 'Manufacturer listing',
        endpoints: [
          'GET /api/v2/manufacturers',
          'DELETE /api/v2/manufacturers/{id}',
        ],
      },
      parameters: {
        description: 'Product parameter management',
        endpoints: [
          'GET /api/v2/parameters',
          'POST /api/v2/parameters',
          'PUT /api/v2/parameters',
          'DELETE /api/v2/parameters/{id}',
        ],
      },
      carts: {
        description: 'Shopping cart monitoring',
        endpoints: ['GET /api/v2/carts'],
      },
      vouchers: {
        description: 'Discount voucher management',
        endpoints: [
          'GET /api/v2/vouchers',
          'POST /api/v2/vouchers',
          'DELETE /api/v2/vouchers',
        ],
      },
      shipments: {
        description: 'Shipping method and affiliate management',
        endpoints: [
          'GET /api/v2/shipments',
          'GET /api/v2/shipments/{id}/affiliates',
          'POST /api/v2/shipments/{id}/affiliates',
          'DELETE /api/v2/shipments/{id}/affiliates',
        ],
      },
      payments: {
        description: 'Payment method listing',
        endpoints: ['GET /api/v2/payments'],
      },
      webhooks: {
        description: 'Webhook configuration',
        endpoints: [
          'GET /api/v2/webhooks',
          'GET /api/v2/webhooks/events',
          'POST /api/v2/webhooks',
          'PUT /api/v2/webhooks',
          'DELETE /api/v2/webhooks/{id}',
        ],
      },
      eshop: {
        description: 'E-shop configuration and info',
        endpoints: [
          'GET /api/v2/config',
          'GET /api/v2/languages',
          'GET /api/v2/pricelists',
          'GET /api/v2/owner',
          'GET /api/v2/status',
        ],
      },
    },
    additionalGroups: [
      'Stocks (Sklady)',
      'Redirections (Přesměrování)',
      'News (Aktuality)',
      'Articles (Články)',
      'Advisor (Rádce)',
      'Files (Soubory)',
      'Custom Fields (Vlastní pole)',
      'Graphics (Grafika)',
      'Conversion Codes (Konverzní kódy)',
    ],
  };

  return JSON.stringify(endpoints, null, 2);
}

/**
 * Handle reading API rate limits resource
 */
async function readApiRateLimits(): Promise<string> {
  const rateLimits = {
    description: 'Upgates API Rate Limiting Information',
    authentication: {
      maxLoginAttempts: 5,
      timeWindow: '1 hour per IP address',
      blockingStatus: 403,
    },
    requestLimits: {
      description: 'Limits vary by plan tier',
      tiers: {
        Bronze: { hourly: 10, daily: 100, total: 340 },
        Silver: { hourly: 15, daily: 300, total: 660 },
        Gold: { hourly: 50, daily: 600, total: 1800 },
        Platinum: { hourly: 100, daily: 1500, total: 3900 },
        Exclusive: { hourly: 100, daily: 1500, total: '3900+', note: 'Custom increases available' },
      },
      additionalPackages: {
        description: 'Optional addon packages',
        requestsPerPackage: 1000,
        distribution: 'Hourly: 25/h * 24h = 600, Daily: 400',
        maxPackages: 60,
      },
    },
    concurrentRequests: {
      limit: 3,
      note: 'Applies per API access group, not per individual access',
      exclusiveTierNote: 'Higher limits available on Exclusive tier',
    },
    bulkOperations: {
      maxItemsPerRequest: 100,
      applicableTo: ['POST', 'PUT'],
      statusOnExceed: 413,
    },
    responseHeaders: {
      'X-Rate-Limit-Hour': 'Current hourly limit',
      'X-Rate-Limit-Day': 'Current daily limit',
      'X-Rate-Limit-Hour-Remaining': 'Remaining hourly requests',
      'X-Rate-Limit-Day-Remaining': 'Remaining daily requests',
      'X-Rate-Limit-Total-Remaining': 'Total remaining requests',
      'Retry-After': 'Time when next request is allowed (GMT, only on 429)',
    },
    bestPractices: [
      'Use webhooks instead of polling',
      'Use pagination for GET requests',
      'Filter by last_update_time_from to get only changed items',
      'Cache static data (languages, order statuses, etc.)',
      'Send up to 100 items in bulk operations',
      'Avoid unnecessary frequent requests',
    ],
  };

  return JSON.stringify(rateLimits, null, 2);
}

/**
 * Handle reading config settings resource
 */
async function readConfigSettings(client: UpgatesClient): Promise<string> {
  const settings = {
    apiUrl: client.getBaseUrl(),
    anonymizeData: client.isAnonymizationEnabled(),
    authentication: 'HTTP Basic Authentication',
    features: {
      dataAnonymization: client.isAnonymizationEnabled(),
      multiLanguageSupport: true,
      webhookSupport: true,
      bulkOperations: true,
    },
    limits: {
      timeout: '30000ms (configurable)',
      maxItemsPerRequest: 100,
    },
    note: 'Sensitive configuration values (username, password) are not shown for security',
  };

  return JSON.stringify(settings, null, 2);
}

/**
 * Handle reading API documentation resource
 */
async function readApiDocumentation(): Promise<string> {
  const documentation = {
    mainDocumentation: 'https://upgatesapiv2.docs.apiary.io/',
    postmanCollection: 'https://upgates.cz/shop-data/developers/Upgates_API_postman_collection.json',
    helpCenter: 'https://www.upgates.cz/a/api',
    developerSection: 'https://www.upgates.cz/pro-vyvojare',
    discordForum: 'https://discord.gg/6X7VbMEVjk',
    webhooksDocumentation: 'https://www.upgates.cz/a/webhooky',
    addonDevelopment: 'https://www.upgates.cz/a/api-dokumentace-doplnku',

    quickStart: {
      authentication: 'Create API access in Admin > Doplňky > API',
      apiUrlFormat: 'https://SHOP-NAME.admin.SERVER-BRAND.upgates.com/api/v2',
      authMethod: 'HTTP Basic Authentication with login:apiKey',
      encoding: 'UTF-8',
      contentType: 'application/json',
    },

    commonEndpoints: {
      orders: '/api/v2/orders',
      products: '/api/v2/products',
      customers: '/api/v2/customers',
      invoices: '/api/v2/invoices',
      categories: '/api/v2/categories',
      webhooks: '/api/v2/webhooks',
      apiStatus: '/api/v2/status',
    },

    statusCodes: {
      200: 'OK - Request successful',
      301: 'Moved Permanently - Shop moved to different server',
      400: 'Bad Request - Invalid JSON',
      401: 'Unauthorized - Authentication failed',
      403: 'Forbidden - No permissions or too many login attempts',
      404: 'Not Found - Invalid URL',
      413: 'Payload Too Large - More than 100 items in request',
      429: 'Too Many Requests - Rate limit exceeded',
      500: 'Internal Server Error - Contact Upgates support',
    },

    dataTypes: {
      bool: 'true/false, 1/0',
      string: 'UTF-8 string',
      int: 'Integer',
      float: 'Decimal number (use dot as separator)',
      date: 'ISO 8601 format',
      language: 'ISO 639-1 code',
      currency: 'ISO 4217 code',
      country: 'ISO 3166-1 alpha-2 code',
    },
  };

  return JSON.stringify(documentation, null, 2);
}

/**
 * Main resource handler dispatcher
 */
export async function handleResourceRead(
  uri: string,
  client: UpgatesClient
): Promise<string> {
  switch (uri) {
    case 'upgates://system/info':
      return readSystemInfo(client);

    case 'upgates://api/endpoints':
      return readApiEndpoints();

    case 'upgates://api/rate-limits':
      return readApiRateLimits();

    case 'upgates://config/settings':
      return readConfigSettings(client);

    case 'upgates://api/documentation':
      return readApiDocumentation();

    default:
      throw new NotFoundError(`Unknown resource: ${uri}`, 'resource');
  }
}
