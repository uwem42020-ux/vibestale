'use client';

import { useState, useTransition } from 'react';
import HeadlineCard from './HeadlineCard';
import FeaturedHeadlineCard from './FeaturedHeadlineCard';

type Headline = any; // use your actual type

export default function HeadlinesList({ initialHeadlines }: { initialHeadlines: Headline[] }) {
  const [headlines, setHeadlines] = useState<Headline[]>(initialHeadlines);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  const featured = headlines[0];
  const rest = headlines.slice(1);

  const loadMore = async () => {
    if (loading || noMore) return;
    setLoading(true);

    const nextPage = page + 1;
    const res = await fetch(`/api/headlines?page=${nextPage}&limit=10`);
    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();
    if (data.headlines.length === 0) {
      setNoMore(true);
    } else {
      startTransition(() => {
        setHeadlines((prev) => [...prev, ...data.headlines]);
        setPage(nextPage);
      });
    }
    setLoading(false);
  };

  return (
    <div>
      {featured && (
        <div className="mb-6">
          <FeaturedHeadlineCard headline={featured} />
        </div>
      )}

      <div className="space-y-4">
        {rest.map((headline) => (
          <HeadlineCard key={headline.id} headline={headline} />
        ))}
      </div>

      <div className="mt-8 text-center">
        {!noMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--surface)] text-[var(--text-primary)] font-semibold rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all shadow-sm hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Stories'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          <p className="text-sm text-[var(--text-tertiary)]">No more stories</p>
        )}
      </div>
    </div>
  );
}