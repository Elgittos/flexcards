import { describe, it, expect } from 'vitest';
import {
  isNetworkError,
  isRateLimitError,
  getErrorMessage,
  getRetryAfter,
  shouldRetry,
} from './errors';

describe('Error Utilities', () => {
  describe('isNetworkError', () => {
    it('should return true for network errors', () => {
      const networkError = new Error('Network Error');
      networkError.name = 'NetworkError';
      expect(isNetworkError(networkError)).toBe(true);
    });

    it('should return true for fetch errors', () => {
      const fetchError = new TypeError('Failed to fetch');
      expect(isNetworkError(fetchError)).toBe(true);
    });

    it('should return false for other errors', () => {
      const genericError = new Error('Something went wrong');
      expect(isNetworkError(genericError)).toBe(false);
    });

    it('should handle null/undefined', () => {
      expect(isNetworkError(null)).toBe(false);
      expect(isNetworkError(undefined)).toBe(false);
    });
  });

  describe('isRateLimitError', () => {
    it('should return true for 429 status error', () => {
      const error = { status: 429 };
      expect(isRateLimitError(error)).toBe(true);
    });

    it('should return true for error with 429 response status', () => {
      const error = { 
        response: { status: 429 } 
      };
      expect(isRateLimitError(error)).toBe(true);
    });

    it('should return false for other status codes', () => {
      expect(isRateLimitError({ status: 404 })).toBe(false);
      expect(isRateLimitError({ status: 500 })).toBe(false);
    });

    it('should handle null/undefined', () => {
      expect(isRateLimitError(null)).toBe(false);
      expect(isRateLimitError(undefined)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error message');
      expect(getErrorMessage(error)).toBe('Test error message');
    });

    it('should extract message from object with message property', () => {
      const error = { message: 'Custom error' };
      expect(getErrorMessage(error)).toBe('Custom error');
    });

    it('should extract data.message from RTK Query error', () => {
      const error = { data: { message: 'API error' } };
      expect(getErrorMessage(error)).toBe('API error');
    });

    it('should return default message for 429 errors', () => {
      const error = { status: 429 };
      expect(getErrorMessage(error)).toBe('Too many requests. Please wait and try again.');
    });

    it('should return default message for network errors', () => {
      const error = new TypeError('Failed to fetch');
      expect(getErrorMessage(error)).toBe('Network error. Please check your connection.');
    });

    it('should return generic message for unknown errors', () => {
      expect(getErrorMessage({})).toBe('An unexpected error occurred.');
      expect(getErrorMessage(null)).toBe('An unexpected error occurred.');
    });

    it('should convert non-string errors to string', () => {
      expect(getErrorMessage({ status: 500 })).toBeTruthy();
    });
  });

  describe('getRetryAfter', () => {
    it('should parse Retry-After header in seconds', () => {
      const response = {
        headers: {
          get: (name) => name === 'Retry-After' ? '120' : null,
        },
      };
      expect(getRetryAfter(response)).toBe(120000); // 120 seconds = 120000 ms
    });

    it('should parse Retry-After date header', () => {
      const futureDate = new Date(Date.now() + 60000); // 1 minute from now
      const response = {
        headers: {
          get: (name) => name === 'Retry-After' ? futureDate.toUTCString() : null,
        },
      };
      const retryAfter = getRetryAfter(response);
      expect(retryAfter).toBeGreaterThan(50000); // Should be around 60000ms
      expect(retryAfter).toBeLessThan(70000);
    });

    it('should return null if no Retry-After header', () => {
      const response = {
        headers: {
          get: () => null,
        },
      };
      expect(getRetryAfter(response)).toBeNull();
    });

    it('should handle missing headers object', () => {
      expect(getRetryAfter({})).toBeNull();
      expect(getRetryAfter(null)).toBeNull();
    });
  });

  describe('shouldRetry', () => {
    it('should retry on 429 errors', () => {
      const error = { status: 429 };
      expect(shouldRetry(error, 0)).toBe(true);
      expect(shouldRetry(error, 1)).toBe(true);
      expect(shouldRetry(error, 2)).toBe(true);
    });

    it('should retry on 5xx errors', () => {
      expect(shouldRetry({ status: 500 }, 0)).toBe(true);
      expect(shouldRetry({ status: 502 }, 0)).toBe(true);
      expect(shouldRetry({ status: 503 }, 0)).toBe(true);
    });

    it('should not retry on 4xx client errors (except 429)', () => {
      expect(shouldRetry({ status: 400 }, 0)).toBe(false);
      expect(shouldRetry({ status: 401 }, 0)).toBe(false);
      expect(shouldRetry({ status: 404 }, 0)).toBe(false);
    });

    it('should retry on network errors', () => {
      const networkError = new TypeError('Failed to fetch');
      expect(shouldRetry(networkError, 0)).toBe(true);
    });

    it('should not retry after max attempts', () => {
      const error = { status: 500 };
      expect(shouldRetry(error, 3)).toBe(false);
      expect(shouldRetry(error, 4)).toBe(false);
    });

    it('should respect maxRetries parameter', () => {
      const error = { status: 500 };
      expect(shouldRetry(error, 2, 2)).toBe(false);
      expect(shouldRetry(error, 2, 3)).toBe(true);
    });
  });
});
