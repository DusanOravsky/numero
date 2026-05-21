# Engine pravidlá

> Top-level overview: `../../CLAUDE.md`

## Princípy

- **UI nikdy neobsahuje výpočtovú logiku.** Všetky numerologické / astrologické / HD operácie sú v engines.
- **Engines sú čisté funkcie** — vstup → výstup, žiadny side effect, žiadne `localStorage`/`window`.
- **Žiadne API volania** v engines — všetko offline. (AI integrácia je v `engine/aiInterpretation.ts`, ale to volá Claude, nie engine pre profil.)
- **Memoizácia cez LRU cache** v `engineCache.ts` pre `calculateAstrology` a `calculateHumanDesign` (drahé výpočty).

## Engines

| Súbor | Účel |
|---|---|
| `numerologyEngine.ts` | Charakterová mriežka, ŽČ, ORV, VDD, roviny, jazyky lásky, pinnacles, challenges, karmic debts |
| `developmentalNumerologyEngine.ts` | Vývojová mriežka so 4 zakrúžkovanými K1-K4 |
| `nameNumerologyEngine.ts` | Numerológia mena: výraz, duša, osobnosť, hidden passion, karmic lessons, cornerstone, balance |
| `astrologyEngine.ts` | Planéty, znamenia, ascendent, domy (Whole Sign), aspekty, progresie, solar return, tranzity (`calculateTransitAspects`) |
| `humanDesignEngine.ts` | Typy, autority, centrá, kanály, brány, profil, definícia, inkarnačný kríž |
| `chakraEngine.ts` | 7 čakier — cross-system výpočet z numerológie + HD + astrológia |
| `kabalahEngine.ts` | 10 sefír, Strom života, primárna/sekundárna sefira |
| `thetaHealingEngine.ts` | Limitujúce presvedčenia podľa ŽČ |
| `compatibilityEngine.ts` | Partner + rodič-dieťa kompatibilita |
| `interpretationEngine.ts` | Cross-system pattern matching |
| `enneagramEngine.ts` | Enneagram typ 1-9 derivácia z ŽČ/K3, krídla, integrácia/dezintegrácia |
| `ayurvedaEngine.ts` | Ayurvéda dóša scoring (Vata/Pitta/Kapha) z astro elementu + HD typu + ŽČ |
| `tcmEngine.ts` | TCM 5 elementov (Drevo/Oheň/Zem/Kov/Voda) scoring z astro + ŽČ |
| `chineseZodiacEngine.ts` | Čínsky horoskop — 12 zvierat + 5 elementov + Yin/Yang + najbližší rok |
| `aiInterpretation.ts` | Claude API client (single-shot + streaming chat) |

## Numerológia (podľa PDF Škola NUMERO + Robin Steinová)

### Životné číslo (ŽČ)

```
ŽČ = redukcia(deň_cifry + mesiac_cifry + rok_cifry)
```

Kľúčové pravidlá:

- **Rok sa NEREDUKUJE pred sčítaním.** Sčítavame všetky cifry roku osobitne.
- Výsledok zobrazujeme ako "X z Y" kde Y je pôvodný súčet pred redukciou.
- **Master numbers (11, 22, 33) sa zachovávajú.** Aj v medzisúme aj vo finálnej hodnote.
- Ak je medzisúčet 13/14/16/19 → karmický dlh (auto-detect cez `detectKarmicDebts`).

### ORV/OMV/ODV (cykly)

- **ORV = osobná ročná vibrácia** — počíta sa od narodenín do narodenín, nie od januára!
- ORV(deň, mesiac, rok, dnešný mesiac, dnešný deň) → ak ešte neboli narodeniny v tomto roku, použije rok-1.
- OMV = (ORV + aktuálny mesiac) reduced
- ODV = (ORV + aktuálny mesiac + aktuálny deň) reduced

### Iné numerologické čísla

- **VDD** (vek duchovnej dospelosti) = 36 - ŽČ
- **ODD** (obdobie duch. detstva) = VDD / 3
- **ΣT** (suma tarotu) = deň + mesiac + rok bez redukcie. Ak ≥ 2000 → Vek Vodnára, inak Vek Rýb.
- **Maturity number** = redukcia(ŽČ + redukcia(deň)) — aktivuje sa okolo 35-40 r.
- **Birthday number** = priamo deň v mesiaci (nie redukovaný)

