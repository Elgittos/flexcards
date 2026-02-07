import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { openModal } from '../ui/uiSlice';
import { formatTimeAgo } from '../../utils/formatDate';
import LazyImage from '../../components/common/LazyImage';

/**
 * Format large numbers with k/m suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
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
 * PostCard Component
 * Displays an individual Reddit post in card or compact view
 */
const PostCard = ({ post, viewMode = 'card', onClick }) => {
  const dispatch = useDispatch();
  const {
    id,
    title,
    author,
    subreddit,
    score,
    numComments,
    thumbnail,
    created,
  } = post;

  const hasThumbnail = thumbnail && 
    thumbnail !== 'self' && 
    thumbnail !== 'default' && 
    thumbnail !== 'nsfw' &&
    thumbnail !== 'spoiler' &&
    !thumbnail.includes('icon');

  const handleClick = () => {
    if (onClick) {
      onClick(post);
    } else {
      // Open modal with post details
      dispatch(openModal({ postId: id, subreddit }));
    }
  };

  const cardClasses = viewMode === 'card'
    ? 'flex flex-col'
    : 'flex flex-row items-center';

  const thumbnailClasses = viewMode === 'card'
    ? 'w-full h-48 object-cover'
    : 'w-20 h-20 object-cover flex-shrink-0';

  const placeholderClasses = viewMode === 'card'
    ? 'w-full h-48'
    : 'w-20 h-20 flex-shrink-0';

  return (
    <article
      data-testid="post-card"
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${cardClasses}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Thumbnail */}
      {hasThumbnail ? (
        <LazyImage
          src={thumbnail}
          alt="Post thumbnail"
          className={thumbnailClasses}
        />
      ) : (
        <div className={`bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center ${placeholderClasses}`}>
          <svg
            className="w-12 h-12 text-white opacity-50"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className={`p-3 sm:p-4 flex-1 ${viewMode === 'compact' ? 'ml-2 sm:ml-3' : ''}`}>
        {/* Title */}
        <h3 className={`font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 ${viewMode === 'card' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
          {title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 flex-wrap gap-1 sm:gap-2">
          <span className="font-medium text-orange-600 dark:text-orange-400">r/{subreddit}</span>
          <span>•</span>
          <span data-testid="post-author">u/{author}</span>
          <span>•</span>
          <span>{formatTimeAgo(created)}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span data-testid="post-score" className="font-semibold">{formatNumber(score)}</span>
          </div>

          <div className="flex items-center gap-1">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{formatNumber(numComments)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    subreddit: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    numComments: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    created: PropTypes.number.isRequired,
    url: PropTypes.string,
    permalink: PropTypes.string,
  }).isRequired,
  viewMode: PropTypes.oneOf(['card', 'compact']),
  onClick: PropTypes.func,
};

export default PostCard;
