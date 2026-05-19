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

  test('lazy-loaded numerology page renders after navigation', async ({ page }) => {
    // Set up a profile in localStorage so the dashboard shows nav links
    await page.goto('/');
    await page.evaluate(() => {
      const state = {
        state: {
          profiles: [{
            id: 'test-1',
            name: 'Test',
            birthDay: 30, birthMonth: 8, birthYear: 1979,
            birthHour: 2, birthMinute: 40,
            createdAt: new Date().toISOString(),
          }],
          activeProfileId: 'test-1',
          clients: [],
          reports: [],
          favorites: [],
          language: 'sk',
          numerologyMethod: 'developmental',
          themeMode: 'light',
        },
        version: 4,
      };
      localStorage.setItem('numero-store', JSON.stringify(state));
    });
    await page.reload();
    await page.goto('/numerology');
    await expect(page.getByText(/Numerológia/i).first()).toBeVisible({ timeout: 10000 });
    // Životné číslo 1 (z 37) for 30.8.1979
    await expect(page.getByText(/Životné číslo 1/i).first()).toBeVisible();
  });
});
