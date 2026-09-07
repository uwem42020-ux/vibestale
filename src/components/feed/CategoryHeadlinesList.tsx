'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import HeadlineCard from './HeadlineCard';

type Item = any; // your actual headline type

export default function CategoryHeadlinesList({ initialItems, slug }: { initialItems: Item[]; slug: string }) {
  // Deduplicate initial items by ID
  const [items, setItems] = useState<Item[]>(() => {
    const seen = new Set<string>();
    return initialItems.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (loading || noMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const res = await fetch(`/api/category-headlines?slug=${slug}&page=${nextPage}&limit=10`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    if (data.items.length === 0) {
      setNoMore(true);
    } else {
      startTransition(() => {
        setItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNew = data.items.filter((item: any) => !existingIds.has(item.id));
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
      <div className="space-y-4">
        {items.map((item) => (
          <HeadlineCard key={item.id} headline={item} />
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
          No more headlines
        </p>
      )}
    </div>
  );
}