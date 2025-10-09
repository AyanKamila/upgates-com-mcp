# GDPR Anonymizace zákaznických dat

Server podporuje automatickou anonymizaci citlivých zákaznických údajů pro ochranu soukromí a splnění GDPR.

## Zapnutí anonymizace

```bash
UPGATES_ANONYMIZE_DATA=true
```

## Co se anonymizuje (40+ polí)

### Zákaznické údaje
- Email: `email`, `customer_email`
- Phone: `phone`, `phoneNumber`, `fax`
- Names: `firstname`, `surname`, `customer_name`, `nickname`
- Invoice names: `firstname_invoice`, `surname_invoice`
- Postal names: `firstname_postal`, `surname_postal`
- Company: `company`, `company_name`, `company_postal`

### Adresy
- Street: `street`, `street_invoice`, `street_postal`
- City: `city`, `city_invoice`, `city_postal`
- State/Region: `state`, `state_invoice`, `state_postal`
- ZIP: `zip`, `zip_invoice`, `zip_postal`, `zip_code`

### Firemní identifikátory
- Czech/Slovak IDs: `ico`, `dic`
- International: `company_number`, `vat_number`
- Banking: `iban`, `swift`, `bank_account`, `account_number`

### Ostatní citlivá data
- Notes: `customer_note`, `internal_note`, `note`
- Personal: `degree`, `salutation`, `declension`
- Symbols: `variable_symbol`, `specific_symbol`
- Codes: `code`, `customer_code`

Plus jakékoliv pole obsahující: name, email, phone, address, street, city, zip

## Příklad

### Bez anonymizace
```json
{
  "customer": {
    "email": "jan.novak@example.com",
    "phone": "+420123456789",
    "firstname_invoice": "Jan",
    "surname_invoice": "Novák",
    "street_invoice": "Hlavní 123",
    "city_invoice": "Praha",
    "zip_invoice": "12000",
    "company": "Test s.r.o.",
    "ico": "12345678",
    "dic": "CZ12345678"
  }
}
```

### S anonymizací
```json
{
  "customer": {
    "email": "***ANONYMIZED***",
    "phone": "***ANONYMIZED***",
    "firstname_invoice": "***ANONYMIZED***",
    "surname_invoice": "***ANONYMIZED***",
    "street_invoice": "***ANONYMIZED***",
    "city_invoice": "***ANONYMIZED***",
    "zip_invoice": "***ANONYMIZED***",
    "company": "***ANONYMIZED***",
    "ico": "***ANONYMIZED***",
    "dic": "***ANONYMIZED***"
  }
}
```

Necitlivá pole (order_number, product_id, price, status) zůstávají nezměněná.

## Které endpointy anonymizují

- `list_orders` - Zákaznická data v objednávkách
- `get_order_history` - Historie může obsahovat zákaznická data
- `list_invoices` - Fakturační údaje zákazníků
- `list_customers` - Všechna osobní data (PII)
- `list_carts` - Údaje v košících
- `get_shop_owner` - Údaje majitele shopu

## Technické detaily

- **Deep anonymization**: Rekurzivně prochází vnořené objekty a pole
- **Null preservation**: Zachovává `null`, `undefined` a prázdné řetězce
- **Non-destructive**: Vytváří deep copy, nemění originál
- **Pattern matching**: Zachytává pole podle jména i keywords

## Use Cases

- **GDPR Compliance**: Ochrana PII v logách a debugging
- **Development & Testing**: Práce s produkčními daty bezpečně
- **Training & Demos**: Použití reálné struktury dat bez privacy concerns
- **Analytics**: Analýza vzorců bez ukládání osobních dat
- **Shared Environments**: Více vývojářů může přistupovat k datům bezpečně
