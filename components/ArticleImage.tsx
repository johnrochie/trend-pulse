'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getArticleFallbackImage, getImageAltText } from '@/lib/images';

interface ArticleImageProps {
  article: any;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Renders the article's source image, falling back to a curated Unsplash
 * photo if the source URL fails (hotlink blocked, 404, etc.).
 */
export default function ArticleImage({
  article,
  fill,
  width,
  height,
  className,
  priority,
  sizes,
}: ArticleImageProps) {
  const [src, setSrc] = useState<string>(article.imageUrl?.startsWith('http') ? article.imageUrl : getArticleFallbackImage(article));

  const alt = getImageAltText(article);

  const handleError = () => {
    setSrc(getArticleFallbackImage(article));
  };

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        onError={handleError}
        unoptimized={!src.includes('unsplash.com')}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 450}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={handleError}
      unoptimized={!src.includes('unsplash.com')}
    />
  );
}
