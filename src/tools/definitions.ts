/**
 * Tool definitions and schemas for Upgates MCP server
 * Based on Upgates API v2 documentation
 */

/**
 * Tool definition interface
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * List of all available tools for Upgates API
 */
export const TOOLS: ToolDefinition[] = [
  // Orders (Objednávky)
  {
    name: 'list_orders',
    description: 'List orders with filtering and pagination (max 100 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        order_number: {
          type: 'string',
          description: 'Specific order number',
        },
        creation_time_from: {
          type: 'string',
          description: 'Filter orders created from this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        creation_time_to: {
          type: 'string',
          description: 'Filter orders created to this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        last_update_time_from: {
          type: 'string',
          description: 'Filter orders updated from this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        paid_yn: {
          type: 'boolean',
          description: 'Filter by paid status',
        },
        status: {
          type: 'string',
          description: 'Filter by order status name',
        },
        status_id: {
          type: 'number',
          description: 'Filter by order status ID',
        },
        email: {
          type: 'string',
          description: 'Filter by customer email',
        },
        phone: {
          type: 'string',
          description: 'Filter by customer phone (MSISDN format)',
        },
        external_order_number: {
          type: 'string',
          description: 'Filter by external order number',
        },
        language: {
          type: 'string',
          description: 'Filter by language (ISO 639-1)',
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
        order_by: {
          type: 'string',
          description: 'Order by field',
          enum: ['creation_time', 'last_update_time'],
        },
        order_dir: {
          type: 'string',
          description: 'Sort direction',
          enum: ['asc', 'desc'],
        },
      },
    },
  },
  {
    name: 'create_order',
    description: 'Create one or more orders (max 100 per request)',
    inputSchema: {
      type: 'object',
      properties: {
        send_emails_yn: {
          type: 'boolean',
          description: 'Send emails for order status (default: true)',
        },
        send_sms_yn: {
          type: 'boolean',
          description: 'Send SMS for order status (default: true)',
        },
        orders: {
          type: 'array',
          description: 'Array of orders to create',
          items: {
            type: 'object',
            properties: {
              external_order_number: { type: 'string' },
              language_id: { type: 'string' },
              status: { type: 'string' },
              status_id: { type: 'number' },
              customer: { type: 'object' },
              products: { type: 'array' },
              shipment: { type: 'object' },
              payment: { type: 'object' },
            },
            required: ['language_id', 'customer', 'products'],
          },
        },
      },
      required: ['orders'],
    },
  },
  {
    name: 'update_orders',
    description: 'Update one or more orders (max 100 per request)',
    inputSchema: {
      type: 'object',
      properties: {
        send_emails_yn: {
          type: 'boolean',
          description: 'Send emails on status change (default: true)',
        },
        send_sms_yn: {
          type: 'boolean',
          description: 'Send SMS on status change (default: true)',
        },
        delete_missing_products_yn: {
          type: 'boolean',
          description: 'Delete products not included in request (default: false)',
        },
        orders: {
          type: 'array',
          description: 'Array of orders to update',
          items: {
            type: 'object',
            properties: {
              order_number: { type: 'string' },
              status: { type: 'string' },
              status_id: { type: 'number' },
              tracking_code: { type: 'string' },
              paid_date: { type: 'string' },
            },
            required: ['order_number'],
          },
        },
      },
      required: ['orders'],
    },
  },
  {
    name: 'delete_orders',
    description: 'Delete one or more orders',
    inputSchema: {
      type: 'object',
      properties: {
        order_number: {
          type: 'string',
          description: 'Single order number to delete',
        },
        order_numbers: {
          type: 'string',
          description: 'Multiple order numbers separated by semicolon',
        },
      },
    },
  },
  {
    name: 'get_order_history',
    description: 'Get history of specific order',
    inputSchema: {
      type: 'object',
      properties: {
        order_number: {
          type: 'string',
          description: 'Order number',
        },
      },
      required: ['order_number'],
    },
  },

  // Order Statuses (Stavy objednávky)
  {
    name: 'list_order_statuses',
    description: 'List all order statuses',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific status ID',
        },
        type: {
          type: 'string',
          description: 'Status type',
          enum: ['Received', 'Canceled', 'Sent', 'PaymentSuccessful', 'PaymentFailed', 'Custom'],
        },
      },
    },
  },
  {
    name: 'create_order_status',
    description: 'Create new order status',
    inputSchema: {
      type: 'object',
      properties: {
        color: {
          type: 'string',
          description: 'Color in HTML HEX format',
        },
        descriptions: {
          type: 'array',
          description: 'Status names in different languages',
          items: {
            type: 'object',
            properties: {
              language_id: { type: 'string' },
              name: { type: 'string' },
            },
            required: ['language_id', 'name'],
          },
        },
        mark_resolved_yn: {
          type: 'boolean',
          description: 'Mark order as resolved',
        },
        mark_paid_yn: {
          type: 'boolean',
          description: 'Mark order as paid',
        },
      },
      required: ['descriptions'],
    },
  },

  // Invoices (Faktury)
  {
    name: 'list_invoices',
    description: 'List invoices with filtering and pagination (max 100 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        invoice_number: {
          type: 'string',
          description: 'Specific invoice number',
        },
        creation_time_from: {
          type: 'string',
          description: 'Filter invoices created from this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        creation_time_to: {
          type: 'string',
          description: 'Filter invoices created to this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        paid_yn: {
          type: 'boolean',
          description: 'Filter by paid status',
        },
        type: {
          type: 'string',
          description: 'Invoice type',
          enum: ['invoice', 'creditNote', 'receipt'],
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },

  // Products (Produkty)
  {
    name: 'list_products',
    description: 'List products with filtering and pagination (max 50 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Product code',
        },
        product_id: {
          type: 'number',
          description: 'Product ID',
        },
        last_update_time_from: {
          type: 'string',
          description: 'Filter products updated from this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        active_yn: {
          type: 'boolean',
          description: 'Filter by active status',
        },
        archived_yn: {
          type: 'boolean',
          description: 'Filter by archived status',
        },
        can_add_to_basket_yn: {
          type: 'boolean',
          description: 'Filter by can add to basket',
        },
        in_stock_yn: {
          type: 'boolean',
          description: 'Filter by in stock status',
        },
        language: {
          type: 'string',
          description: 'Filter by language (ISO 639-1)',
        },
        pricelist: {
          type: 'string',
          description: 'Filter by pricelist name',
        },
        variants_yn: {
          type: 'boolean',
          description: 'Include variants (default: true)',
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },
  {
    name: 'list_products_simple',
    description: 'List products in simplified format (max 50 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        product_id: { type: 'number' },
        last_update_time_from: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
        active_yn: { type: 'boolean' },
        in_stock_yn: { type: 'boolean' },
        page: { type: 'number', minimum: 1 },
      },
    },
  },
  {
    name: 'create_products',
    description: 'Create products and variants (max 100 products per request)',
    inputSchema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          description: 'Array of products to create',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              ean: { type: 'string' },
              active_yn: { type: 'boolean' },
              descriptions: { type: 'array' },
              stock: { type: 'number' },
              availability: { type: 'string' },
              manufacturer: { type: 'string' },
              weight: { type: 'number' },
              prices: { type: 'array' },
              categories: { type: 'array' },
              variants: { type: 'array' },
            },
            required: ['descriptions'],
          },
        },
      },
      required: ['products'],
    },
  },
  {
    name: 'update_products',
    description: 'Update products and variants (max 100 products per request)',
    inputSchema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          description: 'Array of products to update',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              active_yn: { type: 'boolean' },
              stock: { type: 'number' },
              stock_increment: { type: 'number' },
              availability: { type: 'string' },
              prices: { type: 'array' },
            },
            required: ['code'],
          },
        },
      },
      required: ['products'],
    },
  },
  {
    name: 'delete_products',
    description: 'Delete one or more products',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Single product code',
        },
        codes: {
          type: 'string',
          description: 'Multiple product codes separated by semicolon',
        },
      },
    },
  },

  // Customers (Zákazníci)
  {
    name: 'list_customers',
    description: 'List customers with filtering and pagination (max 100 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        customer_id: {
          type: 'number',
          description: 'Specific customer ID',
        },
        code: {
          type: 'string',
          description: 'Customer code',
        },
        email: {
          type: 'string',
          description: 'Customer email',
        },
        phone: {
          type: 'string',
          description: 'Customer phone',
        },
        active_yn: {
          type: 'boolean',
          description: 'Filter by active status',
        },
        blocked_yn: {
          type: 'boolean',
          description: 'Filter by blocked status',
        },
        language: {
          type: 'string',
          description: 'Filter by language (ISO 639-1)',
        },
        pricelist: {
          type: 'string',
          description: 'Filter by pricelist',
        },
        last_update_time_from: {
          type: 'string',
          description: 'Filter customers updated from this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },
  {
    name: 'create_customers',
    description: 'Create one or more customers',
    inputSchema: {
      type: 'object',
      properties: {
        customers: {
          type: 'array',
          description: 'Array of customers to create',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['contact', 'customer', 'company'],
              },
              firstname: { type: 'string' },
              surname: { type: 'string' },
              language: { type: 'string' },
              login: { type: 'object' },
            },
            required: ['type', 'language', 'login'],
          },
        },
      },
      required: ['customers'],
    },
  },

  // Categories (Kategorie)
  {
    name: 'list_categories',
    description: 'List categories with filtering and pagination (max 100 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Category code',
        },
        category_id: {
          type: 'number',
          description: 'Category ID',
        },
        parent_id: {
          type: 'number',
          description: 'Filter by parent category ID',
        },
        active_yn: {
          type: 'boolean',
          description: 'Filter by active status',
        },
        language: {
          type: 'string',
          description: 'Filter by language (ISO 639-1)',
        },
        last_update_time_from: {
          type: 'string',
          description: 'Filter categories updated from this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },
  {
    name: 'create_categories',
    description: 'Create one or more categories',
    inputSchema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          description: 'Array of categories to create',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              parent_code: { type: 'string' },
              active_yn: { type: 'boolean' },
              descriptions: { type: 'array' },
            },
            required: ['descriptions'],
          },
        },
      },
      required: ['categories'],
    },
  },

  // Labels (Štítky)
  {
    name: 'list_labels',
    description: 'List product labels (max 50 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific label ID',
        },
        type: {
          type: 'string',
          description: 'Label type',
          enum: ['action', 'new', 'sale', 'custom'],
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },

  // Availabilities (Dostupnosti)
  {
    name: 'list_availabilities',
    description: 'List product availabilities (max 50 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific availability ID',
        },
        type: {
          type: 'string',
          description: 'Availability type',
          enum: ['OnRequest', 'NotAvailable', 'InStock', 'Custom'],
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },

  // Manufacturers (Výrobci)
  {
    name: 'list_manufacturers',
    description: 'List manufacturers (max 50 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific manufacturer ID',
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },

  // Parameters (Parametry)
  {
    name: 'list_parameters',
    description: 'List product parameters',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific parameter ID',
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },

  // Carts (Košíky)
  {
    name: 'list_carts',
    description: 'List shopping carts (max 100 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific cart ID',
        },
        creation_time_from: {
          type: 'string',
          description: 'Filter carts created from this date (YYYY-MM-DD)',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        },
        language: {
          type: 'string',
          description: 'Filter by language (ISO 639-1)',
        },
        filled_delivery_info_yn: {
          type: 'boolean',
          description: 'Filter carts with filled delivery info',
        },
        customer_logged_in_yn: {
          type: 'boolean',
          description: 'Filter carts with logged in customers',
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },

  // Vouchers (Slevové kupóny)
  {
    name: 'list_vouchers',
    description: 'List discount vouchers (max 100 items per page)',
    inputSchema: {
      type: 'object',
      properties: {
        voucher_code: {
          type: 'string',
          description: 'Specific voucher code',
        },
        active_yn: {
          type: 'boolean',
          description: 'Filter by active status',
        },
        global_yn: {
          type: 'boolean',
          description: 'Filter by reusable status',
        },
        page: {
          type: 'number',
          description: 'Page number (starting from 1)',
          minimum: 1,
        },
      },
    },
  },
  {
    name: 'create_vouchers',
    description: 'Create discount vouchers',
    inputSchema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of vouchers to create (default: 1)',
          minimum: 1,
        },
        type: {
          type: 'string',
          description: 'Voucher type',
          enum: ['price', 'percentage', 'payment_shipment'],
        },
        currency_id: {
          type: 'string',
          description: 'Currency code (ISO 4217)',
        },
        amount: {
          type: 'number',
          description: 'Voucher value (price or percentage)',
        },
        active_yn: {
          type: 'boolean',
          description: 'Active status (default: true)',
        },
        global_yn: {
          type: 'boolean',
          description: 'Reusable (default: false)',
        },
      },
      required: ['type', 'currency_id', 'amount'],
    },
  },

  // Shipments (Doprava)
  {
    name: 'list_shipments',
    description: 'List shipping methods',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific shipment ID',
        },
        code: {
          type: 'string',
          description: 'Shipment code',
        },
        type: {
          type: 'string',
          description: 'Shipment type',
          enum: ['custom', 'ceskaPosta', 'slovenskaPosta', 'zasilkovna', 'dpd', 'ppl', 'gls'],
        },
        page: {
          type: 'number',
          minimum: 1,
        },
      },
    },
  },

  // Payments (Platby)
  {
    name: 'list_payments',
    description: 'List payment methods',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific payment ID',
        },
        code: {
          type: 'string',
          description: 'Payment code',
        },
        type: {
          type: 'string',
          description: 'Payment type',
          enum: ['cash', 'cashOnDelivery', 'command', 'paypal', 'gopay', 'stripe', 'custom'],
        },
        page: {
          type: 'number',
          minimum: 1,
        },
      },
    },
  },

  // Webhooks
  {
    name: 'list_webhooks',
    description: 'List configured webhooks',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Specific webhook ID',
        },
      },
    },
  },
  {
    name: 'create_webhook',
    description: 'Create new webhook',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Webhook name for internal identification',
        },
        url: {
          type: 'string',
          description: 'Webhook URL (must be absolute URI)',
        },
        event: {
          type: 'string',
          description: 'Event name (get list via list_webhook_events)',
        },
        active_yn: {
          type: 'boolean',
          description: 'Active status (default: true)',
        },
      },
      required: ['name', 'url', 'event'],
    },
  },
  {
    name: 'list_webhook_events',
    description: 'List available webhook events',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Languages (Jazyky)
  {
    name: 'get_languages',
    description: 'Get e-shop languages configuration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // E-shop config
  {
    name: 'get_shop_config',
    description: 'Get e-shop configuration and settings',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Owner (Provozovatel)
  {
    name: 'get_shop_owner',
    description: 'Get e-shop owner billing information',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // API Status
  {
    name: 'get_api_status',
    description: 'Get API status and list of allowed endpoints for current user',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Pricelists (Ceníky)
  {
    name: 'list_pricelists',
    description: 'List pricelists',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

/**
 * Get tool definition by name
 */
export function getToolDefinition(name: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.name === name);
}

/**
 * Validate if a tool exists
 */
export function isValidTool(name: string): boolean {
  return TOOLS.some((tool) => tool.name === name);
}
