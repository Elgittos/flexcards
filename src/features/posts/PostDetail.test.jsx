import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import PostDetail from './PostDetail';

// Mock the API hook
const mockUseGetPostWithCommentsQuery = vi.fn();

vi.mock('../../app/api/redditApi', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGetPostWithCommentsQuery: (...args) => mockUseGetPostWithCommentsQuery(...args),
  };
});

describe('PostDetail', () => {
  const mockPost = {
    id: 'post123',
    title: 'Test Post Title',
    author: 'testuser',
    subreddit: 'test',
    score: 100,
    createdAt: 1609459200,
    numComments: 5,
    content: 'This is **test** content with markdown',
    isSelf: true,
  };

  const mockComments = [
    {
      id: 'comment1',
      author: 'commenter1',
      body: 'First comment',
      score: 10,
      createdAt: 1609459200,
      replies: [],
    },
    {
      id: 'comment2',
      author: 'commenter2',
      body: 'Second comment',
      score: 5,
      createdAt: 1609459200,
      replies: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state while fetching', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render error state when fetch fails', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' },
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
  });

  it('should render retry button on error', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Failed to fetch' },
      refetch,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);
    
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('should render post details when loaded', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: { post: mockPost, comments: mockComments },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should render post content with markdown', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: { post: mockPost, comments: mockComments },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    
    const testWord = screen.getByText('test');
    expect(testWord.tagName).toBe('STRONG');
  });

  it('should render comment tree', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: { post: mockPost, comments: mockComments },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
  });

  it('should show comments count', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: { post: mockPost, comments: mockComments },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    expect(screen.getByText(/5.*comment/i)).toBeInTheDocument();
  });

  it('should handle posts with no content', () => {
    const linkPost = {
      ...mockPost,
      content: '',
      isSelf: false,
      url: 'https://example.com',
    };

    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: { post: linkPost, comments: [] },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    // Should not crash without content
  });

  it('should handle posts with no comments', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: { post: mockPost, comments: [] },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);
    
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });

  it('should render with dark mode', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: { post: mockPost, comments: mockComments },
      isLoading: false,
      error: null,
    });

    const { container } = renderWithProviders(
      <PostDetail postId="post123" subreddit="test" />,
      {
        preloadedState: {
          ui: {
            darkMode: true,
            viewMode: 'card',
            activeSubreddit: 'test',
            activeSortOption: 'hot',
            sidebarOpen: false,
            modalOpen: false,
            selectedPostId: null,
          },
        },
      }
    );

    expect(container.firstChild).toHaveClass(/dark|bg-gray-/);
  });

  it('should use correct API query parameters', () => {
    mockUseGetPostWithCommentsQuery.mockReturnValue({
      data: { post: mockPost, comments: mockComments },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PostDetail postId="post123" subreddit="test" />);

    expect(mockUseGetPostWithCommentsQuery).toHaveBeenCalledWith({
      postId: 'post123',
      subreddit: 'test',
    });
  });
});
