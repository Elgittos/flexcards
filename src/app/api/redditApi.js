import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  endpoints: () => ({}), // Endpoints will be injected in feature slices
});
