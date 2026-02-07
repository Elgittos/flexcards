import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import { formatTimeAgo } from '../../utils/formatDate';

/**
 * Comment Component
 * Displays a single Reddit comment with markdown rendering
 * Supports collapse/expand for long comments
 */
const Comment = ({ comment, depth = 0, darkMode = false, isLong: isLongProp }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { author, body, score, createdAt } = comment;

  const isDeleted = author === '[deleted]' && body === '[deleted]';
  const isRemoved = author === '[deleted]' && body === '[removed]';
  const isLong = isLongProp !== undefined ? isLongProp : (body && body.length > 500);

  // Calculate indentation based on depth
  const marginLeft = depth > 0 ? `${depth * 1.5}rem` : '0';

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const baseClasses = darkMode
    ? 'bg-gray-800 text-gray-100 border-gray-700'
    : 'bg-white text-gray-900 border-gray-200';

  if (isDeleted || isRemoved) {
    return (
      <div
        className={`p-3 mb-2 border-l-2 ${baseClasses}`}
        style={{ marginLeft }}
      >
        <p className="text-gray-500 italic">{body}</p>
      </div>
    );
  }

  return (
    <div
      className={`p-3 mb-2 border-l-2 ${baseClasses}`}
      style={{ marginLeft }}
      data-comment-id={comment.id}
    >
      {/* Comment header */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <span className="font-semibold text-orange-600">u/{author}</span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-500">{score} points</span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-500">{formatTimeAgo(createdAt)}</span>
        {isLong && (
          <>
            <span className="text-gray-500">•</span>
            <button
              onClick={handleToggle}
              className="text-blue-600 hover:text-blue-800 font-medium"
              aria-label={isCollapsed ? 'Expand comment' : 'Collapse comment'}
            >
              {isCollapsed ? '[+] Expand' : '[-] Collapse'}
            </button>
          </>
        )}
      </div>

      {/* Comment body */}
      {!isCollapsed && (
        <div className="text-sm">
          <MarkdownRenderer content={body} />
        </div>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    replies: PropTypes.array,
  }).isRequired,
  depth: PropTypes.number,
  darkMode: PropTypes.bool,
  isLong: PropTypes.bool,
};

export default Comment;
