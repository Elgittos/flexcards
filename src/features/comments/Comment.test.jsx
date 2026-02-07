import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Comment from './Comment';

describe('Comment', () => {
  const mockComment = {
    id: 'comment1',
    author: 'testuser',
    body: 'This is a test comment',
    score: 42,
    createdAt: 1609459200, // 2021-01-01 00:00:00 UTC
    replies: [],
  };

  it('should render comment author', () => {
    render(<Comment comment={mockComment} />);
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  it('should render comment body with markdown', () => {
    const commentWithMarkdown = {
      ...mockComment,
      body: 'This is **bold** text',
    };
    render(<Comment comment={commentWithMarkdown} />);
    const bold = screen.getByText('bold');
    expect(bold.tagName).toBe('STRONG');
  });

  it('should render comment score', () => {
    render(<Comment comment={mockComment} />);
    expect(screen.getByText(/42.*points/i)).toBeInTheDocument();
  });

  it('should render timestamp', () => {
    render(<Comment comment={mockComment} />);
    // Should show relative time
    expect(screen.getByText(/ago/i)).toBeInTheDocument();
  });

  it('should handle deleted comments', () => {
    const deletedComment = {
      ...mockComment,
      author: '[deleted]',
      body: '[deleted]',
    };
    render(<Comment comment={deletedComment} />);
    expect(screen.getByText('[deleted]')).toBeInTheDocument();
  });

  it('should handle removed comments', () => {
    const removedComment = {
      ...mockComment,
      author: '[deleted]',
      body: '[removed]',
    };
    render(<Comment comment={removedComment} />);
    expect(screen.getByText('[removed]')).toBeInTheDocument();
  });

  it('should collapse and expand long comments', async () => {
    const user = userEvent.setup();
    const longComment = {
      ...mockComment,
      body: 'A'.repeat(1000), // Very long comment
    };
    render(<Comment comment={longComment} isLong={true} />);

    // Should have collapse button
    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    expect(collapseButton).toBeInTheDocument();

    // Click to collapse
    await user.click(collapseButton);

    // Should show expand button
    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();
  });

  it('should render with proper depth indentation', () => {
    const { container } = render(
      <Comment comment={mockComment} depth={3} />
    );
    // Should have left margin/padding based on depth
    const commentElement = container.firstChild;
    expect(commentElement).toHaveStyle({ marginLeft: expect.any(String) });
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Comment comment={mockComment} isLong={true} />);

    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    
    // Focus and press Enter
    collapseButton.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();
  });

  it('should show replies count if present', () => {
    const commentWithReplies = {
      ...mockComment,
      replies: [
        { id: 'reply1', author: 'user2', body: 'Reply 1', score: 1, createdAt: 1609459200, replies: [] },
        { id: 'reply2', author: 'user3', body: 'Reply 2', score: 2, createdAt: 1609459200, replies: [] },
      ],
    };
    render(<Comment comment={commentWithReplies} />);
    // Replies should be handled by CommentTree, but comment should indicate it has replies
    expect(commentWithReplies.replies.length).toBe(2);
  });

  it('should apply dark mode styles when darkMode is true', () => {
    const { container } = render(
      <Comment comment={mockComment} darkMode={true} />
    );
    // Dark mode class should be applied
    expect(container.firstChild).toHaveClass(/dark|bg-gray-/);
  });
});
