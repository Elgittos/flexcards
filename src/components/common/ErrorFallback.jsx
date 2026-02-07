import React from 'react';
import { getErrorMessage } from '../../utils/errors';

/**
 * ErrorFallback component displays a friendly error message
 * with options to retry or go home
 * 
 * @param {Object} props
 * @param {Error} props.error - The error that was caught
 * @param {Object} props.errorInfo - Additional error information
 * @param {Function} props.resetError - Function to reset the error boundary
 */
function ErrorFallback({ error, errorInfo, resetError }) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Something Went Wrong
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          {errorMessage}
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6">
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-700 dark:text-gray-300 font-medium mb-2">
                Error Details
              </summary>
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 overflow-auto max-h-40">
                <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {error.toString()}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </div>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={resetError}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
