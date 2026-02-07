import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import MultiSubredditGrid from './MultiSubredditGrid';
import { redditApi } from '../../app/api/redditApi';

describe('MultiSubredditGrid', () => {
  it('renders multiple subreddit sections', async () => {
    renderWithProviders(<MultiSubredditGrid />);
    
    // Default subreddits should be displayed
    await waitFor(() => {
      expect(screen.getByText(/javascript/i)).toBeInTheDocument();
      expect(screen.getByText(/reactjs/i)).toBeInTheDocument();
      expect(screen.getByText(/webdev/i)).toBeInTheDocument();
      expect(screen.getByText(/programming/i)).toBeInTheDocument();
    });
  });

  it('displays loading skeletons while posts are loading', () => {
    renderWithProviders(<MultiSubredditGrid />);
    
    // Should show loading indicators
    const loadingElements = screen.getAllByText(/loading/i);
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders posts from each subreddit when loaded', async () => {
    // Mock responses for each subreddit
    const mockPosts = {
      javascript: {
        posts: [
          {
            id: 'js1',
            title: 'JavaScript Tutorial',
            author: 'jsdev',
            subreddit: 'javascript',
            score: 100,
            numComments: 50,
            created: Date.now() / 1000,
            permalink: '/r/javascript/comments/js1',
            url: 'https://example.com/js',
          },
        ],
        after: null,
        before: null,
      },
      reactjs: {
        posts: [
          {
            id: 'react1',
            title: 'React Hooks Guide',
            author: 'reactdev',
            subreddit: 'reactjs',
            score: 200,
            numComments: 75,
            created: Date.now() / 1000,
            permalink: '/r/reactjs/comments/react1',
            url: 'https://example.com/react',
          },
        ],
        after: null,
        before: null,
      },
    };

    const store = renderWithProviders(<MultiSubredditGrid />).store;
    
    // Manually inject the mock data into the Redux store
    store.dispatch(
      redditApi.util.upsertQueryData('getSubredditPosts', { subreddit: 'javascript', sort: 'hot', limit: 8 }, mockPosts.javascript)
    );
    store.dispatch(
      redditApi.util.upsertQueryData('getSubredditPosts', { subreddit: 'reactjs', sort: 'hot', limit: 8 }, mockPosts.reactjs)
    );

    await waitFor(() => {
      expect(screen.getByText('JavaScript Tutorial')).toBeInTheDocument();
      expect(screen.getByText('React Hooks Guide')).toBeInTheDocument();
    });
  });

  it('displays subreddit names as section headers', async () => {
    renderWithProviders(<MultiSubredditGrid />);
    
    await waitFor(() => {
      // Headers should display r/subredditname
      expect(screen.getByText(/r\/javascript/i)).toBeInTheDocument();
      expect(screen.getByText(/r\/reactjs/i)).toBeInTheDocument();
    });
  });

  it('uses custom subreddits when provided', async () => {
    const customSubreddits = ['python', 'golang'];
    renderWithProviders(<MultiSubredditGrid subreddits={customSubreddits} />);
    
    await waitFor(() => {
      expect(screen.getByText(/r\/python/i)).toBeInTheDocument();
      expect(screen.getByText(/r\/golang/i)).toBeInTheDocument();
    });
  });

  it('applies responsive grid classes', () => {
    const { container } = renderWithProviders(<MultiSubredditGrid />);
    
    // Check for responsive grid classes: mobile (1 col), desktop (2 col), xl (3 col)
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeTruthy();
    expect(gridElement.className).toMatch(/grid-cols-1/);
    expect(gridElement.className).toMatch(/lg:grid-cols-2/);
    expect(gridElement.className).toMatch(/xl:grid-cols-3/);
  });

  it('handles errors gracefully for individual subreddits', async () => {
    const store = renderWithProviders(<MultiSubredditGrid />).store;
    
    // Simulate an error for one subreddit
    store.dispatch(
      redditApi.util.upsertQueryData('getSubredditPosts', { subreddit: 'javascript', sort: 'hot', limit: 8 }, undefined)
    );

    // Should still render other subreddits
    await waitFor(() => {
      expect(screen.getByText(/r\/reactjs/i)).toBeInTheDocument();
    });
  });
});
