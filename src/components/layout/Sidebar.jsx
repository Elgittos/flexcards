import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleSidebar, selectSidebarOpen, selectDarkMode } from '../../features/ui/uiSlice';
import { SUBREDDIT_CATEGORIES } from '../../constants/subreddits';

/**
 * Sidebar Component
 * 
 * Desktop sidebar with popular subreddits and categories.
 * Slides in from left on mobile/tablet with animations.
 * 
 * Features:
 * - Always visible on desktop (lg+)
 * - Slide-in drawer on mobile/tablet
 * - Framer Motion animations (translateX)
 * - Backdrop overlay on mobile when open
 * - Popular subreddits by category
 * - Close button for mobile
 * - Dark mode support
 */
function Sidebar() {
  const dispatch = useDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const darkMode = useAppSelector(selectDarkMode);

  const handleClose = () => {
    dispatch(toggleSidebar());
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      {/* Backdrop - Mobile/Tablet only */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleBackdropClick}
            data-testid="sidebar-backdrop"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible on large screens */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-16">
        <SidebarContent />
      </aside>

      {/* Mobile/Tablet Sidebar - Slide in drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 lg:hidden overflow-y-auto"
            data-testid="sidebar-content"
          >
            {/* Close Button - Mobile only */}
            <div className="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Sidebar Content Component
 * Shared content between desktop and mobile sidebar
 */
function SidebarContent() {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Popular Subreddits
        </h2>
        
        {/* Subreddit Categories */}
        <div className="space-y-4">
          {Object.entries(SUBREDDIT_CATEGORIES).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {category.label}
              </h3>
              <ul className="space-y-1">
                {category.subreddits.map((subreddit) => (
                  <li key={subreddit}>
                    <a
                      href={`#${subreddit}`}
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      r/{subreddit}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
