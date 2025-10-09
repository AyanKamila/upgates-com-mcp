/**
 * Tool request handlers for Upgates API
 */

import { UpgatesClient } from '../upgates-client.js';
import { NotFoundError, ReadonlyError } from '../errors/index.js';
import { validateDateRange, validatePagination } from '../validators/index.js';
import { optimizeListResponse } from '../optimizers/index.js';

/**
 * List of write operations (tools that modify data)
 */
const WRITE_OPERATIONS = new Set([
  'create_order',
  'update_orders',
  'delete_orders',
  'create_order_status',
  'create_products',
  'update_products',
  'delete_products',
  'create_customers',
  'create_categories',
  'create_vouchers',
  'create_webhook',
]);

/**
 * Check if operation is allowed in readonly mode
 */
function checkReadonlyMode(toolName: string, client: UpgatesClient): void {
  if (client.isReadonlyMode() && WRITE_OPERATIONS.has(toolName)) {
    throw new ReadonlyError(
      `Operation '${toolName}' is not allowed in readonly mode. Set UPGATES_READONLY=false to enable write operations.`,
      toolName
    );
  }
}

/**
 * Default values for list operations
 */
const DEFAULT_PAGE_SIZE = 20; // Optimal for LLM context window
const DEFAULT_SORT_DIR = 'desc'; // Newest first

/**
 * Build query string from parameters with defaults
 */
function buildQueryParams(params: Record<string, any>, defaults?: Record<string, any>): Record<string, any> {
  const query: Record<string, any> = { ...defaults };

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      query[key] = value;
    }
  }

  return query;
}

/**
 * Handle list_orders tool
 */
async function handleListOrders(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });
  validateDateRange(params.creation_time_from, params.creation_time_to);

  const endpoint = params.order_number
    ? `/orders/${params.order_number}`
    : '/orders';

  // Set defaults: 20 items per page, sorted by creation_time desc (newest first)
  const defaults = {
    page: 1,
    order_by: 'creation_time',
    order_dir: DEFAULT_SORT_DIR,
  };

  const response = await client.get(endpoint, buildQueryParams(params, defaults));

  // Optimize response for LLM
  let data = optimizeListResponse(response.data, 'orders');

  // Anonymize customer data in orders
  return client.isAnonymizationEnabled()
    ? client.getAnonymizedData(data)
    : data;
}

/**
 * Handle create_order tool
 */
async function handleCreateOrder(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.post('/orders', params);
  return response.data;
}

/**
 * Handle update_orders tool
 */
async function handleUpdateOrders(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.put('/orders', params);
  return response.data;
}

/**
 * Handle delete_orders tool
 */
async function handleDeleteOrders(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.delete('/orders', buildQueryParams(params));
  return response.data;
}

/**
 * Handle get_order_history tool
 */
async function handleGetOrderHistory(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.get(`/orders/${params.order_number}/history`);

  // Anonymize history data
  return client.isAnonymizationEnabled()
    ? client.getAnonymizedData(response.data)
    : response.data;
}

/**
 * Handle list_order_statuses tool
 */
async function handleListOrderStatuses(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const endpoint = params.id
    ? `/order-statuses/${params.id}`
    : '/order-statuses';

  const response = await client.get(endpoint, buildQueryParams(params));
  return response.data;
}

/**
 * Handle create_order_status tool
 */
async function handleCreateOrderStatus(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.post('/order-statuses', params);
  return response.data;
}

/**
 * Handle list_invoices tool
 */
async function handleListInvoices(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });
  validateDateRange(params.creation_time_from, params.creation_time_to);

  const endpoint = params.invoice_number
    ? `/invoices/${params.invoice_number}`
    : '/invoices';

  // Set defaults: page 1, 20 items
  const defaults = {
    page: 1,
  };

  const response = await client.get(endpoint, buildQueryParams(params, defaults));

  // Optimize response for LLM
  let data = optimizeListResponse(response.data, 'invoices');

  // Anonymize customer data in invoices
  return client.isAnonymizationEnabled()
    ? client.getAnonymizedData(data)
    : data;
}

/**
 * Handle list_products tool
 */
async function handleListProducts(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.code
    ? `/products/${params.code}`
    : '/products';

  // Set defaults: page 1, active only, with variants
  const defaults = {
    page: 1,
    active_yn: params.active_yn !== undefined ? params.active_yn : true,
    variants_yn: params.variants_yn !== undefined ? params.variants_yn : false,
  };

  const response = await client.get(endpoint, buildQueryParams(params, defaults));

  // Optimize response for LLM
  return optimizeListResponse(response.data, 'products');
}

/**
 * Handle list_products_simple tool
 */
async function handleListProductsSimple(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.code
    ? `/products/${params.code}/simple`
    : '/products/simple';

  const response = await client.get(endpoint, buildQueryParams(params));
  return response.data;
}

