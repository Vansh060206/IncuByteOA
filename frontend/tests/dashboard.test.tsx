import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dashboard } from '../src/pages/Dashboard';
import { renderWithProviders } from './utils';

describe('Dashboard Component Rendering', () => {
  it('should load list of vehicles and show out of stock state properly', async () => {
    renderWithProviders(<Dashboard />);

    expect(screen.getByText(/Fetching fleet status.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/\$22,?000/i)).toBeInTheDocument();
      expect(screen.getByText(/\$24,?000/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Toyota Corolla/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Honda Civic/i).length).toBeGreaterThan(0);

    expect(screen.getByText(/5 In Stock/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Out of Stock/i)).toHaveLength(2);

    const purchaseButtons = screen.getAllByRole('button');
    const toyotaButton = purchaseButtons.find(
      (btn) => btn.textContent === 'Purchase Vehicle'
    );
    const hondaButton = purchaseButtons.find(
      (btn) => btn.textContent === 'Sold Out'
    );

    expect(toyotaButton).toBeEnabled();
    expect(hondaButton).toBeDisabled();
  });
});
