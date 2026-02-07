/**
 * Rate Limiter using Token Bucket Algorithm
 * 
 * Implements client-side rate limiting to prevent hitting Reddit's API limits
 * Reddit API limit: 60 requests per minute (1 per second average)
 */
class RateLimiter {
  /**
   * Create a new rate limiter
   * @param {number} capacity - Maximum number of tokens (default: 60 for Reddit API)
   */
  constructor(capacity = 60) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = 1000; // 1 token per second (1000ms)
    this.lastRefill = Date.now();
  }

  /**
   * Refill tokens based on elapsed time
   */
  refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillRate);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  /**
   * Check if a request can be made and consume a token if available
   * @returns {boolean} True if request can be made
   */
  canMakeRequest() {
    this.refill();
    
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    
    return false;
  }

  /**
   * Get the time to wait until next token is available
   * @returns {number} Milliseconds to wait
   */
  waitTime() {
    this.refill();
    
    if (this.tokens > 0) {
      return 0;
    }
    
    // Calculate time until next refill
    const now = Date.now();
    const timeSinceLastRefill = now - this.lastRefill;
    const timeUntilNextToken = this.refillRate - timeSinceLastRefill;
    
    return Math.max(0, timeUntilNextToken);
  }

  /**
   * Reset the rate limiter to full capacity
   */
  reset() {
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
  }
}

export default RateLimiter;