/**
 * Handle create_products tool
 */
async function handleCreateProducts(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.post('/products', params);
  return response.data;
}

/**
 * Handle update_products tool
 */
async function handleUpdateProducts(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.put('/products', params);
  return response.data;
}

/**
 * Handle delete_products tool
 */
async function handleDeleteProducts(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const endpoint = params.code
    ? `/products/${params.code}`
    : '/products';

  const response = await client.delete(endpoint, buildQueryParams(params));
  return response.data;
}

/**
 * Handle list_customers tool
 */
async function handleListCustomers(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  // Set defaults: page 1, active customers only
  const defaults = {
    page: 1,
    active_yn: params.active_yn !== undefined ? params.active_yn : true,
    blocked_yn: params.blocked_yn !== undefined ? params.blocked_yn : false,
  };

  const response = await client.get('/customers', buildQueryParams(params, defaults));

  // Optimize response for LLM
  let data = optimizeListResponse(response.data, 'customers');

  // Always anonymize customer data
  return client.isAnonymizationEnabled()
    ? client.getAnonymizedData(data)
    : data;
}

/**
 * Handle create_customers tool
 */
async function handleCreateCustomers(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.post('/customers', params);
  return response.data;
}

/**
 * Handle list_categories tool
 */
async function handleListCategories(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  // Set defaults: page 1, active only
  const defaults = {
    page: 1,
    active_yn: params.active_yn !== undefined ? params.active_yn : true,
  };

  const response = await client.get('/categories', buildQueryParams(params, defaults));

  // Optimize response for LLM
  return optimizeListResponse(response.data, 'categories');
}

/**
 * Handle create_categories tool
 */
async function handleCreateCategories(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.post('/categories', params);
  return response.data;
}

/**
 * Handle list_labels tool
 */
async function handleListLabels(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.id
    ? `/labels/${params.id}`
    : '/labels';

  const response = await client.get(endpoint, buildQueryParams(params));
  return response.data;
}

/**
 * Handle list_availabilities tool
 */
async function handleListAvailabilities(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.id
    ? `/availabilities/${params.id}`
    : '/availabilities';

  const response = await client.get(endpoint, buildQueryParams(params));
  return response.data;
}

/**
 * Handle list_manufacturers tool
 */
async function handleListManufacturers(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.id
    ? `/manufacturers/${params.id}`
    : '/manufacturers';

  const response = await client.get(endpoint, buildQueryParams(params));
  return response.data;
}

/**
 * Handle list_parameters tool
 */
async function handleListParameters(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.id
    ? `/parameters/${params.id}`
    : '/parameters';

  const response = await client.get(endpoint, buildQueryParams(params));
  return response.data;
}

/**
 * Handle list_carts tool
 */
async function handleListCarts(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.id
    ? `/carts/${params.id}`
    : '/carts';

  // Set defaults: page 1, recent carts only (last 7 days)
  const defaults: Record<string, any> = {
    page: 1,
  };

  // Default: carts from last 7 days if no filter specified
  if (!params.creation_time_from && !params.id) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    defaults.creation_time_from = sevenDaysAgo.toISOString().split('T')[0];
  }

  const response = await client.get(endpoint, buildQueryParams(params, defaults));

  // Optimize response for LLM
  let data = optimizeListResponse(response.data, 'carts');

  // Anonymize cart data (contains customer info)
  return client.isAnonymizationEnabled()
    ? client.getAnonymizedData(data)
    : data;
}

/**
 * Handle list_vouchers tool
 */
async function handleListVouchers(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.voucher_code
    ? `/vouchers/${params.voucher_code}`
    : '/vouchers';

  // Set defaults: page 1, active vouchers only
  const defaults = {
    page: 1,
    active_yn: params.active_yn !== undefined ? params.active_yn : true,
  };

  const response = await client.get(endpoint, buildQueryParams(params, defaults));
  return response.data;
}

/**
 * Handle create_vouchers tool
 */
async function handleCreateVouchers(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.post('/vouchers', params);
  return response.data;
}

/**
 * Handle list_shipments tool
 */
async function handleListShipments(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.id
    ? `/shipments/${params.id}`
    : '/shipments';

  const defaults = {
    page: 1,
  };

  const response = await client.get(endpoint, buildQueryParams(params, defaults));

  // Optimize response for LLM (removes multi-language descriptions)
  return optimizeListResponse(response.data, 'shipments');
}

/**
 * Handle list_payments tool
 */
async function handleListPayments(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  validatePagination({ page: params.page });

  const endpoint = params.id
    ? `/payments/${params.id}`
    : '/payments';

  const defaults = {
    page: 1,
  };

  const response = await client.get(endpoint, buildQueryParams(params, defaults));

  // Optimize response for LLM (removes multi-language descriptions)
  return optimizeListResponse(response.data, 'payments');
}

