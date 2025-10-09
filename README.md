# Upgates MCP Server

> **AI asistent pro e-shopy Upgates**

Propojte Claude AI s vaším Upgates e-shopem a automatizujte správu objednávek, produktů a zákazníků.

✅ **99.8% redukce tokenů** pro efektivní AI zpracování
✅ Automatický monitoring objednávek a košíků
✅ Správa produktů, skladů a dostupností
✅ GDPR anonymizace zákaznických údajů
✅ Readonly režim pro bezpečné testování
✅ Webhook integrace pro real-time notifikace

---

## 🚀 Rychlý start

### 1. Instalace

```bash
npm install
npm run build
```

### 2. Konfigurace

Vytvořte API přístup v administraci Upgates (**Doplňky > API**) a přidejte do `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "upgates": {
      "command": "node",
      "args": ["/cesta/k/projektu/dist/index.js"],
      "env": {
        "UPGATES_API_URL": "https://vas-shop.admin.s17.upgates.com/api/v2",
        "UPGATES_API_USERNAME": "vase-api-login",
        "UPGATES_API_PASSWORD": "vas-api-klic",
        "UPGATES_READONLY": "true",
        "UPGATES_ANONYMIZE_DATA": "true"
      }
    }
  }
}
```

### 3. Použití

Zeptejte se Claude AI:

```
"Kolik máme neuhrazených objednávek?"
"Jaké produkty jsou vyprodané?"
"Které košíky obsahují kontaktní údaje zákazníků?"
"Vytvoř přehled objednávek za poslední týden"
```

---

## 📦 Dostupné nástroje (34 nástrojů)

### 🛒 Objednávky

| Nástroj | Popis |
|---------|-------|
| `list_orders` | Seznam objednávek s rozšířeným filtrováním (stav, datum, email, telefon) |
| `get_order_history` | Historie změn objednávky |
| `create_order` | Vytvoření nové objednávky (readonly blokuje) |
| `update_orders` | Aktualizace objednávek (stav, tracking kód) |
| `delete_orders` | Smazání objednávek |

**Příklad použití:**
```
"Seznam všech nezaplacených objednávek za poslední týden"
"Historie objednávky ORD-12345"
```

### 📦 Produkty

| Nástroj | Popis |
|---------|-------|
| `list_products` | Kompletní seznam produktů s variantami, cenami (max 50/stránka) |
| `list_products_simple` | Zjednodušený seznam produktů (rychlejší) |
| `create_products` | Vytvoření produktů s variantami |
| `update_products` | Aktualizace produktů (sklad, ceny, dostupnost) |
| `delete_products` | Smazání produktů |

**Příklad použití:**
```
"Které produkty byly aktualizované dnes?"
"Seznam všech aktivních produktů skladem"
```

### 👥 Zákazníci

| Nástroj | Popis |
|---------|-------|
| `list_customers` | Seznam zákazníků s filtrováním (anonymizace GDPR) |
| `create_customers` | Vytvoření zákazníků (kontakt/zákazník/firma) |

**Příklad použití:**
```
"Kolik máme aktivních zákazníků?"
"Seznam firemních zákazníků"
```

### 🏷️ Kategorie a štítky

| Nástroj | Popis |
|---------|-------|
| `list_categories` | Hierarchický strom kategorií |
| `list_labels` | Štítky produktů (akce, novinka, výprodej) |
| `list_availabilities` | Dostupnosti (skladem, na dotaz, není skladem) |
| `list_manufacturers` | Seznam výrobců |
| `list_parameters` | Parametry produktů |

### 🛍️ Košíky a kupóny

| Nástroj | Popis |
|---------|-------|
| `list_carts` | Nedokončené košíky s detaily zákazníků |
| `list_vouchers` | Slevové kupóny |
| `create_vouchers` | Vytvoření slevových kupónů |

**Příklad použití:**
```
"Které košíky mají vyplněné dodací údaje?"
"Seznam aktivních slevových kupónů"
```

### 🔔 Webhooky

| Nástroj | Popis |
|---------|-------|
| `list_webhooks` | Nakonfigurované webhooky |
| `create_webhook` | Vytvoření webhooku pro události |
| `list_webhook_events` | Dostupné události (Orders.create, Products.update, atd.) |

### 📊 Faktury a platby

| Nástroj | Popis |
|---------|-------|
| `list_invoices` | Faktury, dobropisy, účtenky |
| `list_payments` | Platební metody |
| `list_shipments` | Způsoby dopravy |

### ⚙️ Konfigurace e-shopu

