import { configureStore } from '@reduxjs/toolkit';
import { redditApi } from './api/redditApi';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    [redditApi.reducerPath]: redditApi.reducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(redditApi.middleware),
});
