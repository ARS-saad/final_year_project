import Link from "next/link";

export default function Navbar({ activeChat = false }) {
  return (
    <>
      <div
        className="bg-alert-info-bg text-alert-info-text text-center text-sm font-semibold py-2"
        suppressHydrationWarning
      >
        ✈ Summer Sale: Save up to 20% on Southeast Asia tours — use code
        Floraflyers20
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-4">
          <Link href="/" className="font-heading font-bold text-xl text-navy">
            Flora<span className="text-teal">flyers</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#packages"
              className="text-navy font-medium text-sm hover:text-teal transition"
            >
              Destinations
            </Link>
            <Link
              href="/#packages"
              className="text-navy font-medium text-sm hover:text-teal transition"
            >
              Packages
            </Link>
            <Link
              href="/#about"
              className="text-navy font-medium text-sm hover:text-teal transition"
            >
              About
            </Link>
            <Link
              href="/chat"
              className={`font-medium text-sm transition ${
                activeChat ? "text-teal font-bold" : "text-navy hover:text-teal"
              }`}
            >
              AI Assistant
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="hidden sm:inline-block px-4 py-2 rounded-sm2 text-sm font-semibold text-navy hover:bg-navy/5 transition"
            >
              ✨ AI Chat
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-sm2 text-sm font-semibold text-navy hover:bg-navy/5 transition"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-sm2 text-sm font-semibold bg-teal text-white hover:bg-teal-hover transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
