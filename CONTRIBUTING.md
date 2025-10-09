# Přispívání do projektu

Děkujeme za váš zájem o přispění do Upgates MCP Server! 🎉

## Jak přispět

### Nahlášení chyby

1. Zkontrolujte [issues](https://github.com/LukasOrcik/upgates-com-mcp/issues), zda chyba již nebyla nahlášena
2. Vytvořte nový issue s:
   - Popisem chyby
   - Kroky k reprodukci
   - Očekávané vs. skutečné chování
   - Verze projektu a Node.js
   - Log výstupy (bez citlivých dat!)

### Návrh nové funkce

1. Otevřete [discussion](https://github.com/LukasOrcik/upgates-com-mcp/discussions) nebo issue
2. Popište:
   - Jakou funkci chcete
   - Proč by byla užitečná
   - Jak by měla fungovat

### Pull Request

1. **Fork** repository
2. **Clone** váš fork
3. **Vytvořte branch**: `git checkout -b feature/moje-nova-funkce`
4. **Proveďte změny**
5. **Testy**: `npm test` (všechny musí projít)
6. **Build**: `npm run build` (bez chyb)
7. **Commit**: `git commit -m "feat: popis změny"`
8. **Push**: `git push origin feature/moje-nova-funkce`
9. **Vytvořte PR** na GitHub

## Vývojové prostředí

### Požadavky

- Node.js 18+
- npm
- TypeScript znalosti
- Upgates e-shop s API přístupem (pro testování)

### Instalace

```bash
git clone https://github.com/LukasOrcik/upgates-com-mcp.git
cd upgates-com-mcp
npm install
npm run build
```

### Development workflow

```bash
# Watch mode - automatický rebuild při změnách
npm run dev

# Spustit testy
npm test

# Testy ve watch mode
npm run test:watch

# Build
npm run build

# Clean
npm run clean
```

### Testování s live API

1. Vytvořte API přístup v Upgates admin (Doplňky > API)
2. Nakonfigurujte credentials v `.mcp.json` (nekomiťte!)
3. Testujte pomocí direct handler calls nebo MCP client

## Code Style

### TypeScript

- **Strict mode** je povolen
- Používejte **explicit types** kde je to možné
- **Avoid `any`** pokud to není nutné
- **Dokumentujte** public API pomocí JSDoc

### Naming Conventions

- **Files**: kebab-case (`order-handler.ts`)
- **Classes**: PascalCase (`UpgatesClient`)
- **Functions**: camelCase (`handleListOrders`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_PAGE_SIZE`)
- **Interfaces**: PascalCase (`UpgatesConfig`)

### Struktura projektu

```
src/
├── index.ts              # Entry point
├── server.ts             # MCP Server
├── upgates-client.ts     # API client
├── types.ts              # Type definitions
├── config/               # Configuration
├── errors/               # Error classes
├── validators/           # Input validation
├── optimizers/           # Response optimization
├── handlers/
│   ├── tools.ts          # Tool handlers
│   └── resources.ts      # Resource handlers
└── tools/
    └── definitions.ts    # Tool schemas
```

## Přidání nového nástroje (Tool)

### 1. Definice v `src/tools/definitions.ts`

```typescript
{
  name: 'my_new_tool',
  description: 'Short description of what it does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter description',
      },
    },
    required: ['param1'],
  },
}
```

### 2. Handler v `src/handlers/tools.ts`

```typescript
async function handleMyNewTool(
  client: UpgatesClient,
  params: Record<string, any>
): Promise<any> {
  // Validate inputs
  validateRequired(params.param1, 'param1');

  // Call API
  const response = await client.get('/endpoint', params);

  // Optimize if needed
  let data = optimizeListResponse(response.data, 'entity_type');

  // Anonymize if needed
  return client.isAnonymizationEnabled()
    ? client.getAnonymizedData(data)
    : data;
}
```

### 3. Přidat do dispatcher

```typescript
case 'my_new_tool':
  return handleMyNewTool(client, params);
```

### 4. Přidat do WRITE_OPERATIONS pokud je to write operace

```typescript
const WRITE_OPERATIONS = new Set([
  'my_new_tool', // Pokud mění data
]);
```

### 5. Přidat testy

Vytvořte `*.test.ts` soubor s unit testy.

## Přidání optimizátoru

Pokud nový endpoint vrací velké množství dat:

### 1. Vytvořte optimizer v `src/optimizers/index.ts`

```typescript
export function optimizeMyEntity(entity: any): any {
  return {
    id: entity.id,
    name: entity.name,
    // Jen podstatná pole!
  };
}
```

### 2. Přidejte do `optimizeListResponse`

```typescript
case 'my_entities':
  optimized.my_entities = (data.my_entities?.slice(0, maxItems) || [])
    .map(optimizeMyEntity);
  break;
```

## Testování

### Unit testy

```bash
npm test
```

Vytvářejte testy pro:
- Validators
- Error handling
- Optimizers
- Důležitou business logiku

### Integration testy

Test s live API (bez commitování credentials):

```bash
node /tmp/test-my-feature.mjs
```

## Commit Messages

Používejte [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: Přidání nového nástroje list_xyz`
- `fix: Oprava duplicitních URL v endpoints`
- `docs: Aktualizace README s novými funkcemi`
- `test: Přidání testů pro anonymizaci`
- `refactor: Zlepšení optimizátorů`
- `perf: Optimalizace token reduction`

## Dokumentace

Při přidání nové funkce aktualizujte:

- ✅ README.md - User-facing dokumentace
- ✅ CHANGELOG.md - Seznam změn
- ✅ Inline JSDoc komentáře
- ✅ Případně docs/ složka

## Code Review

Všechny PR procházejí review. Budeme kontrolovat:

- ✅ TypeScript type safety
- ✅ Error handling
- ✅ Tests pass
- ✅ Build successful
- ✅ Dokumentace aktualizovaná
- ✅ No sensitive data committed
- ✅ Code quality a čitelnost

## Důležité zásady

### Security

- ❌ **NIKDY** necomitujte credentials nebo API keys
- ✅ Testujte s readonly mode
- ✅ Validujte všechny vstupy
- ✅ Používejte anonymizaci při testování

### Performance

- ✅ Optimalizujte pro LLM (token reduction)
- ✅ Používejte pagination
- ✅ Cachujte statická data
- ✅ Respektujte API rate limits

### Compatibility

- ✅ Node.js 18+
- ✅ TypeScript 5+
- ✅ ES Modules (type: "module")

## Získání pomoci

- 💬 [GitHub Discussions](https://github.com/LukasOrcik/upgates-com-mcp/discussions)
- 🐛 [Issues](https://github.com/LukasOrcik/upgates-com-mcp/issues)
- 🎮 [Upgates Discord](https://discord.gg/6X7VbMEVjk)

## Licence

Přispěním do tohoto projektu souhlasíte s tím, že váš kód bude licencován pod CC-BY-NC-4.0.

---

**Děkujeme za vaše příspěvky!** ❤️
