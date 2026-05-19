# Integrálna mapa bytia (Número)

Offline-first PWA pre numerológiu, astrológiu, Human Design, etikoterapiu, kabalu, Theta Healing a sebarozvoj.

> 📁 **Nested CLAUDE.md súbory:**
> - `src/engine/CLAUDE.md` — engine pravidlá, numerológia/astrológia/HD matematika
> - `src/components/CLAUDE.md` — UI patterns, AI chat, view derivation
> - `e2e/CLAUDE.md` — Playwright E2E testy

## Technológie

- React 19 + TypeScript
- Vite 8 + TailwindCSS 4
- Framer Motion (animácie)
- Zustand (state management s persist, version 4 + migrácie)
- astronomy-engine (planetárne výpočty, eclipses)
- jsPDF (PDF export, lazy-loaded)
- vite-plugin-pwa (service worker, runtimeCaching, offline)
- Anthropic Claude API (AI integrálny výklad — D1)
- Vitest + Testing Library + jsdom (unit + component tests)
- Playwright (E2E smoke testy)

## Spustenie

```bash
npm install
npm run dev               # localhost:5173
npm run build             # dist/
npm run build:analyze     # ANALYZE=1 → dist/stats.html (rollup-plugin-visualizer)
npm test                  # vitest unit + component tests
npm run test:e2e          # playwright E2E (boots vite preview na :4173)
npm run lint              # eslint (react-hooks/set-state-in-effect je strict)
```

## NPM registry (DÔLEŽITÉ pre CI)

Projekt má lokálny `.npmrc` s `registry=https://registry.npmjs.org/`.
**Nesmie sa odstrániť** — globálny `~/.npmrc` na vývojárskom stroji môže byť
nakonfigurovaný na firemný (Covestro) registry. Bez lokálneho prepisu by:
- `npm install` v `package-lock.json` zapísal "resolved" URL na firemný registry
- GitHub Actions deploy by zlyhal s E401 (runner nemá access k firemnému registry)

Ak treba regenerovať lock súbor, použiť výslovne:
`npm install --registry=https://registry.npmjs.org/`

## Numerologické metódy (dva systémy s prepínačom)

Aplikácia podporuje dve odlišné numerologické školy, prepínač je v Settings
(`store.numerologyMethod`):

1. **Charakterová** (`'characterological'`) — vrodené kvality a archetypy.
   - Engine: `numerologyEngine.ts`
   - Zdroj: Robin Steinová – Numerológia: Čísla Lásky

2. **Vývojová** (`'developmental'`, **default**) — životné úlohy a karmické cykly.
   - Engine: `developmentalNumerologyEngine.ts` so 4 zakrúžkovanými K1-K4
   - Zdroj: Lívia Mičková – Duchovná numerológia

Detaily matematiky: `src/engine/CLAUDE.md`.

UI je **method-aware**: niektoré sekcie (Roviny, Karmické cykly, Jazyky lásky) sú špecifické pre Charakterovú a skryjú sa pri Vývojovej. Detail v `src/components/CLAUDE.md`.

## Štruktúra

```
src/
  engine/          # Výpočtové moduly (bez UI závislostí) — viď src/engine/CLAUDE.md
  data/            # Statické dáta a výklady
  components/      # Reusable UI — viď src/components/CLAUDE.md
  pages/           # Stránky (routes, lazy-loaded okrem Dashboard)
  store/           # Zustand store s migráciou
  layouts/         # MainLayout so sidebar/bottom nav
  styles/          # Tailwind + light mode overrides
  hooks/           # useTheme, useSessionState, usePerformanceMetrics
  i18n/            # Lightweight in-house dictionary (sk/en)
  test/            # Vitest setup (jsdom + jest-dom matchers)
e2e/               # Playwright smoke tests — viď e2e/CLAUDE.md
.github/
  workflows/deploy.yml      # GitHub Pages deploy
  PULL_REQUEST_TEMPLATE.md  # PR checklist
```

## AI integrácia (D1)

