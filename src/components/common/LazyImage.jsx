import React, { useEffect, useRef, useState } from 'react';

/**
 * LazyImage Component
 * Implements lazy loading for images using IntersectionObserver API
 * Features:
 * - Only loads images when they enter the viewport
 * - Fade-in animation on load
 * - Error handling for failed image loads
 * - Placeholder support while loading
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 300\'%3E%3Crect fill=\'%23f3f4f6\' width=\'400\' height=\'300\'/%3E%3C/svg%3E',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const currentImg = imgRef.current;
    
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When image enters viewport
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading slightly before entering viewport
        threshold: 0.01,
      }
    );

    // Start observing
    if (currentImg) {
      observer.observe(currentImg);
    }

    // Cleanup
    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      data-loading={!isLoaded && !hasError}
      data-error={hasError}
      className={`
        transition-opacity duration-300
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
        ${hasError ? 'opacity-50' : ''}
        ${className}
      `}
      {...props}
    />
  );
};

export default LazyImage;
