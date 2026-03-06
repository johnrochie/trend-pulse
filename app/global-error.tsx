'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          A critical error occurred. Please try again or return home.
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-medium border border-gray-600 text-gray-300 hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
