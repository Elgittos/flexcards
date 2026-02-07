import { createSlice } from '@reduxjs/toolkit';

/**
 * Search Slice for managing search state
 * Handles: query, search history, filters, and search status
 */

const initialState = {
  activeQuery: '',           // Current search query
  searchHistory: [],         // Array of recent searches (max 10)
  subredditFilter: 'all',    // 'all' or specific subreddit
  timeFilter: 'all',         // all, hour, day, week, month, year
  sortFilter: 'relevance',   // relevance, hot, top, new, comments
  isSearching: false,        // Whether search is active
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    /**
     * Set the active search query
     * @param {Object} action - Action with payload: search query string
     */
    setActiveQuery: (state, action) => {
      state.activeQuery = action.payload;
    },

    /**
     * Add a query to search history
     * Prevents duplicates and limits to 10 items
     * @param {Object} action - Action with payload: search query string
     */
    addToSearchHistory: (state, action) => {
      const query = action.payload;
      
      // Remove duplicate if it exists
      state.searchHistory = state.searchHistory.filter(q => q !== query);
      
      // Add to beginning of array
      state.searchHistory.unshift(query);
      
      // Limit to 10 items
      if (state.searchHistory.length > 10) {
        state.searchHistory = state.searchHistory.slice(0, 10);
      }
    },

    /**
     * Clear all search history
     */
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },

    /**
     * Set subreddit filter for search
     * @param {Object} action - Action with payload: 'all' or subreddit name
     */
    setSubredditFilter: (state, action) => {
      state.subredditFilter = action.payload;
    },

    /**
     * Set time range filter for search
     * @param {Object} action - Action with payload: time range string
     */
    setTimeFilter: (state, action) => {
      state.timeFilter = action.payload;
    },

    /**
     * Set sort filter for search
     * @param {Object} action - Action with payload: sort option string
     */
    setSortFilter: (state, action) => {
      state.sortFilter = action.payload;
    },

    /**
     * Set whether search is currently active
     * @param {Object} action - Action with payload: boolean
     */
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },

    /**
     * Reset all filters to default values
     */
    clearFilters: (state) => {
      state.subredditFilter = 'all';
      state.timeFilter = 'all';
      state.sortFilter = 'relevance';
    },
  },
});

// Export actions
export const {
  setActiveQuery,
  addToSearchHistory,
  clearSearchHistory,
  setSubredditFilter,
  setTimeFilter,
  setSortFilter,
  setIsSearching,
  clearFilters,
} = searchSlice.actions;

// Export selectors
export const selectActiveQuery = (state) => state.search.activeQuery;
export const selectSearchHistory = (state) => state.search.searchHistory;
export const selectSubredditFilter = (state) => state.search.subredditFilter;
export const selectTimeFilter = (state) => state.search.timeFilter;
export const selectSortFilter = (state) => state.search.sortFilter;
export const selectIsSearching = (state) => state.search.isSearching;
export const selectSearchFilters = (state) => ({
  subredditFilter: state.search.subredditFilter,
  timeFilter: state.search.timeFilter,
  sortFilter: state.search.sortFilter,
});

// Export reducer
export default searchSlice.reducer;
