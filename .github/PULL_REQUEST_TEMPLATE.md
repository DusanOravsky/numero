## Summary

<!-- 1-3 bullet points describing what this PR does and why. -->

-
-

## Numerological / astrological correctness

<!-- If this PR touches any of the engines (numerology, astrology, HD,
chakras, kabalah, theta) describe how the change preserves or improves
correctness. Reference book sources where applicable. -->

- [ ] Touches engine logic — added/updated lock tests
- [ ] Verified for reference birthdate(s):
- [ ] No engine logic touched

## Testing

- [ ] `npm test` (vitest) passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` produces a working bundle
- [ ] Manually exercised affected pages in dev (`npm run dev`)

## Bundle / performance

- [ ] Initial bundle size unchanged or smaller
- [ ] Lazy-loaded any new heavy dependency
- [ ] (If applicable) ran `npm run build:analyze` and checked dist/stats.html

## Method coverage

The app has two numerology methods (Charakterová + Vývojová). When changes
affect Numerologia UI, confirm both render correctly:

- [ ] Charakterová method
- [ ] Vývojová method
- [ ] Method-specific sections are correctly hidden when the other method is active

## Migration / data

- [ ] Zustand store schema unchanged
- [ ] Schema changed → bumped `STORE_VERSION` and added a migrate step

## Screenshots (UI changes)

<!-- Drag-drop screenshots here, ideally light + dark mode if relevant. -->

## Notes / risk

<!-- Anything reviewers should pay extra attention to: tricky math,
timezone handling, async edge cases, persisted state, etc. -->
