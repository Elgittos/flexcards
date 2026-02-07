import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { configureStore } from '@reduxjs/toolkit';
import { redditApi } from './redditApi';

// Mock Reddit API responses
const mockSubredditPosts = {
  kind: 'Listing',
  data: {
    after: 't3_next123',
    before: null,
    children: [
      {
        kind: 't3',
        data: {
          id: 'post1',
          title: 'Test Post 1',
          author: 'testuser1',
          subreddit: 'javascript',
          score: 100,
          created_utc: 1609459200,
          num_comments: 25,
          url: 'https://example.com/post1',
          permalink: '/r/javascript/comments/post1/test_post_1/',
          thumbnail: 'https://example.com/thumb1.jpg',
          selftext: 'This is a test post',
          is_self: true,
        },
      },
      {
        kind: 't3',
        data: {
          id: 'post2',
          title: 'Test Post 2',
          author: 'testuser2',
          subreddit: 'javascript',
          score: 50,
          created_utc: 1609459300,
          num_comments: 10,
          url: 'https://example.com/post2',
          permalink: '/r/javascript/comments/post2/test_post_2/',
        },
      },
    ],
  },
};

const mockSearchResults = {
  kind: 'Listing',
  data: {
    after: 't3_search_next',
    before: null,
    children: [
      {
        kind: 't3',
        data: {
          id: 'search1',
          title: 'Search Result Post',
          author: 'searcher',
          subreddit: 'reactjs',
          score: 200,
          created_utc: 1609459400,
          num_comments: 50,
        },
      },
    ],
  },
};

