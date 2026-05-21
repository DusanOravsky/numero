# Integrálna mapa bytia (Número)

Offline-first PWA pre numerológiu, astrológiu, Human Design, etikoterapiu, kabalu, Theta Healing, Enneagram, Ayurvédu, TCM a sebarozvoj. **v2.44.0**

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
    numerology/    # NumerologyPage taby (PlanesTab, KarmicTab, LoveTab, NameTab, EnneagramTab)
  pages/           # Stránky (routes, lazy-loaded okrem Dashboard)
    ModalityPage   # Ayurvéda + TCM + Bachove kvety (/modality)
  store/           # Zustand store s migráciou (IndexedDB persist)
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
- **max_tokens**: 4096 (stream chat), 3500 (summarize)
- **ProfileContext**: 11 systémov (numerológia, astrológia, HD, čakry, kabala, theta, enneagram, dosha, tcm, čínsky horoskop, jazyky lásky).
- **Interpretation lenses** (v2.3.0): integratívny ezoterický (default), logické úrovne (NLP/Dilts), etikoterapia (Vogeltanz/Bezděk), koučing (GROW). Volia sa v Settings, perzistované v `localStorage` pod `anthropic-lens`. Lens iba mení system prompt, žiadny vplyv na engine výpočty.
- **Globálny AI drawer** (v2.33.0): floating ✦ button v `MainLayout` → slide-out panel s `AIChat`. Dostupný z hociktorej stránky. Lazy computation (engines sa počítajú až pri otvorení). Escape na zatvorenie. Nahrádza per-page AI sekcie (odstránené v v2.34.0).
- Ponechaný len `ClientDashboard` AI chat (špecifický kontext klienta na konzultáciu).
- Komponent: `components/AIChat.tsx` so streaming, históriou v **IndexedDB** (migrované z localStorage v2.22.0). `components/GlobalAIDrawer.tsx` — wrapper pre globálny prístup.
- Engine: `engine/aiInterpretation.ts` — `summarizeProfile()`, `streamChat()`, `testApiKey()`, `buildSystemPrompt()` (kombinuje base + lens-specific prompt)

## Doplnkové modality

- **Etikoterapia** (`src/data/etikoterapia.ts`) — slovensko-česká liečebná tradícia (Vogeltanz, Bezděk). Mapuje 7 čakier na etické príčiny + cnosti + orgány + reflexné otázky + praktickú cestu. Renderuje sa ako collapsible sekcia v ChakrasPage pri každej čakrovej karte. **Nie je medicínsky nástroj** — vždy s disclaimerom. Pri blokovanej čakre auto-open.
- **Enneagram** (`src/engine/enneagramEngine.ts`) — typ 1-9 derivovaný z ŽČ/K3, krídla, integrácia/dezintegrácia. Tab v NumerologyPage, riadky v ComparePage.
- **Ayurvéda** (`src/engine/ayurvedaEngine.ts`) — 3 dóše (Vata/Pitta/Kapha) derivované z astro elementu + HD typu + ŽČ. Stránka `/modality`.
- **TCM 5 elementov** (`src/engine/tcmEngine.ts`) — Drevo/Oheň/Zem/Kov/Voda derivované z astro + ŽČ. Stránka `/modality`.
- **Bachove kvety** — 17 esencií mapovaných na 7 čakier. Stránka `/modality`.
- **Čínsky horoskop** (`src/engine/chineseZodiacEngine.ts`, `src/data/chineseZodiac.ts`) — 12 zvierat + 5 elementov + Yin/Yang. Výpočet z roku narodenia s korekciou podľa Lunárneho nového roka (tabuľka 1940-2030). Sekcia v AstrologyPage (ľavý stĺpec pod planétami). Výklad: povaha, silné stránky, výzvy, element, kompatibilita, odporúčanie, najbližší rok zvieraťa.

## PDF export

- **Font: Roboto** (plná slovenská diakritika vrátane ľ, ď, ť, ň, č, š, ž)
- Font sa lazy-loaduje (`src/assets/fonts/robotoFont.ts`) len pri kliknutí na "Exportovať PDF"
- Komponent: `components/ClientExport.tsx`
- **Personalizované výklady** — za každou sekciou je fialový blok "Ako čítať" s konkrétnymi hodnotami (rovnaký koncept ako v appke)
- jsPDF 4.x s custom font registráciou cez `addFileToVFS` + `addFont`

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

## PWA — offline-first + manual-friendly update

`vite-plugin-pwa` s **CacheFirst stratégiou** pre všetky resources (HTML aj
JS/CSS). To znamená:

- **App sa otvára okamžite z cache** — žiadne čakanie na sieť, ani 3s timeout.
- **Pri GitHub Pages outage funguje appka ďalej** — všetko je cached lokálne.
- **Žiadny `skipWaiting`/`clientsClaim`** — SW sa neaktivuje sám automaticky.

### Detekcia novej verzie

Pri otvorení appky sa pri prvom mount-e porovná `localStorage.app-version`
(uložená pri minulom otvorení) vs `APP_VERSION` z čerstvo načítaného HTML.
Ak sú rôzne → **zobrazí sa "Nová verzia" popup** (raz, idempotentne).

Logika je v `src/components/PWAPrompts.tsx`:
- `useEffect` mount → version compare → `setShowUpdate(true)`
- `handleUpdate` → `checkForUpdate()` (online check + cache wipe + reload)
- `dismissUpdate` → sync `app-version` → popup sa znova nezobrazí

