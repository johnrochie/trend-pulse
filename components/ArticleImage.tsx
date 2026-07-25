'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getArticleFallbackImage, getArticleUltimateFallback, getImageAltText } from '@/lib/images';

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
 * Renders a curated Unsplash photo for the article's category. We don't use
 * the source outlet's own image (article.imageUrl) — we don't hold rights to
 * republish their editorial photos, and hotlinking is unreliable besides.
 * Falls back to a second, fixed pick if the primary one 404s (Unsplash
 * photos occasionally get taken down).
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
  const [src, setSrc] = useState(() => getArticleFallbackImage(article));
  const alt = getImageAltText(article);

  const handleError = () => {
    const ultimate = getArticleUltimateFallback(article);
    if (src !== ultimate) setSrc(ultimate);
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
