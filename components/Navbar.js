'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navbar({ activeChat = false }) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoadingUser(false);
    });

    // Keep the navbar in sync the moment login/logout happens anywhere in the app.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const displayName =
    user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account';

  return (
    <>
      <div className="bg-alert-info-bg text-alert-info-text text-center text-sm font-semibold py-2 px-4">
        ✈ Summer Sale: Save up to 20% on Southeast Asia tours — use code FLORA20
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-4">
          <Link href="/" className="font-heading font-bold text-xl text-navy">
            Flora<span className="text-teal">Flyers</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#packages" className="text-navy font-medium text-sm hover:text-teal transition">
              Destinations
            </Link>
            <Link href="/#packages" className="text-navy font-medium text-sm hover:text-teal transition">
              Packages
            </Link>
            <Link href="/#about" className="text-navy font-medium text-sm hover:text-teal transition">
              About
            </Link>
            <Link
              href="/chat"
              className={`font-medium text-sm transition ${
                activeChat ? 'text-teal font-bold' : 'text-navy hover:text-teal'
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

            {loadingUser ? (
              <div className="w-24 h-9" /> // reserve space to avoid layout shift while checking auth
            ) : user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-sm2 text-sm font-semibold text-navy">
                  <div className="w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {displayName[0]?.toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-sm2 text-sm font-semibold text-navy border border-gray-200 hover:bg-navy/5 transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
