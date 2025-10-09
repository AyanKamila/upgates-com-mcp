# 🎉 Upgates MCP Server v0.1.0 - Initial Release

**Datum vydání:** 2025-10-09
**Status:** Production Ready ✅

---

## 📦 Co je nového

První veřejné vydání **Upgates MCP Server** - Model Context Protocol server pro integraci s Upgates e-shop API v2.

### 🌟 Hlavní funkce

#### 34 Nástrojů pro práci s e-shopem
- ✅ **Objednávky** - Kompletní správa (list, create, update, delete, history)
- ✅ **Produkty** - Plná podpora včetně variant, cen, skladů
- ✅ **Zákazníci** - Management zákaznických účtů
- ✅ **Faktury** - Listing a filtrace faktur
- ✅ **Kategorie** - Hierarchická struktura kategorií
- ✅ **Košíky** - Monitoring nedokončených košíků
- ✅ **Webhooky** - Konfigurace event-driven notifikací
- ✅ **Kupóny** - Správa slevových kupónů

#### 🔒 Bezpečnostní funkce

**GDPR Anonymizace** 🔐
- 40+ citlivých polí automaticky anonymizováno
- Email, telefon, jména, adresy
- Firemní identifikátory (IČO, DIČ, IBAN)
- Deep anonymization pro vnořené objekty
- Pattern matching pro dynamická pole

**Readonly Režim** 🛡️
- Ochrana proti nechtěným změnám
- Blokuje všechny write operace
- Ideální pro testování a monitoring
- Clear error messages

**HTTP Basic Authentication** 🔑
- Standardní RFC 7617 autentizace
- Credentials nikdy nelogované
- Secure connection přes HTTPS

#### 🏗️ Architektura

- **Clean Architecture** - Modulární design
- **TypeScript** - 100% type safety (2,716 řádků)
- **8 Error tříd** - Comprehensive error handling
- **Validation Layer** - Vstupní validace všech parametrů
- **Rate Limit Handling** - Graceful handling limitů

---

## 📊 Statistiky

### Kód
- **TypeScript soubory:** 14 (10 modulů + 4 test soubory)
- **Řádky kódu:** 2,716
- **Build output:** 10 JavaScript souborů
- **Kompilace:** ~2 sekundy

### Testy
- **Unit testy:** 35
- **Pass rate:** 100% (35/35)
- **Test suites:** 18
- **Coverage:**
  - Error handling: 10 testů
  - Validators: 11 testů
  - Tool handlers: 2 testy
  - Anonymization: 12 testů

### Live API testy
- **Shop:** EdgarPower (s17.upgates.com)
- **Objednávky:** 23,789 ✅
- **Produkty:** 87 aktivních ✅
- **Jazyky:** 6 (cs, en, hu, sk, de, pl) ✅
- **Webhook events:** 10+ dostupných ✅

---

## 🚀 Instalace

### Požadavky

- Node.js 18 nebo vyšší
- Upgates e-shop s API přístupem
- Claude Desktop nebo jiný MCP klient

### Kroky

```bash
# 1. Naklonovat repository
git clone https://github.com/LukasOrcik/upgates-com-mcp.git
cd upgates-com-mcp

# 2. Nainstalovat dependencies
npm install

# 3. Sestavit projekt
npm run build

# 4. Spustit testy (volitelné)
npm test
```

### Konfigurace

Vytvořte API přístup v **Admin > Doplňky > API** a přidejte do `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "upgates": {
      "command": "node",
      "args": ["/absolute/path/to/upgates-com-mcp/dist/index.js"],
      "env": {
        "UPGATES_API_URL": "https://your-shop.admin.s17.upgates.com/api/v2",
        "UPGATES_API_USERNAME": "your-api-login",
        "UPGATES_API_PASSWORD": "your-api-key",
        "UPGATES_READONLY": "true",
        "UPGATES_ANONYMIZE_DATA": "true"
      }
    }
  }
}
```

