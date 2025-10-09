# Readonly režim

Server podporuje readonly režim pro bezpečné testování bez rizika změny dat.

## Zapnutí readonly režimu

```bash
UPGATES_READONLY=true
```

## Jak funguje

### Povoleno ✅
Všechny GET/list operace:
- `list_orders`, `list_products`, `list_customers`
- `list_invoices`, `list_categories`, `list_carts`
- `list_vouchers`, `list_payments`, `list_shipments`
- `get_languages`, `get_shop_config`, `get_api_status`

### Blokováno ❌
Všechny write operace:
- `create_order`, `update_orders`, `delete_orders`
- `create_order_status`
- `create_products`, `update_products`, `delete_products`
- `create_customers`
- `create_categories`
- `create_vouchers`
- `create_webhook`

## Chybová hláška

```
ReadonlyError [READONLY_MODE] Operation 'create_order' is not allowed in readonly mode.
Set UPGATES_READONLY=false to enable write operations. (operation: create_order)
```

## Kdy použít

### ✅ Zapněte readonly když:
- 🧪 Testujete MCP server poprvé
- 📊 Potřebujete pouze číst data (monitoring, analytics)
- 👨‍🎓 Učíte se pracovat s API
- 🔍 Explorujete strukturu dat
- 👥 Sdílíte přístup s více lidmi

### ⚠️ Vypněte readonly když:
- Potřebujete aktualizovat stavy objednávek
- Synchronizujete produkty ze skladu
- Konfigurujete webhooky
- Vytváříte objednávky z externího systému

## Bezpečnostní vrstva

Readonly mode poskytuje **aplikační vrstvu ochrany** nad API permissions:

1. **Aplikační vrstva**: `UPGATES_READONLY=true` blokuje write operace v kódu
2. **API vrstva**: API user permissions (nastavené v Upgates admin)

**Dvojitá ochrana** = maximální bezpečnost! 🔒

## Kombinace s anonymizací

Doporučená konfigurace pro produkci:

```bash
UPGATES_READONLY=true          # Ochrana proti změnám
UPGATES_ANONYMIZE_DATA=true    # Ochrana zákaznických dat
```

**Nejbezpečnější nastavení pro testování a monitoring!**
