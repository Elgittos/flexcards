import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import exampleReducer from '../features/example/exampleSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    example: exampleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
