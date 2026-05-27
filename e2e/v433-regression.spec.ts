import { test, expect, type Page } from '@playwright/test';

/**
 * Regression test pre v4.3.2 / v4.3.3 zmeny.
 * Seed cez UI form (realistický flow) — Zustand persist je v IndexedDB.
 */

async function seedProfileViaUI(page: Page) {
  await page.goto('/profile');
  await page.locator('input[placeholder*="meno" i], input[type="text"]').first().fill('Dušan');
  const dayInput = page.locator('input[placeholder="DD"], input[name="day"], input').nth(1);
  const monthInput = page.locator('input[placeholder="MM"], input[name="month"], input').nth(2);
  const yearInput = page.locator('input[placeholder="YYYY"], input[name="year"], input').nth(3);
  await dayInput.fill('30');
  await monthInput.fill('8');
  await yearInput.fill('1979');

  await page.getByRole('button', { name: /Uložiť|Pokračovať|Ďalej|Vytvoriť|Save/i }).first().click();
  await page.waitForURL(/^(?!.*\/profile).*$/, { timeout: 10000 });

  // OnboardingReveal sa môže objaviť po prvom profile (v4.3.0 feature)
  await page.waitForTimeout(1000);
  const skipBtn = page.getByRole('button', { name: /Preskočiť|Skip/i }).first();
  if (await skipBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await skipBtn.click();
    await page.waitForTimeout(500);
  }
  // Tiež môže ostať backdrop — klikni na backdrop alebo set localStorage flag
  await page.evaluate(() => {
    localStorage.setItem('onboarding-completed', 'true');
  });
}

