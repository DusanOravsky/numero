# Code Review — Número PWA v4.6.2 (2026-05-30)

> Opravené vo v4.6.3 — viď CHANGELOG. Tento dokument je trvalý záznam nálezov + stavu (SKIP položky sú backlog).

Plný code review celej aplikácie (4 paralelní recenzenti: engine, components, pages/hooks, store/utils/i18n/config).
Baseline pri review: `typecheck` čistý, `lint` čistý, **272/272 testov** prešlo.

Závažnosť: **C**=Critical (reálny runtime bug / data loss), **I**=Important (vecná chyba / perf / robustnosť), **M**=Minor (polish).
Stav: ⬜ TODO · 🔧 IN PROGRESS · ✅ FIXED · ⏭️ SKIP (s dôvodom).

## Critical

| # | Stav | Súbor | Problém |
|---|------|-------|---------|
| C1 | ✅ | `hooks/useMantraAudio.ts` | Žiadny cleanup pri unmount → looping audio hrá ďalej po opustení stránky. |
| C2 | ✅ | `pages/ChakrasPage.tsx` + `components/ChakraBody.tsx` | Dve nezávislé `useMantraAudio()` inštancie → dve mantry naraz, každá pauzuje len svoju. |
| C3 | ✅ | `components/MeditationTimer.tsx` | Stale `duration` v intervale + `playEndChime()` volaný vo `setRemaining` updateri (side-effect v reduceri, 2× v StrictMode). |
| C4 | ⏭️ | `engine/astrologyEngine.ts:191` | Chiron „parallax" korekcia `asin(sin(Δλ)/r)` je geometricky nezmyselná. SKIP: vyžaduje astronomickú referenciu, nie čistý bug-fix; zdokumentované ako známy limit. |

## Important

| # | Stav | Súbor | Problém |
|---|------|-------|---------|
| I1 | ✅ | `components/numerology/NameTab.tsx` | Priamy `localStorage` v `useState` initializeri mimo povolených výnimiek → crash v iOS private mode. → `safeGet/safeSet`. |
| I2 | ✅ | `components/ClientSummary.tsx:678` | `calculateKua(year,'male',…)` natvrdo → nesprávne Kua pre ženy. Pridať `gender` prop. |
| I3 | ✅ | `store/indexedDbStorage.ts` | localStorage fallback v `setItem`/`removeItem` mimo try/catch → crash v iOS private mode pri persist write. |
| I4 | ✅ | `engine/numerologyEngine.ts:45` | `reduceToSingle(NaN)` ticho propaguje NaN cez celý reťazec. Pridať `Number.isFinite` guard. |
| I5 | ✅ | `pages/RelationshipsPage.tsx:362-422` | `safeGet`+`JSON.parse` 4× pri každom rendri (nie v lazy initializeri). |
| I6 | ✅ | `pages/ComparePage.tsx:39-59` | `selected` je nová referencia každý render → `useMemo` s drahými engine volaniami sa nikdy nehitne. |
| I7 | ✅ | `engine/aiInterpretation.ts` | non-stream `generateAIInterpretation` nemá `abortSignal` (wasted tokeny + setState po unmount). |
| I8 | ⏭️ | `store/useStore.ts` | Async IndexedDB rehydrácia bez `onRehydrateStorage`/gating → flash of light theme. SKIP zatiaľ: väčší zásah do boot flow, samostatná úloha. |
| I9 | ✅ | `components/ShareStory.tsx:190` | `canvas.toBlob` callback môže vrátiť `null`, `blob!` potom spadne bez reject. |
| I10 | ⏭️ | `engine/astrologyEngine.ts:715` + `engineCache.ts` | Transit chart počítaný z lokálneho času + cache key kolíduje per-minútu (LRU eviction natálnych profilov). SKIP: nižšia priorita, samostatná úloha. |
| I11 | ⏭️ | `engine/humanDesignEngine.ts:495` | 6× `.find(...)!` non-null assertion bez fallbacku. SKIP: v praxi nikdy nezlyhá (activations sú garantované), nízke reálne riziko. |

## Minor (vybrané, opravené v rámci batchu)

| # | Stav | Súbor | Problém |
|---|------|-------|---------|
| M1 | ✅ | `components/ChakraBody.tsx:40` | Hardcoded SK status texty (`Vyvážená/Blokovaná/Hyperaktívna`) bez i18n → použiť `CHAKRA_STATUS_TEXT`. |
| M2 | ✅ | `components/MantraButton.tsx:25` | `title`/`aria-label` natvrdo anglicky („Play/Stop"). |
| M3 | ⏭️ | `engine/numerologyEngine.ts:289` | Zbytočne komplikovaný `lpBase` výraz (obe vetvy rovnaké). SKIP: kozmetika, nemení výsledok. |
| M4 | ⏭️ | `components/ClientExport.tsx:986` | QR cez externý `api.qrserver.com` → rozbíja offline-first + PII únik. SKIP: vyžaduje QR lib / produktové rozhodnutie. |
| M5 | ⏭️ | docs | Duplicitné astro helpery (astro vs HD), `openDB` (chatStorage vs indexedDbStorage), zastaraný popis `translations.ts` v `components/CLAUDE.md`. SKIP: tech-debt poznámky. |

## Čo je solídne (potvrdené, žiadny nález)
- ErrorBoundary redaktuje API kľúče pred logom/clipboardom.
- AIChat: poctivý AbortController cleanup + `cancelled` flag.
- SharedView: strict validácia, 4096 limit, `TextDecoder`, žiadny `dangerouslySetInnerHTML`.
- i18n 1:1 garantované typom (chýbajúci kľúč = compile error).
- `useShallow` konzistentne na multi-field selektoroch.
- LRU engineCache s MISS symbolom, master numbers 11/22/33 korektne zachované.
- HD wheel start, astronomy konvencie (tropický, Whole Sign, True Node) + lock testy 30.8.1979.
