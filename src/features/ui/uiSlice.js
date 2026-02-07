import { createSlice } from '@reduxjs/toolkit';

/**
 * UI Slice for managing application UI state
 * Handles: dark mode, view mode, active subreddit, sort options, sidebar, and modal state
 */

const initialState = {
  darkMode: false,         // User-controlled theme
  viewMode: 'card',        // 'card' or 'compact'
  activeSubreddit: 'javascript', // Currently viewing subreddit
  activeSortOption: 'hot', // hot, new, top, rising
  sidebarOpen: false,      // Mobile sidebar state
  modalOpen: false,        // Post detail modal state
  selectedPostId: null,    // For modal view
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Toggle dark mode on/off
     */
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },

    /**
     * Set view mode (card or compact)
     * @param {Object} action - Action with payload: 'card' or 'compact'
     */
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },

    /**
     * Set currently viewing subreddit
     * @param {Object} action - Action with payload: subreddit name
     */
    setActiveSubreddit: (state, action) => {
      state.activeSubreddit = action.payload;
    },

    /**
     * Set sort option for posts
     * @param {Object} action - Action with payload: 'hot', 'new', 'top', or 'rising'
     */
    setActiveSortOption: (state, action) => {
      state.activeSortOption = action.payload;
    },

    /**
     * Toggle sidebar open/closed (for mobile)
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    /**
     * Open post detail modal
     * @param {Object} action - Action with payload: post ID
     */
    openModal: (state, action) => {
      state.modalOpen = true;
      state.selectedPostId = action.payload;
    },

    /**
     * Close post detail modal
     */
    closeModal: (state) => {
      state.modalOpen = false;
      state.selectedPostId = null;
    },
  },
});

// Export actions
export const {
  toggleDarkMode,
  setViewMode,
  setActiveSubreddit,
  setActiveSortOption,
  toggleSidebar,
  openModal,
  closeModal,
} = uiSlice.actions;

// Export selectors
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectViewMode = (state) => state.ui.viewMode;
export const selectActiveSubreddit = (state) => state.ui.activeSubreddit;
export const selectActiveSortOption = (state) => state.ui.activeSortOption;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModalOpen = (state) => state.ui.modalOpen;
export const selectSelectedPostId = (state) => state.ui.selectedPostId;

// Export reducer
export default uiSlice.reducer;
