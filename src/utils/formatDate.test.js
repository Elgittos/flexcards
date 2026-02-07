import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatTimeAgo, formatFullDate } from './formatDate';

describe('formatDate utilities', () => {
  beforeEach(() => {
    // Set a fixed date for testing: Feb 7, 2026, 12:00:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-07T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatTimeAgo', () => {
    it('should format seconds ago', () => {
      const timestamp = Date.now() / 1000 - 30; // 30 seconds ago
      expect(formatTimeAgo(timestamp)).toBe('30 seconds ago');
    });

    it('should format 1 second ago', () => {
      const timestamp = Date.now() / 1000 - 1;
      expect(formatTimeAgo(timestamp)).toBe('1 second ago');
    });

    it('should format minutes ago', () => {
      const timestamp = Date.now() / 1000 - 120; // 2 minutes ago
      expect(formatTimeAgo(timestamp)).toBe('2 minutes ago');
    });

    it('should format 1 minute ago', () => {
      const timestamp = Date.now() / 1000 - 60;
      expect(formatTimeAgo(timestamp)).toBe('1 minute ago');
    });

    it('should format hours ago', () => {
      const timestamp = Date.now() / 1000 - 7200; // 2 hours ago
      expect(formatTimeAgo(timestamp)).toBe('2 hours ago');
    });

    it('should format 1 hour ago', () => {
      const timestamp = Date.now() / 1000 - 3600;
      expect(formatTimeAgo(timestamp)).toBe('1 hour ago');
    });

    it('should format days ago', () => {
      const timestamp = Date.now() / 1000 - 172800; // 2 days ago
      expect(formatTimeAgo(timestamp)).toBe('2 days ago');
    });

    it('should format 1 day ago', () => {
      const timestamp = Date.now() / 1000 - 86400;
      expect(formatTimeAgo(timestamp)).toBe('1 day ago');
    });

    it('should format months ago', () => {
      const timestamp = Date.now() / 1000 - 5184000; // ~60 days (2 months) ago
      expect(formatTimeAgo(timestamp)).toBe('2 months ago');
    });

    it('should format 1 month ago', () => {
      const timestamp = Date.now() / 1000 - 2592000; // ~30 days ago
      expect(formatTimeAgo(timestamp)).toBe('1 month ago');
    });

    it('should format years ago', () => {
      const timestamp = Date.now() / 1000 - 63072000; // ~2 years ago
      expect(formatTimeAgo(timestamp)).toBe('2 years ago');
    });

    it('should format 1 year ago', () => {
      const timestamp = Date.now() / 1000 - 31536000; // ~1 year ago
      expect(formatTimeAgo(timestamp)).toBe('1 year ago');
    });

    it('should handle "just now" for very recent timestamps', () => {
      const timestamp = Date.now() / 1000;
      expect(formatTimeAgo(timestamp)).toBe('just now');
    });
  });

  describe('formatFullDate', () => {
    it('should format a full date string', () => {
      const timestamp = new Date('2025-12-25T10:30:00Z').getTime() / 1000;
      expect(formatFullDate(timestamp)).toBe('Dec 25, 2025');
    });

    it('should handle current year', () => {
      const timestamp = new Date('2026-01-15T08:00:00Z').getTime() / 1000;
      expect(formatFullDate(timestamp)).toBe('Jan 15, 2026');
    });

    it('should handle different months', () => {
      const timestamp = new Date('2024-03-08T14:20:00Z').getTime() / 1000;
      expect(formatFullDate(timestamp)).toBe('Mar 8, 2024');
    });
  });
});
