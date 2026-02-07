import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setActiveSubreddit, selectActiveSubreddit } from '../ui/uiSlice';
import { getAllSubreddits } from '../../constants/subreddits';

/**
 * SubredditSelector Component
 * 
 * Dropdown selector for choosing the active subreddit.
 * Displays all available subreddits from constants.
 * 
 * Features:
 * - Dropdown with all available subreddits
 * - Highlights currently active subreddit
 * - Smooth transitions and hover effects
 * - Keyboard accessible
 * - Auto-closes after selection
 */
function SubredditSelector() {
  const dispatch = useDispatch();
  const activeSubreddit = useAppSelector(selectActiveSubreddit);
  const [isOpen, setIsOpen] = useState(false);
  
  const subreddits = getAllSubreddits();

  const handleSelect = (subreddit) => {
    dispatch(setActiveSubreddit(subreddit));
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors duration-200"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          <span className="text-gray-700 font-medium">r/{activeSubreddit}</span>
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown List */}
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            <ul role="listbox" className="py-1">
              {subreddits.map((subreddit) => {
                const isActive = activeSubreddit === subreddit;
                
                return (
                  <li key={subreddit} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onClick={() => handleSelect(subreddit)}
                      className={`w-full text-left px-4 py-2 transition-colors duration-150 ${
                        isActive
                          ? 'bg-orange-50 text-orange-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      r/{subreddit}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default SubredditSelector;
