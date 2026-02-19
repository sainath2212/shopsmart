/**
 * INTEGRATION TESTS – App component (Vitest + Testing Library)
 *
 * Tests the full async data flow: fetch resolves → component re-renders →
 * user sees the backend status. Focus is on component behaviour across
 * state transitions, not just initial render.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../../App';

const mockHealthOk = {
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: '2024-01-01T00:00:00.000Z',
};

beforeEach(() => {
    global.fetch = vi.fn(() =>
        Promise.resolve({ json: () => Promise.resolve(mockHealthOk) })
    );
});

describe('[Integration] App – async data flow', () => {
    it('shows loading state initially, then status after fetch resolves', async () => {
        render(<App />);
        // Loading state visible before fetch resolves
        expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();

        // After fetch resolves, status field appears
        await waitFor(() =>
            expect(screen.getByText(/ok/i)).toBeInTheDocument()
        );
    });

    it('displays the message returned by the backend', async () => {
        render(<App />);
        await waitFor(() =>
            expect(screen.getByText(/ShopSmart Backend is running/i)).toBeInTheDocument()
        );
    });

    it('displays the timestamp returned by the backend', async () => {
        render(<App />);
        await waitFor(() =>
            expect(screen.getByText(/2024-01-01/i)).toBeInTheDocument()
        );
    });

    it('calls fetch exactly once on mount', async () => {
        render(<App />);
        await waitFor(() => screen.getByText(/ok/i));
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('calls the /api/health endpoint', async () => {
        render(<App />);
        await waitFor(() => screen.getByText(/ok/i));
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/health')
        );
    });

    it('gracefully handles a fetch error (no crash)', async () => {
        global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
        expect(() => render(<App />)).not.toThrow();
        // Loading text stays since data never arrives
        await waitFor(() =>
            expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument()
        );
    });
});
