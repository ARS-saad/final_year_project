"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-lightbg">
      <div className="px-8 py-6">
        <Link href="/" className="font-heading font-bold text-xl text-navy">
          Flora<span className="text-teal">flyers</span>
        </Link>
      </div>

      <div className="flex-1 flex items-stretch">
        <div
          className="hidden md:flex flex-1 items-end p-12 text-white"
          style={{
            backgroundImage:
              "linear-gradient(rgba(29,45,68,0.68), rgba(2,128,144,0.6)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div>
            <h2 className="font-heading text-3xl font-bold mb-2.5">
              Welcome back, explorer.
            </h2>
            <p className="text-[#E4EAF0] max-w-sm text-sm">
              Log in to manage your bookings, track your itineraries, and keep
              chatting with your AI travel assistant.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h1 className="font-heading text-3xl font-bold mb-2">Log In</h1>
            <p className="text-gray-500 text-sm mb-7">
              Enter your details to access your account.
            </p>

            <div className="flex gap-2.5 bg-alert-info-bg text-alert-info-text border-l-4 border-teal-hover rounded-sm2 px-4 py-3 text-sm mb-6">
              <span>ℹ</span>
              <div>Demo only — this form does not submit anywhere yet.</div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                />
              </div>
              <div className="flex justify-between items-center text-sm mb-6">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" /> Remember me
                </label>
                <Link
                  href="#"
                  className="text-teal-hover font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-teal text-white font-semibold py-3.5 rounded-sm2 hover:bg-teal-hover transition active:scale-[0.98]"
              >
                Log In
              </button>
            </form>

            <div className="flex items-center gap-3 my-6 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-200" />
              or continue with
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-sm2 py-2.5 text-sm font-semibold hover:bg-lightbg transition">
                🔵 Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-sm2 py-2.5 text-sm font-semibold hover:bg-lightbg transition">
                📘 Facebook
              </button>
            </div>

            <div className="text-center mt-7 text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-teal-hover font-semibold hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
