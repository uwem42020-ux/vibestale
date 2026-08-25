'use client';

import { useEffect, useState } from 'react';

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  const formatted = new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Africa/Lagos',
  }).format(now);

  return (
    <div className="text-xs text-gray-500 flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
      {formatted} WAT
    </div>
  );
}