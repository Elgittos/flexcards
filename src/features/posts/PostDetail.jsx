import React from 'react';
import PropTypes from 'prop-types';
import { useGetPostWithCommentsQuery } from '../../app/api/redditApi';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectDarkMode } from '../ui/uiSlice';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import CommentTree from '../comments/CommentTree';
import { formatTimeAgo } from '../../utils/formatDate';

/**
 * Format large numbers with k/m suffix
 */
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

/**
 * PostDetail Component
 * Displays full post details with comments
 * Fetches data using RTK Query
 */
const PostDetail = ({ postId, subreddit }) => {
  const darkMode = useAppSelector(selectDarkMode);
  const { data, isLoading, error, refetch } = useGetPostWithCommentsQuery({
    postId,
    subreddit,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <p className="text-center text-gray-500 mt-4">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Error loading post: {error.message || 'Failed to load'}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || !data.post) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  const { post, comments } = data;
  const baseClasses = darkMode
    ? 'bg-gray-800 text-gray-100'
    : 'bg-white text-gray-900';

  return (
    <div className={`${baseClasses} max-h-[90vh] overflow-y-auto`}>
      {/* Post content */}
      <div className="p-6 border-b border-gray-200">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-3">{post.title}</h1>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          <span className="font-medium text-orange-600">r/{post.subreddit}</span>
          <span>•</span>
          <span>Posted by u/{post.author}</span>
          <span>•</span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-lg">{formatNumber(post.score)}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{formatNumber(post.numComments)} comments</span>
          </div>
        </div>

        {/* Post content (selftext) */}
        {post.content && (
          <div className="mt-4 prose max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        )}

        {/* External link */}
        {!post.isSelf && post.url && (
          <div className="mt-4">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {post.url}
            </a>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Comments ({post.numComments})
        </h2>
        <CommentTree comments={comments} darkMode={darkMode} />
      </div>
    </div>
  );
};

PostDetail.propTypes = {
  postId: PropTypes.string.isRequired,
  subreddit: PropTypes.string.isRequired,
};

export default PostDetail;
