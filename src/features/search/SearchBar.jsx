import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveQuery,
  addToSearchHistory,
  setIsSearching,
  selectActiveQuery,
} from './searchSlice';

/**
 * SearchBar Component
 * Provides search input with submission and clear functionality
 */
const SearchBar = () => {
  const dispatch = useDispatch();
  const activeQuery = useSelector(selectActiveQuery);
  const [inputValue, setInputValue] = useState(activeQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = inputValue.trim();
    
    if (!trimmedQuery) {
      return;
    }
    
    dispatch(setActiveQuery(trimmedQuery));
    dispatch(addToSearchHistory(trimmedQuery));
    dispatch(setIsSearching(true));
  };

  const handleClear = () => {
    setInputValue('');
    dispatch(setActiveQuery(''));
    dispatch(setIsSearching(false));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search Reddit..."
          className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          aria-label="Search Reddit"
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="absolute right-2 px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
