import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../hooks/useAppSelector';
import { toggleSidebar, selectDarkMode } from '../../features/ui/uiSlice';
import { setActiveSearch } from '../../features/search/searchSlice';

/**
 * MobileNav Component
 * 
 * Bottom navigation bar for mobile devices.
 * Hidden on desktop screens.
 * 
 * Features:
 * - Fixed at bottom of screen
 * - Icons for: Home, Search, Popular, Menu
 * - Active state highlighting
 * - Dark mode support
 * - Hidden on lg+ screens
 */
function MobileNav() {
  const dispatch = useDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const [activeTab, setActiveTab] = useState('home');

  const handleHomeClick = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    setActiveTab('search');
    // Focus search input if available
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handlePopularClick = () => {
    setActiveTab('popular');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuClick = () => {
    setActiveTab('menu');
    dispatch(toggleSidebar());
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      onClick: handleHomeClick,
    },
    {
      id: 'search',
      label: 'Search',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      onClick: handleSearchClick,
    },
    {
      id: 'popular',
      label: 'Popular',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      onClick: handlePopularClick,
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      onClick: handleMenuClick,
    },
  ];

  return (
    <nav 
      role="navigation"
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-orange-500 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;
