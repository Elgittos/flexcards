import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * RTK Query base API configuration
 * 
 * This is the foundation for all API endpoints in the application.
 * Individual feature-based API slices can inject endpoints into this base API.
 * 
 * @see https://redux-toolkit.js.org/rtk-query/overview
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    prepareHeaders: (headers) => {
      // Add any default headers here (e.g., authentication tokens)
      // const token = getState().auth.token;
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  tagTypes: ['Example', 'User', 'Post'], // Define tag types for cache invalidation
  endpoints: (builder) => ({
    // Endpoints can be defined here or injected from feature-specific slices
    // Example:
    // getExample: builder.query({
    //   query: (id) => `/example/${id}`,
    //   providesTags: ['Example'],
    // }),
  }),
});

// Export hooks for usage in components
// Example: export const { useGetExampleQuery } = apiSlice;
