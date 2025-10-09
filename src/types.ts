/**
 * TypeScript type definitions for Upgates MCP Server
 */

/**
 * Server configuration interface
 */
export interface UpgatesConfig {
  apiUrl: string;
  apiUsername: string;
  apiPassword: string;
  timeout?: number;
  anonymizeData?: boolean;
  readonlyMode?: boolean;
}

/**
 * API Request options
 */
export interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Pagination response
 */
export interface PaginationResponse<T> {
  current_page: number;
  current_page_items: number;
  number_of_pages: number;
  number_of_items: number;
  items: T[];
}

/**
 * Order data structure
 */
export interface Order {
  order_number: string;
  external_order_number?: string;
  status?: string;
  status_id?: number;
  language_id: string;
  creation_time: string;
  last_update_time?: string;
  paid_yn?: boolean;
  paid_date?: string;
  tracking_code?: string;
  tracking_url?: string;
  resolved_yn?: boolean;
  customer: OrderCustomer;
  products: OrderProduct[];
  shipment?: OrderShipment;
  payment?: OrderPayment;
  price_total_with_vat?: number;
  price_total_without_vat?: number;
}

/**
 * Order customer
 */
export interface OrderCustomer {
  email: string;
  phone?: string;
  firstname_invoice?: string;
  surname_invoice?: string;
  company?: string;
  company_yn?: boolean;
  ico?: string;
  dic?: string;
  street_invoice?: string;
  city_invoice?: string;
  zip_invoice?: string;
  country_id_invoice?: string;
}

/**
 * Order product
 */
export interface OrderProduct {
  code?: string;
  ean?: string;
  title: string;
  quantity: number;
  unit?: string;
  price_per_unit: number;
  price_per_unit_with_vat?: number;
  price_per_unit_without_vat?: number;
  vat: number;
  recycling_fee?: number;
  weight?: number;
}

/**
 * Order shipment
 */
export interface OrderShipment {
  id?: number;
  code?: string;
  name: string;
  type?: string;
  price: number;
  price_with_vat?: number;
  price_without_vat?: number;
  vat: number;
  affiliate_id?: string;
  affiliate_name?: string;
}

/**
 * Order payment
 */
export interface OrderPayment {
  id?: number;
  code?: string;
  name: string;
  type?: string;
  price: number;
  price_with_vat?: number;
  price_without_vat?: number;
  vat: number;
}

/**
 * Product data structure
 */
export interface Product {
  id: number;
  code?: string;
  code_supplier?: string;
  ean?: string;
  title: string;
  active_yn: boolean;
  can_add_to_basket_yn?: boolean;
  availability_id?: number;
  manufacturer_id?: number;
  weight?: number;
  price?: number;
  price_with_vat?: number;
  price_without_vat?: number;
  vat?: number;
  url?: string;
  image_url?: string;
}

/**
 * Invoice data structure
 */
export interface Invoice {
  invoice_number: string;
  order_number: string;
  variable_symbol: string;
  date_of_issuance: string;
  expiration_date: string;
  date_of_vat_revenue_recognition?: string;
  price_total_with_vat: number;
  price_total_without_vat: number;
  currency_id: string;
}

/**
 * Customer data structure
 */
export interface Customer {
  id: number;
  email: string;
  active_yn: boolean;
  blocked_yn: boolean;
  firstname?: string;
  surname?: string;
  phone?: string;
  company?: string;
  company_yn?: boolean;
  ico?: string;
  dic?: string;
  vat_payer_yn?: boolean;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Filter options for queries
 */
export interface FilterOptions {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  languageId?: string;
}

/**
 * Query options combining pagination and filtering
 */
export interface QueryOptions extends PaginationOptions, FilterOptions {
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}
