# Dostupné nástroje (34 tools)

Kompletní seznam všech MCP nástrojů pro Upgates API.

## 🛒 Objednávky (5 tools)

### `list_orders`
Seznam objednávek s rozšířeným filtrováním.

**Parametry:**
- `page` - Stránka (default: 1)
- `creation_time_from`, `creation_time_to` - Filtr podle data
- `paid_yn` - Zaplacené/nezaplacené
- `status`, `status_id` - Filtr podle stavu
- `email`, `phone` - Filtr podle zákazníka
- `order_by`, `order_dir` - Řazení (default: creation_time DESC)

**Default:** 15 nejnovějších objednávek

### `get_order_history`
Historie změn objednávky.

**Parametry:**
- `order_number` (required) - Číslo objednávky

### `create_order`
Vytvoření nové objednávky (max 100 najednou).

### `update_orders`
Aktualizace objednávek (stav, tracking kód, zákazník).

### `delete_orders`
Smazání objednávek.

---

## 📦 Produkty (5 tools)

### `list_products`
Seznam produktů s kompletními informacemi.

**Parametry:**
- `page` - Stránka (default: 1)
- `active_yn` - Aktivní produkty (default: true)
- `in_stock_yn` - Skladem
- `language` - Jazyková mutace
- `pricelist` - Ceník
- `variants_yn` - Zahrnout varianty (default: false)

**Default:** 15 aktivních produktů bez variant

### `list_products_simple`
Zjednodušený seznam (rychlejší).

### `create_products`
Vytvoření produktů s variantami (max 100).

### `update_products`
Aktualizace produktů (sklad, ceny, dostupnost).

### `delete_products`
Smazání produktů.

---

## 👥 Zákazníci (2 tools)

### `list_customers`
Seznam zákazníků.

**Parametry:**
- `active_yn` - Aktivní (default: true)
- `blocked_yn` - Blokovaní (default: false)
- `email`, `phone` - Vyhledávání
- `language`, `pricelist` - Filtry

**Default:** 15 aktivních, neblokovaných zákazníků

### `create_customers`
Vytvoření zákazníků (contact/customer/company).

---

## 🏷️ Kategorie a štítky (3 tools)

### `list_categories`
Hierarchický strom kategorií.

**Default:** Jen aktivní kategorie

### `create_categories`
Vytvoření kategorií.

### `list_labels`
Štítky produktů (akce, novinka, výprodej, vlastní).

---

## 📊 Číselníky (6 tools)

### `list_order_statuses`
Stavy objednávek.

### `create_order_status`
Vytvoření vlastního stavu.

### `list_availabilities`
Dostupnosti (skladem, na dotaz, není skladem).

### `list_manufacturers`
Seznam výrobců.

### `list_parameters`
Parametry produktů.

### `list_pricelists`
Ceníky.

---

## 🛍️ Košíky a kupóny (3 tools)

### `list_carts`
Nedokončené košíky.

**Default:** Košíky za poslední týden

### `list_vouchers`
Slevové kupóny.

**Default:** Jen aktivní

### `create_vouchers`
Vytvoření slevových kupónů.

---

## 🔔 Webhooky (3 tools)

### `list_webhooks`
Nakonfigurované webhooky.

### `create_webhook`
Vytvoření webhooku pro události.

### `list_webhook_events`
Dostupné události (Orders.create, Products.update, atd.).

---

## 📊 Faktury a platby (3 tools)

### `list_invoices`
Faktury, dobropisy, účtenky.

**Parametry:**
- `paid_yn` - Zaplacené
- `type` - invoice/creditNote/receipt
- `creation_time_from`, `creation_time_to` - Datum

### `list_payments`
Platební metody.

### `list_shipments`
Způsoby dopravy.

---

## ⚙️ Konfigurace e-shopu (4 tools)

### `get_languages`
Jazykové mutace e-shopu.

### `get_shop_config`
Nastavení e-shopu (DPH, OSS režim).

### `get_shop_owner`
Údaje provozovatele e-shopu.

### `get_api_status`
Stav API a oprávnění aktuálního uživatele.

---

## 💡 Příklady použití

```
"Kolik máme neuhrazených objednávek?"
→ list_orders s filter paid_yn=false

"Které produkty jsou vyprodané?"
→ list_products s filter in_stock_yn=false

"Seznam košíků s vyplněnými údaji"
→ list_carts s filter filled_delivery_info_yn=true

"Jaké webhook události jsou dostupné?"
→ list_webhook_events

"Aktivní slevové kupóny"
→ list_vouchers (default už filtruje active_yn=true)
```

---

Pro detailní API referenci viz [Upgates API v2 Dokumentace](https://upgatesapiv2.docs.apiary.io/)