**KRITICKÉ:** version compare sa **MUSÍ** spúšťať aj v standalone mode
(inštalovaná PWA na ploche). To je presne scenár kde je auto-popup
najpotrebnejší. V `useEffect` je install-hint logika (iOS hint,
beforeinstallprompt) zabalená ZA standalone-check, ale online detection
+ version compare sú VŽDY aktívne. Bez toho inštalovaná PWA nikdy
nedostane upgrade upozornenie.

**Caveat — CacheFirst HTML strikes again:** keďže HTML je CacheFirst,
SW servíruje starý HTML aj keď je nový deployed na GitHube. Auto-popup
sa preto zobrazí až **PO** prvom upgrade ktorý sa udeje cez:
- Manuálny "Skontrolovať update" v Settings (cache wipe + reload)
- Manuálny "Vynútiť aktualizáciu" v Settings (cache wipe + reload)

Po prvom takom upgrade už SW slúži novú verziu HTML aj z cache, takže
ďalšie deploye normálne triggernú auto-popup. Inak povedané: prvý
upgrade po deploy v2.2.0+ vyžaduje manuálny krok, všetky ďalšie idú
cez popup.

### Offline-safe update helpers

`src/components/PWAPrompts.tsx` exportuje:

- `checkForUpdate()` — bezpečná manuálna kontrola:
  1. HEAD ping na `index.html` s `cache: 'no-store'`
  2. Ak server fail → `{ online: false }`, **žiadne mazanie cache**
  3. Ak ok → SW.update() + reload

- `forceUpdate()` — tvrdší fallback (unregister SW + clear caches):
  - **Tiež má online-check** pred mazaním. Ak je GitHub offline, vráti
    `{ online: false }` a appka zostane v aktuálnom stave.

- `clearAIData()` — vymaže anthropic-api-key + chat history (pre zdieľané
  zariadenia).

### Settings → "Skontrolovať update"

Manuálny trigger update flow. V `<details>` je aj "Vynútiť cache wipe"
ako fallback keď opakovaná kontrola zlyháva.

### Version bump pravidlo (SemVer)

**Pri KAŽDOM user-facing release** treba bump-núť `APP_VERSION` v
`src/components/PWAPrompts.tsx` AJ `version` v `package.json`. Auto-popup
porovnáva tieto verzie — bez bump-u používateľ nedostane upozornenie.

Stratégia podľa [SemVer](https://semver.org/):

| Bump | Kedy | Príklady |
|---|---|---|
| **MAJOR** (X.0.0) | Veľká nová schopnosť, breaking change v store, nový subsystém | 1.5.0 → 2.0.0 (AI integrácia, B-batch features) |
| **MINOR** (1.X.0) | Nová feature kompatibilne pridaná | 2.1.5 → 2.2.0 (PWA offline-first refactor) |
| **PATCH** (1.5.X) | Bug fix, UI úprava, polish bez novej funkcionality | 2.0.0 → 2.0.1 (theme picker polish) |

**Workflow:**
1. Pri commitovaní viacerých zmien → urči najvyššiu úroveň zmeny.
2. Bump obe `APP_VERSION` aj `package.json` v jednom commite.
3. CHANGELOG.md → pridaj sekciu pre novú verziu.

### iOS / Android install

- `theme-color` meta pre iOS status bar zladenie
- iOS Safari: manuálny "Add to Home Screen" hint cez `showIOSHint`
- Android/Chrome: `beforeinstallprompt` event handler s "Nainštalovať" prompt

## Store (Zustand + persist → IndexedDB)

- Verzia 4, migrácie v `src/store/useStore.ts`
- Profily, klienti (s tags), reports (max 200), favourites
- Preferencie: language (sk/en), numerologyMethod, themeMode
- Persisted cez zustand persist v **IndexedDB** (nie localStorage)

## Export / Import

- **Settings záloha** — export/import profily + klienti + reporty + nastavenia (JSON)
- **Hromadný export klientov** — CSV/JSON
- **Import zálohy** — restore zo zálohy
- **Dashboard PDF export** — vlastný profil (natálne koliesko + bodygraph vizualizácie)

## Statické dáta

- 230 citátov, 225 mantier, 22 tarot kariet × 12 rád

## Vzťahy a porovnania

- **RelationshipsPage** — 4 módy (Partnerský výklad, Rodič a deti, Astro kompatibilita, Rodinná konštelácia)
- **Partnerský výklad** — numerologická kompatibilita, cieľ vzťahu, HD bodygraph porovnanie (elektromagnetické + kompromisné kanály, podmieňovanie)
- **Rodič a deti** — rola rodiča, komunikácia, profil dieťaťa (ŽČ, K3, kozmický vek, karmické dlhy, izolované), HD prekrývanie centier, spoločné Génové kľúče
- **Astro kompatibilita** — synastria (aspekty s významami), Davison chart, Composite chart
- **Rodinná konštelácia** — celá rodina (rodičia + deti), HD prekrývanie, rodinné číslo, súrodenecká dynamika
- **ComparePage** — vlastný profil v porovnaní + enneagram riadky
- Všetky módy: localStorage persistence, editing mode (✎ button), reset len pre aktívny tab

## Dashboard

- **Denný digest** — jedna vec na dnes, dnešná energia, mantra + citát + tarot
- **Integrálny súhrn osobnosti** (`ClientSummary`) — 11 systémov, personalizovaný cross-system príbeh, čínsky horoskop, čakry, jazyky lásky

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

- **80+ unit + component testov** (`npm test`)
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
