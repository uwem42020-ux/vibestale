'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const headlineCategories = [
  { slug: 'general', label: 'General' },
  { slug: 'politics', label: 'Politics' },
  { slug: 'business', label: 'Business' },
  { slug: 'sports', label: 'Sports' },
  { slug: 'tech', label: 'Tech' },
  { slug: 'entertainment', label: 'Entertainment' },
];

const mediaCategories = [
  { label: 'Music', href: '/music' },
  { label: 'Music Videos', href: '/music-videos' },
  { label: 'Celebrity News', href: '/music-news' },
  { label: 'Movies', href: '/movies' },
  { label: 'Live TV', href: '/live-tv' },
  { label: 'Memes', href: '/memes' },
];

export default function Sidebar({ initialTime }: { initialTime?: string | null }) {
  const pathname = usePathname();
  const [headlinesOpen, setHeadlinesOpen] = useState(true);
  const [mediaOpen, setMediaOpen] = useState(false);

  // Automatically set open state based on route
  useEffect(() => {
    const isMediaRoute = mediaCategories.some((item) => pathname.startsWith(item.href));
    if (isMediaRoute) {
      setHeadlinesOpen(false);
      setMediaOpen(true);
    } else if (pathname === '/' || pathname.startsWith('/category/')) {
      setHeadlinesOpen(true);
      setMediaOpen(false);
    } else {
      setHeadlinesOpen(true);
      setMediaOpen(false);
    }
  }, [pathname]);

  return (
    <aside className="hidden md:block w-60 flex-shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar space-y-1">
        {/* Date/Time */}
        <div className="mb-4">
          <div className="text-xs text-gray-300">{initialTime || ''}</div>
          <div className="mt-4 border-t border-gray-700" />
        </div>

        {/* Headlines button (goes to home) */}
        <button
          onClick={() => {
            setHeadlinesOpen((prev) => !prev);
            if (!headlinesOpen) setMediaOpen(false);
          }}
          className={`w-full flex items-center justify-between text-sm font-semibold px-4 py-2 rounded-lg ${
            pathname === '/' ? 'bg-green-700 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          <span>Headlines</span>
          <svg
            className={`w-4 h-4 transition-transform ${headlinesOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {headlinesOpen && (
          <div className="ml-4 flex flex-col gap-1">
            {headlineCategories.map((cat) => {
              const active = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`block px-3 py-1.5 rounded-lg text-sm transition ${
                    active
                      ? 'bg-green-700 text-white font-semibold'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Media dropdown */}
        <button
          onClick={() => {
            setMediaOpen((prev) => !prev);
            if (!mediaOpen) setHeadlinesOpen(false);
          }}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-300 hover:text-white px-4 py-2 rounded-lg"
        >
          <span>Media</span>
          <svg
            className={`w-4 h-4 transition-transform ${mediaOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mediaOpen && (
          <div className="ml-4 flex flex-col gap-1">
            {mediaCategories.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-1.5 rounded-lg text-sm transition ${
                    active
                      ? 'bg-green-700 text-white font-semibold'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}