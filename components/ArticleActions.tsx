'use client';

import { Share2, Bookmark, Check } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

interface ArticleActionsProps {
  title: string;
  url: string;
}

const BOOKMARKS_KEY = 'trend-pulse-bookmarks';

export default function ArticleActions({ title, url }: ArticleActionsProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    try {
      const slug = url.replace(/^\/article\//, '');
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      const bookmarks: string[] = stored ? JSON.parse(stored) : [];
      setBookmarked(bookmarks.includes(slug));
    } catch {
      // Ignore
    }
  }, [url]);
  const [shareFeedback, setShareFeedback] = useState<'idle' | 'copied'>('idle');

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const handleShare = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title,
          url: fullUrl,
          text: title,
        });
      } else {
        await navigator.clipboard.writeText(fullUrl);
        setShareFeedback('copied');
        setTimeout(() => setShareFeedback('idle'), 2000);
      }
    } catch (err) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl);
        setShareFeedback('copied');
        setTimeout(() => setShareFeedback('idle'), 2000);
      } catch {
        // Ignore clipboard errors
      }
    }
  }, [title, fullUrl]);

  const handleBookmark = useCallback(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      const bookmarks: string[] = stored ? JSON.parse(stored) : [];
      const slug = url.replace(/^\/article\//, '');

      if (bookmarked) {
        const next = bookmarks.filter((s) => s !== slug);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
        setBookmarked(false);
      } else {
        if (!bookmarks.includes(slug)) {
          bookmarks.push(slug);
          localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        }
        setBookmarked(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [url, bookmarked]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleBookmark}
        className={`p-2 rounded-lg transition-colors ${
          bookmarked ? 'text-amber-400' : 'text-gray-400 hover:text-white'
        }`}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      >
        <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
      </button>
      <button
        onClick={handleShare}
        className="p-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Share"
      >
        {shareFeedback === 'copied' ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : (
          <Share2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