| Nástroj | Popis |
|---------|-------|
| `get_languages` | Jazykové mutace e-shopu |
| `get_shop_config` | Nastavení e-shopu (DPH, OSS režim) |
| `get_shop_owner` | Údaje provozovatele e-shopu |
| `get_api_status` | Stav API a oprávnění aktuálního uživatele |
| `list_pricelists` | Ceníky |
| `list_order_statuses` | Stavy objednávek |
| `create_order_status` | Vytvoření vlastního stavu |

---

## 🔐 GDPR Anonymizace

Server podporuje automatickou **anonymizaci citlivých zákaznických údajů** pro ochranu soukromí a splnění GDPR.

### Zapnutí anonymizace

```bash
UPGATES_ANONYMIZE_DATA=true
```

### Co se anonymizuje (40+ polí)

**Zákaznické údaje:**
- Email, telefon, fax
- Jména, příjmení, přezdívky
- Firemní údaje (název firmy, IČO, DIČ)

**Adresy:**
- Ulice, město, PSČ, stát
- Fakturační i doručovací adresy

**Obchodní identifikátory:**
- IČO, DIČ, company_number, vat_number
- IBAN, SWIFT, čísla účtů
- Variabilní a specifické symboly

**Příklad výstupu:**

```json
// BEZ anonymizace:
{
  "email": "jan.novak@example.com",
  "phone": "+420123456789",
  "firstname": "Jan",
  "company": "Test s.r.o.",
  "ico": "12345678"
}

// S anonymizací:
{
  "email": "***ANONYMIZED***",
  "phone": "***ANONYMIZED***",
  "firstname": "***ANONYMIZED***",
  "company": "***ANONYMIZED***",
  "ico": "***ANONYMIZED***"
}
```

Necitlivá pole (čísla objednávek, ceny, stavy) zůstávají nezměněná.

### Které nástroje anonymizují data

- `list_orders` - Zákaznická data v objednávkách
- `list_customers` - Všechna osobní data zákazníků
- `list_invoices` - Fakturační údaje
- `list_carts` - Údaje v košících
- `get_order_history` - Historie objednávek
- `get_shop_owner` - Údaje majitele shopu

---

## 🔒 Readonly režim

Server podporuje **readonly režim** pro bezpečné testování bez rizika změny dat.

### Zapnutí readonly režimu

```bash
UPGATES_READONLY=true
```

### Chybová hláška

```
ReadonlyError: Operation 'create_order' is not allowed in readonly mode.
Set UPGATES_READONLY=false to enable write operations.
```

### Kdy použít

- 🧪 **Testování**: Vyzkoušejte MCP server bez obav
- 📊 **Monitoring**: Pouze sledování dat
- 👨‍🎓 **Školení**: Učte se bez rizika změn
- 📈 **Analytika**: Reporty a přehledy

---

## 💡 Hlavní výhody

### ⏱️ Ušetřete čas
Co byste hledali v administraci celé hodiny, AI najde za vteřiny.

### 🎯 Přesné výsledky
AI procházejte všechny objednávky, produkty a košíky - žádné přehlédnuté detaily.

### 🔒 Bezpečnost
- **Readonly režim** - Ochrana proti nechtěným změnám
- **GDPR anonymizace** - Ochrana osobních údajů zákazníků
- **HTTP Basic Auth** - Bezpečná autentizace

### 🛠️ Snadné použití
Žádné složité API - jen přirozený jazyk v Claude AI.

---

## 📊 API Limity a Best Practices

### Rate Limiting

Upgates API má stupňovité limity podle tarifu:

| Tarif | Hodinový limit | Denní limit | Celkem |
|-------|----------------|-------------|--------|
| Bronze | 10 | 100 | 340 |
| Silver | 15 | 300 | 660 |
| Gold | 50 | 600 | 1,800 |
| Platinum | 100 | 1,500 | 3,900 |
| Exclusive | 100+ | 1,500+ | 3,900+ |

**Souběžné požadavky:** Max 3 současně

### Doporučené postupy

1. ✅ **Používejte webhooky** místo častého dotazování
2. ✅ **Stránkování** pro velké seznamy
3. ✅ **Filtrování** podle `last_update_time_from` pro pouze změněné položky
4. ✅ **Cache** pro statická data (jazyky, stavy, ceníky)
5. ✅ **Bulk operace** až 100 položek najednou

---

## 🚀 LLM Optimalizace (Token Reduction)

Server **automaticky optimalizuje** všechny listovací funkce pro minimální spotřebu tokenů.

### 📊 Úspora tokenů

| Endpoint | Redukce | Úspora na 100 položek |
|----------|---------|----------------------|
| **Orders** | **82.2%** | ~110,000 tokenů |
| **Products** | **99.8%** | ~2,000,000 tokenů |
| **Customers** | ~80% | ~90,000 tokenů |
| **Invoices** | ~85% | ~100,000 tokenů |
| **Carts** | ~75% | ~80,000 tokenů |

