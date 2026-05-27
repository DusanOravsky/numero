# Integrálna mapa bytia (Número)

Offline-first PWA pre numerológiu, astrológiu, Human Design, etikoterapiu, kabalu, Theta Healing, Enneagram, Ayurvédu, TCM, biorytmus, Jungove archetypy, kristaloterapiu, Feng Shui (Kua) a sebarozvoj. **v4.4.0**

> 📁 **Nested CLAUDE.md súbory:**
> - `src/engine/CLAUDE.md` — engine pravidlá, numerológia/astrológia/HD matematika
> - `src/components/CLAUDE.md` — UI patterns, AI chat, view derivation
> - `e2e/CLAUDE.md` — Playwright E2E testy

## Technológie

- React 19 + TypeScript
- Vite 8 + TailwindCSS 4
- Framer Motion (animácie)
- Zustand (state management s persist, version 5 + migrácie)
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

## i18n — kompletná bilingválnosť (v4.0.0, audit v4.4.0)

Plná SK/EN podpora. **Vždy 1:1** — každý text musí existovať v oboch jazykoch v rovnakej hĺbke.

**Architektúra:**
- `src/i18n/namespaces/*.ts` — 8 namespace súborov s typed SK+EN dictionaries
- `src/i18n/registry.ts` — merge, `translate()`, `TranslationKey` union type
- `src/i18n/entityNames.ts` — display mapy (zodiac→Aries, planéty→Sun, HD typy→Generator, channels, strategies, love languages, house themes, Chinese animals, etc.)
- `useTranslation()` hook → `{ t, language }`. Pre content paragrafy: `language === 'sk' ? 'SK' : 'EN'` ternary
- Dátové súbory: accessor funkcie s `lang: Language = 'sk'` (fallback na SK)
- Engines s content stringami (theta, archetype, kua, kabalah, chakra, compatibility): prijímajú `lang: Language = 'sk'` parameter
- Pure calculation engines (numerology, astrology, HD, biorhythm): bez i18n, UI prekladá cez `displayName()`

**Display mapy v `entityNames.ts` (v4.4.0):**
- `ZODIAC_DISPLAY`, `PLANET_DISPLAY`, `ELEMENT_DISPLAY` — astro entity names
- `HD_TYPE_DISPLAY`, `HD_AUTHORITY_DISPLAY`, `HD_CENTER_DISPLAY` — HD typy
- `HD_STRATEGY_DISPLAY`, `HD_NOT_SELF_THEME_DISPLAY`, `HD_CHANNEL_DISPLAY` — HD stratégie, not-self, kanály
- `LOVE_LANGUAGE_DISPLAY` — 5 jazykov lásky
- `CHAKRA_NAME_DISPLAY`, `CHAKRA_THEME_DISPLAY`, `CHAKRA_STATUS_TEXT` — čakry
- `CHINESE_ANIMAL_DISPLAY`, `CHINESE_ELEMENT_DISPLAY`, `CHINESE_ANIMAL_GENITIVE` — čínsky horoskop
- `HOUSE_THEME_DISPLAY` — 12 astrologických domov

**Pri pridaní novej funkcionality:**
1. UI labely → pridať key do príslušného namespace (oba jazyky)
2. Content paragrafy → `language === 'sk' ? ... : ...` ternary
3. Dátový obsah → accessor s `lang` parametrom + oba jazyky
4. Entity names z engines → `displayName(MAPA, skKey, language)` v renderovaní
5. **Žiadne skrátené verzie** — EN musí mať rovnakú hĺbku ako SK
6. **E2E audit** — `e2e/i18n-audit.spec.ts` testuje 80+ SK patterns na 10 stránkach v EN mode

**Language picker:** Settings → Profil tab (mobile aj desktop) + Desktop sidebar.

## Štruktúra

