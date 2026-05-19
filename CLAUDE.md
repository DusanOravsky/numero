# Integrálna mapa bytia (Número)

Offline-first PWA pre numerológiu, astrológiu, Human Design, etikoterapiu, kabalu, Theta Healing a sebarozvoj.

## Technológie

- React 19 + TypeScript
- Vite 8 + TailwindCSS 4
- Framer Motion (animácie)
- Zustand (state management s persist)
- astronomy-engine (planetárne výpočty)
- jsPDF (PDF export, lazy-loaded)
- vite-plugin-pwa (service worker, offline)

## Spustenie

```bash
npm install
npm run dev        # localhost:5173
npm run build      # dist/
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
   - Engine: `numerologyEngine.ts` (klasická mriežka z dátumu + redukcií)
   - Zdroj: Robin Steinová – Numerológia: Čísla Lásky
   - Významy: 1=Ja, 2=Intuícia, 3=Kreativita, 6=Láska, 9=Múdrosť…

2. **Vývojová** (`'developmental'`, **default**) — životné úlohy a karmické cykly.
   - Engine: `developmentalNumerologyEngine.ts` so 4 zakrúžkovanými číslami
   - Roky 2000+: rok = 20 + zvyšok (napr. 2011 → 31)
   - Zdroj: kniha Lívia Mičková – Duchovná numerológia
   - Významy: 1=Ego (mužské/ženské), 2=Bioenergia, 4=Sebavedomie, 6=Vytrvalosť/mág…
   - Dáta: `data/developmentalMeanings.ts`

## Štruktúra

```
src/
  engine/          # Výpočtové moduly (bez UI závislostí)
    numerologyEngine.ts    # Mriežka, ŽČ, ORV, VDD, roviny, jazyky lásky
    astrologyEngine.ts     # Planéty, znamenia, ascendent, aspekty
    humanDesignEngine.ts   # Typy, autority, centrá, kanály, brány
    chakraEngine.ts        # 7 čakier, integrácia so všetkými systémami
    kabalahEngine.ts       # 10 sefír, Strom života
    thetaHealingEngine.ts  # Limitujúce presvedčenia, digging
    compatibilityEngine.ts # Partner + rodič-dieťa kompatibilita
    interpretationEngine.ts # Cross-system pattern matching
    nameNumerologyEngine.ts # Numerológia mena (výraz, duša, osobnosť)
  data/            # Statické dáta a výklady
    geneKeys.ts           # 64 Génových kľúčov + NLP techniky
    orvDescriptions.ts    # ORV 1-9, jazyky lásky, kozmické veky
    planetSignDescriptions.ts  # Planéta × znamenie interpretácie
    cities.ts             # Mestá s lat/lon pre astrológiu
    lifePaths.json        # Životné čísla 1-9
    planes.json           # Plné/prázdne roviny
    numbers.json          # Čísla 1-9 pozitívne/negatívne
    isolatedNumbers.json  # Izolované čísla výklady
  components/      # Reusable UI komponenty
  pages/           # Stránky (routes)
  store/           # Zustand store s migráciou
  layouts/         # MainLayout so sidebar/bottom nav
  styles/          # Tailwind + light mode overrides
```

## Engine pravidlá

- UI NIKDY neobsahuje výpočtovú logiku
- Engines sú čisté funkcie (vstup → výstup)
- Všetky výklady sú v /data (oddelené od logiky)
- Žiadne API volania – všetko offline

## Numerológia (podľa PDF Škola NUMERO)

- ŽČ = súčet číslic dňa + mesiaca + roku (rok sa NEREDUKUJE pred sčítaním)
- Výsledok: "X z Y" kde Y je pôvodný súčet
- Master numbers (11, 22, 33) sa zachovávajú
- ORV sa počíta od narodenín do narodenín (nie od januára)
- VDD = 36 - ŽČ (vek duchovnej dospelosti)
- ODD = VDD / 3 (obdobie duchovného detstva)
- ΣT = deň + mesiac + rok (bez redukcie); ≥2000 = Vek Vodnára

## Deploy

- GitHub Pages cez Actions (.github/workflows/deploy.yml)
- base: '/numero/' v produkcii, '/' v dev
- BrowserRouter basename = import.meta.env.BASE_URL
- 404.html pre SPA redirect na GitHub Pages
- URL: https://dusanoravsky.github.io/numero/

## PWA

- vite-plugin-pwa s autoUpdate
- Verzia v src/components/PWAPrompts.tsx (APP_VERSION)
- Install prompt + update popup + offline indicator

## Konvencie

- Slovenčina v UI a dátach
- Light mode (biele pozadie, čakrový gradient sidebar)
- Čas vždy v 24h formáte
- Miesto narodenia cez autocomplete (cities.ts)
- Zustand store verzia pre migrácie
