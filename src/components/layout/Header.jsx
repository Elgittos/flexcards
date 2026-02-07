import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleSidebar, selectDarkMode } from '../../features/ui/uiSlice';
import SearchBar from '../../features/search/SearchBar';

/**
 * Header Component
 * 
 * Responsive header with logo, search bar, and mobile menu toggle.
 * 
 * Features:
 * - Sticky header at top of page
 * - Logo and app title
 * - Integrated search bar
 * - Mobile hamburger menu button
 * - Dark mode support
 * - Responsive layout (full on desktop, compact on mobile)
 */
function Header() {
  const dispatch = useDispatch();
  const darkMode = useAppSelector(selectDarkMode);

  const handleMenuToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <header 
      role="banner"
      className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuToggle}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg 
                role="img"
                className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Reddit Client
            </h1>
          </div>

          {/* Search Bar - Hidden on smallest screens */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>

          {/* Spacer for mobile layout balance */}
          <div className="w-10 md:hidden"></div>
        </div>

        {/* Mobile Search Bar - Full width below header on small screens */}
        <div className="sm:hidden mt-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

export default Header;
