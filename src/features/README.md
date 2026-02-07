# Features

This directory contains feature-based modules using Redux Toolkit slices.

## Structure

Each feature should be organized in its own subdirectory with the following pattern:

```
features/
  exampleFeature/
    exampleFeatureSlice.js    # Redux slice (state, reducers, actions)
    exampleFeatureAPI.js      # RTK Query endpoints (optional)
    components/               # Feature-specific components (optional)
    hooks/                    # Feature-specific hooks (optional)
```

## Creating a New Feature Slice

### Standard Redux Slice (Local State)

Use `createSlice` for managing local application state:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const featureSlice = createSlice({
  name: 'featureName',
  initialState: { /* ... */ },
  reducers: {
    // Synchronous actions
    actionName: (state, action) => {
      // Immer allows direct state mutations
      state.property = action.payload;
    },
  },
});

export const { actionName } = featureSlice.actions;
export default featureSlice.reducer;
```

### RTK Query API Slice (Server State)

For server data fetching and caching, inject endpoints into the base API:

```javascript
import { apiSlice } from '@/app/api/apiSlice';

export const featureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => '/items',
      providesTags: ['Item'],
    }),
    createItem: builder.mutation({
      query: (item) => ({
        url: '/items',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Item'],
    }),
  }),
});

export const { useGetItemsQuery, useCreateItemMutation } = featureApi;
```

## Example

See `example/exampleSlice.js` for a reference implementation with common patterns.

## Best Practices

- Keep slices focused on a single feature or domain
- Use RTK Query for server state, createSlice for client state
- Export selectors alongside actions for easier consumption
- Colocate feature-specific components with the slice when appropriate
