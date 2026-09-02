'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img
            src="/whitelogo.png"
            alt="VibeStale"
            className="h-10 w-auto"
            width={2172}
            height={724}
          />
        </Link>

        {/* Desktop nav (visible on md and up) */}
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link href="/media" className="text-gray-300 hover:text-white font-medium">Media</Link>
          <Link href="/music" className="text-gray-300 hover:text-white font-medium">Music</Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-4 py-3">
          <nav className="flex flex-col gap-3">
            <Link
              href="/media"
              className="text-gray-300 hover:text-white py-1"
              onClick={() => setMenuOpen(false)}
            >
              Media
            </Link>
            <Link
              href="/music"
              className="text-gray-300 hover:text-white py-1"
              onClick={() => setMenuOpen(false)}
            >
              Music
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}