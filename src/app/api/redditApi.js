import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  transformSubredditPosts,
  transformSearchResults,
  transformPostWithComments,
} from '../../utils/redditHelpers';

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
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.reddit.com',
    prepareHeaders: (headers) => {
      // Reddit requires a User-Agent header
      headers.set('User-Agent', 'RedditClient/1.0');
      return headers;
    },
  }),
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
     * @returns {Object} Transformed search results with pagination info
     */
    searchPosts: builder.query({
      query: ({ query, subreddit, limit = 25, after }) => {
        const params = new URLSearchParams({
          q: query,
          limit: limit.toString(),
          raw_json: '1',
        });
        
        if (after) {
          params.append('after', after);
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
