# Changelog

All notable changes to this project are documented in this file. Dates are
in ISO 8601 (YYYY-MM-DD). The format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased — 2026-05-19

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