---

## 📚 Dokumentace

### Nová dokumentace v tomto vydání

- ✅ **README.md** - User-friendly dokumentace v češtině
- ✅ **CHANGELOG.md** - Historie změn
- ✅ **TEST_REPORT.md** - Kompletní test report
- ✅ **RELEASE.md** - Tento soubor

### Odkazy na externí dokumentaci

- **Upgates API v2 Docs**: https://upgatesapiv2.docs.apiary.io/
- **Postman Collection**: https://upgates.cz/shop-data/developers/Upgates_API_postman_collection.json
- **Model Context Protocol**: https://modelcontextprotocol.io/

---

## 🎯 Podporované funkce

### API Endpoint Groups (26 skupin)

1. Objednávky (Orders)
2. Stavy objednávky (Order Statuses)
3. Faktury (Invoices)
4. Produkty (Products)
5. Štítky (Labels)
6. Dostupnosti (Availabilities)
7. Výrobci (Manufacturers)
8. Parametry (Parameters)
9. Sklady (Stocks)
10. Kategorie (Categories)
11. Zákazníci (Customers)
12. Košíky (Carts)
13. Přesměrování (Redirections)
14. Slevové kupóny (Vouchers)
15. Aktuality (News)
16. Články (Articles)
17. Rádce (Advisor)
18. Soubory (Files)
19. Doprava (Shipments)
20. Platba (Payments)
21. Konverzní kódy (Conversion Codes)
22. Webhooky (Webhooks)
23. E-shop konfigurace
24. Ceníky (Pricelists)
25. Jazyky (Languages)
26. Provozovatel (Owner)

Plus: API Status, Grafika, Vlastní pole, Doplňky

### Implementované v této verzi (19 skupin)

V0.1.0 pokrývá 19 nejdůležitějších skupin s 34 nástroji.

---

## ⚡ Performance

- **Startup time:** < 1 sekunda
- **Build time:** ~2 sekundy
- **Test execution:** ~1.6 sekundy (35 testů)
- **API response:** < 500ms (většina endpointů)

---

## 🔍 Co bylo testováno

### Unit Testy (35/35 passed)
- ✅ Error handling (10 testů)
- ✅ Validators (11 testů)
- ✅ Tool handlers (2 testy)
- ✅ Anonymization (12 testů)

### Integration Testy
- ✅ API connection (6 endpointů)
- ✅ Authentication (HTTP Basic Auth)
- ✅ Resources (5 zdrojů)
- ✅ Tool definitions (34 nástrojů)

### Live API Testy (EdgarPower shop)
- ✅ Orders: 23,789 objednávek
- ✅ Products: 87 aktivních produktů
- ✅ Languages: 6 jazykových mutací
- ✅ Webhooks: Events dostupné

---

## 🐛 Známé Limitace

### API Permissions
- Testovací API user má readonly permissions na většinu endpointů
- Write operace vyžadují upgrade permissions v administraci
- Webhooks má plná oprávnění (all)

### Neimplementované funkce (pro budoucí verze)
- PDF stahování (faktury, objednávky)
- Skupiny endpointů: Articles, News, Advisor, Files
- Graphics a backup management
- Custom Fields (Metas) management

---

## 🎉 Děkujeme

Děkujeme Upgates za vynikající API dokumentaci a podporu vývojářů!

---

## 📞 Podpora

- **GitHub Issues**: https://github.com/LukasOrcik/upgates-com-mcp/issues
- **Discussions**: https://github.com/LukasOrcik/upgates-com-mcp/discussions
- **Upgates Discord**: https://discord.gg/6X7VbMEVjk
- **Email**: OpenMCP - openmcp.cz

---

## 📝 Licence

Creative Commons Attribution-NonCommercial 4.0 International (CC-BY-NC-4.0)

Pro komerční využití kontaktujte autora.

---

**Upgates MCP Server v0.1.0 - Automatizujte svůj e-shop s AI!** 🚀
