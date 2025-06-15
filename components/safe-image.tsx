'use client';

import { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  ...props
}: SafeImageProps) {
  // Convert empty strings to null or fallback
  const initialSrc = !src || src === '' ? fallbackSrc : src;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Convert empty strings to null or fallback
    const newSrc = !src || src === '' ? fallbackSrc : src;
    setImgSrc(newSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src, fallbackSrc]);

  return (
    <>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-zinc-600 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      )}

      <Image
        {...props}
        width={90}
        height={90}
        fill={undefined}
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
          setImgSrc(fallbackSrc);
        }}
      />
    </>
  );
}
