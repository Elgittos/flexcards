/**
 * Error handling utilities for the Reddit Client application
 * 
 * This module provides utility functions for identifying and handling
 * different types of errors that may occur during API requests.
 */

/**
 * Check if an error is a network error
 * @param {Error|Object} error - The error to check
 * @returns {boolean} True if it's a network error
 */
export function isNetworkError(error) {
  if (!error) return false;
  
  // Check for NetworkError type
  if (error.name === 'NetworkError') return true;
  
  // Check for fetch failures
  if (error instanceof TypeError && error.message?.includes('fetch')) {
    return true;
  }
  
  // Check for RTK Query FETCH_ERROR
  if (error.status === 'FETCH_ERROR') return true;
  
  // Check for error without status (likely network issue)
  if (error.error && !error.status) return true;
  
  return false;
}

/**
 * Check if an error is a rate limit error (HTTP 429)
 * @param {Error|Object} error - The error to check
 * @returns {boolean} True if it's a rate limit error
 */
export function isRateLimitError(error) {
  if (!error) return false;
  
  // Check direct status property
  if (error.status === 429) return true;
  
  // Check nested response status
  if (error.response && error.response.status === 429) return true;
  
  return false;
}

/**
 * Extract a user-friendly error message from an error object
 * @param {Error|Object} error - The error to extract message from
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error) {
  if (!error) return 'An unexpected error occurred.';
  
  // Handle rate limit errors
  if (isRateLimitError(error)) {
    return 'Too many requests. Please wait and try again.';
  }
  
  // Handle network errors
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection.';
  }
  
  // Extract message from various error formats
  if (error.message) {
    return error.message;
  }
  
  if (error.data && error.data.message) {
    return error.data.message;
  }
  
  // Default message
  return 'An unexpected error occurred.';
}

/**
 * Parse the Retry-After header from a response
 * @param {Response|Object} response - The HTTP response
 * @returns {number|null} Milliseconds to wait, or null if not specified
 */
export function getRetryAfter(response) {
  if (!response || !response.headers) return null;
  
  const retryAfter = response.headers.get('Retry-After');
  if (!retryAfter) return null;
  
  // Try to parse as seconds (number)
  const seconds = parseInt(retryAfter, 10);
  if (!isNaN(seconds)) {
    return seconds * 1000; // Convert to milliseconds
  }
  
  // Try to parse as HTTP date
  const retryDate = new Date(retryAfter);
  if (!isNaN(retryDate.getTime())) {
    const now = Date.now();
    const delay = retryDate.getTime() - now;
    return Math.max(0, delay);
  }
  
  return null;
}

/**
 * Determine if an error should be retried
 * @param {Error|Object} error - The error to check
 * @param {number} attemptNumber - The current attempt number (0-indexed)
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @returns {boolean} True if the error should be retried
 */
export function shouldRetry(error, attemptNumber, maxRetries = 3) {
  // Don't retry if max attempts reached
  if (attemptNumber >= maxRetries) return false;
  
  // Retry on rate limit errors
  if (isRateLimitError(error)) return true;
  
  // Retry on 5xx server errors
  if (error.status >= 500 && error.status < 600) return true;
  
  // Retry on network errors
  if (isNetworkError(error)) return true;
  
  // Don't retry on 4xx client errors (except 429)
  return false;
}
