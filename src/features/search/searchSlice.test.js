import { describe, it, expect } from 'vitest';
import searchReducer, {
  setActiveQuery,
  addToSearchHistory,
  clearSearchHistory,
  setSubredditFilter,
  setTimeFilter,
  setSortFilter,
  setIsSearching,
  clearFilters,
  selectActiveQuery,
  selectSearchHistory,
  selectSubredditFilter,
  selectTimeFilter,
  selectSortFilter,
  selectIsSearching,
  selectSearchFilters,
} from './searchSlice';

describe('searchSlice', () => {
  const initialState = {
    activeQuery: '',
    searchHistory: [],
    subredditFilter: 'all',
    timeFilter: 'all',
    sortFilter: 'relevance',
    isSearching: false,
  };

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(searchReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setActiveQuery', () => {
      const actual = searchReducer(initialState, setActiveQuery('react hooks'));
      expect(actual.activeQuery).toBe('react hooks');
    });

    it('should handle addToSearchHistory', () => {
      const actual = searchReducer(initialState, addToSearchHistory('react hooks'));
      expect(actual.searchHistory).toEqual(['react hooks']);
    });

    it('should not add duplicate queries to search history', () => {
      const stateWithHistory = {
        ...initialState,
        searchHistory: ['react hooks', 'javascript'],
      };
      const actual = searchReducer(stateWithHistory, addToSearchHistory('react hooks'));
      expect(actual.searchHistory).toEqual(['react hooks', 'javascript']);
    });

    it('should limit search history to 10 items', () => {
      const stateWithHistory = {
        ...initialState,
        searchHistory: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'],
      };
      const actual = searchReducer(stateWithHistory, addToSearchHistory('q11'));
      expect(actual.searchHistory).toHaveLength(10);
      expect(actual.searchHistory[0]).toBe('q11');
      expect(actual.searchHistory[9]).toBe('q9');
    });

    it('should handle clearSearchHistory', () => {
      const stateWithHistory = {
        ...initialState,
        searchHistory: ['react', 'vue', 'angular'],
      };
      const actual = searchReducer(stateWithHistory, clearSearchHistory());
      expect(actual.searchHistory).toEqual([]);
    });

    it('should handle setSubredditFilter', () => {
      const actual = searchReducer(initialState, setSubredditFilter('javascript'));
      expect(actual.subredditFilter).toBe('javascript');
    });

    it('should handle setTimeFilter', () => {
      const actual = searchReducer(initialState, setTimeFilter('week'));
      expect(actual.timeFilter).toBe('week');
    });

    it('should handle setSortFilter', () => {
      const actual = searchReducer(initialState, setSortFilter('top'));
      expect(actual.sortFilter).toBe('top');
    });

    it('should handle setIsSearching', () => {
      const actual = searchReducer(initialState, setIsSearching(true));
      expect(actual.isSearching).toBe(true);
    });

    it('should handle clearFilters', () => {
      const stateWithFilters = {
        ...initialState,
        subredditFilter: 'javascript',
        timeFilter: 'week',
        sortFilter: 'top',
      };
      const actual = searchReducer(stateWithFilters, clearFilters());
      expect(actual.subredditFilter).toBe('all');
      expect(actual.timeFilter).toBe('all');
      expect(actual.sortFilter).toBe('relevance');
    });
  });

  describe('selectors', () => {
    const mockState = {
      search: {
        activeQuery: 'react hooks',
        searchHistory: ['react hooks', 'javascript'],
        subredditFilter: 'javascript',
        timeFilter: 'week',
        sortFilter: 'top',
        isSearching: true,
      },
    };

    it('selectActiveQuery should return activeQuery state', () => {
      expect(selectActiveQuery(mockState)).toBe('react hooks');
    });

    it('selectSearchHistory should return searchHistory state', () => {
      expect(selectSearchHistory(mockState)).toEqual(['react hooks', 'javascript']);
    });

    it('selectSubredditFilter should return subredditFilter state', () => {
      expect(selectSubredditFilter(mockState)).toBe('javascript');
    });

    it('selectTimeFilter should return timeFilter state', () => {
      expect(selectTimeFilter(mockState)).toBe('week');
    });

    it('selectSortFilter should return sortFilter state', () => {
      expect(selectSortFilter(mockState)).toBe('top');
    });

    it('selectIsSearching should return isSearching state', () => {
      expect(selectIsSearching(mockState)).toBe(true);
    });

    it('selectSearchFilters should return all filter values', () => {
      const filters = selectSearchFilters(mockState);
      expect(filters).toEqual({
        subredditFilter: 'javascript',
        timeFilter: 'week',
        sortFilter: 'top',
      });
    });
  });
});
