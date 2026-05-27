import { test, expect } from '@playwright/test';

test.describe('Smoke — landing & navigation', () => {
  test('shows the welcome screen with "Začať cestu" button when no profile', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Integrálna mapa bytia/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Začať cestu/i })).toBeVisible();
  });

  test('clicking "Začať cestu" navigates to profile setup', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Začať cestu/i }).click();
    await expect(page).toHaveURL(/\/profile/);
  });

  test('app shell loads under 5 seconds (gauge of bundle health)', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'load' });
    expect(Date.now() - start).toBeLessThan(5000);
  });

  // Lazy-loaded numerology test bol odstránený — broken po migrácii store do IndexedDB (v2.22.0).
  // Nahradený realistickým UI flow testom v v433-regression.spec.ts.
});