Anthropic Claude priamo z prehliadača (header `anthropic-dangerous-direct-browser-access: true`):

- API kľúč len v `localStorage` (nikdy v store ani v bundle)
- Settings → "✦ AI integrácia (Claude)" — input + Test + Save
- Modely: Haiku 4.5 / Sonnet 4.6 (default) / Opus 4.7
- Triggery: Dashboard (celý profil), Numerology Prehľad (per metóda), ClientDashboard (per klient)
- Komponent: `components/AIChat.tsx` so streaming, históriou per profile/klient/metóda v localStorage
- Engine: `engine/aiInterpretation.ts` — `summarizeProfile()`, `streamChat()`, `testApiKey()`

## Performance & quality

- **Lazy load všetkých routes** okrem Dashboard (`React.lazy + Suspense`). Initial bundle ~220KB (78KB gzip).
- **Service Worker runtimeCaching**: NetworkFirst pre navigations, CacheFirst pre /assets/*.js/css a images. `cleanupOutdatedCaches: true`.
- **Web Vitals** (LCP + CLS) v `hooks/usePerformanceMetrics.ts`, vizualizované v Settings → Výkonnostné metriky.
- **Error reporting** v `components/ErrorBoundary.tsx` — localStorage log (max 20), copy-to-clipboard, Diagnostika karta v Settings.
- **Bundle analyzer**: `npm run build:analyze` → `dist/stats.html` treemap.

## Deploy

- GitHub Pages cez Actions (`.github/workflows/deploy.yml`)
- `base: '/numero/'` v produkcii, `'/'` v dev
- `BrowserRouter basename = import.meta.env.BASE_URL`
- `404.html` pre SPA redirect na GitHub Pages
- **URL: https://dusanoravsky.github.io/numero/**

## PWA

- `vite-plugin-pwa` s `autoUpdate`
- Verzia v `src/components/PWAPrompts.tsx` (APP_VERSION konstanta)
- Install prompt + update popup + offline indicator
- iOS status bar zladenie cez `theme-color` meta

## Store (Zustand + persist)

- Verzia 4, migrácie v `src/store/useStore.ts`
- Profily, klienti (s tags), reports (max 200), favourites
- Preferencie: language (sk/en), numerologyMethod, themeMode
- Persisted v localStorage pod kľúčom `numero-store`

## Konvencie

- **Slovenčina** v UI a dátach
- **Light mode** default (biele pozadie, čakrový gradient sidebar). Dark + System dostupné v Settings.
- Čas vždy v 24h formáte
- Miesto narodenia cez autocomplete (`data/cities.ts` s lat/lon)
- Master numbers (11, 22, 33) sa zachovávajú v ŽČ
- ORV sa počíta od narodenín do narodenín, nie od januára
- TypeScript strict, eslint strict (`react-hooks/set-state-in-effect`)
- Žiadne `any`, žiadne `// @ts-ignore` bez vysvetlenia

## Testovanie

- **78 unit + component testov** (`npm test`)
- **4 E2E smoke testov** (`npm run test:e2e`)
- Lock testy pre kritické hodnoty: 30.8.1979 02:40 Bratislava → HD profil 1/3, ŽČ 1 z 37, čakra root score 45
- Component testy: PersonalYearTimeline, RadarChart9
- Detail Playwright config: `e2e/CLAUDE.md`

## Referenčný profil pre testovanie

Pri akýchkoľvek zmenách v engines kontroluj proti **30.8.1979 02:40 Bratislava**:
- ŽČ = 1 z 37, mriežka: 1×1, 3×2, 7×1, 8×2, 9×2 (žiadne 2/4/5/6)
- Vývojová: K1=37, K2=10, K3=31, K4=4, masculine ego
- HD: profil 1/3 (Skúmajúci Mučeník), Generátor, Emocionálna autorita
- Astro: Slnko Panna 6°, Mesiac Škorpión 27°, Asc Rak
- Čakry: root/sakrálna/krčná blokované (kvôli chýbajúcim 2/5/6)
