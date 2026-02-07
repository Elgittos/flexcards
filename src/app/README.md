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

### api/apiSlice.js
The RTK Query base API configuration.

**Key Features:**
- Centralized API configuration with `createApi`
- Configurable base URL via environment variable `VITE_API_BASE_URL`
- Tag-based cache invalidation system
- Automatic request/response handling

**Usage:**
Feature-specific API endpoints can inject into this base API or be defined separately:
```javascript
import { apiSlice } from '@/app/api/apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
  }),
});
```

## Environment Variables

- `VITE_API_BASE_URL` - Base URL for API requests (defaults to JSONPlaceholder for development)