### Před vs Po optimalizaci

**Objednávky (100 ks):**
```
❌ Před: ~134,000 tokenů (38 polí, vnořené objekty)
✅ Po:   ~24,000 tokenů (16 polí, jen podstatná data)
💰 Úspora: 110,000 tokenů (82%)
```

**Produkty (50 ks):**
```
❌ Před: ~1,995,000 tokenů (descriptions v 6 jazycích, variants, images)
✅ Po:   ~4,300 tokenů (title, cena, sklad, dostupnost)
💰 Úspora: 1,991,000 tokenů (99.8%)
```

### Co se zachovává

**Objednávky (16 klíčových polí):**
- Číslo, stav, datum, částka
- Zákazník: email, telefon, jméno (6 polí místo 30)
- Produkty: kód, název, množství, cena (4 pole místo 32)
- Doprava: název, typ, cena, pobočka
- Platba: název, typ, cena

**Produkty (13 klíčových polí):**
- ID, kód, název, URL
- Sklad, dostupnost, výrobce
- Cena s DPH, bez DPH, měna
- Hlavní kategorie, počet variant

**Zákazníci (12 klíčových polí):**
- Email, jméno, firma, typ
- Aktivní/blokovaný, jazyk, ceník
- Obrat a měna

### Co se odstraňuje

❌ Duplicitní překlady (6 jazyků → 1 výchozí)
❌ UUID, admin_url, metadata
❌ Vnořená pole (agreements, metas, configurations)
❌ Detaily variant (jen počet)
❌ Obrázky, soubory, SEO data
❌ EET, OSS, statistiky

### Příklad - Jedna objednávka

**Před (6,290 znaků):**
- 38 polí v objednávce
- 30 polí v zákazníkovi
- 32 polí na každý produkt
- Agreements, metas, attachments

**Po (1,148 znaků):**
- 16 polí v objednávce
- 6 polí v zákazníkovi
- 4 pole na produkt
- Jen podstatné informace

### Výhody

🎯 **AI rychleji analyzuje** (méně tokenů ke zpracování)
💰 **Nižší cena** (pokud platíte za tokeny)
⚡ **Rychlejší odpovědi** (méně dat)
📈 **Více dat najednou** (vejde se víc objednávek do context window)

**Optimalizace běží automaticky - není potřeba nic nastavovat!**

### 🎚️ Inteligentní defaulty

Všechny listovací funkce mají **smart defaults** pro nejlepší AI experience:

| Funkce | Default page | Default filtry | Default řazení |
|--------|--------------|----------------|----------------|
| `list_orders` | 1 | - | **Nejnovější první** (creation_time desc) |
| `list_products` | 1 | **Jen aktivní** (active_yn=true) | - |
| `list_customers` | 1 | **Aktivní, neblokovaní** | - |
| `list_categories` | 1 | **Jen aktivní** | - |
| `list_carts` | 1 | **Poslední týden** | - |
| `list_vouchers` | 1 | **Jen aktivní** | - |

**Příklady:**
```
"Seznam objednávek" → Vrátí 100 NEJNOVĚJŠÍCH objednávek
"Seznam produktů" → Vrátí 50 AKTIVNÍCH produktů (skryje neaktivní)
"Seznam košíků" → Vrátí košíky za POSLEDNÍ TÝDEN (ne celou historii)
```

Defaults lze vždy přepsat explicitními parametry. [Více v dokumentaci →](docs/DEFAULTS.md)

---

## 🔍 Pokročilé funkce

### Filtrování objednávek

```
"Nezaplacené objednávky vytvořené v září"
"Objednávky zákazníka jan.novak@example.com"
"Všechny objednávky se stavem 'Odesláno'"
```

### Monitoring skladů

```
"Které produkty mají sklad pod 10 kusů?"
"Seznam produktů s dostupností 'není skladem'"
```

### Analýza košíků

```
"Košíky s vyplněnými dodacími údaji za poslední 3 dny"
"Kolik košíků má přihlášené zákazníky?"
```

### Webhook management

```
"Jaké webhook události jsou dostupné?"
"Vytvoř webhook pro Orders.create na URL https://..."
```

---

## 📚 Technická dokumentace

### Oficiální zdroje

- **API Dokumentace**: https://upgatesapiv2.docs.apiary.io/

### Dostupné zdroje (Resources)

- `upgates://system/info` - Informace o serveru
- `upgates://api/endpoints` - Přehled API endpointů
- `upgates://api/rate-limits` - Rate limiting info
- `upgates://config/settings` - Konfigurace serveru
- `upgates://api/documentation` - Odkazy na dokumentaci

### Datové typy

