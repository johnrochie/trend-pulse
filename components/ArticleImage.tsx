'use client';

import Image from 'next/image';
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
 * Renders a curated Unsplash photo for the article's category. We don't use
 * the source outlet's own image (article.imageUrl) — we don't hold rights to
 * republish their editorial photos, and hotlinking is unreliable besides.
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
  const src = getArticleFallbackImage(article);
  const alt = getImageAltText(article);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
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
      unoptimized={!src.includes('unsplash.com')}
    />
  );
}
