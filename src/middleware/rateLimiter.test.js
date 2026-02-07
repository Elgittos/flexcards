import { describe, it, expect, beforeEach, vi } from 'vitest';
import RateLimiter from './rateLimiter';

describe('RateLimiter', () => {
  let rateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter();
  });

  describe('constructor', () => {
    it('should create with default capacity of 60 tokens', () => {
      expect(rateLimiter.capacity).toBe(60);
    });

    it('should create with custom capacity', () => {
      const customLimiter = new RateLimiter(30);
      expect(customLimiter.capacity).toBe(30);
    });

    it('should start with full tokens', () => {
      expect(rateLimiter.tokens).toBe(60);
    });

    it('should set refill rate to 1 token per second', () => {
      expect(rateLimiter.refillRate).toBe(1000); // 1000ms = 1 second
    });
  });

  describe('canMakeRequest', () => {
    it('should return true when tokens available', () => {
      expect(rateLimiter.canMakeRequest()).toBe(true);
    });

    it('should consume a token when making request', () => {
      const initialTokens = rateLimiter.tokens;
      rateLimiter.canMakeRequest();
      expect(rateLimiter.tokens).toBe(initialTokens - 1);
    });

    it('should return false when no tokens available', () => {
      rateLimiter.tokens = 0;
      expect(rateLimiter.canMakeRequest()).toBe(false);
    });

    it('should not consume token when none available', () => {
      rateLimiter.tokens = 0;
      rateLimiter.canMakeRequest();
      expect(rateLimiter.tokens).toBe(0);
    });

    it('should refill tokens over time', () => {
      vi.useFakeTimers();
      
      rateLimiter.tokens = 50;
      const lastRefill = Date.now();
      rateLimiter.lastRefill = lastRefill;
      
      // Advance time by 5 seconds
      vi.advanceTimersByTime(5000);
      
      rateLimiter.canMakeRequest();
      
      // Should have refilled 5 tokens (but consumed 1)
      // 50 + 5 - 1 = 54
      expect(rateLimiter.tokens).toBe(54);
      
      vi.useRealTimers();
    });

    it('should not exceed capacity when refilling', () => {
      vi.useFakeTimers();
      
      rateLimiter.tokens = 58;
      rateLimiter.lastRefill = Date.now();
      
      // Advance time by 10 seconds (would add 10 tokens)
      vi.advanceTimersByTime(10000);
      
      rateLimiter.canMakeRequest();
      
      // Should cap at capacity (60), then consume 1 = 59
      expect(rateLimiter.tokens).toBe(59);
      
      vi.useRealTimers();
    });
  });

  describe('waitTime', () => {
    it('should return 0 when tokens available', () => {
      expect(rateLimiter.waitTime()).toBe(0);
    });

    it('should return time until next token when none available', () => {
      vi.useFakeTimers();
      
      rateLimiter.tokens = 0;
      rateLimiter.lastRefill = Date.now();
      
      // Wait time should be 1000ms (refill rate)
      expect(rateLimiter.waitTime()).toBe(1000);
      
      vi.useRealTimers();
    });

    it('should account for time already passed since last refill', () => {
      vi.useFakeTimers();
      
      rateLimiter.tokens = 0;
      rateLimiter.lastRefill = Date.now();
      
      // Advance time by 300ms
      vi.advanceTimersByTime(300);
      
      // Should need to wait 700ms more (1000 - 300)
      expect(rateLimiter.waitTime()).toBe(700);
      
      vi.useRealTimers();
    });

    it('should return 0 if enough time has passed to refill', () => {
      vi.useFakeTimers();
      
      rateLimiter.tokens = 0;
      rateLimiter.lastRefill = Date.now();
      
      // Advance time by 2 seconds (more than refill rate)
      vi.advanceTimersByTime(2000);
      
      expect(rateLimiter.waitTime()).toBe(0);
      
      vi.useRealTimers();
    });
  });

  describe('refill', () => {
    it('should refill tokens based on elapsed time', () => {
      vi.useFakeTimers();
      
      rateLimiter.tokens = 50;
      rateLimiter.lastRefill = Date.now();
      
      // Advance time by 3 seconds
      vi.advanceTimersByTime(3000);
      
      rateLimiter.refill();
      
      // Should have 50 + 3 = 53 tokens
      expect(rateLimiter.tokens).toBe(53);
      
      vi.useRealTimers();
    });

    it('should update lastRefill time', () => {
      vi.useFakeTimers();
      
      const startTime = Date.now();
      rateLimiter.lastRefill = startTime;
      
      vi.advanceTimersByTime(1000);
      
      rateLimiter.refill();
      
      expect(rateLimiter.lastRefill).toBeGreaterThan(startTime);
      
      vi.useRealTimers();
    });

    it('should not exceed capacity', () => {
      vi.useFakeTimers();
      
      rateLimiter.tokens = 55;
      rateLimiter.lastRefill = Date.now();
      
      // Advance time by 10 seconds (would add 10 tokens)
      vi.advanceTimersByTime(10000);
      
      rateLimiter.refill();
      
      // Should cap at 60
      expect(rateLimiter.tokens).toBe(60);
      
      vi.useRealTimers();
    });
  });

  describe('reset', () => {
    it('should reset tokens to capacity', () => {
      rateLimiter.tokens = 30;
      rateLimiter.reset();
      expect(rateLimiter.tokens).toBe(60);
    });

    it('should update lastRefill time', () => {
      vi.useFakeTimers();
      
      const oldTime = Date.now();
      rateLimiter.lastRefill = oldTime;
      
      vi.advanceTimersByTime(5000);
      
      rateLimiter.reset();
      
      expect(rateLimiter.lastRefill).toBeGreaterThan(oldTime);
      
      vi.useRealTimers();
    });
  });
});
