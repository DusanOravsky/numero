import { test, expect, Page } from '@playwright/test';

const SK_PATTERNS = [
  // Numerology
  /Tvoje čítanie/,
  /Životné číslo/,
  /Izolované čísla/,
  /Chýbajúce čísla/,
  /Fyzický dotyk/,
  /Slová uistenia/,
  /Kvalitný čas/,
  /Obdarovávanie/,
  /Skutky služby/,
  // HD
  /Reagovať/,
  /Informovať/,
  /Čakať na pozvanie/,
  /Frustrácia(?! &)/,  // avoid matching EN "Frustration & anger"
  /Horkosť/,
  /Nie-ja téma/,
  /Stratégia:/,
  /\bBrána\b/,
  /\bbrány\b/,
  // Chakras
  /Venujte pozornosť/,
  /Meditácia na farbu/,
  /Uzemňovacia prax/,
  /Rovnováha medzi/,
  /Koreňová čakra/,
  /Sakrálna čakra/,
  /Krčná čakra/,
  /Srdcová čakra/,
  /Korunná čakra/,
  // Kabalah
  /Koruna/,
  /Milosrdenstvo/,
  /Prísnosť/,
  /Jednota/,
  /Božská vôľa/,
  /Strom života/,
  /Kabalistický strom/,
  // Chinese zodiac
  /\bKoza\b/,
  /\bHad\b/,
  /\bDrak\b/,
  /\bOpica\b/,
  /\bKohút\b/,
  /\bPes\b/,
  /\bPrasa\b/,
  /\bKôň\b/,
  // Planets (SK names in astro context)
  /\bSlnko\b/,
  /\bMesiac\b/,
  /\bMerkúr\b/,
  /\bVenuša\b/,
  /\bMars\b/,
  /\bJupiter\b/,
  /\bSaturn\b/,
  /\bUrán\b/,
  /\bNeptún\b/,
  /\bPluto\b/,
  // Zodiac (SK names)
  /\bBaran\b/,
  /\bBýk\b/,
  /\bBlíženci\b/,
  /\bRak\b/,
  /\bLev\b/,
  /\bPanna\b/,
  /\bVáhy\b/,
  /\bŠkorpión\b/,
  /\bStrelec\b/,
  /\bKozorožec\b/,
  /\bVodnár\b/,
  /\bRyby\b/,
  // Elements
  /\bOheň\b/,
  /\bZem\b/,
  /\bVzduch\b/,
  /\bVoda\b/,
  // Settings / UI
  /Meditácia \/ Timer/,
  /Vyber dĺžku/,
  /\bŠtart\b/,
  /rýchly, lacný/,
  /kvalitný.*odporúčaný/,
  /najlepší, drahší/,
  /výklad/,
  /Integratívny ezoterický/,
  /Logické úrovne/,
  /Etikoterapia/,
  /Koučing/,
  // Conditioning
  /podmieňuje/,
  /preberá spôsob/,
  /môže cítiť falošnú/,
  // Relationships
  /Partnerský vzťah rodičov/,
  /Súrodenecký vzťah/,
  /cieľ vzťahu/,
  /\. dom\b/,
];

// Known exceptions — SK words that appear in EN mode legitimately (names, untranslatable terms)
const EXCEPTIONS = [
  'Keter', 'Chokmah', 'Binah', 'Chesed', 'Geburah', 'Tiferet', 'Necach', 'Hod', 'Jesod', 'Malchut',
  'Muladhara', 'Svadhisthana', 'Manipura', 'Anahata', 'Vishuddha', 'Ajna',
];

async function setupProfile(page: Page) {
  await page.goto('/');
  // Set onboarding as completed to skip modal
  await page.evaluate(() => localStorage.setItem('onboarding-completed', 'true'));

  // Switch to English
  await page.goto('/settings');
  await page.waitForLoadState('networkidle');

  // Find and click EN language option
  const enButton = page.locator('button:has-text("EN"), button:has-text("English")').first();
  if (await enButton.isVisible()) {
    await enButton.click();
    await page.waitForTimeout(500);
  }

  // Create a profile if none exists
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const hasProfile = await page.evaluate(() => {
    const raw = localStorage.getItem('numero-store');
    if (!raw) return false;
    try {
      const state = JSON.parse(raw);
      return !!state?.state?.profile;
    } catch { return false; }
  });

  if (!hasProfile) {
    // Fill in birth date via the form
    await page.goto('/numerology');
    await page.waitForLoadState('networkidle');
    const dayInput = page.locator('input[placeholder*="Day"], input[placeholder*="Deň"]').first();
    if (await dayInput.isVisible()) {
      await dayInput.fill('30');
      await page.locator('input[placeholder*="Month"], input[placeholder*="Mesiac"]').first().fill('8');
      await page.locator('input[placeholder*="Year"], input[placeholder*="Rok"]').first().fill('1979');
      await page.locator('button:has-text("Calculate"), button:has-text("Vypočítať")').first().click();
      await page.waitForTimeout(1000);
    }
  }
}

async function checkPageForSK(page: Page, pagePath: string, pageName: string) {
  await page.goto(pagePath);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const bodyText = await page.locator('body').innerText();
  const violations: string[] = [];

  for (const pattern of SK_PATTERNS) {
    const match = bodyText.match(pattern);
    if (match) {
      const isException = EXCEPTIONS.some(exc => match[0].includes(exc));
      if (!isException) {
        violations.push(`[${pageName}] Found SK text: "${match[0]}"`);
      }
    }
  }

  return violations;
}

test.describe('i18n audit — no SK text in EN mode', () => {
  test('pages should not contain SK-only content when in English mode', async ({ page }) => {
    await setupProfile(page);

    const pages = [
      { path: '/', name: 'Dashboard' },
      { path: '/numerology', name: 'Numerology' },
      { path: '/astrology', name: 'Astrology' },
      { path: '/human-design', name: 'Human Design' },
      { path: '/chakras', name: 'Chakras' },
      { path: '/kabalah', name: 'Kabalah' },
      { path: '/theta-healing', name: 'Theta Healing' },
      { path: '/modality', name: 'Modality' },
    ];

    const allViolations: string[] = [];

    for (const p of pages) {
      const violations = await checkPageForSK(page, p.path, p.name);
      allViolations.push(...violations);
    }

    if (allViolations.length > 0) {
      console.log('\n=== i18n VIOLATIONS ===');
      allViolations.forEach(v => console.log(v));
      console.log(`\nTotal: ${allViolations.length} violations`);
    }

    expect(allViolations).toEqual([]);
  });
});
