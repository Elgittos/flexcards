import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTimeFilter,
  setSortFilter,
  clearFilters,
  selectTimeFilter,
  selectSortFilter,
} from './searchSlice';

/**
 * SearchFilters Component
 * Provides filter options for search results (time range and sort)
 */
const SearchFilters = () => {
  const dispatch = useDispatch();
  const timeFilter = useSelector(selectTimeFilter);
  const sortFilter = useSelector(selectSortFilter);

  const handleTimeFilterChange = (e) => {
    dispatch(setTimeFilter(e.target.value));
  };

  const handleSortFilterChange = (e) => {
    dispatch(setSortFilter(e.target.value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Time Range Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="time-filter" className="text-sm font-medium text-gray-700">
          Time Range:
        </label>
        <select
          id="time-filter"
          value={timeFilter}
          onChange={handleTimeFilterChange}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          aria-label="Time range filter"
        >
          <option value="all">All Time</option>
          <option value="hour">Past Hour</option>
          <option value="day">Past Day</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="year">Past Year</option>
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort-filter" className="text-sm font-medium text-gray-700">
          Sort By:
        </label>
        <select
          id="sort-filter"
          value={sortFilter}
          onChange={handleSortFilterChange}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          aria-label="Sort by filter"
        >
          <option value="relevance">Relevance</option>
          <option value="hot">Hot</option>
          <option value="top">Top</option>
          <option value="new">New</option>
          <option value="comments">Comments</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Clear filters"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default SearchFilters;
