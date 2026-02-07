import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setActiveSortOption, selectActiveSortOption } from '../ui/uiSlice';
import { SORT_OPTIONS } from '../../constants/subreddits';

/**
 * SortSelector Component
 * 
 * Displays sort option buttons (hot, new, top, rising) for filtering posts.
 * Updates the active sort option in Redux state when clicked.
 * 
 * Features:
 * - Pill-shaped buttons with smooth transitions
 * - Active state highlighted with Reddit orange (#FF4500)
 * - Keyboard accessible
 * - Responsive layout
 */
function SortSelector() {
  const dispatch = useDispatch();
  const activeSortOption = useAppSelector(selectActiveSortOption);

  const handleSortClick = (sortOption) => {
    dispatch(setActiveSortOption(sortOption));
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Sort options">
      {SORT_OPTIONS.map((option) => {
        const isActive = activeSortOption === option;
        
        return (
          <button
            key={option}
            type="button"
            onClick={() => handleSortClick(option)}
            className={`
              px-4 py-2 rounded-full font-medium text-sm
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
              ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-300 hover:bg-orange-50'
              }
            `}
            aria-pressed={isActive}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        );
      })}
    </div>
  );
}

export default SortSelector;
