'use client';

import { useEffect, useState } from 'react';
import { SHOWCASE_FALLBACK_IMAGE } from '../lib/showcaseGallery';

interface ShowcaseImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export default function ShowcaseImage({ src, alt, className, loading = 'lazy' }: ShowcaseImageProps) {
  const [url, setUrl] = useState(src);

  useEffect(() => {
    setUrl(src);
  }, [src]);

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={loading}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={() => {
        if (url !== SHOWCASE_FALLBACK_IMAGE) {
          setUrl(SHOWCASE_FALLBACK_IMAGE);
        }
      }}
    />
  );
}