```
src/
  engine/          # Výpočtové moduly (bez UI závislostí) — viď src/engine/CLAUDE.md
  data/            # Statické dáta a výklady
  components/      # Reusable UI — viď src/components/CLAUDE.md
    numerology/    # NumerologyPage taby (PlanesTab, KarmicTab, LoveTab, NameTab, EnneagramTab)
  pages/           # Stránky (routes, lazy-loaded okrem Dashboard)
    ModalityPage   # 6 tabov: Prehľad, Ayurvéda & TCM, Bachove kvety, Kryštály, Archetyp, Feng Shui (/modality)
  store/           # Zustand store s migráciou (IndexedDB persist)
  layouts/         # MainLayout so sidebar/bottom nav
  styles/          # Tailwind + light mode overrides
  hooks/           # useTheme, useSessionState, usePerformanceMetrics
  i18n/            # Full bilingual SK/EN system (v4.0.0)
    namespaces/    # 8 namespace files (common, settings, clients, dashboard, numerology, astrology, chakras, relationships)
    registry.ts    # Merges namespaces, exports translate() + TranslationKey union
    entityNames.ts # Display name maps for zodiac, planets, elements, HD types, Chinese animals
    useTranslation.ts # Hook: { t, language }
  utils/           # Cross-cutting helpers (v4.3.2+)
    safeStorage.ts # safeGet/safeSet/safeRemove — tolerantné voči localStorage exception (iOS private mode, quota exceeded)
    constants.ts   # getAppUrl() / getAppUrlDisplay() — base URL z window.location.origin + BASE_URL
    pdfExport.ts   # loadPdf() — lazy jsPDF + Roboto font bootstrap, PDF_SECTION_COLORS palette
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
- **ProfileContext**: 15 systémov (numerológia, astrológia, HD, čakry, kabala, theta, enneagram, dosha, tcm, čínsky horoskop, jazyky lásky, biorytmus, archetyp, kua, kristaloterapia).
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
- **Biorytmus** (`src/engine/biorhythmEngine.ts`) — fyzický (23d), emocionálny (28d), intelektuálny (33d) cyklus. Zobrazený v Dashboard (progress bary + denný tip). Derivovaný čisto z dátumu narodenia.
- **Jungove archetypy** (`src/engine/archetypeEngine.ts`) — 12 archetypov (Nevinný, Mudrc, Prieskumník, Rebel, Mág, Hrdina, Milovník, Šašo, Opatrovateľ, Tvorca, Vládca, Každý človek). Primárny/sekundárny/tieňový derivované z ŽČ + Enneagram + HD typ. Stránka `/modality`.
- **Kristaloterapia** (`src/data/crystals.ts`) — kryštály mapované na 7 čakier (3 per čakra), 9 ODV čísel, 12 znamení zodiaku. Dashboard: kryštál dňa. ModalityPage: podľa znamenia + blokovaných čakier.
- **Kua číslo / Feng Shui** (`src/engine/kuaEngine.ts`) — osobné číslo z roku narodenia + pohlavie. 4 priaznivé a 4 nepriaznivé svetové strany. Praktické rady: kam orientovať posteľ, pracovný stôl, vchod. Stránka `/modality`.

## PDF export

- **Font: Roboto** (plná slovenská diakritika vrátane ľ, ď, ť, ň, č, š, ž)
- Font sa lazy-loaduje (`src/assets/fonts/robotoFont.ts`) len pri kliknutí na "Exportovať PDF"
- Komponent: `components/ClientExport.tsx`
- **Personalizované výklady** — za každou sekciou je fialový blok "Ako čítať" s konkrétnymi hodnotami (rovnaký koncept ako v appke)
- jsPDF 4.x s custom font registráciou cez `addFileToVFS` + `addFont`
- **Sekcie v PDF** (v2.59.0): Numerológia, Vývojová, Gene Keys, Astrológia (s natálnym kolieskom), Human Design (s bodygraphom), Enneagram, Čakry, Ayurvéda, TCM, Čínsky horoskop, ORV/OMV/ODV s popismi, Biorytmus, Jungov archetyp, Kristaloterapia, Kua Feng Shui, Jazyky lásky, Theta Healing, Kabala, Partnerská kompatibilita

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

## TWA — Google Play distribúcia (v4.3.1)

Android obal cez Trusted Web Activity (Bubblewrap). TWA otvára existujúcu PWA URL — žiadny natívny kód.

- **Package:** `com.integralmap.app`
- **App name:** Integral Map
- **Projekt:** `twa/` (Bubblewrap-generated gradle projekt)
- **Build:** výhradne cez GitHub Actions (`.github/workflows/build-twa.yml`, manual trigger `workflow_dispatch`)
- **Keystore:** `twa/android.keystore` — NIKDY v gite, uložený ako GitHub Secret `TWA_KEYSTORE_BASE64`
- **Digital Asset Links:** `public/.well-known/assetlinks.json` — SHA-256 fingerprint z Play Console App Signing (aktuálne PLACEHOLDER)
- **Notifikácie:** `enableNotifications: true` — TWA deleguje Web Push na SW
- **Lokálny build nefunguje** — firemný SSL proxy blokuje Gradle. Preto CI-only.

**GitHub Secrets:** `TWA_KEYSTORE_BASE64`, `TWA_KEYSTORE_PASSWORD`, `TWA_KEY_PASSWORD`

## PWA — offline-first + manual-friendly update

`vite-plugin-pwa` s **CacheFirst stratégiou** pre všetky resources (HTML aj
JS/CSS). To znamená:

- **App sa otvára okamžite z cache** — žiadne čakanie na sieť, ani 3s timeout.
- **Pri GitHub Pages outage funguje appka ďalej** — všetko je cached lokálne.
- **Žiadny `skipWaiting`/`clientsClaim`** — SW sa neaktivuje sám automaticky.

### Detekcia novej verzie (v2.47.1+)

Tri nezávislé mechanizmy detekcie (belt-and-suspenders):

1. **localStorage version compare** — pri mount porovná `localStorage.app-version`
   vs `APP_VERSION` v JS bundle. Ak sú rôzne → popup.

2. **version.json network fetch** — fetchne `version.json` s `cache: 'no-store'`
   (3 pokusy s exponenciálnym backoff: 2s, 4s).
   Porovná s `APP_VERSION`. Ak server má novšiu → popup.
   **KRITICKÉ:** `version.json` je vylúčený z precache cez `globIgnores` v
   `vite.config.ts`. Bez toho SW servíruje starú verziu z cache a detekcia nefunguje.

3. **SW lifecycle detection** — `navigator.serviceWorker.getRegistration()` →
   ak `reg.waiting` existuje alebo `updatefound` event → popup. Toto funguje
   aj keď version.json zlyhá. Pri mount sa volá `reg.update()` na manuálny check.

**handleUpdate flow:**
- Ak je `reg.waiting` → `postMessage({ type: 'SKIP_WAITING' })` + `controllerchange` → reload
- Fallback: `checkForUpdate()` (cache wipe + unregister SW + reload)

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

**Pri KAŽDOM user-facing release** treba bump-núť `version` v `package.json`.
`APP_VERSION` sa derivuje automaticky z `package.json` cez Vite `define`
(`__APP_VERSION__` → `pkg.version`). Stačí bump-núť na jednom mieste.

Stratégia podľa [SemVer](https://semver.org/):

| Bump | Kedy | Príklady |
|---|---|---|
| **MAJOR** (X.0.0) | Veľká nová schopnosť, breaking change v store, nový subsystém | 1.5.0 → 2.0.0 (AI integrácia, B-batch features) |
| **MINOR** (1.X.0) | Nová feature kompatibilne pridaná | 2.1.5 → 2.2.0 (PWA offline-first refactor) |
| **PATCH** (1.5.X) | Bug fix, UI úprava, polish bez novej funkcionality | 2.0.0 → 2.0.1 (theme picker polish) |

**Workflow:**
1. Pri commitovaní viacerých zmien → urči najvyššiu úroveň zmeny.
2. Bump `version` v `package.json` (APP_VERSION sa auto-synchronizuje).
3. CHANGELOG.md → pridaj sekciu pre novú verziu.

### iOS / Android install

- `theme-color` meta pre iOS status bar zladenie
- iOS Safari: manuálny "Add to Home Screen" hint cez `showIOSHint`
- Android/Chrome: `beforeinstallprompt` event handler s "Nainštalovať" prompt

## Store (Zustand + persist → IndexedDB)

- Verzia 5, migrácie v `src/store/useStore.ts` (v5: `themeMode: 'system'` → `'light'`)
- Profily, klienti (s tags), reports (max 200), favourites
- Preferencie: language (sk/en), numerologyMethod, themeMode
- Persisted cez zustand persist v **IndexedDB** (nie localStorage)
- **useShallow selektory** (v4.3.2+) — všetky `useStore()` callsites s viac poliami používajú `useShallow(s => ({ ... }))` aby sa predišlo cascading re-renderom pri zmene nesúvisiaceho store state. Single field: `useStore(s => s.fieldName)`.

## localStorage robustnosť (v4.3.4+)

**KRITICKÉ:** localStorage hodí exception v iOS Safari private mode + pri vyčerpanej quote. Bez try/catch každý mount-time read/write zhodí celú appku cez ErrorBoundary.

**Pravidlo:** všetky `localStorage.*` callsites mimo storage layeru (chatStorage, indexedDbStorage) používať cez `safeGet/safeSet/safeRemove` z `src/utils/safeStorage.ts`.

```ts
import { safeGet, safeSet, safeRemove } from '../utils/safeStorage';

