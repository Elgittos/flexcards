import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { redditApi } from '../../app/api/redditApi';
import uiReducer from '../ui/uiSlice';
import PostList from './PostList';
import { setupServer } from 'msw/node';
import { http, HttpResponse, delay } from 'msw';

// Mock PostCard component
vi.mock('./PostCard', () => ({
  default: ({ post, viewMode }) => (
    <div data-testid={`post-card-${post.id}`}>
      {post.title} - {viewMode}
    </div>
  ),
}));

// Mock PostSkeleton component
vi.mock('./PostSkeleton', () => ({
  default: ({ count }) => (
    <div data-testid="post-skeleton">
      Loading {count} skeletons
    </div>
  ),
}));

const mockPostsResponse = {
  kind: 'Listing',
  data: {
    children: [
      {
        kind: 't3',
        data: {
          id: '1',
          title: 'First Post',
          author: 'user1',
          subreddit: 'javascript',
          score: 100,
          num_comments: 10,
          created_utc: 1234567890,
          thumbnail: 'https://example.com/thumb1.jpg',
          url: 'https://reddit.com/r/javascript/1',
          permalink: '/r/javascript/1',
        },
      },
      {
        kind: 't3',
        data: {
          id: '2',
          title: 'Second Post',
          author: 'user2',
          subreddit: 'javascript',
          score: 200,
          num_comments: 20,
          created_utc: 1234567891,
          thumbnail: 'https://example.com/thumb2.jpg',
          url: 'https://reddit.com/r/javascript/2',
          permalink: '/r/javascript/2',
        },
      },
    ],
    after: null,
  },
};

const server = setupServer();

describe('PostList', () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'bypass' });
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  const createMockStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        [redditApi.reducerPath]: redditApi.reducer,
        ui: uiReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(redditApi.middleware),
      preloadedState: {
        ui: {
          darkMode: false,
          viewMode: 'card',
          activeSubreddit: 'javascript',
          activeSortOption: 'hot',
          sidebarOpen: false,
          modalOpen: false,
          selectedPostId: null,
          ...initialState.ui,
        },
      },
    });
  };

  it('should render loading state initially', async () => {
    const store = createMockStore();
    
    server.use(
      http.get('https://www.reddit.com/r/:subreddit/:sort.json', async () => {
        // Delay response to keep loading state
        await delay('infinite');
      })
    );

    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    expect(screen.getByTestId('post-skeleton')).toBeInTheDocument();
  });

  it('should render posts when data is loaded', async () => {
    const store = createMockStore();
    
    server.use(
      http.get('https://www.reddit.com/r/:subreddit/:sort.json', () => {
        return HttpResponse.json(mockPostsResponse);
      })
    );

    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
    });

    expect(screen.getByTestId('post-card-2')).toBeInTheDocument();
    expect(screen.getByText(/First Post/)).toBeInTheDocument();
    expect(screen.getByText(/Second Post/)).toBeInTheDocument();
  });

  it('should use card view mode from state', async () => {
    const store = createMockStore({ ui: { viewMode: 'card' } });
    
    server.use(
      http.get('https://www.reddit.com/r/:subreddit/:sort.json', () => {
        return HttpResponse.json(mockPostsResponse);
      })
    );

    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/First Post - card/)).toBeInTheDocument();
    });
  });

  it('should use compact view mode from state', async () => {
    const store = createMockStore({ ui: { viewMode: 'compact' } });
    
    server.use(
      http.get('https://www.reddit.com/r/:subreddit/:sort.json', () => {
        return HttpResponse.json(mockPostsResponse);
      })
    );

    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/First Post - compact/)).toBeInTheDocument();
    });
  });

  it('should apply grid layout for card view', async () => {
    const store = createMockStore({ ui: { viewMode: 'card' } });
    
    server.use(
      http.get('https://www.reddit.com/r/:subreddit/:sort.json', () => {
        return HttpResponse.json(mockPostsResponse);
      })
    );

    const { container } = render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    await waitFor(() => {
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('md:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });
  });

  it('should render empty state when no posts', async () => {
    const store = createMockStore();
    
    server.use(
      http.get('https://www.reddit.com/r/:subreddit/:sort.json', () => {
        return HttpResponse.json({ kind: 'Listing', data: { children: [], after: null } });
      })
    );

    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
    });
  });

  it('should render error state with retry button', async () => {
    const store = createMockStore();
    
    server.use(
      http.get('https://www.reddit.com/r/:subreddit/:sort.json', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      })
    );

    render(
      <Provider store={store}>
        <PostList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading posts/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});

