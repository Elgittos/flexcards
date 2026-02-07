import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LazyImage from './LazyImage';

describe('LazyImage', () => {
  let intersectionObserverMock;
  let observeMock;
  let unobserveMock;

  beforeEach(() => {
    observeMock = vi.fn();
    unobserveMock = vi.fn();
    
    intersectionObserverMock = vi.fn(function(callback) {
      this.observe = observeMock;
      this.unobserve = unobserveMock;
      this.disconnect = vi.fn();
      // Store callback for manual triggering
      this.callback = callback;
    });

    global.IntersectionObserver = intersectionObserverMock;
  });

  it('should render with initial placeholder', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    const img = screen.getByRole('img', { name: 'Test image' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('data-loading', 'true');
  });

  it('should observe the image element on mount', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    expect(intersectionObserverMock).toHaveBeenCalledTimes(1);
    expect(observeMock).toHaveBeenCalledTimes(1);
  });

  it('should load image when intersecting', async () => {
    const { container } = render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    const img = screen.getByRole('img', { name: 'Test image' });
    
    // Simulate intersection
    const observer = intersectionObserverMock.mock.results[0].value;
    observer.callback([{ isIntersecting: true, target: img }]);

    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });
  });

  it('should apply loading class initially', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
        className="custom-class"
      />
    );

    const img = screen.getByRole('img', { name: 'Test image' });
    expect(img.className).toContain('opacity-0');
  });

  it('should apply loaded class after image loads', async () => {
    const { container } = render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    const img = screen.getByRole('img', { name: 'Test image' });
    
    // Simulate intersection
    const observer = intersectionObserverMock.mock.results[0].value;
    observer.callback([{ isIntersecting: true, target: img }]);

    // Wait for image to load
    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    // Simulate onLoad event
    const loadEvent = new Event('load');
    img.dispatchEvent(loadEvent);

    await waitFor(() => {
      expect(img.className).toContain('opacity-100');
    });
  });

  it('should handle error state', async () => {
    render(
      <LazyImage
        src="https://example.com/invalid-image.jpg"
        alt="Test image"
      />
    );

    const img = screen.getByRole('img', { name: 'Test image' });
    
    // Simulate intersection
    const observer = intersectionObserverMock.mock.results[0].value;
    observer.callback([{ isIntersecting: true, target: img }]);

    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'https://example.com/invalid-image.jpg');
    });

    // Simulate error event
    const errorEvent = new Event('error');
    img.dispatchEvent(errorEvent);

    await waitFor(() => {
      expect(img).toHaveAttribute('data-error', 'true');
    });
  });

  it('should use placeholder while not loaded', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
        placeholder="data:image/svg+xml,%3Csvg%3E%3C/svg%3E"
      />
    );

    const img = screen.getByRole('img', { name: 'Test image' });
    expect(img).toHaveAttribute('src', 'data:image/svg+xml,%3Csvg%3E%3C/svg%3E');
  });

  it('should unobserve on unmount', () => {
    const { unmount } = render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
      />
    );

    unmount();

    expect(unobserveMock).toHaveBeenCalled();
  });

  it('should accept custom className', () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
        className="custom-image-class"
      />
    );

    const img = screen.getByRole('img', { name: 'Test image' });
    expect(img.className).toContain('custom-image-class');
  });

  it('should not load image when not intersecting', async () => {
    render(
      <LazyImage
        src="https://example.com/image.jpg"
        alt="Test image"
        placeholder="placeholder.jpg"
      />
    );

    const img = screen.getByRole('img', { name: 'Test image' });
    
    // Simulate NOT intersecting
    const observer = intersectionObserverMock.mock.results[0].value;
    observer.callback([{ isIntersecting: false, target: img }]);

    // Should still have placeholder
    expect(img).toHaveAttribute('src', 'placeholder.jpg');
  });
});