### Mriežka (3×3)

```
3 6 9
2 5 8
1 4 7
```

- Čísla z dátumu narodenia + redukované hodnoty dňa/mesiaca/roku
- Základné (`isBase: true`) = z dátumu, doplnkové (`isBase: false`) = z redukcií
- **A2 reverted**: nepridávajú sa cifry medzisúčtu roku (1979 → 26 → 2,6). User explicitly potvrdil že 30.8.1979 nemá mať 2 v mriežke.

### Roviny

- **8 plných** (Myslenie 1-2-3, Vytrvalosť 4-5-6, Energia 7-8-9, Zručnosti 1-4-7, Vášeň 2-5-8, Empatia 3-6-9, Odhodlanie 1-5-9, Pochopenie 3-5-7)
- **7 prázdnych** (Postreh 1-4-7, Senzitivita 2-5-8, Inšpirácia 3-6-9, Saturn 4-5-6, Oddanosť 7-8-9, Rozvoj 1-5-9, Vízia 3-5-7)
- Roviny sa rátajú **zo základných aj doplnkových čísel** (celá mriežka) — podľa knihy Numerológia: Čísla Lásky (Steinová).

### Karmické dlhy (B2)

Detekované v 4 miestach:

1. `lifePathFrom` (medzisuma pred redukciou) ∈ {13, 14, 16, 19}
2. `birthDay` ∈ {13, 14, 16, 19}
3. Pinnacle mid-sums (M+D, D+R, M+R) ∈ {13, 14, 16, 19}

```typescript
KARMIC_DEBT_INFO[13] // → reducesTo: 4, theme: 'Práca a transformácia'
KARMIC_DEBT_INFO[14] // → reducesTo: 5, theme: 'Sloboda a sebakontrola'
KARMIC_DEBT_INFO[16] // → reducesTo: 7, theme: 'Pokora a duchovné prebudenie'
KARMIC_DEBT_INFO[19] // → reducesTo: 1, theme: 'Zodpovednosť a samostatnosť'
```

## Vývojová numerológia (Lívia Mičková)

### 4 zakrúžkované čísla K1-K4

```
K1 = (deň_cifry + mesiac_cifry) + R(rok)    # 1. zakrúžkované, "psych. stabilita"
K2 = redukcia(K1)                            # 2. zakrúžkované, "mat. stabilita"
K3 = K1 - 2 × prvá_cifra_dňa                 # 3. zakrúžkované, "životné poslanie ★"
K4 = redukcia(K3)                            # 4. zakrúžkované, "detské sny"
```

### R(rok) — Lívia pravidlo

```typescript
function calculateYearSumLivia(year: number): number {
  if (year >= 2000) return 20 + (year - 2000);  // 2011 → 31
  return sumDigits(year);                        // 1979 → 26
}
```

### Polarita ega

```
oneCount = počet 1-iek v mriežke (date digits + circled digits)
egoPolarity:
  - 0× → 'none'
  - nepárny počet → 'masculine'
  - párny počet → 'feminine'
```

## Astrológia (`astrologyEngine.ts`)

### Konvencie

- **Tropický zodiak** (nie sidereal)
- **Whole Sign domy** — každý dom = jedno celé znamenie začínajúce ascendentom
- **True Node** (s Meeus periodickými korekciami) — nie Mean Node
- **CET/CEST** automatic detection (`getTimezoneOffset`) — pre roky < 1979 vždy CET (ČSSR nemalo letný čas)
- **Timezone propagácia** — všetky stránky používajú `getTimezoneFromCoords(lat, lon)` z `data/cities.ts`
- **Natálne aspekty** — personalizované popisy pre 45 planetárnych kombinácií (nie generické "trigón — harmónia")
- **Astronomy.SunPosition** + `Astronomy.GeoMoon` + `Astronomy.GeoVector` pre planéty

### Lilith + Chiron (B12)

Astronomy-engine ich nemá natívne. Používame:

