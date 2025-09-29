import React, { useState, useCallback } from 'react';
import { Loader } from 'lucide-react';

const Image = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  placeholder = true,
  fallback = '/images/placeholder.jpg',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback((e) => {
    setIsLoading(false);
    onLoad?.(e);
  }, [onLoad]);

  const handleError = useCallback((e) => {
    setIsLoading(false);
    setHasError(true);
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
    onError?.(e);
  }, [onError, currentSrc, fallback]);

  // Generate WebP and AVIF sources for modern browsers
  const generateSources = (imageSrc) => {
    if (!imageSrc || imageSrc.startsWith('data:') || imageSrc.includes('placeholder')) {
      return null;
    }
    
    // For external URLs (like Unsplash), we'll use their optimization params
    if (imageSrc.includes('unsplash.com') || imageSrc.includes('images.')) {
      const baseUrl = imageSrc.split('?')[0];
      const webpUrl = `${baseUrl}?auto=format&fit=crop&w=800&q=80&fm=webp`;
      const avifUrl = `${baseUrl}?auto=format&fit=crop&w=800&q=80&fm=avif`;
      
      return (
        <>
          <source srcSet={avifUrl} type="image/avif" />
          <source srcSet={webpUrl} type="image/webp" />
        </>
      );
    }
    
    return null;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {isLoading && placeholder && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
          <Loader className="w-6 h-6 text-orange-400 animate-spin" />
        </div>
      )}
      
      {/* Optimized image with multiple formats */}
      <picture>
        {generateSources(currentSrc)}
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>
      
      {/* Error state */}
      {hasError && currentSrc === fallback && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs">Image non disponible</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Image;