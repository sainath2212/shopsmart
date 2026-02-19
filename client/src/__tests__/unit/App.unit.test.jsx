/**
 * UNIT TESTS – App component (Vitest + Testing Library)
 *
 * fetch is mocked so no real network call is made.
 * Tests focus on rendering and what the user sees in isolation.
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App';

// ─── Global fetch mock ───────────────────────────────────────────────────────
const mockHealthResponse = {
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: '2024-01-01T00:00:00.000Z',
};

beforeEach(() => {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockHealthResponse),
        })
    );
});
// ────────────────────────────────────────────────────────────────────────────

describe('[Unit] App – static rendering', () => {
    it('renders the ShopSmart heading', () => {
        render(<App />);
        expect(screen.getByRole('heading', { name: /ShopSmart/i })).toBeInTheDocument();
    });

    it('renders the "Backend Status" subheading', () => {
        render(<App />);
        // getByRole scopes to headings only — avoids matching the loading paragraph
        expect(screen.getByRole('heading', { name: /Backend Status/i })).toBeInTheDocument();
    });

    it('shows loading text before data resolves', () => {
        // Freeze fetch so it never resolves
        global.fetch = vi.fn(() => new Promise(() => { }));
        render(<App />);
        expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
    });

    it('does not crash on render', () => {
        expect(() => render(<App />)).not.toThrow();
    });
});
