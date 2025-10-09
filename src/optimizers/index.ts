/**
 * Response optimizers for LLM context window efficiency
 * Reduces token usage by filtering only essential fields
 */

/**
 * Optimize order object - keep only essential fields
 */
export function optimizeOrder(order: any): any {
  return {
    order_number: order.order_number,
    status: order.status,
    status_id: order.status_id,
    creation_time: order.creation_time,
    paid_yn: order.paid_date ? true : false,
    paid_date: order.paid_date,
    order_total: order.order_total,
    currency_id: order.currency_id,
    language_id: order.language_id,
    tracking_code: order.tracking_code,
    external_order_number: order.external_order_number,

    // Customer - only essential
    customer: order.customer ? {
      email: order.customer.email,
      phone: order.customer.phone,
      firstname_invoice: order.customer.firstname_invoice,
      surname_invoice: order.customer.surname_invoice,
      company: order.customer.company,
      customer_note: order.customer.customer_note,
    } : null,

    // Products - summary only
    products_count: order.products?.length || 0,
    products_summary: order.products?.map((p: any) => ({
      code: p.code,
      title: p.title,
      quantity: p.quantity,
      price: p.price,
    })) || [],

    // Shipment - essential only
    shipment: order.shipment ? {
      name: order.shipment.name,
      type: order.shipment.type,
      price: order.shipment.price,
      affiliate_name: order.shipment.affiliate_name,
    } : null,

    // Payment - essential only
    payment: order.payment ? {
      name: order.payment.name,
      type: order.payment.type,
      price: order.payment.price,
    } : null,
  };
}

/**
 * Optimize product object - keep only essential fields
 */
export function optimizeProduct(product: any): any {
  return {
    product_id: product.product_id,
    code: product.code,
    active_yn: product.active_yn,
    can_add_to_basket_yn: product.can_add_to_basket_yn,
    stock: product.stock,
    availability: product.availability,
    manufacturer: product.manufacturer,

    // First description only (usually Czech)
    title: product.descriptions?.[0]?.title || null,
    url: product.descriptions?.[0]?.url || null,

    // First price only
    price_with_vat: product.prices?.[0]?.pricelists?.[0]?.price_with_vat || null,
    price_without_vat: product.prices?.[0]?.pricelists?.[0]?.price_without_vat || null,
    currency: product.prices?.[0]?.currency || null,

    // Main category only
    main_category: product.categories?.find((c: any) => c.main_yn)?.code ||
                   product.categories?.[0]?.code || null,

    // Variant count
    variants_count: product.variants?.length || 0,
  };
}

/**
 * Optimize customer object - keep only essential fields
 */
export function optimizeCustomer(customer: any): any {
  return {
    customer_id: customer.customer_id,
    email: customer.email,
    type: customer.type,
    firstname: customer.firstname,
    surname: customer.surname,
    company: customer.company?.name || null,
    active_yn: customer.login?.active_yn,
    blocked_yn: customer.login?.blocked_yn,
    language: customer.language,
    pricelist: customer.pricelist,
    turnover: customer.turnover,
    turnover_currency: customer.turnover_currency,
  };
}

/**
 * Optimize invoice object - keep only essential fields
 */
export function optimizeInvoice(invoice: any): any {
  return {
    invoice_number: invoice.invoice_number,
    order_number: invoice.order_number,
    type: invoice.type,
    date_of_issuance: invoice.date_of_issuance,
    date_of_expiration: invoice.date_of_expiration,
    paid_yn: invoice.paid_yn,
    paid_date: invoice.paid_date,
    total_with_vat: invoice.total_with_vat,
    currency_id: invoice.currency_id,
    variable_symbol: invoice.variable_symbol,
    customer_email: invoice.customer?.email || null,
  };
}

/**
 * Optimize category object - keep only essential fields
 */
export function optimizeCategory(category: any): any {
  return {
    category_id: category.category_id,
    code: category.code,
    parent_id: category.parent_id,
    active_yn: category.active_yn,
    type: category.type,
    // First description only
    name: category.descriptions?.[0]?.name || null,
    url: category.descriptions?.[0]?.url || null,
  };
}

/**
 * Optimize cart object - keep only essential fields
 */
