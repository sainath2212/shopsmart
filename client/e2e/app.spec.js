// @ts-check
import { test, expect } from '@playwright/test';

/**
 * E2E TESTS – Full browser tests using Playwright.
 *
 * The Vite preview server is started automatically by playwright.config.js.
 * fetch calls are intercepted and mocked so no real backend is needed in CI.
 */

const mockProducts = [
  {
    id: 1, name: 'Wireless Headphones', description: 'Premium noise-cancelling', price: 249.99,
    category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: 4.8, reviews: 1247, inStock: true, badge: 'Best Seller',
  },
  {
    id: 2, name: 'Leather Watch', description: 'Handcrafted genuine leather', price: 189.00,
    category: 'accessories', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    rating: 4.6, reviews: 834, inStock: true, badge: 'New',
  },
];

const mockCategories = [
  { id: 'electronics', name: 'Electronics', icon: '🔌', description: 'Gadgets' },
  { id: 'accessories', name: 'Accessories', icon: '⌚', description: 'Watches' },
];

test.beforeEach(async ({ page }) => {
  // Mock all API endpoints
  await page.route('**/api/products**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ products: mockProducts, total: mockProducts.length }),
    });
  });

  await page.route('**/api/categories', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ categories: mockCategories }),
    });
  });

  await page.route('**/api/cart', (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], itemCount: 0, subtotal: 0 }),
      });
    } else if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Item added', cart: [] }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'OK', cart: [] }),
      });
    }
  });
});

test.describe('[E2E] ShopSmart App – Page Load', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShopSmart/i);
  });

  test('renders the navigation with ShopSmart branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#navbar')).toBeVisible();
    await expect(page.getByText(/Smart/i).first()).toBeVisible();
  });

  test('renders the hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Discover/i)).toBeVisible();
    await expect(page.getByText(/Premium/i).first()).toBeVisible();
  });
});

test.describe('[E2E] ShopSmart App – Product Display', () => {
  test('shows product cards after data loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Wireless Headphones')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Leather Watch')).toBeVisible({ timeout: 5000 });
  });

  test('shows product prices', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('249.99')).toBeVisible({ timeout: 5000 });
  });

  test('shows product badges', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Best Seller')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('[E2E] ShopSmart App – Categories', () => {
  test('renders category chips', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#category-all')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Electronics')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('[E2E] ShopSmart App – Search & Sort', () => {
  test('search input is interactive', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('headphones');
    await expect(searchInput).toHaveValue('headphones');
  });

  test('sort dropdown is interactive', async ({ page }) => {
    await page.goto('/');
    const sortSelect = page.locator('#sort-select');
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption('price-asc');
    await expect(sortSelect).toHaveValue('price-asc');
  });
});

test.describe('[E2E] ShopSmart App – Cart', () => {
  test('opens cart drawer when cart button clicked', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cart-button').click();
    await expect(page.locator('#cart-drawer')).toHaveClass(/open/);
    await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
  });

  test('closes cart drawer via close button', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cart-button').click();
    await expect(page.locator('#cart-drawer')).toHaveClass(/open/);
    await page.locator('#close-cart').click();
    await expect(page.locator('#cart-drawer')).not.toHaveClass(/open/);
  });

  test('closes cart drawer via overlay click', async ({ page }) => {
    await page.goto('/');
    await page.locator('#cart-button').click();
    await expect(page.locator('#cart-drawer')).toHaveClass(/open/);
    await page.locator('#cart-overlay').click({ force: true });
    await expect(page.locator('#cart-drawer')).not.toHaveClass(/open/);
  });
});

test.describe('[E2E] ShopSmart App – Footer', () => {
  test('renders footer with copyright', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/© 2026 ShopSmart/i)).toBeVisible();
  });
});