test.describe('v4.3.3 — Engine integrity (UI flow seed)', () => {
  test('vytvorenie profilu cez UI a navigácia na Numerology zobrazí výpočet', async ({ page }) => {
    await seedProfileViaUI(page);
    await page.goto('/numerology');
    // Numerológia stránka má heading "Numerológia"
    await expect(page.getByRole('heading', { name: /Numerológia/i }).first()).toBeVisible({ timeout: 10000 });
    // Po seedovaní profilu by mal byť ŽČ niekde na stránke (obsahuje "Životné" alebo "ŽČ")
    await expect(page.locator('body')).toContainText(/Životné číslo|ŽČ/i, { timeout: 10000 });
  });

  test('Astrology page sa rendruje pre seedovaný profil', async ({ page }) => {
    await seedProfileViaUI(page);
    await page.goto('/astrology');
    await expect(page.getByRole('heading', { name: /Astrológia/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test('Human Design page sa rendruje', async ({ page }) => {
    await seedProfileViaUI(page);
    await page.goto('/human-design');
    await expect(page.getByRole('heading', { name: /Human Design/i }).first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('v4.3.3 — Console errors check', () => {
  test('Dashboard load nemá JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    await seedProfileViaUI(page);
    await page.waitForTimeout(2000);

    const significant = errors.filter(e =>
      !e.includes('chrome-extension') &&
      !e.includes('manifest.json') &&
      !e.includes('Failed to load resource') &&
      !e.toLowerCase().includes('service worker')
    );
    expect(significant).toEqual([]);
  });

  test('Numerology stránka nemá JS errors po navigácii', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await seedProfileViaUI(page);
    await page.goto('/numerology');
    await page.waitForTimeout(3000);

    const significant = errors.filter(e =>
      !e.includes('chrome-extension') &&
      !e.includes('manifest.json') &&
      !e.includes('Failed to load resource') &&
      !e.toLowerCase().includes('service worker')
    );
    expect(significant).toEqual([]);
  });

  test('Vzťahy stránka nemá JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await seedProfileViaUI(page);
    await page.goto('/relationships');
    await page.waitForTimeout(2000);

    const significant = errors.filter(e =>
      !e.includes('chrome-extension') &&
      !e.includes('manifest.json') &&
      !e.includes('Failed to load resource') &&
      !e.toLowerCase().includes('service worker')
    );
    expect(significant).toEqual([]);
  });

  test('Klienti stránka nemá JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await seedProfileViaUI(page);
    await page.goto('/clients');
    await page.waitForTimeout(2000);

    const significant = errors.filter(e =>
      !e.includes('chrome-extension') &&
      !e.includes('manifest.json') &&
      !e.includes('Failed to load resource') &&
      !e.toLowerCase().includes('service worker')
    );
    expect(significant).toEqual([]);
  });
});

test.describe('v4.3.3 — language switch (Zustand useShallow regression)', () => {
  test('Settings → prepnúť SK → EN → späť na Dashboard (žiadny error)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    await seedProfileViaUI(page);
    await page.goto('/settings?tab=profile');

    const enButton = page.getByRole('button', { name: /^EN$/i }).first();
    if (await enButton.isVisible().catch(() => false)) {
      await enButton.click();
      await page.waitForTimeout(500);
    }

    await page.goto('/');
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test('Dashboard texty SA SKUTOČNE prepnú zo SK na EN', async ({ page }) => {
    await seedProfileViaUI(page);

    // 1. Capture SK strings na Dashboard
    await page.goto('/');
    await page.waitForTimeout(1500);
    // Hľadáme hocijaké slovenské slová ktoré sú špecifické pre SK
    const skBodyText = await page.locator('body').innerText();
    const hasSk = /Vitaj|Numerológia|Astrológia|Vzťahy|Klienti|Nastavenia|Vyber/.test(skBodyText);
    expect(hasSk).toBe(true);

    // 2. Prepnúť na EN
    await page.goto('/settings?tab=profile');
    const enButton = page.getByRole('button', { name: /^EN$/i }).first();
    await enButton.click();
    await page.waitForTimeout(500);

    // 3. Späť na Dashboard a overiť EN
    await page.goto('/');
    await page.waitForTimeout(1500);
    const enBodyText = await page.locator('body').innerText();
    // EN nav: Dashboard, Numerology, Astrology, Human Design, Relationships, Clients, Settings
    const hasEn = /Numerology|Astrology|Relationships|Clients|Settings/i.test(enBodyText);
    expect(hasEn).toBe(true);
    // Ne-prepnuté SK slovo sa NEMAL by zobrazovať
    const stillSk = /Numerológia|Astrológia/i.test(enBodyText);
    expect(stillSk).toBe(false);
  });
});

test.describe('v4.3.3 — RelationshipsPage partner mode (useMemo regression)', () => {
  test('partner mode: vyplniť 2 osôb a vypočítať kompatibilitu', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    await seedProfileViaUI(page);
    await page.goto('/relationships');
    await page.waitForTimeout(1500);

    // Use placeholder "Meno" — to je presný textbox label
    const nameBoxes = page.getByPlaceholder('Meno');
    expect(await nameBoxes.count()).toBe(2);
    await nameBoxes.nth(0).fill('Anna');
    await nameBoxes.nth(1).fill('Peter');

    // Spinbuttons (number inputs) — 5 per partner = 10 total (day, month, year, hour, minute)
    const spinButtons = page.getByRole('spinbutton');
    const total = await spinButtons.count();
    expect(total).toBeGreaterThanOrEqual(6); // minimum for date-only

    // Partner 1: prvých 3 sú day/month/year
    await spinButtons.nth(0).fill('15');
    await spinButtons.nth(1).fill('5');
    await spinButtons.nth(2).fill('1990');
    // Partner 2: ďalších 3 (skip hour/minute partner1 ak sú)
    // Layout snapshot: day p1, month p1, year p1, hour p1, minute p1, day p2, month p2, year p2, hour p2, minute p2
    if (total >= 10) {
      await spinButtons.nth(5).fill('20');
      await spinButtons.nth(6).fill('11');
      await spinButtons.nth(7).fill('1985');
    } else {
      await spinButtons.nth(3).fill('20');
      await spinButtons.nth(4).fill('11');
      await spinButtons.nth(5).fill('1985');
    }

    // Wait for button to be enabled (validácia má prejsť)
    const calcBtn = page.getByRole('button', { name: /Vypočítať/i }).first();
    await expect(calcBtn).toBeEnabled({ timeout: 5000 });
    await calcBtn.click();
    await page.waitForTimeout(2000);

    // Výsledok kompatibility — typicky obsahuje "kompatibili" alebo %
    const bodyText = await page.locator('body').innerText();
    const hasResult = /kompatibili|silné stránky|cieľ/i.test(bodyText);
    expect(hasResult).toBe(true);
    expect(errors).toEqual([]);
  });
});