- **Mean Black Moon Lilith** — `getMeanLilithLongitude()` cez Meeus 47 (perigeum + 180°). Mean Lilith vs True Lilith sa líši až o ±30° v závislosti od fázy; presnosť **±5° priemerne**, použiteľné iba pre znamenie.
- **Chiron** — `getChironLongitude()` cez Keplerov problém s JPL orbitálnymi elementmi (a=13.648 AU, e=0.379, epoch J2000.0). Presnosť ±1-2° pre 1940-2030. Korektne zachytáva variabilnú rýchlosť pri excentrickej orbite.

Oba body sa pridávajú do `result.planets` AŽ ZA výpočet `dominantElement` aby neovplyvňovali tradičnú dominantnú analýzu. **Vylúčené z `calculateNatalAspects`** aby aproximovaná pozícia neprodukovala šum v aspekt math. Chiron má retrograde detekciu (±1 deň porovnanie).

### Progresie (B10)

Sekundárne progresie ("1 deň = 1 rok"):

```typescript
progressedDate = birthDate + targetAge × 86400000 ms
```

Progresia Slnka ~1°/rok, Mesiaca ~12°/rok. Zmena znamenia = veľký životný prah.

### Solar Return (B9)

```typescript
Astronomy.SearchSunLongitude(natalSunLon, searchStart, 60)
// → presný moment kedy tranzit Slnko opäť v natálnej longitúde
```

Vyhľadáva sa ±30 dní okolo výročia. Vracia `AstrologyResult` pre tento moment + miesto.

### Tranzity (`calculateTransitAspects`)

Výpočet aktuálnych tranzitných aspektov voči natálnym planétam:
- Tranzitné planéty pre aktuálny dátum vs natálne pozície
- Aspekty: konjunkcia, opozícia, trigon, kvadratúra, sextil (s orbami)
- Použité v Dashboard dennom digeste a AstrologyPage

### Composite vs Davison (B18, B19)

- **Composite** — pre každú planétu midpoint longitúd dvoch ľudí (kratší arc). NIE JE skutočný horoskop, len symbolická štruktúra.
- **Davison** — skutočný `calculateAstrology` pre stredný čas + stredné miesto. Reálny horoskop "tretej osoby — vzťahu".

Matematika midpointu (wraparound 0/360°):
```typescript
let diff = lon2 - lon1;
if (diff > 180) diff -= 360;
if (diff < -180) diff += 360;
const mid = ((lon1 + diff / 2) % 360 + 360) % 360;
```

### Eclipses (B13)

`Astronomy.SearchLunarEclipse` + `SearchGlobalSolarEclipse` + ich `Next*` iteratory. EclipseKind enum = `Total | Partial | Annular | Penumbral`.

## Human Design (`humanDesignEngine.ts`)

### KRITICKÉ — HD_WHEEL_START

```typescript
const HD_WHEEL_START = 302.0;  // NIE 302.625!
```

Gate 41 začína na **2°00'00" Aquarius = 302.0°** tropic Sun longitude (Jovian Archive konvencia). Predošlá hodnota 302.625° (z nesprávneho online zdroja) bola buggy a vrátila 6/2 namiesto správneho 1/3 pre `30.8.1979 02:40 Bratislava`. **Lock test v `humanDesignEngine.test.ts`.**

### Bránová matematika

```typescript
GATE_SIZE = 5.625      // 360° / 64 brán
LINE_SIZE = 0.9375     // 1 brána / 6 línií
```

```typescript
function degreeToGateLine(eclipticLongitude: number): { gate: number; line: number } {
  const adjusted = ((eclipticLongitude - HD_WHEEL_START) % 360 + 360) % 360;
  const index = Math.floor(adjusted / GATE_SIZE);
  const line = Math.floor((adjusted % GATE_SIZE) / LINE_SIZE) + 1;
  return { gate: GATE_ORDER[Math.min(index, 63)], line: Math.min(line, 6) };
}
```

`GATE_ORDER` = pole 64 čísel brán v poradí ako idú za sebou na zodiacu (definované v engine).

### Design date

```typescript
designDate = moment kedy bolo Slnko 88° pred natálnym Slnkom
```

Vyhľadávame cez `Astronomy.SearchSunLongitude` v okne 120 dní pred narodením. Fallback: aproximácia `88 × 365.25/360` dní späť.

