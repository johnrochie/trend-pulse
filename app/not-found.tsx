import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-900 text-gray-100">
      <h1 className="text-6xl md:text-8xl font-bold mb-4">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          404
        </span>
      </h1>
      <p className="text-xl text-gray-400 mb-8 text-center max-w-md">
        This page doesn&apos;t exist or has moved. Let&apos;s get you back on track.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-600 hover:to-blue-600 transition-all"
        >
          Back to home
        </Link>
        <Link
          href="/articles"
          className="px-6 py-3 rounded-lg font-medium border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-white transition-colors"
        >
          Browse articles
        </Link>
      </div>
    </div>
  );
}
