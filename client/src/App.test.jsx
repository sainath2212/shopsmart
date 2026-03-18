import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('App', () => {
  beforeEach(() => {
    // Mock fetch for products, categories, and cart
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            products: [
              { id: 1, name: 'Test Product', description: 'A test item', price: 29.99, category: 'electronics', image: '', rating: 4.5, reviews: 100, inStock: true, badge: null }
            ],
            total: 1,
          }),
        });
      }
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            categories: [
              { id: 'electronics', name: 'Electronics', icon: '🔌', description: 'Gadgets' }
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

  it('renders ShopSmart branding', () => {
    render(<App />);
    expect(screen.getByText('Smart')).toBeInTheDocument();
  });

  it('renders hero section', () => {
    render(<App />);
    const hero = document.getElementById('hero');
    expect(hero).not.toBeNull();
  });

  it('renders cart button', () => {
    render(<App />);
    const cartBtn = screen.getByLabelText(/Open cart/i);
    expect(cartBtn).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<App />);
    const search = screen.getByPlaceholderText(/Search products/i);
    expect(search).toBeInTheDocument();
  });

  it('renders sort dropdown', () => {
    render(<App />);
    const sort = screen.getByLabelText(/Sort products/i);
    expect(sort).toBeInTheDocument();
  });
});
