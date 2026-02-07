import { describe, it, expect } from 'vitest';
import uiReducer, {
  toggleDarkMode,
  setViewMode,
  setActiveSubreddit,
  setActiveSortOption,
  toggleSidebar,
  openModal,
  closeModal,
  selectDarkMode,
  selectViewMode,
  selectActiveSubreddit,
  selectActiveSortOption,
  selectSidebarOpen,
  selectModalOpen,
  selectSelectedPostId,
} from './uiSlice';

describe('uiSlice', () => {
  const initialState = {
    darkMode: false,
    viewMode: 'card',
    activeSubreddit: 'javascript',
    activeSortOption: 'hot',
    sidebarOpen: false,
    modalOpen: false,
    selectedPostId: null,
  };

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle toggleDarkMode', () => {
      const actual = uiReducer(initialState, toggleDarkMode());
      expect(actual.darkMode).toBe(true);

      const actualAgain = uiReducer(actual, toggleDarkMode());
      expect(actualAgain.darkMode).toBe(false);
    });

    it('should handle setViewMode', () => {
      const actual = uiReducer(initialState, setViewMode('compact'));
      expect(actual.viewMode).toBe('compact');
    });

    it('should handle setActiveSubreddit', () => {
      const actual = uiReducer(initialState, setActiveSubreddit('reactjs'));
      expect(actual.activeSubreddit).toBe('reactjs');
    });

    it('should handle setActiveSortOption', () => {
      const actual = uiReducer(initialState, setActiveSortOption('new'));
      expect(actual.activeSortOption).toBe('new');
    });

    it('should handle toggleSidebar', () => {
      const actual = uiReducer(initialState, toggleSidebar());
      expect(actual.sidebarOpen).toBe(true);

      const actualAgain = uiReducer(actual, toggleSidebar());
      expect(actualAgain.sidebarOpen).toBe(false);
    });

    it('should handle openModal', () => {
      const actual = uiReducer(initialState, openModal('abc123'));
      expect(actual.modalOpen).toBe(true);
      expect(actual.selectedPostId).toBe('abc123');
    });

    it('should handle closeModal', () => {
      const stateWithModal = {
        ...initialState,
        modalOpen: true,
        selectedPostId: 'abc123',
      };
      const actual = uiReducer(stateWithModal, closeModal());
      expect(actual.modalOpen).toBe(false);
      expect(actual.selectedPostId).toBe(null);
    });
  });

  describe('selectors', () => {
    const mockState = {
      ui: {
        darkMode: true,
        viewMode: 'compact',
        activeSubreddit: 'python',
        activeSortOption: 'top',
        sidebarOpen: true,
        modalOpen: true,
        selectedPostId: 'xyz789',
      },
    };

    it('selectDarkMode should return darkMode state', () => {
      expect(selectDarkMode(mockState)).toBe(true);
    });

    it('selectViewMode should return viewMode state', () => {
      expect(selectViewMode(mockState)).toBe('compact');
    });

    it('selectActiveSubreddit should return activeSubreddit state', () => {
      expect(selectActiveSubreddit(mockState)).toBe('python');
    });

    it('selectActiveSortOption should return activeSortOption state', () => {
      expect(selectActiveSortOption(mockState)).toBe('top');
    });

    it('selectSidebarOpen should return sidebarOpen state', () => {
      expect(selectSidebarOpen(mockState)).toBe(true);
    });

    it('selectModalOpen should return modalOpen state', () => {
      expect(selectModalOpen(mockState)).toBe(true);
    });

    it('selectSelectedPostId should return selectedPostId state', () => {
      expect(selectSelectedPostId(mockState)).toBe('xyz789');
    });
  });
});