export function optimizeCart(cart: any): any {
  return {
    id: cart.id,
    uuid: cart.uuid,
    datetime: cart.datetime,
    language: cart.language,
    customer_email: cart.customer?.email || null,
    customer_logged_in_yn: cart.customer?.customer_logged_in_yn,
    filled_delivery_info_yn: cart.customer?.filled_delivery_info_yn,
    products_count: cart.products?.length || 0,
    products_summary: cart.products?.map((p: any) => ({
      code: p.code,
      quantity: p.quantity,
    })) || [],
    shipment_name: cart.shipment?.name || null,
    payment_name: cart.payment?.name || null,
  };
}

/**
 * Optimize payment object - keep only essential fields
 */
export function optimizePayment(payment: any): any {
  return {
    id: payment.id,
    code: payment.code,
    type: payment.type,
    active_yn: payment.active_yn,
    // First description only (usually Czech)
    name: payment.descriptions?.[0]?.name || null,
    description: payment.descriptions?.[0]?.description || null,
    price: payment.descriptions?.[0]?.price || null,
    price_type: payment.descriptions?.[0]?.price_type || null,
    free_from: payment.descriptions?.[0]?.free_from || null,
  };
}

/**
 * Optimize shipment object - keep only essential fields
 */
export function optimizeShipment(shipment: any): any {
  return {
    id: shipment.id,
    code: shipment.code,
    type: shipment.type,
    active_yn: shipment.active_yn,
    affiliates: shipment.affiliates,
    // First description only (usually Czech)
    name: shipment.descriptions?.[0]?.name || null,
    description: shipment.descriptions?.[0]?.description || null,
    price: shipment.descriptions?.[0]?.price || null,
    free_from: shipment.descriptions?.[0]?.free_from || null,
  };
}

/**
 * Maximum items to return for MCP responses (to stay under 25k token limit)
 */
const MAX_ITEMS_FOR_MCP = 15;

/**
 * Optimize list response - apply entity-specific optimization with item limiting
 */
export function optimizeListResponse(data: any, entityType: string, maxItems: number = MAX_ITEMS_FOR_MCP): any {
  // If no optimization needed, return as-is
  if (!data) return data;

  // Keep pagination metadata (update to reflect actual returned items)
  const optimized: any = {
    current_page: data.current_page,
    number_of_pages: data.number_of_pages,
    number_of_items: data.number_of_items,
    mcp_limited_to: maxItems,
    mcp_note: `Showing first ${maxItems} of ${data.current_page_items} items on this page. Use page parameter to see more.`,
  };

  // Optimize based on entity type and limit items
  switch (entityType) {
    case 'orders':
      optimized.orders = (data.orders?.slice(0, maxItems) || []).map(optimizeOrder);
      optimized.current_page_items = optimized.orders.length;
      break;

    case 'products':
      optimized.products = (data.products?.slice(0, maxItems) || []).map(optimizeProduct);
      optimized.current_page_items = optimized.products.length;
      break;

    case 'customers':
      optimized.customers = (data.customers?.slice(0, maxItems) || []).map(optimizeCustomer);
      optimized.current_page_items = optimized.customers.length;
      break;

    case 'invoices':
      optimized.invoices = (data.invoices?.slice(0, maxItems) || []).map(optimizeInvoice);
      optimized.current_page_items = optimized.invoices.length;
      break;

    case 'categories':
      optimized.categories = (data.categories?.slice(0, maxItems) || []).map(optimizeCategory);
      optimized.current_page_items = optimized.categories.length;
      break;

    case 'carts':
      optimized.carts = (data.carts?.slice(0, maxItems) || []).map(optimizeCart);
      optimized.current_page_items = optimized.carts.length;
      break;

    // Payments and Shipments need optimization (they have multi-language descriptions)
    case 'payments':
      optimized.payments = (data.payments?.slice(0, maxItems) || []).map(optimizePayment);
      optimized.current_page_items = optimized.payments.length;
      break;

    case 'shipments':
      optimized.shipments = (data.shipments?.slice(0, maxItems) || []).map(optimizeShipment);
      optimized.current_page_items = optimized.shipments.length;
      break;

    // For simple entities, keep as-is (they're usually small and already optimized)
    case 'order_statuses':
    case 'labels':
    case 'availabilities':
    case 'manufacturers':
    case 'parameters':
    case 'vouchers':
    default:
      return data; // Keep full data for simple entities
  }

  return optimized;
}

/**
 * Check if optimization should be applied
 * Can be controlled via environment variable
 */
export function shouldOptimize(): boolean {
  return process.env.UPGATES_OPTIMIZE_RESPONSES !== 'false';
}
