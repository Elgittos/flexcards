# App Configuration

This directory contains the core application configuration files.

## Files

### store.js
The Redux store configuration using Redux Toolkit's `configureStore`.

**Key Features:**
- Centralized state management
- Combines all feature reducers
- Configures RTK Query middleware for API caching
- Includes Redux DevTools integration (automatic in development)

**Usage:**
```javascript
import { store } from './app/store';
// Store is provided to the app in main.jsx via <Provider>
```

### api/redditApi.js
The RTK Query API configuration for Reddit API integration.

**Key Features:**
- Centralized Reddit API configuration with `createApi`
- Base URL: `https://www.reddit.com`
- Tag-based cache invalidation system with types: Posts, Post, Comments, Subreddit
- User-Agent header automatically set to 'RedditClient/1.0'
- Automatic request/response handling

**Usage:**
Feature-specific endpoints can inject into this base API:
```javascript
import { redditApi } from '@/app/api/redditApi';

export const postsApi = redditApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (subreddit) => `/${subreddit}.json`,
      providesTags: ['Posts'],
    }),
  }),
});
```
