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

## Existujúce testy

### `smoke.spec.ts` (3 testy)
1. **Landing page** — overí že "Integrálna mapa bytia" + "Začať cestu" CTA sú viditeľné.
2. **Navigation** — klik na "Začať cestu" naviguje na `/profile`.
3. **Bundle health** — app shell sa naloží pod 5s.

> 🗑 **Odstránené (v4.3.4):** test `lazy-loaded numerology page renders` — používal `localStorage.setItem('numero-store', ...)` ale store je v IndexedDB od v2.22.0. Nahradený realistickým UI flow testom v `v433-regression.spec.ts`.

### `v433-regression.spec.ts` (10 testov, v4.3.3+)
Risk areas regression suite:
- **Engine integrity** — Numerology/Astrology/HD pages render po seed cez UI form
- **No JS console errors** — Dashboard, Numerology, Vzťahy, Klienti
- **Language switch SK→EN** — Settings prepínanie + overenie že sa texty skutočne zmenia
- **RelationshipsPage partner mode** — vyplniť 2 osôb + "Vypočítať" → výsledok kompatibility

## Pridávanie nového testu

**KRITICKÉ — seed cez UI flow, nie cez localStorage:**

Store je v IndexedDB (od v2.22.0). `localStorage.setItem('numero-store', ...)` **nefunguje** ako seed — Zustand persist sa pri mount načíta z IndexedDB a localStorage hodnotu ignoruje.

Vzor:
```typescript
import { test, expect, type Page } from '@playwright/test';

async function seedProfileViaUI(page: Page) {
  await page.goto('/profile');
  await page.locator('input[type="text"]').first().fill('Test');
  const inputs = page.locator('input');
  await inputs.nth(1).fill('30');  // day
  await inputs.nth(2).fill('8');   // month
  await inputs.nth(3).fill('1979'); // year
  await page.getByRole('button', { name: /Uložiť|Pokračovať|Vytvoriť/i }).first().click();
  await page.waitForURL(/^(?!.*\/profile).*$/, { timeout: 10000 });

  // OnboardingReveal modal sa môže objaviť — preskočiť cez localStorage flag
  await page.evaluate(() => localStorage.setItem('onboarding-completed', 'true'));
}

test('my test', async ({ page }) => {
  await seedProfileViaUI(page);
  await page.goto('/numerology');
  await expect(page.getByRole('heading', { name: /Numerológia/i }).first()).toBeVisible({ timeout: 10000 });
});
```

### OnboardingReveal blocker

Po prvom vytvorení profilu (v4.3.0+ feature) sa zobrazí 5-krokový reveal modal s `z-[200]` ktorý blokuje pointer events. Musíš ho preskočiť:
- **Najjednoduchšie:** `localStorage.setItem('onboarding-completed', 'true')` po profile creation
- Alebo klik na "Preskočiť" button (môže byť skrytý za animation delay)
- Alebo Escape key (v4.3.4+)

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
