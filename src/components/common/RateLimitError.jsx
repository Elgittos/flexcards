import React, { useState, useEffect } from 'react';

/**
 * RateLimitError component displays a countdown timer and progress bar
 * for rate limit errors (HTTP 429)
 * 
 * @param {Object} props
 * @param {number} props.retryAfter - Milliseconds until retry is allowed
 * @param {Function} props.onRetry - Callback function when retry is triggered
 * @param {boolean} props.disableManualRetry - Disable manual retry during countdown
 * @param {string} props.retryButtonText - Custom text for retry button
 */
function RateLimitError({ 
  retryAfter = 0, 
  onRetry, 
  disableManualRetry = false,
  retryButtonText = 'Retry Now' 
}) {
  const [timeRemaining, setTimeRemaining] = useState(retryAfter);
  const totalTime = retryAfter;

  useEffect(() => {
    // If no time remaining or negative, call retry immediately
    if (retryAfter <= 0) {
      return;
    }

    setTimeRemaining(retryAfter);

    // Set up countdown timer
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000;
        
        // If countdown finished, trigger auto-retry
        if (newTime <= 0) {
          clearInterval(interval);
          if (onRetry) {
            onRetry();
          }
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter, onRetry]);

  /**
   * Format time remaining as MM:SS or SS
   */
  const formatTime = (ms) => {
    const seconds = Math.ceil(ms / 1000);
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return seconds.toString();
  };

  /**
   * Calculate progress percentage
   */
  const progress = totalTime > 0 
    ? ((totalTime - timeRemaining) / totalTime) * 100 
    : 100;

  const isCountdownActive = timeRemaining > 0;
  const shouldDisableButton = disableManualRetry && isCountdownActive;

  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Rate Limit Icon */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-orange-500"
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Rate Limit Exceeded
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          Too many requests. Please wait before trying again.
        </p>

        {/* Countdown Timer */}
        {isCountdownActive && (
          <div className="mb-6">
            <div className="text-center mb-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatTime(timeRemaining)}
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                seconds
              </span>
            </div>

            {/* Progress Bar */}
            <div 
              className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Time remaining until retry"
            >
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Retry Button */}
        <button
          onClick={onRetry}
          disabled={shouldDisableButton}
          className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
            shouldDisableButton
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {retryButtonText}
        </button>

        {/* Helpful hint */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          The request will retry automatically when the timer expires.
        </p>
      </div>
    </div>
  );
}

export default RateLimitError;
