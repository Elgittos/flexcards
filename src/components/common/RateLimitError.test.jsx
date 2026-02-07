import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RateLimitError from './RateLimitError';

describe('RateLimitError', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render rate limit message', () => {
    render(<RateLimitError retryAfter={5000} />);
    
    expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();
  });

  it('should display countdown timer', () => {
    render(<RateLimitError retryAfter={5000} />);
    
    // Should show seconds remaining
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('should update countdown every second', async () => {
    render(<RateLimitError retryAfter={5000} />);
    
    expect(screen.getByText(/5/)).toBeInTheDocument();
    
    // Advance 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Check updated countdown
    expect(await screen.findByText(/4/)).toBeInTheDocument();
  });

  it('should show progress bar', () => {
    const { container } = render(<RateLimitError retryAfter={5000} />);
    
    // Look for progress bar element
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should update progress bar as time elapses', async () => {
    const { container } = render(<RateLimitError retryAfter={10000} />);
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
    
    const initialProgress = progressBar?.getAttribute('aria-valuenow');
    
    // Advance 5 seconds (50% of time)
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      const currentProgress = progressBar?.getAttribute('aria-valuenow');
      expect(Number(currentProgress)).toBeGreaterThan(Number(initialProgress || 0));
    });
  });

  it('should call onRetry when countdown reaches zero', async () => {
    const onRetry = vi.fn();
    render(<RateLimitError retryAfter={2000} onRetry={onRetry} />);
    
    expect(onRetry).not.toHaveBeenCalled();
    
    // Advance past the retry time
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(onRetry).toHaveBeenCalled();
    });
  });

  it('should render manual retry button', () => {
    render(<RateLimitError retryAfter={5000} />);
    
    expect(screen.getByRole('button', { name: /retry now/i })).toBeInTheDocument();
  });

  it('should call onRetry when manual retry clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onRetry = vi.fn();
    render(<RateLimitError retryAfter={5000} onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /retry now/i });
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should disable retry button during countdown if specified', () => {
    render(<RateLimitError retryAfter={5000} disableManualRetry={true} />);
    
    const retryButton = screen.getByRole('button', { name: /retry now/i });
    expect(retryButton).toBeDisabled();
  });

  it('should enable retry button after countdown if specified', async () => {
    render(<RateLimitError retryAfter={2000} disableManualRetry={true} />);
    
    const retryButton = screen.getByRole('button', { name: /retry now/i });
    expect(retryButton).toBeDisabled();
    
    // Advance past retry time
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(retryButton).not.toBeDisabled();
    });
  });

  it('should format time correctly for minutes', () => {
    render(<RateLimitError retryAfter={65000} />); // 65 seconds
    
    // Should show 1:05 or similar format
    expect(screen.getByText(/1:05|65/)).toBeInTheDocument();
  });

  it('should clean up timer on unmount', () => {
    const { unmount } = render(<RateLimitError retryAfter={5000} />);
    
    unmount();
    
    // Advance timers - should not cause errors
    vi.advanceTimersByTime(10000);
  });

  it('should handle zero or negative retryAfter', () => {
    const onRetry = vi.fn();
    render(<RateLimitError retryAfter={0} onRetry={onRetry} />);
    
    // Should immediately call retry or show ready state
    expect(screen.getByRole('button', { name: /retry now/i })).toBeInTheDocument();
  });

  it('should display helpful message', () => {
    render(<RateLimitError retryAfter={5000} />);
    
    expect(screen.getByText(/please wait|too many requests/i)).toBeInTheDocument();
  });

  it('should have proper ARIA labels', () => {
    const { container } = render(<RateLimitError retryAfter={5000} />);
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow');
    expect(progressBar).toHaveAttribute('aria-valuemin');
    expect(progressBar).toHaveAttribute('aria-valuemax');
  });

  it('should support custom retry button text', () => {
    render(<RateLimitError retryAfter={5000} retryButtonText="Try Again" />);
    
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
