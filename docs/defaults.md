# Default Values for List Operations

Všechny listovací funkce mají nastavené **inteligentní defaultní hodnoty** pro optimální práci s AI.

## 📋 Přehled defaultů

### `list_orders`

**Defaults:**
- `page: 1` - První stránka
- `order_by: 'creation_time'` - Řazení podle data vytvoření
- `order_dir: 'desc'` - **Nejnovější první** (od nejnovějších k nejstarším)

**Výsledek:**
- Bez parametrů vrátí 100 nejnovějších objednávek
- Objednávka z dneška bude první
- Ideální pro "Jaké máme nové objednávky?"

**Příklad:**
```javascript
// Bez parametrů - použijí se defaults
list_orders({})
// Vrátí: 100 nejnovějších objednávek, seřazené od nejnovější

// S vlastními parametry - přepíšou defaults
list_orders({ page: 2, order_dir: 'asc' })
// Vrátí: Stránku 2, seřazenou od nejstarších
```

---

### `list_products`

**Defaults:**
- `page: 1` - První stránka
- `active_yn: true` - **Pouze aktivní produkty** (skryje neaktivní)
- `variants_yn: false` - Bez variant (šetří tokeny)

**Výsledek:**
- Bez parametrů vrátí max 50 aktivních produktů
- Neaktivní a archivované produkty jsou automaticky vyfiltrované
- Varianty se nezahrnují (ušetří tokeny)

**Příklad:**
```javascript
// Bez parametrů - jen aktivní produkty
list_products({})
// Vrátí: 50 aktivních produktů bez variant

// Pokud chcete i neaktivní
list_products({ active_yn: false })

// S variantami
list_products({ variants_yn: true })
```

---

### `list_customers`

**Defaults:**
- `page: 1` - První stránka
- `active_yn: true` - **Pouze aktivní zákazníci**
- `blocked_yn: false` - **Neblokovaní zákazníci**

**Výsledek:**
- Bez parametrů vrátí 100 aktivních, neblokovaných zákazníků
- Filtruje problémy zákazníky automaticky

**Příklad:**
```javascript
// Bez parametrů - jen aktivní, neblokovaní
list_customers({})

// Včetně blokovaných
list_customers({ blocked_yn: true })

// Všichni zákazníci
list_customers({ active_yn: undefined, blocked_yn: undefined })
```

---

### `list_carts`

**Defaults:**
- `page: 1` - První stránka
- `creation_time_from: dnes - 7 dní` - **Pouze košíky za poslední týden**

**Výsledek:**
- Automaticky filtruje staré košíky (> 7 dní)
- Zobrazí jen relevantní nedokončené nákupy

**Příklad:**
```javascript
// Bez parametrů - košíky za 7 dní
list_carts({})
// Vrátí: Košíky vytvořené od 2025-10-02

// Vlastní rozsah
list_carts({ creation_time_from: '2025-09-01' })
// Vrátí: Košíky od září
```

---

### `list_categories`

**Defaults:**
- `page: 1` - První stránka
- `active_yn: true` - **Pouze aktivní kategorie**

**Výsledek:**
- Filtruje neaktivní/skryté kategorie

---

### `list_vouchers`

**Defaults:**
- `page: 1` - První stránka
- `active_yn: true` - **Pouze aktivní kupóny**

**Výsledek:**
- Neukáže expirované nebo deaktivované kupóny

---

### `list_invoices`

**Defaults:**
- `page: 1` - První stránka

**Žádné další filtry** - faktury jsou důležité vždy.

---

### `list_order_statuses`, `list_labels`, `list_availabilities`, atd.

**Defaults:**
- `page: 1` - První stránka

**Žádné filtry** - číselníky jsou malé, zobrazí se všechny.

---

## 🎯 Proč tyto defaults?

### 1. **Relevance**
- Nejnovější objednávky jsou nejdůležitější
- Aktivní produkty jsou v prodeji
- Košíky starší než týden jsou většinou neaktuální

### 2. **Token efektivita**
- Méně položek = méně tokenů
- Filtrované výsledky = rychlejší AI analýza

### 3. **User experience**
- Uživatel většinou chce "aktuální stav"
- Defaults odpovídají běžným use cases

---

## 🔧 Přepsání defaultů

Defaults můžete vždy přepsat explicitními parametry:

```javascript
// Všechny objednávky (i staré)
list_orders({ order_dir: 'asc' })

// Neaktivní produkty
list_products({ active_yn: false })

// Košíky za celý měsíc
list_carts({ creation_time_from: '2025-09-01' })

// Blokovaní zákazníci
list_customers({ active_yn: false, blocked_yn: true })
```

---

## 📊 Dopad na tokeny

S defaults (20-100 položek) místo full listu (1000+ položek):

- **Orders**: ~24k tokenů místo ~1.3M (98% úspora)
- **Products**: ~4k tokenů místo ~2M (99.8% úspora)
- **Carts**: ~5k tokenů místo ~100k (95% úspora)

**Celková úspora: Desítky až stovky tisíc tokenů na každý request!**

---

## 💡 Best Practices

1. **Nechte defaults** pro běžné dotazy
2. **Specifikujte filtry** jen když potřebujete konkrétní data
3. **Používejte stránkování** pro velké datasety
4. **Kombinujte s anonymizací** pro maximální ochranu

---

**Defaults jsou navržené pro optimální práci s AI - není třeba je měnit!** ✅
