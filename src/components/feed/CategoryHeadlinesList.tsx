'use client';

import { useState, useTransition } from 'react';
import HeadlineCard from './HeadlineCard';

type Item = any; // your actual headline type

export default function CategoryHeadlinesList({ initialItems, slug }: { initialItems: Item[]; slug: string }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [isPending, startTransition] = useTransition();

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
        setItems((prev) => [...prev, ...data.items]);
        setPage(nextPage);
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="space-y-4">
        {items.map((item) => (
          <HeadlineCard key={item.id} headline={item} />
        ))}
      </div>

      <div className="mt-8 text-center">
        {!noMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-semibold rounded-xl border border-gray-700 hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          <p className="text-sm text-gray-500">No more headlines</p>
        )}
      </div>
    </div>
  );
}