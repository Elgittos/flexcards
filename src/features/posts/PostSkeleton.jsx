import React from 'react';
import PropTypes from 'prop-types';

/**
 * PostSkeleton Component
 * Loading skeleton placeholder for posts
 */
const PostSkeleton = ({ count = 6, viewMode = 'card' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const cardClasses = viewMode === 'card'
    ? 'flex flex-col'
    : 'flex flex-row items-center';

  const thumbnailClasses = viewMode === 'card'
    ? 'w-full h-48'
    : 'w-20 h-20 flex-shrink-0';

  return (
    <>
      {skeletons.map((index) => (
        <div
          key={index}
          className={`bg-white rounded-lg shadow-md overflow-hidden ${cardClasses}`}
        >
          {/* Thumbnail skeleton */}
          <div className={`bg-gray-300 animate-pulse ${thumbnailClasses}`} />

          {/* Content skeleton */}
          <div className={`p-4 flex-1 ${viewMode === 'compact' ? 'ml-3' : ''}`}>
            {/* Title skeleton */}
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-3/4" />
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-3 w-1/2" />

            {/* Metadata skeleton */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            </div>

            {/* Stats skeleton */}
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

PostSkeleton.propTypes = {
  count: PropTypes.number,
  viewMode: PropTypes.oneOf(['card', 'compact']),
};

export default PostSkeleton;
