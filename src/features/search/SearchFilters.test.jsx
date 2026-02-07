import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchFilters from './SearchFilters';
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

describe('SearchFilters', () => {
  it('should render time filter dropdown', () => {
    const store = createMockStore();
    renderWithProvider(<SearchFilters />, store);
    expect(screen.getByLabelText(/time range/i)).toBeInTheDocument();
  });

  it('should render sort filter dropdown', () => {
    const store = createMockStore();
    renderWithProvider(<SearchFilters />, store);
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
  });

  it('should show current time filter value', () => {
    const store = createMockStore({ timeFilter: 'week' });
    renderWithProvider(<SearchFilters />, store);
    const select = screen.getByLabelText(/time range/i);
    expect(select).toHaveValue('week');
  });

  it('should show current sort filter value', () => {
    const store = createMockStore({ sortFilter: 'top' });
    renderWithProvider(<SearchFilters />, store);
    const select = screen.getByLabelText(/sort by/i);
    expect(select).toHaveValue('top');
  });

  it('should dispatch setTimeFilter when time filter changes', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchFilters />, store);
    
    const timeFilterSelect = screen.getByLabelText(/time range/i);
    await user.selectOptions(timeFilterSelect, 'day');
    
    const state = store.getState();
    expect(state.search.timeFilter).toBe('day');
  });

  it('should dispatch setSortFilter when sort filter changes', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    renderWithProvider(<SearchFilters />, store);
    
    const sortFilterSelect = screen.getByLabelText(/sort by/i);
    await user.selectOptions(sortFilterSelect, 'new');
    
    const state = store.getState();
    expect(state.search.sortFilter).toBe('new');
  });

  it('should have all time range options', () => {
    const store = createMockStore();
    renderWithProvider(<SearchFilters />, store);
    
    const timeOptions = ['all', 'hour', 'day', 'week', 'month', 'year'];
    timeOptions.forEach(option => {
      expect(screen.getByRole('option', { name: new RegExp(option, 'i') })).toBeInTheDocument();
    });
  });

  it('should have all sort options', () => {
    const store = createMockStore();
    renderWithProvider(<SearchFilters />, store);
    
    const sortOptions = ['relevance', 'hot', 'top', 'new', 'comments'];
    sortOptions.forEach(option => {
      expect(screen.getByRole('option', { name: new RegExp(option, 'i') })).toBeInTheDocument();
    });
  });

  it('should render clear filters button', () => {
    const store = createMockStore();
    renderWithProvider(<SearchFilters />, store);
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('should dispatch clearFilters when clear button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore({
      timeFilter: 'week',
      sortFilter: 'top',
    });
    renderWithProvider(<SearchFilters />, store);
    
    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(clearButton);
    
    const state = store.getState();
    expect(state.search.timeFilter).toBe('all');
    expect(state.search.sortFilter).toBe('relevance');
  });

  it('should have proper styling for accessibility', () => {
    const store = createMockStore();
    renderWithProvider(<SearchFilters />, store);
    
    const timeFilter = screen.getByLabelText(/time range/i);
    const sortFilter = screen.getByLabelText(/sort by/i);
    
    expect(timeFilter).toHaveClass('border');
    expect(sortFilter).toHaveClass('border');
  });
});
