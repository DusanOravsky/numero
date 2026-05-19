# Playwright E2E testy

> Top-level overview: `../CLAUDE.md`

## Setup

```bash
npm install
npx playwright install chromium    # browser binárky (~150MB, len prvý raz)
npm run test:e2e                    # spustí testy
```

Ak `playwright install` zlyhá s permission errorom, nepotrebujeme `--with-deps` (chrome shell stačí).

## Konfigurácia

`playwright.config.ts`:

- `testDir: './e2e'` — testy sú tu, oddelene od unit testov v `src/`
- `baseURL: 'http://localhost:4173'` — `vite preview` port
- `webServer.command: 'npm run build && npm run preview -- --port 4173'` — auto-boots produkčný build pred testami
- `webServer.reuseExistingServer: !CI` — lokálne reuse, v CI fresh boot
- Iba **chromium** projekt (nešetríme čas na firefox/safari pre PWA smoke testy)

## Vitest exclusion

`vitest.config.ts` má `exclude: ['e2e/**', 'node_modules/**', 'dist/**']` aby unit test runner nešiel do `e2e/`.

## Existujúce testy (`smoke.spec.ts`)

4 smoke testy:

1. **Landing page** — overí že "Integrálna mapa bytia" + "Začať cestu" CTA sú viditeľné.
2. **Navigation** — klik na "Začať cestu" naviguje na `/profile`.
3. **Bundle health** — app shell sa naloží pod 5s.
4. **Lazy loaded route** — naseeduje profile do localStorage, naviguje na `/numerology` a overí že sa zobrazí ŽČ 1 z 37 pre 30.8.1979.

## Pridávanie nového testu

Vzor:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My feature', () => {
  test('does something', async ({ page }) => {
    // Pre testy s aktívnym profilom — naseeduj cez localStorage:
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('numero-store', JSON.stringify({
        state: {
          profiles: [{ id: 'test-1', name: 'Test', birthDay: 30, birthMonth: 8, birthYear: 1979, /*…*/ }],
          activeProfileId: 'test-1',
          // ...rest of state
        },
        version: 4,
      }));
    });
    await page.reload();

    // teraz testuj funkciu...
    await page.goto('/numerology');
    await expect(page.getByText(/Životné číslo/i).first()).toBeVisible();
  });
});
```

## Dôležité gotchas

### Strict mode violations

Playwright v strict mode hodí error keď selector vráti viac ako 1 element:

```typescript
// ✗ Failuje ak je text na viacerých miestach (header, sidebar, main)
await expect(page.getByText(/Integrálna mapa bytia/i)).toBeVisible();

// ✓ Použi .first() alebo špecifickejší selector
await expect(page.getByText(/Integrálna mapa bytia/i).first()).toBeVisible();
await expect(page.getByRole('main').getByText(/Integrálna mapa bytia/i)).toBeVisible();
```

### Lazy loaded routes

Stránky sú lazy loaded cez `React.lazy + Suspense`. Po `page.goto('/numerology')` daj timeout vyšší alebo wait na konkrétny element:

```typescript
await expect(page.getByText(/Životné číslo 1/i).first()).toBeVisible({ timeout: 10000 });
```

### PWA service worker

`vite preview` neaktivuje service worker (build vytvára `sw.js` ale preview ho nemusí registrovať). Pre testovanie SW funkcionality použi `vite build && cd dist && python3 -m http.server 4173`.

## CI

`forbidOnly: !!process.env.CI` — `test.only()` zlyhá v CI.
`retries: CI ? 2 : 0` — len v CI retry pri network flakes.
`workers: CI ? 1 : undefined` — sériovo v CI (deterministickejšie).

V GitHub Actions deploy.yml E2E aktuálne **NIE JE** ako gate. Ak chceš pridať:

```yaml
- name: Run E2E
  run: |
    npm ci
    npx playwright install --with-deps chromium
    npm run test:e2e
```

Trvá ~30s + ~3 min download playwright runtime.
