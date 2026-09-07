'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Newspaper, Tv, Clock } from 'lucide-react';

const headlineCategories = [
  { slug: 'general', label: 'General', icon: '📰' },
  { slug: 'politics', label: 'Politics', icon: '🏛️' },
  { slug: 'business', label: 'Business', icon: '💼' },
  { slug: 'sports', label: 'Sports', icon: '⚽' },
  { slug: 'tech', label: 'Tech', icon: '💻' },
  { slug: 'entertainment', label: 'Entertainment', icon: '🎬' },
];

export default function Sidebar({ initialTime }: { initialTime?: string | null }) {
  const pathname = usePathname();
  const [headlinesOpen, setHeadlinesOpen] = useState(true);

  // No media section, so we can keep headlines open by default.
  // If you later want to close it on certain routes, adjust here.
  useEffect(() => {
    // Keep headlines open unless on a headline detail page (optional)
    if (pathname.startsWith('/headline/')) {
      setHeadlinesOpen(false);
    } else {
      setHeadlinesOpen(true);
    }
  }, [pathname]);

  const date = initialTime ? new Date(initialTime) : new Date();
  const dateString = new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(date);

  const timeString = new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(date);

  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar space-y-4">
        {/* Date/Time Card */}
        <div className="bg-[var(--surface)] rounded-xl p-4 shadow-sm border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-xs text-[var(--text-tertiary)]">{dateString}</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
            {timeString} <span className="text-sm font-normal">WAT</span>
          </div>
        </div>

        {/* Headlines Section */}
        <div className="bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)]">
          <button
            onClick={() => setHeadlinesOpen(!headlinesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--surface-hover)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">Headlines</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${headlinesOpen ? 'rotate-180' : ''}`} />
          </button>

          {headlinesOpen && (
            <div className="px-2 pb-2 space-y-1">
              {headlineCategories.map((cat) => {
                const active = pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      active
                        ? 'bg-[var(--accent)] text-white font-semibold shadow-md'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="my-2 border-t border-[var(--border)]" />

              {/* Live News Link */}
              <Link
                href="/live-news"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  pathname === '/live-news'
                    ? 'bg-[var(--accent)] text-white font-semibold shadow-md'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>Live News</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}