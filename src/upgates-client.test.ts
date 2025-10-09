/**
 * Unit tests for UpgatesClient anonymization
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { UpgatesClient } from './upgates-client.js';

describe('UpgatesClient Anonymization', () => {
  const mockConfig = {
    apiUrl: 'https://test.upgates.com/api/v2',
    apiUsername: 'test',
    apiPassword: 'test',
    anonymizeData: true,
  };

  const client = new UpgatesClient(mockConfig);

  describe('anonymize customer data', () => {
    it('should anonymize email fields', () => {
      const data = {
        customer: {
          email: 'customer@example.com',
          customer_email: 'test@test.com',
        },
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.customer.email, '***ANONYMIZED***');
      assert.strictEqual(anonymized.customer.customer_email, '***ANONYMIZED***');
    });

    it('should anonymize phone fields', () => {
      const data = {
        phone: '+420123456789',
        phoneNumber: '987654321',
        fax: '111222333',
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.phone, '***ANONYMIZED***');
      assert.strictEqual(anonymized.phoneNumber, '***ANONYMIZED***');
      assert.strictEqual(anonymized.fax, '***ANONYMIZED***');
    });

    it('should anonymize name fields', () => {
      const data = {
        firstname: 'Jan',
        surname: 'Novák',
        firstname_invoice: 'Petr',
        surname_invoice: 'Svoboda',
        company: 'Test s.r.o.',
        customer_name: 'Jan Novák',
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.firstname, '***ANONYMIZED***');
      assert.strictEqual(anonymized.surname, '***ANONYMIZED***');
      assert.strictEqual(anonymized.firstname_invoice, '***ANONYMIZED***');
      assert.strictEqual(anonymized.surname_invoice, '***ANONYMIZED***');
      assert.strictEqual(anonymized.company, '***ANONYMIZED***');
      assert.strictEqual(anonymized.customer_name, '***ANONYMIZED***');
    });

    it('should anonymize address fields', () => {
      const data = {
        street: 'Hlavní 123',
        street_invoice: 'Nová 456',
        city: 'Praha',
        city_postal: 'Brno',
        zip: '12000',
        zip_invoice: '60000',
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.street, '***ANONYMIZED***');
      assert.strictEqual(anonymized.street_invoice, '***ANONYMIZED***');
      assert.strictEqual(anonymized.city, '***ANONYMIZED***');
      assert.strictEqual(anonymized.city_postal, '***ANONYMIZED***');
      assert.strictEqual(anonymized.zip, '***ANONYMIZED***');
      assert.strictEqual(anonymized.zip_invoice, '***ANONYMIZED***');
    });

    it('should anonymize business identifiers', () => {
      const data = {
        ico: '12345678',
        dic: 'CZ12345678',
        company_number: '87654321',
        vat_number: 'SK9876543210',
        iban: 'CZ1234567890',
        swift: 'KOMBCZPP',
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.ico, '***ANONYMIZED***');
      assert.strictEqual(anonymized.dic, '***ANONYMIZED***');
      assert.strictEqual(anonymized.company_number, '***ANONYMIZED***');
      assert.strictEqual(anonymized.vat_number, '***ANONYMIZED***');
      assert.strictEqual(anonymized.iban, '***ANONYMIZED***');
      assert.strictEqual(anonymized.swift, '***ANONYMIZED***');
    });

    it('should preserve null and undefined values', () => {
      const data = {
        email: null,
        phone: undefined,
        name: '',
        validField: 'keep-this',
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.email, null);
      assert.strictEqual(anonymized.phone, undefined);
      assert.strictEqual(anonymized.name, '');
      assert.strictEqual(anonymized.validField, 'keep-this');
    });

    it('should anonymize nested objects', () => {
      const data = {
        customer: {
          email: 'test@test.com',
          address: {
            street: 'Main St 123',
            city: 'Prague',
          },
        },
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.customer.email, '***ANONYMIZED***');
      assert.strictEqual(anonymized.customer.address.street, '***ANONYMIZED***');
      assert.strictEqual(anonymized.customer.address.city, '***ANONYMIZED***');
    });

    it('should anonymize arrays of objects', () => {
      const data = {
        orders: [
          { customer: { email: 'customer1@test.com', phone: '111' } },
          { customer: { email: 'customer2@test.com', phone: '222' } },
        ],
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.orders[0].customer.email, '***ANONYMIZED***');
      assert.strictEqual(anonymized.orders[0].customer.phone, '***ANONYMIZED***');
      assert.strictEqual(anonymized.orders[1].customer.email, '***ANONYMIZED***');
      assert.strictEqual(anonymized.orders[1].customer.phone, '***ANONYMIZED***');
    });

    it('should preserve non-sensitive fields', () => {
      const data = {
        order_number: 'ORD-12345',
        product_id: 123,
        price: 99.99,
        status: 'pending',
        email: 'test@test.com', // This should be anonymized
      };

      const anonymized = client.getAnonymizedData(data);
      assert.strictEqual(anonymized.order_number, 'ORD-12345');
      assert.strictEqual(anonymized.product_id, 123);
      assert.strictEqual(anonymized.price, 99.99);
      assert.strictEqual(anonymized.status, 'pending');
      assert.strictEqual(anonymized.email, '***ANONYMIZED***');
    });
  });

  describe('anonymization mode check', () => {
    it('should return true when anonymization is enabled', () => {
      const client = new UpgatesClient({
        apiUrl: 'https://test.com',
        apiUsername: 'test',
        apiPassword: 'test',
        anonymizeData: true,
      });

      assert.strictEqual(client.isAnonymizationEnabled(), true);
    });

    it('should return false when anonymization is disabled', () => {
      const client = new UpgatesClient({
        apiUrl: 'https://test.com',
        apiUsername: 'test',
        apiPassword: 'test',
        anonymizeData: false,
      });

      assert.strictEqual(client.isAnonymizationEnabled(), false);
    });

    it('should not anonymize when disabled', () => {
      const client = new UpgatesClient({
        apiUrl: 'https://test.com',
        apiUsername: 'test',
        apiPassword: 'test',
        anonymizeData: false,
      });

      const data = {
        email: 'test@test.com',
        name: 'Test User',
      };

      const result = client.getAnonymizedData(data);
      assert.strictEqual(result.email, 'test@test.com');
      assert.strictEqual(result.name, 'Test User');
    });
  });
});
