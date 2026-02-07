import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

/**
 * MarkdownRenderer Component
 * Renders markdown content with sanitization to prevent XSS attacks
 * Supports GitHub Flavored Markdown (GFM) features
 */
const MarkdownRenderer = ({ content, className = '' }) => {
  if (!content) {
    return null;
  }

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Open links in new tab with security attributes
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            />
          ),
          // Style code blocks
          code: ({ node, inline, children, ...props }) => {
            if (inline) {
              return (
                <code
                  {...props}
                  className="px-1.5 py-0.5 bg-gray-100 text-red-600 rounded text-sm font-mono"
                >
                  {children}
                </code>
              );
            }
            
            // Block code - render in pre>code
            return (
              <code {...props} className="font-mono">
                {children}
              </code>
            );
          },
          pre: ({ node, children, ...props }) => (
            <pre
              {...props}
              className="p-3 bg-gray-100 rounded text-sm font-mono overflow-x-auto"
            >
              {children}
            </pre>
          ),
          // Style blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-gray-300 pl-4 italic text-gray-700"
            />
          ),
          // Style tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} className="min-w-full border-collapse border border-gray-300" />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th {...props} className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold" />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="border border-gray-300 px-4 py-2" />
          ),
          // Style lists
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc list-inside space-y-1" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal list-inside space-y-1" />
          ),
          // Style headings
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-2xl font-bold mt-4 mb-2" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-xl font-bold mt-3 mb-2" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-lg font-semibold mt-2 mb-1" />
          ),
          // Style paragraphs
          p: ({ node, ...props }) => (
            <p {...props} className="mb-2" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

MarkdownRenderer.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};

export default MarkdownRenderer;
