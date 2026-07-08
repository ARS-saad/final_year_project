'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightbg px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-alert-error-bg text-alert-error-text rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
          ⚠
        </div>
        <h1 className="font-heading text-2xl font-bold mb-3">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-8">
          We hit an unexpected error while loading this page. You can try again, or head back to the homepage.
        </p>

        {error?.message && (
          <div className="bg-white border border-gray-200 rounded-sm2 px-4 py-3 text-xs font-mono text-gray-500 mb-8 text-left overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-teal text-white font-semibold px-6 py-3 rounded-sm2 hover:bg-teal-hover transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border-2 border-teal text-teal-hover font-semibold px-6 py-3 rounded-sm2 hover:bg-teal hover:text-white transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
