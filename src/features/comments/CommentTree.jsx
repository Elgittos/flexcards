import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

/**
 * CommentTree Component
 * Recursively renders nested comments with depth limit
 * Collapses comments after 4 levels deep
 */
const CommentTree = ({ comments, isLoading = false, error = null, darkMode = false, depth = 0, maxDepth = 4 }) => {
  const [expandedThreads, setExpandedThreads] = useState({});

  const toggleThread = (commentId) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Failed to load comments</p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  const baseClasses = darkMode
    ? 'bg-gray-900 text-gray-100'
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={baseClasses}>
      {comments.map((comment) => {
        const hasReplies = comment.replies && comment.replies.length > 0;
        const shouldCollapse = (depth + 1) >= maxDepth && hasReplies;
        const isExpanded = expandedThreads[comment.id];

        return (
          <div key={comment.id}>
            <Comment comment={comment} depth={depth} darkMode={darkMode} />

            {/* Render replies or show "Continue this thread" link */}
            {hasReplies && (
              shouldCollapse ? (
                isExpanded ? (
                  <CommentTree
                    comments={comment.replies}
                    darkMode={darkMode}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                  />
                ) : (
                  <div
                    className="ml-6 mb-2"
                    style={{ marginLeft: `${(depth + 1) * 1.5}rem` }}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleThread(comment.id);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Continue this thread →
                    </a>
                  </div>
                )
              ) : (
                <CommentTree
                  comments={comment.replies}
                  darkMode={darkMode}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                />
              )
            )}
          </div>
        );
      })}
    </div>
  );
};

CommentTree.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      createdAt: PropTypes.number.isRequired,
      replies: PropTypes.array,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  darkMode: PropTypes.bool,
  depth: PropTypes.number,
  maxDepth: PropTypes.number,
};

export default CommentTree;
