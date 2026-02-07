import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import PopularSubreddits from './PopularSubreddits';
import { SUBREDDIT_CATEGORIES } from '../../constants/subreddits';

describe('PopularSubreddits', () => {
  it('renders all categories', () => {
    renderWithProviders(<PopularSubreddits />);
    
    Object.values(SUBREDDIT_CATEGORIES).forEach((category) => {
      expect(screen.getByText(category.label)).toBeInTheDocument();
    });
  });

  it('displays subreddit chips for each category', () => {
    renderWithProviders(<PopularSubreddits />);
    
    // Check technology category subreddits are displayed
    const techSubreddits = SUBREDDIT_CATEGORIES.technology.subreddits;
    techSubreddits.forEach((subreddit) => {
      expect(screen.getAllByText(new RegExp(subreddit, 'i')).length).toBeGreaterThan(0);
    });
  });

  it('dispatches setActiveSubreddit when a subreddit chip is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<PopularSubreddits />);
    
    // Find and click a subreddit chip
    const reactjsButtons = screen.getAllByRole('button', { name: /reactjs/i });
    await user.click(reactjsButtons[0]);
    
    const state = store.getState();
    expect(state.ui.activeSubreddit).toBe('reactjs');
  });

  it('highlights the currently active subreddit', () => {
    const preloadedState = {
      ui: {
        activeSubreddit: 'webdev',
      },
    };
    
    renderWithProviders(<PopularSubreddits />, { preloadedState });
    
    // Find the active subreddit button
    const webdevButtons = screen.getAllByRole('button', { name: /webdev/i });
    const activeButton = webdevButtons.find(btn => btn.classList.contains('bg-orange-500'));
    expect(activeButton).toBeDefined();
  });

  it('organizes subreddits by category', () => {
    renderWithProviders(<PopularSubreddits />);
    
    // Verify categories are rendered in sections
    Object.entries(SUBREDDIT_CATEGORIES).forEach(([key, category]) => {
      const categoryLabel = screen.getByText(category.label);
      expect(categoryLabel).toBeInTheDocument();
      
      // Check that subreddits from this category are present
      category.subreddits.forEach((subreddit) => {
        const subredditElements = screen.getAllByText(new RegExp(subreddit, 'i'));
        expect(subredditElements.length).toBeGreaterThan(0);
      });
    });
  });

  it('supports keyboard navigation for subreddit chips', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PopularSubreddits />);
    
    // Tab to first button
    await user.tab();
    const firstButton = screen.getAllByRole('button')[0];
    expect(firstButton).toHaveFocus();
  });
});
