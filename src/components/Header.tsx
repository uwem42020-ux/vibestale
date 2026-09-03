'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/60 backdrop-blur-lg border-b border-gray-800/80'
          : 'bg-black border-b border-gray-800'
      }`}
    >
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

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link
            href="/"
            className={`font-medium transition ${
              pathname === '/' ? 'text-green-400' : 'text-gray-200 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`font-medium transition ${
              pathname === '/about' ? 'text-green-400' : 'text-gray-200 hover:text-white'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 text-gray-200 hover:text-white"
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full bg-black/80 backdrop-blur-lg border-b border-gray-800 z-50 md:hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
              <img
                src="/whitelogo.png"
                alt="VibeStale"
                className="h-8 w-auto"
              />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1 text-gray-300 hover:text-white"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-3 px-5 py-4">
              {/* Only About on mobile dropdown */}
              <Link
                href="/about"
                className={`text-base transition ${
                  pathname === '/about' ? 'text-green-400 font-semibold' : 'text-white hover:text-green-400'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}