import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  transformSubredditPosts,
  transformSearchResults,
  transformPostWithComments,
} from '../../utils/redditHelpers';
import { shouldRetry, getRetryAfter } from '../../utils/errors';

/**
 * Base query with retry logic for Reddit API
 * Handles 429 rate limits and 5xx server errors with exponential backoff
 */
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://www.reddit.com',
  prepareHeaders: (headers) => {
    // Reddit requires a User-Agent header
    headers.set('User-Agent', 'RedditClient/1.0');
    return headers;
  },
});

/**
 * Base query wrapper with retry logic
 * Implements exponential backoff: 1s, 2s, 4s, 8s (max 3 retries)
 */
const baseQueryWithRetry = async (args, api, extraOptions) => {
  const maxRetries = 3;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await baseQuery(args, api, extraOptions);
    
    // If successful or no error, return result
    if (!result.error) {
      return result;
    }
    
    // Check if we should retry
    if (!shouldRetry(result.error, attempt, maxRetries)) {
      return result;
    }
    
    // Calculate delay for retry
    let delay;
    
    // For 429 errors, use Retry-After header if available
    if (result.error.status === 429 && result.meta?.response) {
      const retryAfter = getRetryAfter(result.meta.response);
      delay = retryAfter || Math.pow(2, attempt) * 1000;
    } else {
      // Exponential backoff: 1s, 2s, 4s, 8s
      delay = Math.pow(2, attempt) * 1000;
    }
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // This shouldn't be reached, but return last result as fallback
  return await baseQuery(args, api, extraOptions);
};

/**
 * Reddit API configuration using RTK Query
 * 
 * This API slice handles all communication with the Reddit API.
 * It includes proper headers and tag types for cache management.
 * 
 * Base URL: https://www.reddit.com
 * Uses raw_json=1 to prevent HTML encoding
 * 
 * @see https://www.reddit.com/dev/api
 */
export const redditApi = createApi({
  reducerPath: 'redditApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Posts', 'Post', 'Comments', 'Subreddit'],
  endpoints: (builder) => ({
    /**
     * Get posts from a subreddit
     * @param {Object} params - Query parameters
     * @param {string} params.subreddit - Subreddit name
     * @param {string} [params.sort='hot'] - Sort option: hot, new, top, rising
     * @param {number} [params.limit=25] - Number of posts to fetch (max 100)
     * @param {string} [params.after] - Pagination cursor for next page
     * @returns {Object} Transformed posts with pagination info
     */
    getSubredditPosts: builder.query({
      query: ({ subreddit, sort = 'hot', limit = 25, after }) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          raw_json: '1',
        });
        
        if (after) {
          params.append('after', after);
        }
        
        return `/r/${subreddit}/${sort}.json?${params.toString()}`;
      },
      transformResponse: transformSubredditPosts,
      providesTags: (result, error, { subreddit }) => [
        { type: 'Posts', id: subreddit },
      ],
    }),

    /**
     * Search for posts
     * @param {Object} params - Query parameters
     * @param {string} params.query - Search query
     * @param {string} [params.subreddit] - Subreddit to search in (optional, searches globally if omitted)
     * @param {number} [params.limit=25] - Number of results to fetch
     * @param {string} [params.after] - Pagination cursor for next page
     * @param {string} [params.sort] - Sort option: relevance, hot, top, new, comments
     * @param {string} [params.t] - Time filter: hour, day, week, month, year, all
     * @returns {Object} Transformed search results with pagination info
     */
    searchPosts: builder.query({
      query: ({ query, subreddit, limit = 25, after, sort, t }) => {
        const params = new URLSearchParams({
          q: query,
          limit: limit.toString(),
          raw_json: '1',
        });
        
        if (after) {
          params.append('after', after);
        }
        
        if (sort) {
          params.append('sort', sort);
        }
        
        if (t) {
          params.append('t', t);
        }
        
        // If subreddit is provided, search within that subreddit
        if (subreddit) {
          params.append('restrict_sr', 'on');
          return `/r/${subreddit}/search.json?${params.toString()}`;
        }
        
        // Otherwise, search globally
        return `/search.json?${params.toString()}`;
      },
      transformResponse: transformSearchResults,
      providesTags: ['Posts'],
    }),

    /**
     * Get a post with its comments
     * @param {Object} params - Query parameters
     * @param {string} params.subreddit - Subreddit name
     * @param {string} params.postId - Post ID
     * @returns {Object} Object with post and comments array
     */
    getPostWithComments: builder.query({
      query: ({ subreddit, postId }) => {
        const params = new URLSearchParams({
          raw_json: '1',
        });
        
        return `/r/${subreddit}/comments/${postId}.json?${params.toString()}`;
      },
      transformResponse: transformPostWithComments,
      providesTags: (result, error, { postId }) => [
        { type: 'Post', id: postId },
        { type: 'Comments', id: postId },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetSubredditPostsQuery,
  useSearchPostsQuery,
  useGetPostWithCommentsQuery,
} = redditApi;