- `bool` - true/false, 1/0
- `date` - ISO 8601 formát (YYYY-MM-DD)
- `language` - ISO 639-1 kód (cs, sk, en)
- `currency` - ISO 4217 kód (CZK, EUR, USD)
- `country` - ISO 3166-1 alpha-2 (CZ, SK)

---

## 🛠️ Technické požadavky

- Node.js 18+
- Upgates e-shop s API přístupem
- Claude Desktop nebo jiný MCP klient

### Struktura projektu

```
src/
├── index.ts              # Hlavní vstupní bod
├── server.ts             # MCP Server třída
├── upgates-client.ts     # HTTP Basic Auth klient
├── types.ts              # TypeScript definice
├── config/               # Konfigurace
├── errors/               # 8 custom error tříd
├── validators/           # Validátory vstupů
├── handlers/
│   ├── tools.ts          # 34 nástrojů
│   └── resources.ts      # 5 zdrojů
└── tools/
    └── definitions.ts    # Schémata nástrojů
```

---

## 🔧 Pokročilá konfigurace

### Environment proměnné

**Povinné:**
- `UPGATES_API_URL` - URL vašeho API
- `UPGATES_API_USERNAME` - API login
- `UPGATES_API_PASSWORD` - API klíč

**Volitelné:**
- `UPGATES_TIMEOUT` - Timeout požadavků (výchozí: 30000ms)
- `UPGATES_ANONYMIZE_DATA` - Anonymizace dat (výchozí: false)
- `UPGATES_READONLY` - Readonly režim (výchozí: false)

### Příklady kombinací

**Produkční prostředí (write přístup):**
```bash
UPGATES_READONLY=false
UPGATES_ANONYMIZE_DATA=false
```

**Testovací prostředí:**
```bash
UPGATES_READONLY=true
UPGATES_ANONYMIZE_DATA=true
```

**Analytika a reporting:**
```bash
UPGATES_READONLY=true
UPGATES_ANONYMIZE_DATA=true
```

---

## 🎯 Use Cases

### E-shop management
- Monitoring nových objednávek
- Kontrola skladových zásob
- Sledování nedokončených košíků
- Správa slevových kupónů

### Analytika
- Analýza prodejů podle období
- Statistiky zákaznických košíků
- Přehledy produktů podle dostupnosti
- Výkonnost kategorií

### Automatizace
- Webhook notifikace pro nové objednávky
- Automatická aktualizace stavů
- Sync produktů s externími systémy
- Import/export zákaznických dat

### GDPR Compliance
- Anonymizovaný export dat
- Bezpečné sdílení s třetími stranami
- Ochrana PII v logech a debuggingu

---


## 👨‍💻 Autor

**Lukáš Orčík**
Neziskový projekt [OpenMCP](https://openmcp.cz)
Specialista na e-commerce automatizaci a AI integrace

---

## 📄 Licence

Creative Commons Attribution-NonCommercial 4.0 International (CC-BY-NC-4.0)
https://creativecommons.org/licenses/by-nc/4.0/

**Pro komerční využití** kontaktujte autora.

---

## 🤝 Podpora a komunita

Máte otázky, našli jste chybu, nebo chcete navrhnout vylepšení?

### Nahlásit problém nebo navrhnout vylepšení

- 🐛 **[Nahlásit chybu](https://github.com/LukasOrcik/upgates-com-mcp/issues)** - Něco nefunguje? Dejte nám vědět!
- ✨ **[Navrhnout novou funkci](https://github.com/LukasOrcik/upgates-com-mcp/issues)** - Máte nápad na novou funkci?
- 🚀 **[Navrhnout vylepšení](https://github.com/LukasOrcik/upgates-com-mcp/issues)** - Jak můžeme zlepšit existující funkce?

### Diskuze a otázky

- 💬 **[GitHub Diskuze](https://github.com/LukasOrcik/upgates-com-mcp/discussions)** - Ptejte se, sdílejte tipy a zkušenosti
- 🎮 **[Discord Forum](https://discord.gg/6X7VbMEVjk)** - Upgates API vývojáři

### Repository

https://github.com/LukasOrcik/upgates-com-mcp

---

## 🌟 Co dělá tento server speciálním?

### 1. Bezpečnost na prvním místě
- Readonly režim jako výchozí
- GDPR anonymizace jedním přepínačem
- Žádné nečekané změny v produkčních datech

### 2. Optimalizace pro AI
- Strukturovaná data pro snadné zpracování
- Filtrování a stránkování
- Jasné error hlášky

### 3. Produkčně připravený
- 100% TypeScript s strict mode
- Kompletní error handling
- Unit testy pro klíčovou funkcionalitu

### 4. Developer-friendly
- Čistá architektura
- Modulární design
- Snadné rozšíření o nové nástroje

---

**Automatizujte svůj Upgates e-shop. Vyzkoušejte ho ještě dnes!** 🚀
