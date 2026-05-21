# Changelog

All notable changes to this project are documented in this file. Dates are
in ISO 8601 (YYYY-MM-DD). The format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2.45.3 — 2026-05-21

**PATCH**:
- NumerologyPage Charakterová: VDD/ODD/ΣT/Kozmický vek presunuté hneď za hero strip Životného čísla (predtým hlboko v overview, často prehliadnuté).
- SubjectPicker + ClientPicker dropdown ikonky `◉`/`♟` — inline color (#4f46e5 indigo / #d97706 amber) pre garantovanú viditeľnosť (predtým biele cez CSS override).

## 2.45.2 — 2026-05-21

**PATCH**: "Vybrať z klientov" button — bg + border úplne inline (#eef2ff bg, #a5b4fc border, #3730a3 text). Tailwind utility classes nestačili kvôli CSS override eskalácii.

## 2.45.1 — 2026-05-21

**PATCH**: Hotfix viditeľnosti dropdownov a buttonov po v2.45.0.

- **SubjectPicker + ClientPicker dropdown** — text mien klientov bol neviditeľný kvôli CSS override (`text-slate-700` v dark mode mapuje na svetlú farbu). Pridaný inline `style={{ color }}` pre garantovanú čitateľnosť v oboch režimoch.
- **"Vybrať z klientov" trigger button** — biely text na svetlo-indigo bg → tmavo-indigo (#3730a3) inline color.
- **"Vypočítať kompatibilitu" disabled state** — `text-slate-500` bol pri svetlo-šedom pozadí takmer neviditeľný; vrátený na `text-slate-800` (čitateľný).
- **Dashboard "Ranný brief" label** — opravená pozícia (overlapping s ORV kartou kvôli negatívnemu `-mb-2`).
- **Dashboard "Hlbší profil"** — default `open` (predtým closed, používateľ ho mohol prehliadnuť — obsahuje Integrálny súhrn s 11 systémami).

## 2.45.0 — 2026-05-21

**MINOR**: UX audit follow-up — Dashboard split, Subject picker, Settings tabs, Presentation mode, polish naprieč appkou.

### UX vylepšenia

- **Dashboard split**: rozdelený na "Ranný brief" (vždy viditeľné), "Detaily a inšpirácie" (collapsible, default open) a "Hlbší profil" (collapsible, default closed). Eliminuje preťaženie pri každom otvorení.
- **Posledný klient shortcut**: na Dashboard amber karta s linkom na posledne otvoreného klienta (persisted v localStorage).
- **Subject picker (quick-switch)**: nový floating picker v MainLayout (sidebar/mobile header) — okamžité prepínanie medzi vlastným profilom a klientmi na všetkých subject-aware stránkach (Numerológia, Astrológia, HD, Čakry, Kabala, Theta, Doplnkové systémy). Čisto URL-driven (`?client=ID`), bez state mutácie.
- **RelationshipsPage client picker**: vo všetkých 4 módoch (Partnerský, Rodič+deti, Astro, Rodinná konštelácia) tlačidlo "Vybrať z klientov" — automaticky naplní form údajmi z existujúceho klienta alebo vlastného profilu.
- **Settings tabs**: 4 taby s URL sync (`?tab=profile|ai|data|about`) — Profil, AI, Dáta, O appke. Eliminuje dlhý flat scroll.
- **Presentation mode**: nový režim `?present=1` pre konzultácie naživo — skryje sidebar, mobile nav, headers a AI drawer; floating exit button v pravom hornom rohu. Toggle v sidebar pätke.
- **Mobile nav**: Klienti namiesto Astrológie v primary nav (Domov, Numerológia, HD, Vzťahy, Klienti). Astrológia presunutá do "Viac" sheetu — frekvencia použitia favorizuje Klientov.

### Polish

- **ComparePage zelený tint**: pri porovnaní 2+ klientov sa zhodné hodnoty (ŽČ, K3, HD typ, element, atď.) zvýraznia zeleným pozadím + ✓ ikonou. Rýchla identifikácia rezonancie/komplementarity.
- **ModalityPage premenovaný**: "Modality" → "Doplnkové systémy" (slovensky, jasnejšie).
- **ModalityPage DateInput fallback**: keď používateľ nemá profil, dostane formulár na manuálne zadanie dátumu (konzistentné s ostatnými stránkami).
- **NumerologyPage**: odstránená duplicita ŽČ kartičky v overview tabe (hero strip nižšie zobrazuje plný výklad).
- **ClientDashboard**: auto-záznam návštevy nahradený manuálnym tlačidlom "+ Zaznamenať dnešnú návštevu". Predtým sa nafukovala history pri každom otvorení detailu, teraz len pri zámernom kliku.
- **Buttony — vizuálny upgrade**: primárne CTA majú multi-color gradient (indigo→violet→purple) + glow shadow + lift hover; "Pridať dieťa" dashed buttony majú animovaný `+` v badge a hover lift.

## 2.16.0 — 2026-05-20

**MINOR**: Čínsky horoskop + AI výklad v Astrológii.

### Čínsky horoskop

Nová sekcia v AstrologyPage — 12 zvierat + 5 elementov + Yin/Yang:
- Engine: `src/engine/chineseZodiacEngine.ts`
- Dáta: `src/data/chineseZodiac.ts` (12 zvierat s traits/strengths/challenges/compatibility/advice + 5 elementov)
- Výpočet z roku narodenia (lunárny nový rok sa nezohľadňuje — zjednodušenie)
- Personalizovaný výklad: povaha, silné stránky, výzvy, element, kompatibilita, odporúčanie

### AI výklad v Astrológii

AIChat pridaný do AstrologyPage (predtým chýbal). Prompt kombinuje
západnú astrológiu (Slnko/Mesiac/Asc/element) s čínskym horoskopom
do jedného integrálneho výkladu.

---

## 2.15.0 — 2026-05-20

**MINOR**: Personalizované sprievodcovia "Ako čítať" naprieč celou appkou.

### Nové sekcie "Tvoje čítanie — ako pracovať s číslami/dátami"

Každá hlavná stránka teraz obsahuje personalizovaný collapsible sprievodca,
ktorý zobrazuje konkrétne hodnoty daného človeka s vysvetlením čo robiť:

- **Vývojová numerológia** — K3 (životné poslanie), nuly (životné úlohy),
  silné energie (3+×), aktivácia cyklov K1-K4 podľa veku
- **Charakterová numerológia** — ŽČ (dar/tieň), chýbajúce čísla (smery rastu),
  silné energie, izolované čísla
- **Human Design** — typ + stratégia, autorita, otvorené centrá, nie-ja téma
- **Astrológia** — Slnko/Mesiac/Asc, lunárne uzly (kam smeruješ/odkiaľ),
  dominantný element + planéta
- **Čakry** — blokované (čo robiť), hyperaktívne (pozor), vyvážené (opora)
- **Integrálny súhrn** — 3-krokový čítací kľúč (kto si / ako fungovať / kam smeruješ)

### Motivácia

Spätná väzba od používateľov: "vidím čísla ale neviem čo s nimi ďalej".
Sprievodcovia riešia onboarding problém bez nutnosti externej dokumentácie.

---

## 2.3.0 — 2026-05-19

**MINOR**: Etikoterapia + AI interpretation lenses (NLP, etikoterapia, koučing).

### Etikoterapia v ChakrasPage

Nová sekcia "Etická príčina a cnosť" pre každú zo 7 čakier. Vychádza
z tradície **Vladimíra Vogeltanza** a **Ctibora Bezděka** (slovensko-česká
liečebná škola).

Pre každú čakru:
- **Etická téma** (vnútorný konflikt — strach, vina, neodpustenie...)
- **Blokujúce emócie** (chips)
- **Oslobodzujúca cnosť** (dôvera, sebaprijatie, pokora, odpustenie...)
- **Súvisiace orgány a systémy** (etikoterapeutická anatómia)
- **Typické indikátory bloku** (pre orientáciu, NIE diagnostika)
- **3-4 reflexné otázky** pre sebareflexiu
- **Praktická cesta** — konkrétne denné cvičenia

Pri blokovanej čakre sa sekcia automaticky otvorí (najpotrebnejšie info).
Disclaimer: reflexný nástroj, nie medicína.

Súbor: `src/data/etikoterapia.ts` (mapping pre čakry 1-7).

### AI interpretation lenses

V Settings → AI integrácia nový picker "Štýl výkladu (lens)". Mení rámec
cez ktorý AI číta profil — dáta zostávajú rovnaké, mení sa uhol pohľadu.

4 dostupné štýly:
1. **Integratívny ezoterický** (default) — pôvodný štýl, spája všetky systémy
2. **Logické úrovne (NLP — Dilts)** — výklad cez 6 vrstiev: poslanie →
   identita → hodnoty → schopnosti → správanie → prostredie
3. **Etikoterapia (Vogeltanz, Bezděk)** — etické darčeky/úlohy, cnosti,
   reflexné otázky pre svedomie
4. **Koučing (GROW model)** — Goal/Reality/Options/Will, kouč nedáva odpovede
   ale otvára otázky

Implementácia: `aiInterpretation.ts` má `INTERPRETATION_LENSES` array,
`getLens()/setLens()` (localStorage `anthropic-lens`), a `buildSystemPrompt()`
ktorá kombinuje base prompt + lens-specific prompt. `generateAIInterpretation`
a `streamChat` používajú túto funkciu — žiadny breaking change v API.

## 2.2.4 — 2026-05-19

PWA fix: auto-popup "Nová verzia" sa konečne zobrazuje aj v inštalovanej
PWA na ploche (standalone mode).

**Problém:** v `PWAPrompts.tsx` `useEffect` mal hneď na začiatku
`if (isInStandaloneMode()) return;` — to znamenalo že version compare
(localStorage.app-version vs APP_VERSION) sa **nikdy nespustil** keď
bola appka nainštalovaná na ploche. Pop-up fungoval iba v browser
tabe, čo je presne opačná situácia ako tá kde je auto-update najviac
potrebný.

**Symptóm:** Po manuálnej aktualizácii na 2.2.3 z plochy sa appka
prepla na novú verziu, ale "Nová verzia" pop-up sa nikdy neukázal.

**Fix:** Reštrukturalizácia `useEffect`:
1. Online/offline listener + version compare → vždy aktívne
2. Install hints (iOS, beforeinstallprompt) → iba ak NIE je standalone

Auto-popup sa teraz triggers v každej situácii — či už máš appku
v browser tabe alebo nainštalovanú na ploche.

## 2.2.3 — 2026-05-19

PWA fix: manuálny "Skontrolovať update" v Settings teraz reálne funguje.

**Problém:** v2.2.0 priniesol CacheFirst pre HTML navigation requests +
odstránil `skipWaiting/clientsClaim`. Manuálne kliknutie na
"Skontrolovať update" volalo iba `SW.update()`, ktorý nainštaloval
nový SW do "waiting" stavu. Reload potom servíroval starý HTML z cache
→ verzia sa nezmenila, žiadny pop-up.

**Fix:** `checkForUpdate()` má teraz rovnaký flow ako `forceUpdate()`:
1. HEAD ping na `index.html` (no-store) — overenie online stavu
2. Ak offline → alert "GitHub je offline" + appka beží ďalej
3. Ak online → unregister SW + cache wipe + hard reload `/?check=...`

Bezpečnosť: cache wipe sa robí IBA keď je server overene online,
takže appka sa po reload garantovane nabootuje. localStorage (profily,
klienti, AI history, API kľúč) zostáva netknutý.

## 2.2.2 — 2026-05-19

UX:
- API kľúč input v Settings → AI integrácia má teraz "👁 / 🙈"
  toggle button vpravo v poli — klikom prepneš medzi password
  (skryté bodky) a text (čitateľný kľúč). Užitočné pri overovaní
  že si zadal správny kľúč.

## 2.2.1 — 2026-05-19

Test bump pre overenie že auto-popup mechaniky z 2.2.0 fungujú end-to-end
na nainštalovanej PWA na ploche. Žiadne funkčné zmeny.

## 2.2.0 — 2026-05-19

PWA stratégia: offline-first + auto-popup s offline-safe update flow.

**Cieľ:** appka musí fungovať aj keď je GitHub Pages offline. Ale keď
je nová verzia dostupná, ukáž to. A keď klikneš "Aktualizovať" počas
GitHub outage, neznič cache.

Zmeny:
- workbox: NetworkFirst → CacheFirst pre HTML navigation requests
  → app sa otvára okamžite z cache, nikdy nečaká na sieť
- workbox: skipWaiting/clientsClaim ODSTRÁNENÉ
  → SW sa neaktivuje sám, čaká na manuálny krok
- Auto-update prompt sa zobrazí IBA RAZ po reálnom upgrade
  (porovnanie localStorage.app-version vs APP_VERSION)
- handleUpdate volá nový checkForUpdate() ktorý:
  - 1. ping HEAD na index.html (online check, no-store)
  - 2. ak online → SW.update() + reload
  - 3. ak offline → alert "GitHub je offline" + appka beží ďalej
- forceUpdate() (manuálne v Settings) tiež má online-check
  pred mazaním cache
- Settings → "Skontrolovať update" tlačidlo (manuálny trigger)
- Settings → "Vynútiť cache wipe" zostáva ako fallback v expandable

Rieši:
- v2.1.4 infinite loop "Nová verzia" prompt
- offline crash pri "Aktualizovať" keď je GitHub down
- nepríjemný auto-popup pri každom controllerchange evente

## 2.1.5 — 2026-05-19

PWA update infinite-loop fix:
- v2.1.4 zobrazoval "Nová verzia" prompt pri každom controllerchange
  evente bez kontroly či sa naozaj zmenila verzia → po reload sa SW
  znova aktivoval → znova prompt → nekonečný cyklus.
- onControllerChange teraz checkuje `localStorage.app-version !== APP_VERSION`
  pred zobrazením prompt-u (rovnako ako mount-time check).
- forceUpdate() ukladá APP_VERSION do localStorage PRED reloadom — po
  reload bude versions match → žiadny prompt.

## 2.1.4 — 2026-05-19

PWA update detection na mobile — Dušok-style network-first pre HTML:

Predtým: `index.html` bol cache-first cez precache → mobile PWA pri otvorení
nikdy nedostala čerstvý HTML, takže nezistila že je nový bundle hash.

Teraz:
- `index.html` zostáva v precache (pre offline reload SPA routes)
- Runtime caching pridaný `NetworkFirst` handler pre VŠETKY navigation
  requests (`request.mode === 'navigate'`)
- Online → fresh HTML každé otvorenie → update detection funguje
- Offline → 3s timeout → fallback na cache → app stále plne funkčná

Spojené s v2.1.3 event-based update checks (controllerchange,
visibilitychange max 1× za 6h) → na mobile nainštalovanej PWA uvidíš
"Nová verzia" prompt pri ďalšom otvorení po deploy-i, bez batériu
zožierajúceho pollingu.

## 2.1.3 — 2026-05-19

PWA update detection battery-friendly:
- Odstránený periodický polling každých 60s (žral by batériu)
- Nová stratégia event-based:
  - 1× pri mount (initial check)
  - controllerchange (zero cost, eventový)
  - visibilitychange (návrat z pozadia) — throttled max raz za 6 hodín
- App nikdy nebude pingovať server keď je v pozadí
- Pri návrate z pozadia max 1× za 6h check (sieťovo aj batériovo lacné)

## 2.1.2 — 2026-05-19

PWA update detection na mobile:
- Predtým: PWA nainštalovaná na ploche nikdy nedostala "Nová verzia"
  prompt, lebo SW sa aktivuje až po zatvorení všetkých kariet — čo sa
  pri nainštalovanej appke nikdy nestane.
- Workbox: `skipWaiting: true` + `clientsClaim: true` — nový SW preberá
  kontrolu okamžite po nainštalovaní bez čakania.
- PWAPrompts:
  - Listener na `controllerchange` zachytí keď SW prevezme kontrolu
  - Periodická kontrola update každých 60s (registration.update())
  - Kontrola pri visibility change (otvorenie z pozadia → check)
  - Manuálne SKIP_WAITING postMessage pre kompatibilitu

## 2.1.1 — 2026-05-19

UI cleanup:
- Odstránené duplicity zo Settings: "Vzhľad aplikácie" sekcia
  (Light/Dark) a "Jazyk" sekcia (SK/EN) — obe sú už v sidebar footer.
- Settings stránka je kratšia a fokusovaná na profily / metódu /
  AI integráciu / diagnostiku.

## 2.1.0 — 2026-05-19

Hĺbkový code review fixy (5 CRITICAL + 10 HIGH + 6 MEDIUM/LOW):

### Critical
- **AI privacy:** clearAIData() helper + "Vymazať VŠETKY AI dáta" tlačidlo
  v Settings (kľúč + všetky chat histórie)
- **ClientSummary regex → explicit birthDay/Month/Year props** (Dashboard
  + ClientDashboard pridali args)
- **KabalahPage + ThetaHealingPage useSubject()** — predtým ignorovali
  ?client=ID, teraz majú "Späť na klienta" link + amber badge
- **Solar Return DST fix:** parametrizoval timezoneOffsetHours, žiadny
  hardcoded CET fallback
- **KarmicDebt source 'challenge'** odstránený z type union (dead branch)

### High
- AI history sa neperistuje pri zlyhaní streamu (orphan user-only správy)
- SSE parser handles \\r\\n a Anthropic 'error' event frames
- Prompt injection: sanitizeForPrompt() v summarizeProfile + strict JSON
  validácia pri import klienta
- SharedView: 4KB cap base64, modern UTF-8 decode (TextDecoder), strict
  type validácia všetkých polí
- HD/Astro timezone z lat/lon (cez getTimezoneFromCoords) — non-EU
  narodenia teraz dostávajú správny offset
- HD wheel-start: 3 nové lock testy s rôznymi referenciami
- Lilith/Chiron VYLÚČENÉ z calculateNatalAspects (aproximovaná pozícia)
- LRU cache MAX_ENTRIES_PER_CACHE 30 → 100
- ErrorBoundary "Obnoviť aplikáciu" používa BASE_URL (predtým 404 na
  GitHub Pages po crashe)
- useSubject() vracia useMemo-cached objekt
- OnboardingTour gating na localStorage flag (žiadny mount-flicker)

### Medium / Low
- PDF export: APP_VERSION namiesto hardcoded "v1.5.0"
- Challenge 8 description (Materiálna rovnováha) doplnená
- getCrossAngle() kanonická HD klasifikácia (LEFT_ANGLE set-based, nie
  zjednodušené `line2 < line1`)
- AstrologyPage warning banner keď chýba miesto narodenia
- Dashboard AI context obsahuje aj developmental data
- PartnerBodygraph header overlap fix (top 2% → 8%, sync s Bodygraph)
- escape()/unescape() nahradené modern TextEncoder/TextDecoder API

81 unit testov passing, build clean.

## 2.0.4 — 2026-05-19

UX:
- "← Späť na klienta {meno}" linka v hlavičke Numerology / Astrology /
  Human Design / Chakras stránok keď je aktívny klient kontext
  (?client=ID). Klik vráti späť na ClientDashboard.

## 2.0.3 — 2026-05-19

PWA cache fix:
- forceUpdate() helper: unregister všetkých SW + vymazanie všetkých
  CacheStorage entries + reload na ?fresh=timestamp
- "Aktualizovať" tlačidlo v auto-update prompte teraz volá forceUpdate
- Nové "↻ Vynútiť aktualizáciu (cache wipe)" tlačidlo v Settings → O
  aplikácii — pre prípad keď používateľ vidí starú verziu napriek deploy-u

Použitie: keď ste si istí, že máte na servere novú verziu ale aplikácia
ukazuje stará dáta, klikni Vynútiť aktualizáciu. Profily ani klienti
sa nestratia (zostávajú v localStorage).

## 2.0.2 — 2026-05-19

Bug fix:
- ClientNumerology "Otvoriť detail →" tlačidlá v ClientDashboard
  (Numerológia / Astrológia / HD / Čakry / Kabala / Theta) navigovali
  bez ?client=ID, takže sa vždy otvoril vlastný profil namiesto
  klientovho. Pridaný `clientId` prop a všetky 6 navigácií ho
  pridajú do query stringu.

## 2.0.1 — 2026-05-19

UI polish:
- Theme picker (Light/Dark only — System dropped) ako segmented control
  v sidebar footer s clean SVG ikonami
- Language picker (SK/EN) prerobený na rovnaký segmented štýl
- Dashboard quick-nav 8 kariet → čisté pastelové bg-50/100 farby
  s farebnými ikonami a tmavým textom (nahradené slabé /10 gradienty
  ktoré boli nečitateľné na svetlom pozadí)

## 2.0.0 — 2026-05-19

**MAJOR**: AI Claude integrácia, ~32 nových features (B-batch + C-batch),
úplný refactor setState patternov, lazy load všetkých routes.

### Numerology depth (B-batch)

- **B1** Personal Year cycle history — chronological list of ORV for ±5 years
  around current year, with title and theme per year.
- **B2** Karmic debts 13/14/16/19 — auto-detected from life-path from-sum,
  birth day, and pinnacle mid-sums; each carries theme + lesson.
- **B3** Maturity & Birthday numbers added to NumerologyResult and shown
  in the Karmické cykly tab.
- **B4** Balance number from name initials (stress-recovery strategy).
- **B5** Hidden Passion — most-frequent number 1-9 in the name.
- **B6** Karmic Lessons — numbers 1-9 entirely missing from the name.
- **B7** Cornerstone (first letter), Capstone (last letter), First Vowel
  with archetypal descriptions for every Slovak/English letter.
- **B11** Lunar phases timeline (15-day strip with glyphs + advice).
- **B12** Lilith (Mean Black Moon) and Chiron (linear approximation)
  added to astrology engine; do not affect dominant element analysis.
- **B13** Upcoming solar + lunar eclipses (next 6) on AstrologyPage.
- **B15** HD lines 1-6 detailed archetypes (Investigator, Hermit, Martyr,
  Opportunist, Heretic, Role Model) with conscious / unconscious /
  shadow / signature blocks per line; profile-specific phase summaries.
- **B16** HD authority detail — wave + how-to-listen for Emotional /
  Sacral / Splenic / Ego / Self-Projected / Mental / Lunar.
- **B17** HD definition type (Single/Split/Triple/Quadruple/No) computed
  via connected-components BFS on defined-centers graph.
- **B23** Daily tarot card on Dashboard (Major Arcana per ODV).
- **B24** Meditation timer with 528 Hz Solfeggio chime.
- **B25** Daily mantra (3 variants per ODV, rotation by day-of-year).
- **B26** Daily quote (3 variants per ODV).
- **B28** Radar chart — 9 numerological energies as SVG polygon.
- **B29** Natal wheel — 12-sector zodiac chart with planets, ASC, MC.
- **B30** Bodygraph — active gate numbers shown beneath each center.
- **B31** Tree of Life — kabbalistic SVG with 10 sefirot + 22 paths,
  primary + secondary highlighted, path to Malchut in gold.
- **B32** Hover mini-card tooltips on grid numbers.

### Client management (A-batch)

- **A4** Multi-client comparison viewer at `/clients/compare` — side-by-side
  table for 2-4 clients (numerology, astrology, HD).
- **A8** Lifetime ORV histogram in Vibrácie tab — 9-year cycles, current
  year highlighted.
- **A10** Tag system on clients (optional `tags?: string[]`).
- **A11** Bulk-mode in ClientsPage: per-card checkboxes, select-all,
  bulk delete, bulk add tag.
- **A13** Tag chip filter row above the client grid.
- **A14** Source citation for Charakterová method (Robin Steinová).

### Critical fixes

- HD profile bug — `HD_WHEEL_START` was incorrectly set to 302.625°.
  Reverted to 302.0° (Jovian Archive convention: gate 41 = 2°00'00"
  Aquarius). Locked test ensures 30.8.1979 02:40 Bratislava → profile 1/3.
- ChakrasPage now passes `birthHour`/`birthMinute` to HD and astrology
  engines (was silently defaulting to 12:00).
- Reverted A2 (year mid-sum digits in grid) — caused phantom numbers
  in the grid that weren't part of the official date.

### Performance & quality (C-batch)

- **C1** Component tests setup (jsdom + Testing Library); first tests
  for PersonalYearTimeline + RadarChart9. 71 → 78 tests.
- **C3** GitHub PR template (`.github/PULL_REQUEST_TEMPLATE.md`).
- **C4** This `CHANGELOG.md`.
- **C5** Bundle analyzer via `rollup-plugin-visualizer`; gated by
  `ANALYZE=1` env. `npm run build:analyze` → `dist/stats.html`.
- **C6** Lazy-loaded all secondary routes via `React.lazy` + `Suspense`.
  Initial bundle: 530KB → 220KB (73KB gzip).
- **C7** Improved SW offline strategy: `cleanupOutdatedCaches`,
  navigateFallback, runtimeCaching for navigations / assets / images.
- **C8** Error reporting — local error log (max 20) in localStorage
  with stack/component-stack/url/UA; copy-to-clipboard from boundary
  fallback; diagnostics card in Settings.
- **C9** Performance metrics — `captureWebVitals()` (LCP + CLS) and
  `usePerformanceMetrics()` mount-timing hook; visualised in Settings.

### UX

- **A6** First-run onboarding tour after profile creation.
- **A12** DateInput values persist across page navigation.
- Vývojová Prehľad shows shared life-path number (1) as the primary hero,
  with K3 highlighted as ★ life-mission chip.
- Numerologia tabs are method-aware: Charakterová-only sections (ŽČ
  interpretation, VDD/ΣT cards, Roviny/Karmické/Jazyky lásky tabs) are
  hidden when Vývojová is active and vice versa.

### Developer

- New tests (71 total): karmic debts, maturity, HD profile lock.
- All page components ported to lazy + Suspense; Dashboard remains eager.

## Earlier (2026-04 to 2026-05-18)

- Initial 19-task feature push: themes, i18n, dark/light, Cycle picker,
  edit/delete reports, search, history, status bar, chart aspects, …
- Audit fixes batch (b3cedb9): timezone, midnight birth-hour `??`-fallback,
  date validation, chakra thresholds, HD wheel start.
- LRU cache for engines, True Node, A1 (natal aspects), A3 (Pinnacles &
  Challenges), A5 (print-friendly), A6 (onboarding), A12 (date persist),
  A14 (citations), 4-circled developmental method.

For full commit-level history use `git log`.
