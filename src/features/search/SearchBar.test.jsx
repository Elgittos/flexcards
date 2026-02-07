import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchBar from './SearchBar';
import searchReducer from './searchSlice';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      search: searchReducer,
    },
    preloadedState: {
      search: {
        activeQuery: '',
        searchHistory: [],
        subredditFilter: 'all',
        timeFilter: 'all',
        sortFilter: 'relevance',
        isSearching: false,
        ...initialState,
      },
    },
  });
};

const renderWithProvider = (component, store) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('SearchBar', () => {
  it('should render search input', () => {
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    expect(screen.getByPlaceholderText(/search reddit/i)).toBeInTheDocument();
  });

  it('should render search icon', () => {
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    const searchIcon = screen.getByRole('img', { hidden: true });
    expect(searchIcon).toBeInTheDocument();
  });

  it('should update input value when typing', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const input = screen.getByPlaceholderText(/search reddit/i);
    await user.type(input, 'react hooks');
    
    expect(input).toHaveValue('react hooks');
  });

  it('should dispatch setActiveQuery and addToSearchHistory when submitting', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const input = screen.getByPlaceholderText(/search reddit/i);
    await user.type(input, 'react hooks');
    await user.keyboard('{Enter}');
    
    const state = store.getState();
    expect(state.search.activeQuery).toBe('react hooks');
    expect(state.search.searchHistory).toContain('react hooks');
    expect(state.search.isSearching).toBe(true);
  });

  it('should dispatch actions when clicking search button', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const input = screen.getByPlaceholderText(/search reddit/i);
    await user.type(input, 'javascript');
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    await user.click(searchButton);
    
    const state = store.getState();
    expect(state.search.activeQuery).toBe('javascript');
    expect(state.search.searchHistory).toContain('javascript');
    expect(state.search.isSearching).toBe(true);
  });

  it('should show clear button when input has value', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const input = screen.getByPlaceholderText(/search reddit/i);
    await user.type(input, 'react');
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when input is empty', () => {
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const clearButton = screen.queryByRole('button', { name: /clear/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should clear input and reset search when clicking clear button', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const input = screen.getByPlaceholderText(/search reddit/i);
    await user.type(input, 'react');
    await user.keyboard('{Enter}');
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);
    
    expect(input).toHaveValue('');
    const state = store.getState();
    expect(state.search.activeQuery).toBe('');
    expect(state.search.isSearching).toBe(false);
  });

  it('should not submit with empty query', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const input = screen.getByPlaceholderText(/search reddit/i);
    await user.click(input);
    await user.keyboard('{Enter}');
    
    const state = store.getState();
    expect(state.search.activeQuery).toBe('');
    expect(state.search.isSearching).toBe(false);
  });

  it('should trim whitespace from query before submitting', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const input = screen.getByPlaceholderText(/search reddit/i);
    await user.type(input, '  react hooks  ');
    await user.keyboard('{Enter}');
    
    const state = store.getState();
    expect(state.search.activeQuery).toBe('react hooks');
  });

  it('should have focus styles on input', () => {
    const store = createMockStore();
    renderWithProvider(<SearchBar />, store);
    
    const input = screen.getByPlaceholderText(/search reddit/i);
    expect(input).toHaveClass('focus:outline-none');
  });
});
