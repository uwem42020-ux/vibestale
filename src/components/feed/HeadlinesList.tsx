'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import HeadlineCard from './HeadlineCard';
import RotatingFeaturedCard from './RotatingFeaturedCard';

type Headline = any; // use your actual type

export default function HeadlinesList({ initialHeadlines }: { initialHeadlines: Headline[] }) {
  const [headlines, setHeadlines] = useState<Headline[]>(() => {
    const seen = new Set<string>();
    return initialHeadlines.filter((h) => {
      if (seen.has(h.id)) return false;
      seen.add(h.id);
      return true;
    });
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const featured = headlines.slice(0, 5); // top 5 for rotating
  const rest = headlines.slice(1); // skip the first one because it's in the carousel

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
        setHeadlines((prev) => {
          const existingIds = new Set(prev.map((h) => h.id));
          const uniqueNew = data.headlines.filter((h: any) => !existingIds.has(h.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const currentSentinel = sentinelRef.current;
    if (!currentSentinel || noMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !noMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(currentSentinel);
    return () => observer.disconnect();
  }, [loading, noMore, page]);

  return (
    <div>
      {featured.length > 0 && (
        <div className="mb-6">
          <RotatingFeaturedCard headlines={featured} />
        </div>
      )}

      <div className="space-y-4">
        {rest.map((headline) => (
          <HeadlineCard key={headline.id} headline={headline} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-10" />

      {loading && (
        <div className="text-center py-4">
          <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--accent)] border-t-transparent" />
        </div>
      )}

      {noMore && (
        <p className="text-sm text-[var(--text-tertiary)] text-center mt-4">
          No more stories
        </p>
      )}
    </div>
  );
}