/**
 * INTEGRATION TESTS – Async state transitions
 * Validates that fetched data renders correctly using waitFor
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App';

const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling',
    price: 249.99,
    category: 'electronics',
    image: 'https://example.com/img.jpg',
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Leather Watch',
    description: 'Handcrafted genuine leather',
    price: 189.0,
    category: 'accessories',
    image: 'https://example.com/img2.jpg',
    rating: 4.6,
    reviews: 834,
    inStock: true,
    badge: 'New',
  },
];

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes('/api/products')) {
      return Promise.resolve({
        json: () => Promise.resolve({ products: mockProducts, total: mockProducts.length }),
      });
    }
    if (url.includes('/api/categories')) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            categories: [
              { id: 'electronics', name: 'Electronics', icon: '🔌', description: 'Gadgets' },
              { id: 'accessories', name: 'Accessories', icon: '⌚', description: 'Watches' },
            ],
          }),
      });
    }
    if (url.includes('/api/cart')) {
      return Promise.resolve({
        json: () => Promise.resolve({ items: [], itemCount: 0, subtotal: 0 }),
      });
    }
    return Promise.resolve({ json: () => Promise.resolve({}) });
  });
});

describe('[Integration] Product Rendering', () => {
  it('renders products after API data loads', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
  });

  it('renders product cards with correct IDs', async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.getElementById('product-1')).not.toBeNull();
      expect(document.getElementById('product-2')).not.toBeNull();
    });
  });

  it('renders product prices', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('249.99')).toBeInTheDocument();
    });
  });

  it('renders product badges', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Best Seller')).toBeInTheDocument();
    });
  });
});

describe('[Integration] Category Filtering', () => {
  it('renders category chips after API data loads', async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.getElementById('category-electronics')).not.toBeNull();
    });
  });

  it('clicking a category chip triggers new fetch', async () => {
    render(<App />);
    await waitFor(() => {
      expect(document.getElementById('category-electronics')).not.toBeNull();
    });

    fireEvent.click(document.getElementById('category-electronics'));

    await waitFor(() => {
      const calls = global.fetch.mock.calls.filter((c) => c[0].includes('/api/products'));
      expect(calls.length).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('[Integration] Search', () => {
  it('typing in search triggers new fetch', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Search products/i);

    fireEvent.change(searchInput, { target: { value: 'headphones' } });

    await waitFor(() => {
      const calls = global.fetch.mock.calls.filter((c) => c[0].includes('search=headphones'));
      expect(calls.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe('[Integration] Cart Interaction', () => {
  it('clicking cart button opens the cart drawer', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Open cart/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText(/Open cart/i));

    await waitFor(() => {
      expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
    });
  });
});
