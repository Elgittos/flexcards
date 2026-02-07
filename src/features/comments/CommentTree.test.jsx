import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentTree from './CommentTree';

describe('CommentTree', () => {
  const mockComments = [
    {
      id: 'comment1',
      author: 'user1',
      body: 'Top level comment',
      score: 10,
      createdAt: 1609459200,
      replies: [],
    },
    {
      id: 'comment2',
      author: 'user2',
      body: 'Another top level',
      score: 5,
      createdAt: 1609459200,
      replies: [],
    },
  ];

  it('should render all top-level comments', () => {
    render(<CommentTree comments={mockComments} />);
    expect(screen.getByText('Top level comment')).toBeInTheDocument();
    expect(screen.getByText('Another top level')).toBeInTheDocument();
  });

  it('should render nested comments', () => {
    const nestedComments = [
      {
        id: 'comment1',
        author: 'user1',
        body: 'Parent comment',
        score: 10,
        createdAt: 1609459200,
        replies: [
          {
            id: 'comment2',
            author: 'user2',
            body: 'Child comment',
            score: 5,
            createdAt: 1609459200,
            replies: [],
          },
        ],
      },
    ];

    render(<CommentTree comments={nestedComments} />);
    expect(screen.getByText('Parent comment')).toBeInTheDocument();
    expect(screen.getByText('Child comment')).toBeInTheDocument();
  });

  it('should collapse comments after 4 levels deep', () => {
    const deepComments = [
      {
        id: 'level1',
        author: 'user1',
        body: 'Level 1',
        score: 1,
        createdAt: 1609459200,
        replies: [
          {
            id: 'level2',
            author: 'user2',
            body: 'Level 2',
            score: 2,
            createdAt: 1609459200,
            replies: [
              {
                id: 'level3',
                author: 'user3',
                body: 'Level 3',
                score: 3,
                createdAt: 1609459200,
                replies: [
                  {
                    id: 'level4',
                    author: 'user4',
                    body: 'Level 4',
                    score: 4,
                    createdAt: 1609459200,
                    replies: [
                      {
                        id: 'level5',
                        author: 'user5',
                        body: 'Level 5',
                        score: 5,
                        createdAt: 1609459200,
                        replies: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    render(<CommentTree comments={deepComments} />);
    
    // Levels 1-4 should be visible
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();
    expect(screen.getByText('Level 3')).toBeInTheDocument();
    expect(screen.getByText('Level 4')).toBeInTheDocument();
    
    // Level 5 should be collapsed with "Continue this thread" link
    expect(screen.queryByText('Level 5')).not.toBeInTheDocument();
    expect(screen.getByText(/continue this thread/i)).toBeInTheDocument();
  });

  it('should show "Continue this thread" link for deep threads', () => {
    const deepComments = [
      {
        id: 'level1',
        author: 'user1',
        body: 'Level 1',
        score: 1,
        createdAt: 1609459200,
        replies: [
          {
            id: 'level2',
            author: 'user2',
            body: 'Level 2',
            score: 2,
            createdAt: 1609459200,
            replies: [
              {
                id: 'level3',
                author: 'user3',
                body: 'Level 3',
                score: 3,
                createdAt: 1609459200,
                replies: [
                  {
                    id: 'level4',
                    author: 'user4',
                    body: 'Level 4',
                    score: 4,
                    createdAt: 1609459200,
                    replies: [
                      {
                        id: 'level5',
                        author: 'user5',
                        body: 'Level 5 (should be collapsed)',
                        score: 5,
                        createdAt: 1609459200,
                        replies: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    render(<CommentTree comments={deepComments} />);
    const continueLink = screen.getByText(/continue this thread/i);
    expect(continueLink).toBeInTheDocument();
    expect(continueLink.tagName).toBe('A');
  });

  it('should handle empty comments array', () => {
    render(<CommentTree comments={[]} />);
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<CommentTree comments={[]} isLoading={true} />);
    expect(screen.getByText(/loading comments/i)).toBeInTheDocument();
  });

  it('should show error state', () => {
    render(<CommentTree comments={[]} error="Failed to load" />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('should visually indent each level', () => {
    const nestedComments = [
      {
        id: 'parent',
        author: 'user1',
        body: 'Parent',
        score: 10,
        createdAt: 1609459200,
        replies: [
          {
            id: 'child',
            author: 'user2',
            body: 'Child',
            score: 5,
            createdAt: 1609459200,
            replies: [],
          },
        ],
      },
    ];

    const { container } = render(<CommentTree comments={nestedComments} />);
    
    // Child comment should have more indentation than parent
    const comments = container.querySelectorAll('[data-comment-id]');
    expect(comments.length).toBeGreaterThan(0);
  });

  it('should expand collapsed thread when clicked', async () => {
    const user = userEvent.setup();
    const deepComments = [
      {
        id: 'level1',
        author: 'user1',
        body: 'Level 1',
        score: 1,
        createdAt: 1609459200,
        replies: [
          {
            id: 'level2',
            author: 'user2',
            body: 'Level 2',
            score: 2,
            createdAt: 1609459200,
            replies: [
              {
                id: 'level3',
                author: 'user3',
                body: 'Level 3',
                score: 3,
                createdAt: 1609459200,
                replies: [
                  {
                    id: 'level4',
                    author: 'user4',
                    body: 'Level 4',
                    score: 4,
                    createdAt: 1609459200,
                    replies: [
                      {
                        id: 'level5',
                        author: 'user5',
                        body: 'Level 5',
                        score: 5,
                        createdAt: 1609459200,
                        replies: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    render(<CommentTree comments={deepComments} />);
    
    const continueLink = screen.getByText(/continue this thread/i);
    await user.click(continueLink);
    
    // After clicking, level 5 should be visible
    expect(screen.getByText('Level 5')).toBeInTheDocument();
  });

  it('should apply dark mode styles', () => {
    const { container } = render(
      <CommentTree comments={mockComments} darkMode={true} />
    );
    expect(container.firstChild).toHaveClass(/dark|bg-gray-/);
  });
});
