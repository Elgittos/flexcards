import React from 'react';
import { useGetSubredditPostsQuery } from '../../app/api/redditApi';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectViewMode, selectActiveSubreddit, selectActiveSortOption } from '../ui/uiSlice';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';

/**
 * PostList Component
 * Displays a list of Reddit posts using RTK Query
 */
const PostList = () => {
  const viewMode = useAppSelector(selectViewMode);
  const activeSubreddit = useAppSelector(selectActiveSubreddit);
  const activeSortOption = useAppSelector(selectActiveSortOption);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSubredditPostsQuery({
    subreddit: activeSubreddit,
    sort: activeSortOption,
    limit: 25,
  });

  const posts = data?.posts || [];

  // Grid classes based on view mode
  const gridClasses = viewMode === 'card'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'flex flex-col gap-4';

  // Loading state
  if (isLoading) {
    return (
      <div className={gridClasses}>
        <PostSkeleton count={viewMode === 'card' ? 6 : 10} viewMode={viewMode} />
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
          Error Loading Posts
        </h2>
        <p className="text-gray-600 mb-4">
          {error?.message || 'Failed to load posts. Please try again.'}
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Posts Found</h2>
        <p className="text-gray-600">
          There are no posts in this subreddit.
        </p>
      </div>
    );
  }

  // Posts list
  return (
    <div className={gridClasses}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default PostList;
