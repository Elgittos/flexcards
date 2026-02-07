import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { redditApi } from './redditApi';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('redditApi retry logic', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [redditApi.reducerPath]: redditApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(redditApi.middleware),
    });
  });

  describe('429 Rate Limit Errors', () => {
    it('should retry on 429 error', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          if (attemptCount < 2) {
            return new HttpResponse(null, { 
              status: 429,
              headers: { 'Retry-After': '1' }
            });
          }
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
          sort: 'hot',
        })
      );

      expect(result.isSuccess).toBe(true);
      expect(attemptCount).toBeGreaterThan(1);
    });

    it('should use Retry-After header for delay', async () => {
      vi.useFakeTimers();
      let attemptCount = 0;
      const retryAfterSeconds = 2;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          if (attemptCount === 1) {
            return new HttpResponse(null, { 
              status: 429,
              headers: { 'Retry-After': retryAfterSeconds.toString() }
            });
          }
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const promise = store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      // Should wait for retry delay
      await vi.advanceTimersByTimeAsync(retryAfterSeconds * 1000);
      
      const result = await promise;
      expect(result.isSuccess).toBe(true);
      
      vi.useRealTimers();
    });

    it('should fail after max retries on 429', async () => {
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          return new HttpResponse(null, { 
            status: 429,
            headers: { 'Retry-After': '1' }
          });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.isError).toBe(true);
      expect(result.error.status).toBe(429);
    });
  });

  describe('5xx Server Errors', () => {
    it('should retry on 500 error', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          if (attemptCount < 2) {
            return new HttpResponse(null, { status: 500 });
          }
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.isSuccess).toBe(true);
      expect(attemptCount).toBeGreaterThan(1);
    });

    it('should retry on 502 Bad Gateway', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          if (attemptCount < 2) {
            return new HttpResponse(null, { status: 502 });
          }
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.isSuccess).toBe(true);
      expect(attemptCount).toBeGreaterThan(1);
    });

    it('should retry on 503 Service Unavailable', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          if (attemptCount < 2) {
            return new HttpResponse(null, { status: 503 });
          }
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.isSuccess).toBe(true);
      expect(attemptCount).toBeGreaterThan(1);
    });
  });

  describe('4xx Client Errors (should NOT retry)', () => {
    it('should NOT retry on 404', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/nonexistent/hot.json', () => {
          attemptCount++;
          return new HttpResponse(null, { status: 404 });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'nonexistent',
        })
      );

      expect(result.isError).toBe(true);
      expect(attemptCount).toBe(1); // Should not retry
    });

    it('should NOT retry on 400 Bad Request', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          return new HttpResponse(null, { status: 400 });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.isError).toBe(true);
      expect(attemptCount).toBe(1);
    });

    it('should NOT retry on 401 Unauthorized', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          return new HttpResponse(null, { status: 401 });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.isError).toBe(true);
      expect(attemptCount).toBe(1);
    });
  });

  describe('Exponential Backoff', () => {
    it('should use exponential backoff for retries', async () => {
      vi.useFakeTimers();
      const delays = [];
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          const now = Date.now();
          if (attemptCount > 1) {
            delays.push(now);
          }
          
          if (attemptCount < 4) {
            return new HttpResponse(null, { status: 500 });
          }
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const promise = store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      // Advance through retries
      for (let i = 0; i < 3; i++) {
        await vi.advanceTimersByTimeAsync(Math.pow(2, i) * 1000);
      }
      
      const result = await promise;
      expect(result.isSuccess).toBe(true);
      
      vi.useRealTimers();
    });

    it('should cap backoff at maximum delay', async () => {
      vi.useFakeTimers();
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          if (attemptCount < 4) {
            return new HttpResponse(null, { status: 500 });
          }
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const promise = store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      // Max backoff should be 8 seconds (2^3)
      await vi.advanceTimersByTimeAsync(8000);
      
      const result = await promise;
      expect(result.isSuccess).toBe(true);
      
      vi.useRealTimers();
    });
  });

  describe('Network Errors', () => {
    it('should retry on network error', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          if (attemptCount < 2) {
            return HttpResponse.error();
          }
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.isSuccess).toBe(true);
      expect(attemptCount).toBeGreaterThan(1);
    });
  });

  describe('Successful Requests', () => {
    it('should not retry on successful request', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://www.reddit.com/r/javascript/hot.json', () => {
          attemptCount++;
          return HttpResponse.json({
            data: {
              children: [],
              after: null,
              before: null,
            },
          });
        })
      );

      const result = await store.dispatch(
        redditApi.endpoints.getSubredditPosts.initiate({
          subreddit: 'javascript',
        })
      );

      expect(result.isSuccess).toBe(true);
      expect(attemptCount).toBe(1); // Only one attempt
    });
  });
});