const v = safeGet('key');                   // string | null
const ok = safeSet('key', 'value');         // boolean (false ak exception)
safeRemove('key');                          // boolean
```

**Výnimky** (vlastný try/catch je acceptable):
- `engine/chatStorage.ts` — má vlastnú error logiku + IndexedDB fallback
- `hooks/usePerformanceMetrics.ts` — celé funkcie sú v try/catch
- `components/ErrorBoundary.tsx` — log writer má try/catch
- `components/PWAPrompts.tsx#clearAIData()` — má vlastný try/catch okolo celej funkcie

**APP_URL konštanta** (`utils/constants.ts`):
- `getAppUrl()` → `'https://dusanoravsky.github.io/numero/'` v produkcii (derivuje z `window.location.origin + import.meta.env.BASE_URL`)
- `getAppUrlDisplay()` → `'dusanoravsky.github.io/numero'` (bez https:// pre user-facing texty)
- Používať pre share linky, Web Share API, story canvas footer. **NIKDY hardcode-ovať** doménu.

## Storage management (v4.2.0)

**Chat storage** (`src/engine/chatStorage.ts`):
- **Max 50 správ per chat** — trim pri každom uložení (ponechá posledných 50)
- **TTL 90 dní** — `cleanupOldChats()` maže chaty s `updatedAt` starším ako 90 dní
- Auto-cleanup pri boot (`main.tsx`) — tichý, neblokujúci
- Manuálny trigger v Settings → Dáta → "Vyčistiť staré chaty"

**Quota monitoring** (`getStorageEstimate()`):
- Wraps `navigator.storage.estimate()` — vracia MB used / quota / percent
- Zobrazené v Settings → Dáta (progress bar, farebný podľa stavu)
- >80% = červený warning text s odporúčaním vyčistiť

## Export / Import

- **Settings záloha** — export/import profily + klienti + reporty + nastavenia (JSON)
- **Hromadný export klientov** — CSV/JSON
- **Import zálohy** — restore zo zálohy
- **Dashboard PDF export** — vlastný profil (natálne koliesko + bodygraph vizualizácie)

## Statické dáta

- 228 citátov, 441 mantier (49 per ODV), 22 tarot kariet × 12 rád (rotujúci výber 2-3 per ODV)
- 9 ORV popisov (ročné), 9 OMV popisov (mesačné), 9 ODV popisov (denné)
- 5 rotujúcich afirmácií per ODV + sezónny kontext (jar/leto/jeseň/zima)
- 21 kryštálov (7 čakier × 3) + 9 numerologických + 24 zodiacných (12 × 2)
- 12 Jungových archetypov s motto, darom, tieňom, stratégiou

## Vzťahy a porovnania

- **RelationshipsPage** — 4 módy (Partnerský výklad, Rodič a deti, Astro kompatibilita, Rodinná konštelácia)
- **Partnerský výklad** — numerologická kompatibilita, cieľ vzťahu, HD bodygraph porovnanie (elektromagnetické + kompromisné kanály, podmieňovanie)
- **Rodič a deti** — rola rodiča, komunikácia, profil dieťaťa (ŽČ, K3, kozmický vek, karmické dlhy, izolované), HD prekrývanie centier, spoločné Génové kľúče
- **Astro kompatibilita** — synastria (aspekty s významami), Davison chart, Composite chart
- **Rodinná konštelácia** — celá rodina (rodičia + deti), HD prekrývanie, rodinné číslo, súrodenecká dynamika
- **ComparePage** — vlastný profil v porovnaní + enneagram riadky. **Zhodné hodnoty** medzi všetkými porovnávanými osobami (ŽČ, K3, HD typ, dominantný element, atď.) sa zvýrazňujú zelene + ✓ ikonou (v2.45.0+).
- Všetky módy: localStorage persistence, editing mode (✎ button), reset len pre aktívny tab
- **Client picker** (v2.45.0+) — vo všetkých 4 módoch tlačidlo "📋 Vybrať z klientov" nad PersonForm; otvorí dropdown s klientmi + vlastným profilom. `clientToPerson()` helper konvertuje `Client` → `PersonInput` (string fields).

## Dashboard (v2.59.0)

Rozdelený na 3 vrstvy:
- **Ranný brief** (vždy viditeľné) — privítanie, ODV/OMV/ORV (poradie: denná prvá), Jedna vec na dnes, Biorytmus + Kryštál dňa, Dnešná energia (sezónny kontext + rotujúca afirmácia)
- **Detaily a inšpirácie** (`<details open>`) — Detail dennej energie (odvDescriptions), Detail mesačnej energie (omvDescriptions), Mantra/Citát/Tarot (s mesačnou kartou), Kalendár energie
- **Hlbší profil** (`<details>` default closed) — Integrálny súhrn (ClientSummary), Export PDF

Plus **Posledný klient shortcut** — amber karta hneď pod headerom, naviguje na `/clients/{id}` posledne otvoreného klienta (persisted v `localStorage['last-viewed-client']` cez `ClientDashboard` mount effect). Má ✕ dismiss button (v2.50.0+).

Plus **Meniny karta** (v4.4.0, SK only) — zobrazuje kto má dnes meniny. Ak user's firstName matchne → osobné blahoprianie. Ak klient matchne → upozornenie. Dáta: `src/data/namedays.json` (513 mien, 8.6KB, exportované z birthday_application DB). Matching cez NFD normalizáciu (`\p{M}` Unicode property) — "Dusan" matchne "Dušan".

## Zdieľateľný obsah (v4.3.0)

Canvas-based PNG generátor pre Instagram stories (1080×1920) v `components/ShareStory.tsx`:

- **Denná energia** — ODV číslo + afirmácia + kryštál dňa + app URL
- **Profil karta** — meno + ŽČ + HD typ/profil + element + znamenie + enneagram + app URL
- **Share mechanika** — Web Share API (`navigator.share({ files })`) s download fallback
- **Integrácia:** Dashboard (2 buttony), RelationshipsPage (partner CTA), sidebar (pozvi priateľa)

## Onboarding Reveal (v4.3.0)

Personalizovaný 5-kartový reveal po prvom vytvorení profilu (nahrádza generický tour):
1. Životné číslo + archetype
2. HD typ + stratégia + autorita
3. Dominantný element + Slnko
4. Blokované čakry + chýbajúce čísla
5. ODV + CTA

Theme-aware, Framer Motion animácie. Trigger: `localStorage.onboarding-completed`.

## MainLayout chrome (v2.45.0+)

Floating UI prvky v `MainLayout.tsx`:

- **SubjectPicker** (`components/SubjectPicker.tsx`) — quick-switch dropdown medzi vlastným profilom a klientmi. Renderuje sa len na subject-aware stránkach (`/numerology`, `/astrology`, `/human-design`, `/chakras`, `/kabalah`, `/theta-healing`, `/modality`). Čisto URL-driven cez `?client=ID` — žiadny store. `useSubject()` hook ho automaticky podchytí.
- **Presentation mode** (`?present=1`) — skryje sidebar, mobile bottom nav, headers a `GlobalAIDrawer`. Floating "✕ Ukončiť prezentáciu" button v top-right. Toggle button v sidebar pätke. Pre konzultácie naživo bez navigácie.
- **GlobalAIDrawer** — floating ✦ button (skrytý v presentMode + keď chýba API key + keď nie je profil).
- **Mobile primary nav**: Domov, Numerológia, HD, Vzťahy, Klienti. Astrológia v "Viac" sheete.

## Settings (v2.45.0+)

4 taby s URL sync (`?tab=profile|ai|data|about`):
- **Profil** — profily list + numerologická metóda + PWA inštalácia
- **AI** — API kľúč + model + lenses + denné pripomenutie
- **Dáta** — export/import záloha
- **O appke** — verzia + update check + cache wipe + performance metriky + diagnostika error log

## SharedView (v2.46.0+)

`/numero/share?data=base64(JSON)` — verejný read-only výklad pre klienta.

- URL hash má **limit 4096 znakov base64** (OOM ochrana proti maliciózny long URL)
- Payload = `{ name, birthDay, birthMonth, birthYear, birthHour?, birthMinute?, birthPlace? }` (max 7 polí)
- **Všetko ostatné sa dopočítava** z týchto polí cez engines — žiadne pre-computed výsledky v URL
- Sekcie: Integrálny súhrn (s Gene Keys), Numerológia (mriežka + roviny + izolované), Astrológia (Slnko/Mesiac/Asc + dominantný živel), Human Design (typ/autorita/profil + def/open centrá), Čakry (wheel), Kabala (sefiry), Theta (presvedčenia), Vývojová (K1-K4 + polarita ega), Enneagram (typ + integrácia/stres + krídlo), Ayurvéda (dóša + tip), TCM (element + organ + emócia + cnosť), Jazyky lásky (top 3)
- Komponent: `pages/SharedView.tsx`. Strict validácia inputov (max 80 char meno, day 1-31, month 1-12, year 1900-2100, hour 0-23, minute 0-59). Pri zlých dátach → error message.
- Vygenerovaný v `ClientExport.tsx` cez tlačidlo "Zdieľať výklad" (encode base64) alebo "QR kód" (vykreslí QR pre URL).

## CSS strategy — light/dark mode (v3.1.0)

App má pôvodný **dark-mode JSX** (`text-white`, `text-slate-300`, `bg-{color}-500/10`). Defaultný **light mode** funguje cez globálne CSS overrides v `src/styles/index.css`. Dark mode sa prepína v Settings → Profil → Vzhľad (mobile) alebo sidebar picker (desktop).

**Hlavné pravidlá:**

1. **Text overrides** — Každý `text-{color}-{shade}` použitý v appke MUSÍ mať `html.dark` override v CSS. Light mode mapuje svetlé shady (300-400) na tmavé. Dark mode mapuje tmavé shady (600-900) na svetlé. Aktuálne pokryté: slate 300-900, indigo 200-900, violet 300-800, purple 300-700, green 300-800, emerald 300-900, amber 300-900, rose 300-900, cyan 300-700, blue 300-700, red 300-800, teal 300-700, orange 600-800, yellow 300-700, pink 700.
2. **Buttony s tmavým bg** (`bg-{color}-500/600/700/800/900`) majú forcnutý biely text cez selektor `button.bg-{color}-{500-900} { color: #ffffff !important }`.
3. **`bg-white` v dark mode** → solid `#1e1b4b`. Platí pre karty, inputy, popupy, dropdowny. NIE priehľadné.
4. **`.glass` karty** v dark mode: `rgba(255,255,255,0.06)` bg + `rgba(255,255,255,0.12)` border.
5. **Gradient karty** (`from-{color}-50.to-{color}-50`) — 5 overrides cez `background-image` (indigo, amber, purple, rose, cyan).
6. **Floating elementy** (bottom sheet, AI drawer, dropdowny) → class `mobile-sheet` = solid `#1a1545` + blur.
7. **Hover states** — `hover:bg-slate-50/100/200` majú dark override (bez bieleho flashu).
8. **`bg-slate-200`** (progress bar tracky) → `rgba(148,163,184,0.18)` v dark mode.
9. **Disabled buttons** — `disabled:bg-slate-200` → `rgba(148,163,184,0.15)`, `disabled:text-slate-800` → `#94a3b8`. Tieto sú **pseudo-class varianty** — bežný `.text-slate-800` override ich NEZACHYTÍ, treba explicitný `button:disabled.disabled\:text-slate-800` selektor.
10. **Bordery** — slate-100/200/300 → 10% white, slate-400/500/600/700 → 18% white.
11. **Opacity modifiers na bg classách** (`bg-indigo-50/50`, `to-violet-50/60`) — CSS override pre `bg-indigo-50` NEZACHYTÍ `bg-indigo-50/50` (je to iná Tailwind class). Buď nepoužívať opacity modifier, alebo pridať separátny CSS override.
12. **Dashed "pridať" buttony** (`from-indigo-50.to-violet-50/60`) — majú vlastný dark gradient override.

**KRITICKÉ — žiadne inline `style={{ color: }}` pre farby!** Vždy Tailwind classy. Inline style ignoruje dark/light prepínanie.

**KRITICKÉ — SVG/Bodygraph hardcoded farby:** Undefined centrá používajú `rgba(148,163,184,0.1)` bg + `rgba(148,163,184,0.3)` border (nie #ffffff!). Inactive kanály `#94a3b8`. NatalWheel Lilith `#6b7280`.

**KRITICKÉ — wildcard trap [[feedback-css-override]]:** Selektor `[class*="bg-blue-5"]` zachytáva aj `bg-blue-50` aj `bg-blue-500`. Vždy použiť **presné classy**.

**KRITICKÉ — gradient opacity trap:** `[class*="bg-gradient-to"] .text-white` robí text biely aj vnútri svetlých gradientov. Na kartách s farebnými ale svetlými gradientmi použiť `text-slate-900`.

**Segmented controls (theme/language picker):** Aktívny stav = `bg-indigo-600 text-white` (viditeľný v oboch módoch). NIE `bg-white` (v dark mode nerozlíšiteľné od pozadia).

## Konvencie

- **Slovenčina** v UI a dátach
- **Light mode** default (biele pozadie, čakrový gradient sidebar). Dark dostupné v Settings → Profil → Vzhľad (mobile) alebo sidebar picker (desktop). Store migrácia v5 forcuje `'system'` → `'light'`.
- Čas vždy v 24h formáte
- Miesto narodenia cez autocomplete (`data/cities.ts` s lat/lon)
- Master numbers (11, 22, 33) sa zachovávajú v ŽČ
- ORV sa počíta od narodenín do narodenín, nie od januára
- TypeScript `strict: true`, eslint strict (`react-hooks/set-state-in-effect`)
- Žiadne `any`, žiadne `// @ts-ignore` bez vysvetlenia

## Testovanie

- **223 unit + component testov** (`npm test`) — 18 test files
- **13 E2E testov** (`npm run test:e2e`) — 3 smoke + 10 v4.3.3+ regression
- Lock testy pre kritické hodnoty: 30.8.1979 02:40 Bratislava → HD profil 1/3, ŽČ 1 z 37, čakra root score 45, Slnko Panna ~6°, Mesiac Škorpión ~27°, Asc Rak
- Component testy: PersonalYearTimeline, RadarChart9
- Engine testy: numerology, developmental, HD, chakra, enneagram, kabalah, ayurveda, tcm, chineseZodiac, compatibility, thetaHealing, interpretation, engineCache, **astrology** (v4.3.2+)
- E2E regression suite: `e2e/v433-regression.spec.ts` — engine integrity + JS console errors + language switch + RelationshipsPage partner mode
- Detail Playwright config: `e2e/CLAUDE.md`

## Referenčný profil pre testovanie

Pri akýchkoľvek zmenách v engines kontroluj proti **30.8.1979 02:40 Bratislava**:
- ŽČ = 1 z 37, mriežka: 1×1, 3×2, 7×1, 8×2, 9×2 (žiadne 2/4/5/6)
- Vývojová: K1=37, K2=10, K3=31, K4=4, masculine ego
- HD: profil 1/3 (Skúmajúci Mučeník), Generátor, Emocionálna autorita
- Astro: Slnko Panna 6°, Mesiac Škorpión 27°, Asc Rak
- Čakry: root/sakrálna/krčná blokované (kvôli chýbajúcim 2/5/6)