/**
 * Handle list_webhooks tool
 */
async function handleListWebhooks(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const endpoint = params.id
    ? `/webhooks/${params.id}`
    : '/webhooks';

  const response = await client.get(endpoint);
  return response.data;
}

/**
 * Handle create_webhook tool
 */
async function handleCreateWebhook(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  const response = await client.post('/webhooks', params);
  return response.data;
}

/**
 * Handle list_webhook_events tool
 */
async function handleListWebhookEvents(
  client: UpgatesClient
): Promise<any> {
  const response = await client.get('/webhooks/events');
  return response.data;
}

/**
 * Handle get_languages tool
 */
async function handleGetLanguages(
  client: UpgatesClient
): Promise<any> {
  const response = await client.get('/languages');
  return response.data;
}

/**
 * Handle get_shop_config tool
 */
async function handleGetShopConfig(
  client: UpgatesClient
): Promise<any> {
  const response = await client.get('/config');
  return response.data;
}

/**
 * Handle get_shop_owner tool
 */
async function handleGetShopOwner(
  client: UpgatesClient
): Promise<any> {
  const response = await client.get('/owner');

  // Anonymize owner business info
  return client.isAnonymizationEnabled()
    ? client.getAnonymizedData(response.data)
    : response.data;
}

/**
 * Handle get_api_status tool
 */
async function handleGetApiStatus(
  client: UpgatesClient
): Promise<any> {
  const response = await client.get('/status');
  return response.data;
}

/**
 * Handle list_pricelists tool
 */
async function handleListPricelists(
  client: UpgatesClient
): Promise<any> {
  const response = await client.get('/pricelists');
  return response.data;
}

/**
 * Main tool handler dispatcher
 */
export async function handleToolRequest(
  toolName: string,
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  // Check readonly mode for write operations
  checkReadonlyMode(toolName, client);

  switch (toolName) {
    // Orders
    case 'list_orders':
      return handleListOrders(client, params);
    case 'create_order':
      return handleCreateOrder(client, params);
    case 'update_orders':
      return handleUpdateOrders(client, params);
    case 'delete_orders':
      return handleDeleteOrders(client, params);
    case 'get_order_history':
      return handleGetOrderHistory(client, params);

    // Order Statuses
    case 'list_order_statuses':
      return handleListOrderStatuses(client, params);
    case 'create_order_status':
      return handleCreateOrderStatus(client, params);

    // Invoices
    case 'list_invoices':
      return handleListInvoices(client, params);

    // Products
    case 'list_products':
      return handleListProducts(client, params);
    case 'list_products_simple':
      return handleListProductsSimple(client, params);
    case 'create_products':
      return handleCreateProducts(client, params);
    case 'update_products':
      return handleUpdateProducts(client, params);
    case 'delete_products':
      return handleDeleteProducts(client, params);

    // Customers
    case 'list_customers':
      return handleListCustomers(client, params);
    case 'create_customers':
      return handleCreateCustomers(client, params);

    // Categories
    case 'list_categories':
      return handleListCategories(client, params);
    case 'create_categories':
      return handleCreateCategories(client, params);

    // Labels
    case 'list_labels':
      return handleListLabels(client, params);

    // Availabilities
    case 'list_availabilities':
      return handleListAvailabilities(client, params);

    // Manufacturers
    case 'list_manufacturers':
      return handleListManufacturers(client, params);

    // Parameters
    case 'list_parameters':
      return handleListParameters(client, params);

    // Carts
    case 'list_carts':
      return handleListCarts(client, params);

    // Vouchers
    case 'list_vouchers':
      return handleListVouchers(client, params);
    case 'create_vouchers':
      return handleCreateVouchers(client, params);

    // Shipments
    case 'list_shipments':
      return handleListShipments(client, params);

    // Payments
    case 'list_payments':
      return handleListPayments(client, params);

    // Webhooks
    case 'list_webhooks':
      return handleListWebhooks(client, params);
    case 'create_webhook':
      return handleCreateWebhook(client, params);
    case 'list_webhook_events':
      return handleListWebhookEvents(client);

    // Languages
    case 'get_languages':
      return handleGetLanguages(client);

    // Shop config
    case 'get_shop_config':
      return handleGetShopConfig(client);

    // Shop owner
    case 'get_shop_owner':
      return handleGetShopOwner(client);

    // API status
    case 'get_api_status':
      return handleGetApiStatus(client);

    // Pricelists
    case 'list_pricelists':
      return handleListPricelists(client);

    default:
      throw new NotFoundError(`Unknown tool: ${toolName}`, 'tool');
  }
}
