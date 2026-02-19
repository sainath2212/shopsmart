// @ts-check
import { test, expect } from '@playwright/test';

/**
 * E2E TESTS – Full browser tests using Playwright.
 *
 * The Vite preview server is started automatically by playwright.config.js.
 * fetch calls to /api/health are intercepted and mocked so no real backend
 * is needed in CI.
 */

test.beforeEach(async ({ page }) => {
  // Mock the /api/health endpoint so E2E tests run without a real backend
  await page.route('**/api/health', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'ok',
        message: 'ShopSmart Backend is running',
        timestamp: new Date().toISOString(),
      }),
    });
  });
});

test.describe('[E2E] ShopSmart App – Page load', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShopSmart/i);
  });

  test('renders the ShopSmart heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /ShopSmart/i })).toBeVisible();
  });

  test('renders the Backend Status section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Backend Status/i)).toBeVisible();
  });
});

test.describe('[E2E] ShopSmart App – Health data display', () => {
  test('shows "ok" status after health check resolves', async ({ page }) => {
    await page.goto('/');
    // Wait for the mocked response to render
    await expect(page.getByText(/ok/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows backend message text', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByText(/ShopSmart Backend is running/i)
    ).toBeVisible({ timeout: 5000 });
  });
});

test.describe('[E2E] ShopSmart App – Error state', () => {
  test('shows loading text when backend is unavailable', async ({ page }) => {
    // Override to simulate a network failure
    await page.route('**/api/health', (route) => route.abort('failed'));
    await page.goto('/');
    await expect(page.getByText(/Loading backend status/i)).toBeVisible();
  });
});
