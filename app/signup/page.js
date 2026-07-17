"use client";

import Link from "next/link";

export default function SignupPage() {
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
              "linear-gradient(rgba(29,45,68,0.68), rgba(255,90,95,0.35)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div>
            <h2 className="font-heading text-3xl font-bold mb-2.5">
              Your next trip starts here.
            </h2>
            <p className="text-[#E4EAF0] max-w-sm text-sm">
              Create a free account to save favorites, get AI-matched tour
              recommendations, and book in seconds.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h1 className="font-heading text-3xl font-bold mb-2">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm mb-7">
              Join thousands of travelers planning smarter.
            </p>

            <div className="flex gap-2.5 bg-alert-info-bg text-alert-info-text border-l-4 border-teal-hover rounded-sm2 px-4 py-3 text-sm mb-6">
              <span>ℹ</span>
              <div>Demo only — this form does not submit anywhere yet.</div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="mb-4">
                  <label
                    htmlFor="fname"
                    className="block text-sm font-semibold mb-1.5"
                  >
                    First Name
                  </label>
                  <input
                    id="fname"
                    type="text"
                    placeholder="Jamal"
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="lname"
                    className="block text-sm font-semibold mb-1.5"
                  >
                    Last Name
                  </label>
                  <input
                    id="lname"
                    type="text"
                    placeholder="Uddin"
                    className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                  />
                </div>
              </div>
              <div className="mb-4">
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
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="cpassword"
                  className="block text-sm font-semibold mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="cpassword"
                  type="password"
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-3 border border-gray-200 rounded-sm2 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition"
                />
              </div>
              <label className="flex items-start gap-2 text-sm text-gray-600 mb-6">
                <input type="checkbox" className="mt-1" />
                <span>
                  I agree to the{" "}
                  <Link href="#" className="text-teal-hover font-semibold">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-teal-hover font-semibold">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <button
                type="submit"
                className="w-full bg-teal text-white font-semibold py-3.5 rounded-sm2 hover:bg-teal-hover transition active:scale-[0.98]"
              >
                Create Account
              </button>
            </form>

            <div className="flex items-center gap-3 my-6 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-200" />
              or sign up with
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
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-teal-hover font-semibold hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
