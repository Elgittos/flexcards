import { describe, it, expect } from 'vitest';
import {
  normalizePost,
  normalizeComment,
  transformSubredditPosts,
  transformSearchResults,
  transformPostWithComments,
  buildCommentTree,
} from './redditHelpers';

describe('redditHelpers', () => {
  describe('normalizePost', () => {
    it('should normalize a Reddit post object', () => {
      const redditPost = {
        kind: 't3',
        data: {
          id: 'abc123',
          title: 'Test Post',
          author: 'testuser',
          subreddit: 'javascript',
          score: 42,
          created_utc: 1609459200,
          num_comments: 10,
          url: 'https://reddit.com/r/javascript/comments/abc123',
          permalink: '/r/javascript/comments/abc123/test_post/',
          thumbnail: 'https://example.com/thumb.jpg',
          selftext: 'Post content',
          is_self: true,
        },
      };

      const normalized = normalizePost(redditPost);

      expect(normalized).toEqual({
        id: 'abc123',
        title: 'Test Post',
        author: 'testuser',
        subreddit: 'javascript',
        score: 42,
        createdAt: 1609459200,
        numComments: 10,
        url: 'https://reddit.com/r/javascript/comments/abc123',
        permalink: '/r/javascript/comments/abc123/test_post/',
        thumbnail: 'https://example.com/thumb.jpg',
        content: 'Post content',
        isSelf: true,
      });
    });

    it('should handle missing optional fields', () => {
      const minimalPost = {
        kind: 't3',
        data: {
          id: 'xyz789',
          title: 'Minimal Post',
          author: 'user2',
          subreddit: 'test',
          score: 0,
          created_utc: 1609459200,
          num_comments: 0,
        },
      };

      const normalized = normalizePost(minimalPost);

      expect(normalized).toHaveProperty('id', 'xyz789');
      expect(normalized).toHaveProperty('title', 'Minimal Post');
      expect(normalized).toHaveProperty('thumbnail');
      expect(normalized).toHaveProperty('content');
    });
  });

  describe('normalizeComment', () => {
    it('should normalize a Reddit comment object', () => {
      const redditComment = {
        kind: 't1',
        data: {
          id: 'comment123',
          author: 'commenter',
          body: 'Great post!',
          score: 5,
          created_utc: 1609459300,
          parent_id: 't3_abc123',
          replies: '',
        },
      };

      const normalized = normalizeComment(redditComment);

      expect(normalized).toEqual({
        id: 'comment123',
        author: 'commenter',
        body: 'Great post!',
        score: 5,
        createdAt: 1609459300,
        parentId: 't3_abc123',
        replies: [],
      });
    });

    it('should handle nested replies', () => {
      const commentWithReplies = {
        kind: 't1',
        data: {
          id: 'parent',
          author: 'user1',
          body: 'Parent comment',
          score: 10,
          created_utc: 1609459200,
          parent_id: 't3_post',
          replies: {
            kind: 'Listing',
            data: {
              children: [
                {
                  kind: 't1',
                  data: {
                    id: 'child',
                    author: 'user2',
                    body: 'Reply',
                    score: 3,
                    created_utc: 1609459300,
                    parent_id: 't1_parent',
                    replies: '',
                  },
                },
              ],
            },
          },
        },
      };

      const normalized = normalizeComment(commentWithReplies);

      expect(normalized.replies).toHaveLength(1);
      expect(normalized.replies[0]).toHaveProperty('id', 'child');
      expect(normalized.replies[0]).toHaveProperty('body', 'Reply');
    });
  });

  describe('transformSubredditPosts', () => {
    it('should transform Reddit listing response to normalized posts array', () => {
      const response = {
        kind: 'Listing',
        data: {
          after: 't3_next',
          before: null,
          children: [
            {
              kind: 't3',
              data: {
                id: 'post1',
                title: 'First Post',
                author: 'user1',
                subreddit: 'javascript',
                score: 100,
                created_utc: 1609459200,
                num_comments: 20,
              },
            },
            {
              kind: 't3',
              data: {
                id: 'post2',
                title: 'Second Post',
                author: 'user2',
                subreddit: 'javascript',
                score: 50,
                created_utc: 1609459300,
                num_comments: 5,
              },
            },
          ],
        },
      };

      const transformed = transformSubredditPosts(response);

      expect(transformed).toHaveProperty('posts');
      expect(transformed).toHaveProperty('after', 't3_next');
      expect(transformed.posts).toHaveLength(2);
      expect(transformed.posts[0]).toHaveProperty('id', 'post1');
      expect(transformed.posts[1]).toHaveProperty('id', 'post2');
    });

    it('should handle empty listing', () => {
      const emptyResponse = {
        kind: 'Listing',
        data: {
          after: null,
          before: null,
          children: [],
        },
      };

      const transformed = transformSubredditPosts(emptyResponse);

      expect(transformed.posts).toHaveLength(0);
      expect(transformed.after).toBeNull();
    });
  });

  describe('transformSearchResults', () => {
    it('should transform search results', () => {
      const response = {
        kind: 'Listing',
        data: {
          after: 't3_search_next',
          children: [
            {
              kind: 't3',
              data: {
                id: 'search1',
                title: 'Search Result',
                author: 'searcher',
                subreddit: 'all',
                score: 200,
                created_utc: 1609459200,
                num_comments: 50,
              },
            },
          ],
        },
      };

      const transformed = transformSearchResults(response);

      expect(transformed.posts).toHaveLength(1);
      expect(transformed.posts[0]).toHaveProperty('id', 'search1');
      expect(transformed).toHaveProperty('after', 't3_search_next');
    });
  });

  describe('transformPostWithComments', () => {
    it('should transform post and comments array response', () => {
      const response = [
        {
          kind: 'Listing',
          data: {
            children: [
              {
                kind: 't3',
                data: {
                  id: 'post123',
                  title: 'Post with Comments',
                  author: 'poster',
                  subreddit: 'test',
                  score: 100,
                  created_utc: 1609459200,
                  num_comments: 2,
                  selftext: 'Post body',
                },
              },
            ],
          },
        },
        {
          kind: 'Listing',
          data: {
            children: [
              {
                kind: 't1',
                data: {
                  id: 'comment1',
                  author: 'commenter1',
                  body: 'First comment',
                  score: 10,
                  created_utc: 1609459300,
                  parent_id: 't3_post123',
                  replies: '',
                },
              },
              {
                kind: 't1',
                data: {
                  id: 'comment2',
                  author: 'commenter2',
                  body: 'Second comment',
                  score: 5,
                  created_utc: 1609459400,
                  parent_id: 't3_post123',
                  replies: '',
                },
              },
            ],
          },
        },
      ];

      const transformed = transformPostWithComments(response);

      expect(transformed).toHaveProperty('post');
      expect(transformed).toHaveProperty('comments');
      expect(transformed.post).toHaveProperty('id', 'post123');
      expect(transformed.comments).toHaveLength(2);
      expect(transformed.comments[0]).toHaveProperty('id', 'comment1');
      expect(transformed.comments[1]).toHaveProperty('id', 'comment2');
    });

    it('should handle post with no comments', () => {
      const response = [
        {
          kind: 'Listing',
          data: {
            children: [
              {
                kind: 't3',
                data: {
                  id: 'lonely_post',
                  title: 'No Comments',
                  author: 'lonely',
                  subreddit: 'test',
                  score: 1,
                  created_utc: 1609459200,
                  num_comments: 0,
                },
              },
            ],
          },
        },
        {
          kind: 'Listing',
          data: {
            children: [],
          },
        },
      ];

      const transformed = transformPostWithComments(response);

      expect(transformed.post).toHaveProperty('id', 'lonely_post');
      expect(transformed.comments).toHaveLength(0);
    });
  });

  describe('buildCommentTree', () => {
    it('should build a flat comment tree from listing', () => {
      const listing = {
        kind: 'Listing',
        data: {
          children: [
            {
              kind: 't1',
              data: {
                id: 'c1',
                author: 'user1',
                body: 'Comment 1',
                score: 5,
                created_utc: 1609459200,
                parent_id: 't3_post',
                replies: '',
              },
            },
          ],
        },
      };

      const tree = buildCommentTree(listing);

      expect(tree).toHaveLength(1);
      expect(tree[0]).toHaveProperty('id', 'c1');
    });

    it('should filter out "more" comments placeholder', () => {
      const listing = {
        kind: 'Listing',
        data: {
          children: [
            {
              kind: 't1',
              data: {
                id: 'c1',
                author: 'user1',
                body: 'Real comment',
                score: 5,
                created_utc: 1609459200,
                parent_id: 't3_post',
                replies: '',
              },
            },
            {
              kind: 'more',
              data: {
                id: 'more1',
                children: ['c2', 'c3'],
              },
            },
          ],
        },
      };

      const tree = buildCommentTree(listing);

      expect(tree).toHaveLength(1);
      expect(tree[0]).toHaveProperty('id', 'c1');
    });
  });
});
