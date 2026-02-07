import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { redditApi } from '../app/api/redditApi';
import uiReducer from '../features/ui/uiSlice';
import searchReducer from '../features/search/searchSlice';

/**
 * Custom render function that includes Redux store provider
 * 
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.preloadedState - Initial state for the store
 * @param {Object} options.store - Custom store instance
 * @param {Object} options.renderOptions - Additional options passed to render
 * @returns {Object} - Render result with store attached
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        [redditApi.reducerPath]: redditApi.reducer,
        ui: uiReducer,
        search: searchReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(redditApi.middleware),
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 * Create a test store with optional preloaded state
 * 
 * @param {Object} preloadedState - Initial state for the store
 * @returns {Object} - Configured store instance
 */
export function setupStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      [redditApi.reducerPath]: redditApi.reducer,
      ui: uiReducer,
      search: searchReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(redditApi.middleware),
    preloadedState,
  });
}
