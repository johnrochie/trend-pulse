'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to reporting service if needed
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        We hit an error loading this page. You can try again or head back home.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-600 hover:to-blue-600 transition-all"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg font-medium border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
