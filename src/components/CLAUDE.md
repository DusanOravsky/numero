# UI komponenty

> Top-level overview: `../../CLAUDE.md` · Engine pravidlá: `../engine/CLAUDE.md`

## Princípy

- **UI nikdy neobsahuje výpočtovú logiku** — všetko cez engines.
- **Method-aware rendering** — niektoré sekcie sa zobrazujú len pre Charakterovú alebo len pre Vývojovú metódu.
- **Glass morphism** — všetky sekcie obalené v `<GlassCard>` pre konzistentný vzhľad.
- **Framer Motion** pre vstupné animácie (`initial`, `animate`, `transition delay`).
- **Slovenčina** v UI textoch. i18n prerušujeme cez `useTranslation()` ale väčšina textov je inline (sk-only kvôli ezoterickej špecifickosti).
- **`safeStorage` pre localStorage** (v4.3.4+) — `safeGet/safeSet/safeRemove` z `src/utils/safeStorage.ts`. Priamy `localStorage.*` zhodí appku v iOS Safari private mode. Detail v top-level CLAUDE.md.
- **`useShallow` selektor pre Zustand** (v4.3.2+) — `useStore(useShallow(s => ({ x: s.x, y: s.y })))`. Single field cez `useStore(s => s.x)`.

## Klient kontext (`useSubject` hook + `SubjectPicker`)

Stránky Numerology, Astrology, HumanDesign, Chakras, Kabalah, Theta, Modality používajú
**`useSubject()`** namiesto `useStore().profile`. Hook vráti:

- Aktívny profil ak nie je `?client=ID` v URL
- Klienta ak je `?client=ID` (napr. po preklikoch z `ClientDashboard` alebo cez SubjectPicker)

**SubjectPicker** (v2.45.0+, `components/SubjectPicker.tsx`) — floating dropdown v `MainLayout` (sidebar/mobile header). Renderuje sa len na subject-aware stránkach (`SUBJECT_AWARE_PATHS`). Click → upraví `?client` query param, `useSubject()` automaticky podchytí novú hodnotu. Zachováva ostatné query params.

Subject má rovnaké polia ako profile + `isClient: boolean` + `timezoneOffset`
(odhadnutý z `birthLatitude/Longitude` cez `getTimezoneFromCoords`).

Každá stránka pri `subject.isClient === true` zobrazuje:

```tsx
{subject?.isClient && (
  <button onClick={() => navigate(`/clients/${subject.id}`)}>
    ← Späť na klienta {subject.name}
  </button>
)}
<div className="flex items-center gap-3">
  <h1>...</h1>
  {subject?.isClient && (
    <span className="bg-amber-500/15 border border-amber-500/30 text-amber-700">
      Klient: <strong>{subject.name}</strong>
    </span>
  )}
</div>
```

`ClientNumerology.tsx` (zobrazené v `ClientDashboard`) má `clientId` prop —
"Otvoriť detail →" linky pridajú `?client=ID` do navigácie.

**ClientNumerology princíp (v2.50.0+):** zobrazuje len základ — ŽČ kruh, ORV/OMV/ODV,
mriežka (method-aware: vývojová/charakterová podľa `useStore().numerologyMethod`).
Detaily (izolované čísla, roviny, jazyky lásky, "Tvoje čítanie") sú na stránke
`/numerology?client=ID` cez "Otvoriť detail →". Rovnaký princíp platí aj pre
Astrológiu, HD, Čakry, Kabalu, Theta — v klient dashboarde len summary, detail cez link.

## NumerologyPage refaktor (v2.14.0)

**Overview tab — profil grid (v4.3.0):**
- Developmental: K3, K1·K2·K4, ego polarita, ORV, OMV, ODV, Enneagram, Maturity, karmické dlhy (ak existujú)
- Characterological: ORV, OMV, ODV, plné roviny, chýbajúce čísla, izolované, Enneagram, jazyk lásky, Maturity, karmické dlhy

NumerologyPage bola zrefaktorovaná z ~1585 na ~1200 riadkov. Taby extrahované do `src/components/numerology/`:

| Komponent | Účel |
|---|---|
| `PlanesTab` | Roviny (iba Charakterová) |
| `KarmicTab` | Karmické cykly, pinnacles, challenges |
| `LoveTab` | Jazyky lásky (iba Charakterová) |
| `NameTab` | Numerológia mena |
| `EnneagramTab` | Enneagram typ, krídla, integrácia/dezintegrácia |

