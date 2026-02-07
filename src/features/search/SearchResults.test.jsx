import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchResults from './SearchResults';
import searchReducer from './searchSlice';
import uiReducer from '../ui/uiSlice';

// Mock the useSearchPostsQuery hook
const mockUseSearchPostsQuery = vi.fn();

vi.mock('../../app/api/redditApi', () => ({
  useSearchPostsQuery: (...args) => mockUseSearchPostsQuery(...args),
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      search: searchReducer,
      ui: uiReducer,
    },
    preloadedState: {
      search: {
        activeQuery: 'react hooks',
        searchHistory: [],
        subredditFilter: 'all',
        timeFilter: 'all',
        sortFilter: 'relevance',
        isSearching: true,
        ...initialState,
      },
      ui: {
        darkMode: false,
        viewMode: 'card',
        activeSubreddit: 'javascript',
        activeSortOption: 'hot',
        sidebarOpen: false,
        modalOpen: false,
        selectedPostId: null,
      },
    },
  });
};

const renderWithProvider = (component, store) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

const mockPosts = [
  {
    id: 'post1',
    title: 'React Hooks Tutorial',
    author: 'user1',
    subreddit: 'reactjs',
    score: 1234,
    numComments: 56,
    thumbnail: 'https://example.com/thumbnail1.jpg',
    created: 1234567890,
    url: 'https://reddit.com/r/reactjs/comments/post1',
    permalink: '/r/reactjs/comments/post1',
  },
  {
    id: 'post2',
    title: 'Understanding useEffect',
    author: 'user2',
    subreddit: 'javascript',
    score: 5678,
    numComments: 123,
    thumbnail: 'self',
    created: 1234567900,
    url: 'https://reddit.com/r/javascript/comments/post2',
    permalink: '/r/javascript/comments/post2',
  },
];

describe('SearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore();
    renderWithProvider(<SearchResults />, store);

    // Check for skeleton loading
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('should display error state with retry button', () => {
    const mockRefetch = vi.fn();
    mockUseSearchPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Failed to fetch' },
      refetch: mockRefetch,
    });

    const store = createMockStore();
    renderWithProvider(<SearchResults />, store);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should call refetch when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRefetch = vi.fn();
    mockUseSearchPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Failed to fetch' },
      refetch: mockRefetch,
    });

    const store = createMockStore();
    renderWithProvider(<SearchResults />, store);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should display empty state when no results', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore();
    renderWithProvider(<SearchResults />, store);

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('should display search results', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore();
    renderWithProvider(<SearchResults />, store);

    expect(screen.getByText('React Hooks Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Understanding useEffect')).toBeInTheDocument();
  });

  it('should display result count', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore();
    renderWithProvider(<SearchResults />, store);

    expect(screen.getByText(/2 results/i)).toBeInTheDocument();
  });

  it('should use query from search state', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore({ activeQuery: 'react hooks' });
    renderWithProvider(<SearchResults />, store);

    expect(mockUseSearchPostsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'react hooks',
      }),
      expect.any(Object)
    );
  });

  it('should apply filters from search state', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore({
      activeQuery: 'react',
      subredditFilter: 'javascript',
    });
    renderWithProvider(<SearchResults />, store);

    expect(mockUseSearchPostsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'react',
        subreddit: 'javascript',
      }),
      expect.any(Object)
    );
  });

  it('should not call API when query is empty', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore({ activeQuery: '', isSearching: false });
    renderWithProvider(<SearchResults />, store);

    expect(mockUseSearchPostsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: '',
      }),
      expect.objectContaining({
        skip: true,
      })
    );
  });

  it('should pass sort filter from state to API query', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore({
      activeQuery: 'react',
      sortFilter: 'top',
    });
    renderWithProvider(<SearchResults />, store);

    expect(mockUseSearchPostsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'react',
        sort: 'top',
      }),
      expect.any(Object)
    );
  });

  it('should pass time filter from state to API query', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore({
      activeQuery: 'react',
      timeFilter: 'week',
    });
    renderWithProvider(<SearchResults />, store);

    expect(mockUseSearchPostsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'react',
        t: 'week',
      }),
      expect.any(Object)
    );
  });

  it('should pass both sort and time filters to API query', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore({
      activeQuery: 'javascript',
      sortFilter: 'new',
      timeFilter: 'day',
    });
    renderWithProvider(<SearchResults />, store);

    expect(mockUseSearchPostsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'javascript',
        sort: 'new',
        t: 'day',
      }),
      expect.any(Object)
    );
  });

  it('should not pass t parameter when timeFilter is "all"', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore({
      activeQuery: 'react',
      timeFilter: 'all',
    });
    renderWithProvider(<SearchResults />, store);

    const callArgs = mockUseSearchPostsQuery.mock.calls[0][0];
    expect(callArgs).not.toHaveProperty('t');
  });

  it('should not pass sort parameter when sortFilter is "relevance"', () => {
    mockUseSearchPostsQuery.mockReturnValue({
      data: { posts: mockPosts },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const store = createMockStore({
      activeQuery: 'react',
      sortFilter: 'relevance',
    });
    renderWithProvider(<SearchResults />, store);

    const callArgs = mockUseSearchPostsQuery.mock.calls[0][0];
    expect(callArgs).not.toHaveProperty('sort');
  });
});