const mockPostWithComments = [
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
            subreddit: 'webdev',
            score: 150,
            created_utc: 1609459200,
            num_comments: 3,
            selftext: 'Post content here',
            is_self: true,
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
            body: 'Great post!',
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
            body: 'Thanks for sharing',
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

// Setup MSW server
const server = setupServer(
  // Search endpoints must come before subreddit posts to avoid path collision
  http.get('https://www.reddit.com/r/:subreddit/search.json', () => {
    return HttpResponse.json(mockSearchResults);
  }),
  
  http.get('https://www.reddit.com/search.json', () => {
    return HttpResponse.json(mockSearchResults);
  }),
  
  http.get('https://www.reddit.com/r/:subreddit/comments/:postId.json', () => {
    return HttpResponse.json(mockPostWithComments);
  }),
  
  http.get('https://www.reddit.com/r/:subreddit/:sort.json', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    
    // Validate parameters
    if (limit && parseInt(limit) > 100) {
      return new HttpResponse(null, { status: 400 });
    }
    
    return HttpResponse.json(mockSubredditPosts);
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('redditApi', () => {
  it('should be defined', () => {
    expect(redditApi).toBeDefined();
  });

  it('should have correct reducerPath', () => {
    expect(redditApi.reducerPath).toBe('redditApi');
  });

  it('should have baseUrl set to https://www.reddit.com', () => {
    // Read the source file to verify baseUrl configuration
    const sourceFile = readFileSync(join(__dirname, 'redditApi.js'), 'utf-8');
    expect(sourceFile).toContain("baseUrl: 'https://www.reddit.com'");
  });

  it('should set User-Agent header to RedditClient/1.0', () => {
    // Read the source file to verify User-Agent header configuration
    const sourceFile = readFileSync(join(__dirname, 'redditApi.js'), 'utf-8');
    expect(sourceFile).toContain("headers.set('User-Agent', 'RedditClient/1.0')");
  });

  it('should have correct tag types array', () => {
    // Read the source file to verify tag types configuration
    const sourceFile = readFileSync(join(__dirname, 'redditApi.js'), 'utf-8');
    const expectedTagTypes = ['Posts', 'Post', 'Comments', 'Subreddit'];
    
    // Verify the tagTypes array contains all expected values
    expectedTagTypes.forEach(tagType => {
      expect(sourceFile).toContain(`'${tagType}'`);
    });
    
    // Verify tagTypes array is properly configured
    expect(sourceFile).toContain("tagTypes: ['Posts', 'Post', 'Comments', 'Subreddit']");
  });

  it('should have endpoints defined', () => {
    // Verify redditApi has endpoints property
    expect(redditApi).toHaveProperty('endpoints');
  });

  it('should be configured as RTK Query API', () => {
    expect(redditApi.reducer).toBeDefined();
    expect(redditApi.middleware).toBeDefined();
    expect(redditApi.reducerPath).toBe('redditApi');
  });
});

describe('redditApi endpoints', () => {
  let store;

  beforeAll(() => {
    // Create a fresh store for each test suite
    store = configureStore({
      reducer: {
        [redditApi.reducerPath]: redditApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(redditApi.middleware),
    });
  });

  describe('getSubredditPosts', () => {
    it('should fetch posts from a subreddit', async () => {
      const { useGetSubredditPostsQuery } = redditApi;
      expect(useGetSubredditPostsQuery).toBeDefined();

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
          sort: 'hot',
          limit: 25,
        })
      );

      expect(result.data).toBeDefined();
      expect(result.data.posts).toHaveLength(2);
      expect(result.data.posts[0]).toHaveProperty('id', 'post1');
      expect(result.data.posts[0]).toHaveProperty('title', 'Test Post 1');
      expect(result.data.after).toBe('t3_next123');
    });

    it('should handle pagination with after parameter', async () => {
      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
          sort: 'new',
          limit: 10,
          after: 't3_previous',
        })
      );

      expect(result.data).toBeDefined();
      expect(result.data.posts).toHaveLength(2);
    });

    it('should use default parameters when optional params are omitted', async () => {
      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.data).toBeDefined();
      expect(result.data.posts).toBeDefined();
    });
  });

  describe('searchPosts', () => {
    it('should search posts within a subreddit', async () => {
      const { useSearchPostsQuery } = redditApi;
      expect(useSearchPostsQuery).toBeDefined();

      const result = await store.dispatch(
        redditApi.endpoints.searchPosts.initiate({
          query: 'react hooks',
          subreddit: 'reactjs',
          limit: 25,
        })
      );

      expect(result.data).toBeDefined();
      expect(result.data.posts).toHaveLength(1);
      expect(result.data.posts[0]).toHaveProperty('id', 'search1');
      expect(result.data.posts[0]).toHaveProperty('title', 'Search Result Post');
    });

    it('should search posts globally when no subreddit specified', async () => {
      const result = await store.dispatch(
        redditApi.endpoints.searchPosts.initiate({
          query: 'javascript',
          limit: 25,
        })
      );

      expect(result.data).toBeDefined();
      expect(result.data.posts).toBeDefined();
    });

    it('should handle pagination in search results', async () => {
      const result = await store.dispatch(
        redditApi.endpoints.searchPosts.initiate({
          query: 'test',
          subreddit: 'reactjs',
          limit: 10,
          after: 't3_prev_search',
        })
      );

      expect(result.data).toBeDefined();
      expect(result.data.after).toBeDefined();
    });
  });

  describe('getPostWithComments', () => {
    it('should fetch a post with its comments', async () => {
      const { useGetPostWithCommentsQuery } = redditApi;
      expect(useGetPostWithCommentsQuery).toBeDefined();

      const result = await store.dispatch(
        redditApi.endpoints.getPostWithComments.initiate({
          subreddit: 'webdev',
          postId: 'post123',
        })
      );

      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty('post');
      expect(result.data).toHaveProperty('comments');
      expect(result.data.post).toHaveProperty('id', 'post123');
      expect(result.data.post).toHaveProperty('title', 'Post with Comments');
      expect(result.data.comments).toHaveLength(2);
      expect(result.data.comments[0]).toHaveProperty('id', 'comment1');
      expect(result.data.comments[0]).toHaveProperty('body', 'Great post!');
    });

    it('should normalize post and comment data', async () => {
      const result = await store.dispatch(
        redditApi.endpoints.getPostWithComments.initiate({
          subreddit: 'webdev',
          postId: 'post123',
        })
      );

      // Check that the post has been normalized
      expect(result.data.post).toHaveProperty('createdAt');
      expect(result.data.post).toHaveProperty('numComments');
      
      // Check that comments have been normalized
      expect(result.data.comments[0]).toHaveProperty('createdAt');
      expect(result.data.comments[0]).toHaveProperty('parentId');
    });
  });
});
