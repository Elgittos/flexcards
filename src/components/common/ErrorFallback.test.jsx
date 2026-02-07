import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorFallback from './ErrorFallback';

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetError = vi.fn();

  beforeEach(() => {
    mockResetError.mockClear();
  });

  it('should render error message', () => {
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error message/i)).toBeInTheDocument();
  });

  it('should render Try Again button', () => {
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should call resetError when Try Again clicked', async () => {
    const user = userEvent.setup();
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    await user.click(tryAgainButton);
    
    expect(mockResetError).toHaveBeenCalledTimes(1);
  });

  it('should display error icon', () => {
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    // Look for SVG element (error icon)
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });

  it('should handle error without message', () => {
    const errorWithoutMessage = new Error();
    render(<ErrorFallback error={errorWithoutMessage} resetError={mockResetError} />);
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('should display generic message for unknown error type', () => {
    const unknownError = { status: 500 };
    render(<ErrorFallback error={unknownError} resetError={mockResetError} />);
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    // Container should have centered content
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('should support dark mode classes', () => {
    const { container } = render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    // Check for dark mode text classes
    const errorText = screen.getByText(/test error message/i);
    expect(errorText.className).toContain('text-gray');
  });

  it('should show error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    // Should show error details section  
    const detailsElement = screen.getByText('Error Details');
    expect(detailsElement).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should be accessible', () => {
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    expect(tryAgainButton).toBeEnabled();
  });
});
