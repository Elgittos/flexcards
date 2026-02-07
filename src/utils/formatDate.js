import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format a Unix timestamp (in seconds) to a relative time string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted time string (e.g., "2 hours ago")
 */
export function formatTimeAgo(timestamp) {
  const now = Date.now();
  const postTime = timestamp * 1000; // Convert to milliseconds
  const diffInSeconds = Math.floor((now - postTime) / 1000);

  if (diffInSeconds < 1) {
    return 'just now';
  }

  if (diffInSeconds < 60) {
    const seconds = diffInSeconds;
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }

  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

/**
 * Format a Unix timestamp (in seconds) to a full date string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatFullDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return format(date, 'MMM d, yyyy');
}
