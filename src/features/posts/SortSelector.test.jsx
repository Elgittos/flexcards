import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import SortSelector from './SortSelector';
import { SORT_OPTIONS } from '../../constants/subreddits';

describe('SortSelector', () => {
  it('renders all sort options', () => {
    renderWithProviders(<SortSelector />);
    
    SORT_OPTIONS.forEach((option) => {
      expect(screen.getByRole('button', { name: new RegExp(option, 'i') })).toBeInTheDocument();
    });
  });

  it('highlights the active sort option', () => {
    const preloadedState = {
      ui: {
        activeSortOption: 'new',
      },
    };
    
    renderWithProviders(<SortSelector />, { preloadedState });
    
    const newButton = screen.getByRole('button', { name: /new/i });
    expect(newButton).toHaveClass('bg-orange-500');
  });

  it('dispatches setActiveSortOption when a sort option is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SortSelector />);
    
    const topButton = screen.getByRole('button', { name: /top/i });
    await user.click(topButton);
    
    const state = store.getState();
    expect(state.ui.activeSortOption).toBe('top');
  });

  it('changes active state when different option is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SortSelector />);
    
    const risingButton = screen.getByRole('button', { name: /rising/i });
    await user.click(risingButton);
    
    expect(risingButton).toHaveClass('bg-orange-500');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SortSelector />);
    
    const hotButton = screen.getByRole('button', { name: /hot/i });
    await user.tab();
    expect(hotButton).toHaveFocus();
  });

  it('displays sort options in correct order', () => {
    renderWithProviders(<SortSelector />);
    
    const buttons = screen.getAllByRole('button');
    SORT_OPTIONS.forEach((option, index) => {
      expect(buttons[index]).toHaveTextContent(new RegExp(option, 'i'));
    });
  });
});
