import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectActiveSortOption } from '../ui/uiSlice';
import { useGetSubredditPostsQuery } from '../../app/api/redditApi';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';

/**
 * MultiSubredditGrid Component
 * 
 * Displays posts from multiple subreddits simultaneously in a grid layout.
 * Each subreddit section shows a limited number of recent posts.
 * 
 * Features:
 * - Fetches posts from multiple subreddits in parallel
 * - Grid layout: 1 column on mobile, 2 columns on tablet/desktop
 * - Each section has a subreddit header
 * - Shows loading state per subreddit
 * - Handles errors gracefully
 * 
 * @param {Object} props - Component props
 * @param {Array<string>} [props.subreddits=['javascript', 'reactjs', 'webdev', 'programming']] - Subreddits to display
 * @param {number} [props.postsPerSubreddit=8] - Number of posts to show per subreddit
 */
function MultiSubredditGrid({ 
  subreddits = ['javascript', 'reactjs', 'webdev', 'programming'],
  postsPerSubreddit = 8 
}) {
  const activeSortOption = useAppSelector(selectActiveSortOption);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Trending Across Communities</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {subreddits.map((subreddit) => (
          <SubredditSection
            key={subreddit}
            subreddit={subreddit}
            sort={activeSortOption}
            limit={postsPerSubreddit}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * SubredditSection Component
 * 
 * Displays posts from a single subreddit within the grid.
 * Handles its own loading and error states.
 */
function SubredditSection({ subreddit, sort, limit }) {
  const { data, isLoading, isError, error } = useGetSubredditPostsQuery({
    subreddit,
    sort,
    limit,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Subreddit Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 px-3 sm:px-4 py-2 sm:py-3">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          r/{subreddit}
        </h3>
      </div>

      {/* Posts Content */}
      <div className="divide-y divide-gray-200">
        {isLoading && (
          <div className="p-4 space-y-4">
            <PostSkeleton />
            <p className="text-sm text-gray-500">Loading posts...</p>
          </div>
        )}

        {isError && (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Failed to load posts from r/{subreddit}
              </p>
              {error?.message && (
                <p className="text-xs text-red-600 mt-1">{error.message}</p>
              )}
            </div>
          </div>
        )}

        {!isLoading && !isError && data?.posts && (
          <>
            {data.posts.length === 0 ? (
              <div className="p-4">
                <p className="text-sm text-gray-500 text-center">
                  No posts found in r/{subreddit}
                </p>
              </div>
            ) : (
              data.posts.map((post) => (
                <div key={post.id} className="p-3">
                  <PostCard post={post} viewMode="compact" />
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MultiSubredditGrid;
