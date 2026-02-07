import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/utils';
import PostCard from './PostCard';

// Mock the formatTimeAgo function
vi.mock('../../utils/formatDate', () => ({
  formatTimeAgo: (timestamp) => '2 hours ago',
}));

describe('PostCard', () => {
  const mockPost = {
    id: 'abc123',
    title: 'Test Post Title',
    author: 'testuser',
    subreddit: 'javascript',
    score: 1234,
    numComments: 56,
    thumbnail: 'https://example.com/thumbnail.jpg',
    created: 1234567890,
    url: 'https://reddit.com/r/javascript/comments/abc123',
    permalink: '/r/javascript/comments/abc123',
  };

  const mockPostNoThumbnail = {
    ...mockPost,
    thumbnail: 'self',
  };

  it('should render post title', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render post author', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  it('should render post subreddit', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    expect(screen.getByText(/javascript/i)).toBeInTheDocument();
  });

  it('should render post score', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    expect(screen.getByText(/1\.2k/i)).toBeInTheDocument();
  });

  it('should render comment count', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    expect(screen.getByText(/56/i)).toBeInTheDocument();
  });

  it('should render time ago', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

  it('should render thumbnail when available', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    const img = screen.getByRole('img', { name: /thumbnail/i });
    expect(img).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
  });

  it('should render placeholder when thumbnail is not available', () => {
    renderWithProviders(<PostCard post={mockPostNoThumbnail} viewMode="card" />);
    // Should render a placeholder div instead of img
    expect(screen.queryByRole('img', { name: /thumbnail/i })).not.toBeInTheDocument();
  });

  it('should call onClick when card is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderWithProviders(<PostCard post={mockPost} viewMode="card" onClick={handleClick} />);
    
    const card = screen.getByText('Test Post Title').closest('article');
    await user.click(card);
    
    expect(handleClick).toHaveBeenCalledWith(mockPost);
  });

  it('should apply card view mode styles', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    const card = screen.getByText('Test Post Title').closest('article');
    expect(card).toHaveClass('flex-col');
  });

  it('should apply compact view mode styles', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="compact" />);
    const card = screen.getByText('Test Post Title').closest('article');
    expect(card).toHaveClass('flex-row');
  });

  it('should have hover effects', () => {
    renderWithProviders(<PostCard post={mockPost} viewMode="card" />);
    const card = screen.getByText('Test Post Title').closest('article');
    expect(card).toHaveClass('hover:shadow-lg');
  });

  it('should format large scores with k suffix', () => {
    const postWithLargeScore = {
      ...mockPost,
      score: 12500,
    };
    renderWithProviders(<PostCard post={postWithLargeScore} viewMode="card" />);
    expect(screen.getByText(/12\.5k/i)).toBeInTheDocument();
  });
});
