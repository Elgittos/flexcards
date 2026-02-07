import React from 'react';
import { useSearchPostsQuery } from '../../app/api/redditApi';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  selectActiveQuery,
  selectSubredditFilter,
  selectIsSearching,
  selectTimeFilter,
  selectSortFilter,
} from './searchSlice';
import { selectViewMode } from '../ui/uiSlice';
import PostCard from '../posts/PostCard';
import PostSkeleton from '../posts/PostSkeleton';

/**
 * SearchResults Component
 * Displays search results from Reddit using RTK Query
 */
const SearchResults = () => {
  const viewMode = useAppSelector(selectViewMode);
  const activeQuery = useAppSelector(selectActiveQuery);
  const subredditFilter = useAppSelector(selectSubredditFilter);
  const isSearching = useAppSelector(selectIsSearching);
  const timeFilter = useAppSelector(selectTimeFilter);
  const sortFilter = useAppSelector(selectSortFilter);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useSearchPostsQuery(
    {
      query: activeQuery,
      subreddit: subredditFilter !== 'all' ? subredditFilter : undefined,
      limit: 25,
      ...(sortFilter !== 'relevance' && { sort: sortFilter }),
      ...(timeFilter !== 'all' && { t: timeFilter }),
    },
    {
      skip: !activeQuery || !isSearching,
    }
  );

  const posts = data?.posts || [];

  // Grid classes based on view mode
  const gridClasses = viewMode === 'card'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'flex flex-col gap-4';

  // Don't show anything if not searching
  if (!isSearching || !activeQuery) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Searching for "{activeQuery}"...
          </h2>
        </div>
        <div className={gridClasses}>
          <PostSkeleton count={viewMode === 'card' ? 6 : 10} viewMode={viewMode} />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <svg
          className="w-16 h-16 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error Loading Results
        </h2>
        <p className="text-gray-600 mb-4">
          {error?.message || 'Failed to load search results. Please try again.'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
        <p className="text-gray-600">
          No posts found for "{activeQuery}". Try different keywords.
        </p>
      </div>
    );
  }

  // Results list
  return (
    <div>
      {/* Result count */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {posts.length} {posts.length === 1 ? 'result' : 'results'} for "{activeQuery}"
        </h2>
      </div>

      {/* Posts grid */}
      <div className={gridClasses}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
