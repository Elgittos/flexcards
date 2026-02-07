import { configureStore } from '@reduxjs/toolkit';
import { redditApi } from './api/redditApi';
import uiReducer from '../features/ui/uiSlice';
import searchReducer from '../features/search/searchSlice';

export const store = configureStore({
  reducer: {
    [redditApi.reducerPath]: redditApi.reducer,
    ui: uiReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(redditApi.middleware),
});