## ModalityPage (v2.59.0)

Stránka `/modality` s **6 tabmi** (URL-synced cez `?tab=`):

| Tab | Obsah |
|-----|-------|
| `overview` (default) | Ako sa to počíta (6 kariet) + Tvoje čítanie personalizované |
| `ayurveda` | Ayurvéda dóša + TCM 5 elementov |
| `bach` | Bachove kvetové esencie (17 esencií × 7 čakier) |
| `crystals` | Kristaloterapia — podľa znamenia, blokovaných čakier, ODV |
| `archetype` | 12 Jungových archetypov (primárny/sekundárny/tieňový) |
| `fengshui` | Kua číslo — priaznivé/nepriaznivé svetové strany |

Hooks (`useSearchParams`, `useCallback`, `useMemo`) musia byť **pred** early return (`if (!data)`).

## Personalizované sprievodcovia "Tvoje čítanie" (v2.15.0+)

Každá hlavná stránka má `<details open>` sekciu s personalizovaným výkladom
pre konkrétneho človeka — nie generický návod, ale jeho konkrétne čísla/hodnoty
s vysvetlením čo robiť. Motivácia: spätná väzba "vidím čísla ale neviem čo s nimi".

**Všetky "Tvoje čítanie" sú default `open`** (v2.33.0+). Per-page AI Chat bol odstránený — nahradený globálnym drawer.

| Stránka | Komponent / Miesto | Obsah |
|---|---|---|
| Vývojová numerológia | `DevelopmentalNumerologyView.tsx` (pod intro) | K3 životné poslanie, nuly = úlohy, 3+× = dary/výzvy, K1-K4 vekové obdobia |
| Charakterová numerológia | `NumerologyPage.tsx` (overview tab, za mriežkou) | ŽČ dar/tieň, chýbajúce čísla, silné energie, izolované |
| Human Design | `HumanDesignPage.tsx` (Prehľad tab) | Typ + stratégia, autorita, otvorené centrá, nie-ja téma |
| Astrológia | `AstrologyPage.tsx` (za "Čo si z toho vziať") | Slnko/Mesiac/Asc, lunárne uzly, dominantný element |
| Čakry | `ChakrasPage.tsx` (za ChakraBody) | Blokované (čo robiť), hyperaktívne (pozor), vyvážené |
| Integrálny súhrn | `ClientSummary.tsx` (pod nadpisom) | 3-krok čítací kľúč: kto si / ako fungovať / kam smeruješ |
| Modality | `ModalityPage.tsx` | Dóša, TCM element, Bachove kvety prakticky |
| Vzťahy — Partner | `RelationshipsPage.tsx` | Kompatibilita %, silné stránky, výzvy |
| Vzťahy — Rodič-dieťa | `RelationshipsPage.tsx` | Rola rodiča, komunikácia, profil dieťaťa |
| Vzťahy — Astro | `RelationshipsPage.tsx` | Elementálna harmónia, synastria |
| Vzťahy — Konštelácia | `RelationshipsPage.tsx` | Rodinný energetický profil |

Vzor implementácie:
- Dáta sa derivujú z `result` priamo v komponente (žiadny nový engine)
- Vždy `<details open>` — používateľ si môže zavrieť, ale defaultne vidí
- Texty z existujúcich `developmentalMeanings.ts`, `lifePaths.json`, inline descriptions
- `developmentalHowToRead` exportovaný z `data/developmentalMeanings.ts` — statické texty pre karmické cykly a praktický tip

## Method-aware UI (KRITICKÉ)

Aplikácia podporuje 2 numerologické metódy. UI sa musí prispôsobiť:

- **Charakterová** (`numerologyMethod === 'characterological'`) → zobraziť: ŽČ hero, Roviny tab, Karmické cykly tab, Jazyky lásky tab, VDD/ΣT, Steinová texty.
- **Vývojová** (`'developmental'`) → zobraziť: ŽČ hero (zdieľané) + K3 chip, K1-K4 explainer, comparison karta. Skryť: Roviny, Karmické cykly, Jazyky lásky, VDD/ΣT.

V `NumerologyPage` to riešime cez:

```typescript
const allTabs = [
  { id: 'overview', methods: ['characterological', 'developmental'] },
  { id: 'planes', methods: ['characterological'] },
  // ...
];
const tabs = allTabs.filter(t => t.methods.includes(numerologyMethod));
```

