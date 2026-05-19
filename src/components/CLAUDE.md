# UI komponenty

> Top-level overview: `../../CLAUDE.md` · Engine pravidlá: `../engine/CLAUDE.md`

## Princípy

- **UI nikdy neobsahuje výpočtovú logiku** — všetko cez engines.
- **Method-aware rendering** — niektoré sekcie sa zobrazujú len pre Charakterovú alebo len pre Vývojovú metódu.
- **Glass morphism** — všetky sekcie obalené v `<GlassCard>` pre konzistentný vzhľad.
- **Framer Motion** pre vstupné animácie (`initial`, `animate`, `transition delay`).
- **Slovenčina** v UI textoch. i18n prerušujeme cez `useTranslation()` ale väčšina textov je inline (sk-only kvôli ezoterickej špecifickosti).

## Klient kontext (`useSubject` hook)

Stránky Numerology, Astrology, HumanDesign, Chakras, Kabalah, Theta používajú
**`useSubject()`** namiesto `useStore().profile`. Hook vráti:

- Aktívny profil ak nie je `?client=ID` v URL
- Klienta ak je `?client=ID` (napr. po preklikoch z `ClientDashboard`)

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

## NumerologyPage refaktor (v2.14.0)

NumerologyPage bola zrefaktorovaná z ~1585 na ~1200 riadkov. Taby extrahované do `src/components/numerology/`:

| Komponent | Účel |
|---|---|
| `PlanesTab` | Roviny (iba Charakterová) |
| `KarmicTab` | Karmické cykly, pinnacles, challenges |
| `LoveTab` | Jazyky lásky (iba Charakterová) |
| `NameTab` | Numerológia mena |
| `EnneagramTab` | Enneagram typ, krídla, integrácia/dezintegrácia |

## ModalityPage (v2.14.0)

Nová stránka `/modality` s 3 systémami:
- **Ayurvéda** — dóša profil (Vata/Pitta/Kapha)
- **TCM** — 5 elementov (Drevo/Oheň/Zem/Kov/Voda)
- **Bachove kvety** — 17 esencií mapovaných na 7 čakier

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
- `ClientDashboard` — auto-add report 1× za deň (side-effect, nie state derivation)

Tieto majú `// eslint-disable-next-line react-hooks/set-state-in-effect` s vysvetlením.

## AI Chat komponent (`AIChat.tsx`)

Streaming chat s Claude API:

- **Persistovaná história** v `localStorage` pod kľúčom `ai-chat-{storageKey}`. Default `storageKey` = `${profile.name}-${day}-{month}-{year}`. Pre rôzne triggery dáme špecifický kľúč: `dashboard-${profileId}`, `numerology-${profileId}-${method}`, `client-${clientId}`.
- **Streaming** cez `streamChat()` s `AbortController` pre cancel.
- **Markdown rendering** inline (## ### nadpisy, **bold**, • bullets) bez external lib.
- **Empty state** s CTA button "Vytvoriť AI výklad" + default úvodná správa.
- **Token counter** v patičke + reset rozhovoru.

Trigger pointy (default `initialUserMessage`):
- Dashboard → integrálny výklad celého profilu
- Numerology Prehľad → method-specific výklad (Charakterová alebo Vývojová)
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
| `ChakraWheel` | 7 čakier ako kruhový gradient |
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

- Lightweight in-house dictionary v `src/i18n/translations.ts`
- Type-safe (TranslationKey union)
- `t('key')` cez `useTranslation()` hook
- Default `sk`, fallback z `en` na `sk`
- 130+ kľúčov

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

## Onboarding

`OnboardingTour.tsx` — first-run tour po vytvorení profilu. Použitie:

```tsx
const profiles = useStore(s => s.profiles);
const showOnboarding = profiles.length > 0;
{showOnboarding && <OnboardingTour />}
```

Persists v localStorage: `onboarding-completed`.
