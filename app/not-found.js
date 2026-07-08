import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightbg px-6">
      <div className="max-w-md w-full text-center">
        <div className="font-mono font-bold text-7xl text-teal mb-4">404</div>
        <h1 className="font-heading text-2xl font-bold mb-3">Looks like this trip doesn&apos;t exist</h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you&apos;re looking for may have been moved, renamed, or never existed. Let&apos;s get you back on track.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="bg-teal text-white font-semibold px-6 py-3 rounded-sm2 hover:bg-teal-hover transition"
          >
            Back to Home
          </Link>
          <Link
            href="/chat"
            className="border-2 border-teal text-teal-hover font-semibold px-6 py-3 rounded-sm2 hover:bg-teal hover:text-white transition"
          >
            Ask AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
