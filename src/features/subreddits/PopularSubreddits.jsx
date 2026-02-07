import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setActiveSubreddit, selectActiveSubreddit } from '../ui/uiSlice';
import { SUBREDDIT_CATEGORIES } from '../../constants/subreddits';

/**
 * PopularSubreddits Component
 * 
 * Displays curated subreddit categories with clickable chips.
 * Allows users to quickly navigate to popular subreddits organized by topic.
 * 
 * Features:
 * - Organized by categories (Technology, Gaming, News, etc.)
 * - Clickable chips for each subreddit
 * - Highlights currently active subreddit
 * - Responsive grid layout
 * - Keyboard accessible
 */
function PopularSubreddits() {
  const dispatch = useDispatch();
  const activeSubreddit = useAppSelector(selectActiveSubreddit);

  const handleSubredditClick = (subreddit) => {
    dispatch(setActiveSubreddit(subreddit));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Subreddits</h2>
      
      <div className="space-y-6">
        {Object.entries(SUBREDDIT_CATEGORIES).map(([key, category]) => (
          <div key={key} className="space-y-3">
            {/* Category Label */}
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {category.label}
            </h3>
            
            {/* Subreddit Chips */}
            <div className="flex flex-wrap gap-2">
              {category.subreddits.map((subreddit) => {
                const isActive = activeSubreddit === subreddit;
                
                return (
                  <button
                    key={subreddit}
                    type="button"
                    onClick={() => handleSubredditClick(subreddit)}
                    className={`
                      px-3 py-1.5 rounded-full text-sm font-medium
                      transition-all duration-200 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                      ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    r/{subreddit}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularSubreddits;