### Definícia (B17)

`determineDefinition()` — počet connected components v defined-centers grafu cez BFS:

- 1 komponent → **Single**
- 2 → **Split**
- 3 → **Triple Split**
- 4 → **Quadruple Split**
- 0 (žiadne def. centrá) → **No Definition** (iba Reflektori)

### Type / Authority

`determineType()`:
1. Žiadne def. centrá → Reflektor
2. Sakrálne def. + motor→Hrdlo → Manifestujúci Generátor
3. Sakrálne def. → Generátor
4. Motor→Hrdlo → Manifestor
5. Inak → Projektor

`determineAuthority()` — priorita: Solárny plexus → Sakrálne → Slezina → Srdce/Ego → G → Mentálna/Environmentálna. Reflektor → Lunárna.

## Chakra engine

```
score = 50 (base)
± numerologyNumbers count v mriežke (-15/+5/+10/+20)
- 10 ak je číslo isolated
+ 10 ak je definované zodpovedajúce HD centrum
+ 10 ak dominantný element zodpovedá čakre
+ 15 ak ŽČ === číslo čakry

Status:
  < 50 → blocked
  50-79 → balanced
  ≥ 80 alebo 4+× rovnaké číslo → hyperactive
```

**LOCK test:** `calculateFullNumerology(15, 7, 1985)` → root.score === 45.

## Cache & memoizácia

`engineCache.ts` poskytuje `memoize()` HOF s LRU pamäťou:

```typescript
const _memoAstro = memoize(_calculateAstrologyImpl, (...args) => `astro:${birthKey(...args)}`);
```

**Pozor:** memoize wrapper môže rozbiť default arg types — preto `calculateAstrology` je explicit wrapper:

```typescript
export function calculateAstrology(day, month, year, hour = 12, minute = 0, ...) {
  return _memoAstro(day, month, year, hour, minute, ...);
}
```

## Testovanie

- **Lock testy** pre kritické referenčné body (najmä `30.8.1979 02:40 Bratislava`):
  - `humanDesignEngine.test.ts` → profile 1/3
  - `numerologyEngine.test.ts` → ŽČ 1 z 37, karmické dlhy
  - `chakraEngine.test.ts` → root.score === 45 pre 15.7.1985
- Unit testy: `*.test.ts` v `src/engine/`
- **Pri zmene v engine VŽDY spusti `npm test` pred commitom.**
- Pri pridaní nového referenčného profilu — lock test ihneď.

## Enneagram engine (`enneagramEngine.ts`)

- `deriveEnneagramType(lifePath, k3?)` — pure function, vracia typ 1-9
- Derivácia z ŽČ (primárne) a K3 (vývojová metóda)
- Vracia: typ, krídla (±1), integračnú a dezintegračnú cestu
- Žiadne side effects, žiadne API calls

## Ayurvéda engine (`ayurvedaEngine.ts`)

- `deriveDosha(astroElement, hdType, lifePath)` — scoring pre Vata/Pitta/Kapha
- Kombinuje dominantný astro element + HD typ + numerologický ŽČ
- Vracia percentuálne rozloženie 3 dóš + dominantnú

## TCM engine (`tcmEngine.ts`)

- `deriveTCMElement(astroElement, lifePath)` — scoring pre Drevo/Oheň/Zem/Kov/Voda
- Mapovanie z astro znamenia + ŽČ na 5 elementov
- Vracia dominantný element + scoring

## AI engine (`aiInterpretation.ts`)

- Anthropic Claude direct browser call (`anthropic-dangerous-direct-browser-access: true`)
- API kľúč v `localStorage` pod `anthropic-api-key`
- Default model: `claude-sonnet-4-6`
- **max_tokens**: 4096 (streamChat), 3500 (summarizeProfile)
- **ProfileContext**: rozšírený o `enneagram`, `dosha`, `tcm` polia (9 systémov celkovo)
- `summarizeProfile(ctx)` — buduje text prompt zo všetkých systémov
- `streamChat(messages, systemContext, onChunk, abortSignal)` — SSE streaming
- `testApiKey(key)` — overenie cez ping na Haiku
