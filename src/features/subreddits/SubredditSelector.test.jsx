import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import SubredditSelector from './SubredditSelector';
import { getAllSubreddits } from '../../constants/subreddits';

describe('SubredditSelector', () => {
  it('renders the current subreddit', () => {
    const preloadedState = {
      ui: {
        activeSubreddit: 'reactjs',
      },
    };
    
    renderWithProviders(<SubredditSelector />, { preloadedState });
    
    expect(screen.getByText(/reactjs/i)).toBeInTheDocument();
  });

  it('displays dropdown with all available subreddits', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubredditSelector />);
    
    // Open dropdown
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Check that listbox is displayed with all options
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    const subreddits = getAllSubreddits();
    
    // Verify we have the right number of options
    expect(options).toHaveLength(subreddits.length);
    
    // Verify each subreddit appears in an option
    subreddits.forEach((subreddit) => {
      const hasOption = options.some(opt => opt.textContent.includes(subreddit));
      expect(hasOption).toBe(true);
    });
  });

  it('dispatches setActiveSubreddit when a subreddit is selected', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SubredditSelector />);
    
    // Open dropdown
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Select a subreddit - find by text within the button
    const options = screen.getAllByRole('option');
    const programmingOption = options.find(opt => opt.textContent.includes('programming'));
    await user.click(programmingOption.querySelector('button'));
    
    const state = store.getState();
    expect(state.ui.activeSubreddit).toBe('programming');
  });

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubredditSelector />);
    
    // Open dropdown
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Verify dropdown is open
    expect(screen.getByText(/programming/i)).toBeInTheDocument();
    
    // Select a subreddit
    const options = screen.getAllByRole('option');
    const webdevOption = options.find(opt => opt.textContent.includes('webdev'));
    await user.click(webdevOption.querySelector('button'));
    
    // Verify dropdown is closed (listbox no longer in document)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('highlights the active subreddit in the list', async () => {
    const user = userEvent.setup();
    const preloadedState = {
      ui: {
        activeSubreddit: 'javascript',
      },
    };
    
    renderWithProviders(<SubredditSelector />, { preloadedState });
    
    // Open dropdown
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Find the active subreddit option by aria-selected
    const activeOption = screen.getByRole('option', { selected: true });
    const activeButton = activeOption.querySelector('button');
    expect(activeButton).toHaveClass('bg-orange-50');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubredditSelector />);
    
    // Tab to the button
    await user.tab();
    const button = screen.getByRole('button');
    expect(button).toHaveFocus();
    
    // Open with Enter
    await user.keyboard('{Enter}');
    
    // Should show dropdown
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
