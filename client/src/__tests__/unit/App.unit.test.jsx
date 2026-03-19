/**
 * UNIT TESTS – Individual component rendering
 * Tests components in isolation with mocked fetch
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App';

// Mock fetch globally
beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes('/api/products')) {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            products: [
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
            ],
            total: 2,
          }),
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

describe('[Unit] Navbar', () => {
  it('renders ShopSmart branding', () => {
    render(<App />);
    expect(screen.getByText('Smart')).toBeInTheDocument();
  });

  it('renders cart button with icon', () => {
    render(<App />);
    expect(screen.getByLabelText(/Open cart/i)).toBeInTheDocument();
  });
});

describe('[Unit] Hero Section', () => {
  it('renders hero heading', () => {
    render(<App />);
    const hero = document.getElementById('hero');
    expect(hero).not.toBeNull();
  });

  it('renders hero subtext', () => {
    render(<App />);
    expect(screen.getByText(/Curated collection/i)).toBeInTheDocument();
  });
});

describe('[Unit] Search & Filter', () => {
  it('renders search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Search products/i)).toBeInTheDocument();
  });

  it('renders sort dropdown', () => {
    render(<App />);
    expect(screen.getByLabelText(/Sort products/i)).toBeInTheDocument();
  });

  it('renders "All" category chip', () => {
    render(<App />);
    const allChip = document.getElementById('category-all');
    expect(allChip).not.toBeNull();
  });
});

describe('[Unit] Footer', () => {
  it('renders footer with copyright', () => {
    render(<App />);
    expect(screen.getByText(/© 2026 ShopSmart/i)).toBeInTheDocument();
  });

  it('renders footer element', () => {
    render(<App />);
    const footer = document.getElementById('footer');
    expect(footer).not.toBeNull();
  });
});