A **derivovaný visible tab** (nie setState v useEffect):

```typescript
const visibleTab = tabs.find(t => t.id === activeTab) ? activeTab : 'overview';
```

V Dashboard `<ClientSummary respectMethodPreference={false} />` zobrazí OBA pohľady (Dashboard ignoruje switch).

## State management vzor

**Auto-init z profilu:** používame `useMemo` namiesto `useEffect → setState` aby sme nemali cascading renders:

```typescript
const profileResult = useMemo(() => {
  if (!profile) return null;
  return calculateFullNumerology(profile.birthDay, profile.birthMonth, profile.birthYear);
}, [profile]);

const [manualResult, setManualResult] = useState(null);
const result = manualResult ?? profileResult;

const handleCalculate = (d, m, y) => setManualResult(calculateFullNumerology(d, m, y));
```

Tento vzor je v: `AstrologyPage`, `HumanDesignPage`, `KabalahPage`, `ThetaHealingPage`, `ChakrasPage`, `NumerologyPage`, `ClientDashboard`.

**Výnimky kde useEffect+setState je legitímne:**
- `PWAPrompts` — sync s localStorage version pri mount
- `SharedView` — parsing URL hash pri mount
- `ClientDashboard` — sync `last-viewed-client` do localStorage pri mount (side-effect, nie state derivation)

Tieto majú `// eslint-disable-next-line react-hooks/set-state-in-effect` s vysvetlením.

**ClientDashboard report flow** (v2.45.0+): predtým bolo auto-add reportu pri každom otvorení detailu klienta (1× za deň). Odstránené — nahradilo manuálne tlačidlo "+ Zaznamenať dnešnú návštevu" v sekcii "Návštevy klienta". Dôvod: bez user intentu sa zoznam reportov nafukoval; teraz len pri zámernom kliku konzultanta.

## AI Chat komponent (`AIChat.tsx`) + Globálny drawer (`GlobalAIDrawer.tsx`)

Streaming chat s Claude API:

- **Persistovaná história** v **IndexedDB** pod kľúčom `ai-chat-{storageKey}`. Storage key: `global-${profileId}` (drawer), `client-${clientId}` (ClientDashboard).
- **Streaming** cez `streamChat()` s `AbortController` pre cancel.
- **Abort trim na vetu** (v4.3.4+): pri zrušení mid-stream sa text trimne na poslednú dokončenú vetu (`. !? \n`) cez `trimToLastSentence()` helper. Žiadne polovičné slová v histórii.
- **Markdown rendering** inline (## ### nadpisy, **bold**, • bullets) bez external lib. Light-mode safe farby (slate-700/900, indigo-600/700) — žiadne `text-indigo-200/300` na bielej karte.
- **Empty state** s ✦ ikonkou + CTA button + default úvodná správa.
- **Token counter** v patičke + reset rozhovoru.
- **Štýl bublín (v4.6.2+):** konverzácia je v `bg-gradient-to-b from-indigo-50 to-violet-50` paneli. User bubble = solid indigo→violet gradient s bielym textom (iMessage-style, `rounded-tr-md` na pravo). Assistant bubble = biela karta s `border-indigo-100` + ✦ accent. Predtým `bg-slate-800/40` na assistant a `bg-indigo-500/15` na user → nečitateľné a bez kontrastu v light mode.
- **Default úvodná správa (v4.6.2+):** `DEFAULT_INITIAL` žiada krátky náhľad (~250 slov), nie kompletný výklad. Spárované s lens prompt v `aiInterpretation.ts` ktorý tiež predpisuje stručnosť. Detaily sa rozpisujú v rozhovore.

### Globálny AI drawer (v2.33.0+)

`GlobalAIDrawer.tsx` v `MainLayout`:
- Floating ✦ button (fixed, bottom-right). Viditeľný len ak existuje profil + API kľúč.
- Slide-out panel (right, full height, 420px na desktop).
- **Lazy computation** — engines sa počítajú len keď `open === true` (v `useMemo` deps).
- Escape key na zatvorenie + backdrop click.
- Plný `ProfileContext` (11 systémov) — rovnaký ako mal Dashboard AI predtým.

**Per-page AI sekcie boli odstránené** (v2.34.0). Globálny drawer ich nahrádza.
Výnimka: `ClientDashboard` si ponecháva vlastný `AIChat` (kontext klienta, nie vlastného profilu).

Trigger pointy:
- Globálny drawer → voľná konverzácia s plným kontextom
- ClientDashboard → profesionálny výklad pre klienta na konzultáciu

### Interpretation lenses (v2.3.0+)

Settings → AI integrácia má picker "Štýl výkladu". Lens iba mení system prompt, žiadny vplyv na engine:

- `default` — integratívny ezoterický (pôvodný štýl)
- `logical-levels` — NLP logické úrovne (Dilts): poslanie → identita → hodnoty → schopnosti → správanie → prostredie
- `etikoterapia` — Vogeltanz/Bezděk: cnosti, neresti, reflexné otázky, etické darčeky/úlohy
- `coaching` — GROW model (Whitmore): Goal, Reality, Options, Will

Lens je v `localStorage` pod `anthropic-lens`. `aiInterpretation.ts` má `buildSystemPrompt()` ktorá kombinuje base + lens prompt. Pri zmene lensu treba reštartovať rozhovor (lens ovplyvňuje iba system prompt, ktorý sa posiela pri každom volaní, ale lens-specific inštrukcie cielia na PRVÚ odpoveď).

## Etikoterapia v ChakrasPage (v2.3.0+)

`src/data/etikoterapia.ts` exportuje `ETIKOTERAPIA_BY_CHAKRA` s mappingom 1-7. ChakrasPage renderuje collapsible sekciu "✦ Etická príčina a cnosť" v každej čakrovej karte. Pri `state.status === 'blocked'` sa otvára automaticky (`<details open>`).

**Princíp:** etikoterapia je reflexný nástroj, nie diagnostika. Vždy s disclaimerom v päte sekcie. UI farby: rose/red pre etickú tému a blokujúce emócie, emerald/green pre cnosť a praktickú cestu, indigo pre reflexné otázky.

## Vizualizácie

| Komponent | Use case |
|---|---|
| `NumerologyGrid` | 3×3 mriežka, hover mini-card tooltip, klik = detail |
| `RadarChart9` | SVG radar 9 numerologických energií |
| `NatalWheel` | SVG natálne koliesko 12 sektorov + planéty (prepísaný: korektná arc math, anti-collision) |
| `Bodygraph` | HD bodygraph s aktívnymi bránami pri každom centre |
| `TreeOfLife` | SVG kabalistický strom 10 sefír + 22 ciest |
| `ChakraBody` | 7 čakier vertikálne s mantrami (LAM→AUM), progress bary, glow podľa stavu, klikateľné ikony pre audio mantry |
| `MantraButton` | Animovaný play/pause button pre čakrové mantry (pulse glow, ⏸ pri prehrávaní) |
| `ORVLifeHistogram` | Lifetime ORV cez 9-ročné cykly |
| `PersonalYearTimeline` | ±5 rokov ORV chronologicky |
| `LunarTimeline` | 15-dňový pás fáz Mesiaca |
| `UpcomingEclipses` | Najbližších 6 zatmení |
| `ProgressionsView` | Sekundárne progresie s vekovým pickerom |
| `SolarReturnView` | Výročný horoskop pre konkrétny rok |
| `ClientExport` | PDF vizualizácie (natálne koliesko + bodygraph) |
| `ClientSummary` | Cross-system príbeh, enneagram, ayurvéda/TCM |

## Tailwind konvencie

- **Light mode default** (biele pozadie). Dark + System cez `useTheme()`.
- **Glass effekt:** `glass`, `glass-light`, `glow` utilita classes (definované v `styles/index.css`).
- **Color tokens:**
  - `indigo-*` = primárna farba (numero/UI primary)
  - `violet-*` = sekundárna
  - `amber-*` = highlight / dôležité
  - `emerald-*` / `green-*` = success / dar
  - `rose-*` / `red-*` = tieň / blocked
  - `cyan-*` = info / astro
- **Dynamic class names** s šablónami (`bg-${color}-500`) **NEFUNGUJÚ** v Tailwind JIT — vždy explicit static classes alebo `clsx`.

## i18n

- In-house dictionary rozdelený do namespace súborov `src/i18n/namespaces/*.ts` (common, settings, clients, dashboard, numerology, astrology, chakras, relationships), zlúčené v `src/i18n/registry.ts`. (`translations.ts` je už len deprecated re-export.)
- Type-safe — každý namespace je `Record<XKey, string>` pre SK aj EN, takže chýbajúci kľúč v jednom jazyku = TS compile error (vynútené 1:1).
- `t('key')` cez `useTranslation()` hook → `{ t, language }`
- Default `sk`, fallback z `en` na `sk` (+ DEV warning pri chýbajúcom kľúči)
- Entity names (zodiac, planéty, HD typy, čakry…) cez `displayName(MAPA, skKey, lang)` z `entityNames.ts`
- Detaily a pravidlá: top-level `CLAUDE.md` sekcia „i18n — kompletná bilingválnosť"

## Form patterns

- **DateInput** komponent — perzistencia hodnôt v sessionStorage cez `useSessionState` (zachovanie pri navigation).
- **City autocomplete** — `searchCities()` z `data/cities.ts` (vracia top 10 podľa fuzzy match).
- **Birth time** voliteľný — ak chýba, default 12:00.
- **Validation** — `isValidDate()` z numerology engine (Feb 31 = false, priestupné roky).

## Vzory pre dynamic className conditional

```tsx
// ✓ správne — static classes, ternary
<div className={`p-3 rounded-xl border ${
  isActive ? 'bg-indigo-500/15 border-indigo-500' : 'border-slate-300 hover:bg-slate-50'
}`} />

// ✗ NESPRÁVNE — Tailwind JIT to nedetekuje
<div className={`bg-${color}-500/10`} />
```

Pri Davison/Composite charts som musel rozbiť dynamic colors na inline if/else pretože JIT inak strip-ol classy.

## ErrorBoundary

`ErrorBoundary.tsx` — globálny boundary obaľujúci `<App />`:
- Saves error log do localStorage (max 20)
- Copy details to clipboard
- "Obnoviť aplikáciu" button → naviguje na `/`
- Nested CLAUDE.md helpers: `getErrorLog()`, `clearErrorLog()` exportované pre Settings page

## Performance hooks

`hooks/usePerformanceMetrics.ts`:
- `captureWebVitals()` — boot-time, jeden raz v `main.tsx`
- `usePerformanceMetrics(name)` — per-component mount-to-paint
- `getPerfLog()` / `clearPerfLog()` — pre Settings Diagnostika

## Onboarding Reveal (v4.3.0)

`OnboardingReveal.tsx` — personalizovaný 5-kartový reveal po vytvorení prvého profilu. Nahradil pôvodný generický `OnboardingTour` (ten je teraz len re-export).

**5 kariet:**
1. Životné číslo + archetype title (scale-up animácia)
2. HD typ + stratégia + autorita (stagger fade-in)
3. Dominantný element + znamenie Slnka (rotate-in)
4. Blokované čakry + chýbajúce čísla (slide-in, rose/amber)
5. ODV číslo + CTA "Objavuj profil" (glow)

**Technické:**
- Theme-aware (kontroluje `html.dark` class)
- Všetky engine výpočty cez `useMemo` (numerology + HD + astrology + chakras)
- Trigger: `localStorage.onboarding-completed` neexistuje + profil existuje (cez `safeGet`)
- Dismiss: backdrop click / "Preskočiť" / finálne CTA / **Escape key** (v4.3.4+)
- Z-index `z-[200]` — nad PWAPrompts. Pri E2E testoch treba modal preskočiť cez `localStorage.setItem('onboarding-completed', 'true')`.

## Zdieľateľný obsah (v4.3.0)

`ShareStory.tsx` — canvas-based PNG generátor pre Instagram stories (1080×1920). URL footer používa `getAppUrlDisplay()` z `utils/constants.ts` — žiadny hardcoded host.

**Dve šablóny:**
- `generateDailyStory()` — ODV číslo + afirmácia + kryštál dňa + app URL
- `generateProfileCard()` — meno + ŽČ + HD typ/profil + element + znamenie + enneagram + app URL

**`shareOrDownload(blob, filename)`** — Web Share API s `files` ak podporované, inak download fallback.

**Integrácia:**
- Dashboard: 2 tlačidlá "📤 Denná energia" / "📤 Môj profil"
- RelationshipsPage: "Porovnaj sa s partnerom" CTA (share link na SharedView)
- MainLayout sidebar: "Pozvi priateľa" (navigator.share s app URL)
