'use client';

import { useEffect, useState } from 'react';

interface TimeApiResponse {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
}

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchTime() {
      try {
        const response = await fetch(
          'https://timeapi.io/api/Time/current/zone?timeZone=Africa/Lagos'
        );
        if (!response.ok) throw new Error('Failed to fetch time');
        const data: TimeApiResponse = await response.json();

        const serverDate = new Date(
          data.year,
          data.month - 1,
          data.day,
          data.hour,
          data.minute,
          data.seconds
        );
        setNow(serverDate);
        setError(false);
      } catch (err) {
        console.error('Failed to fetch server time:', err);
        setError(true);
        setNow(new Date()); // fallback to device time
      }
    }

    fetchTime();

    interval = setInterval(() => {
      setNow((prev) => {
        if (!prev) return prev;
        return new Date(prev.getTime() + 1000);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!now) {
    // Return an empty div to avoid layout shift, or null to show nothing
    return null;
  }

  const dateString = new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  }).format(now);

  const timeString = new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(now);

  return (
    <div className="text-xs text-gray-300 flex flex-col gap-0.5">
      <span>{dateString}</span>
      <span className="font-semibold text-white">{timeString} WAT</span>
      {error && <span className="text-[10px] text-gray-500">(device time)</span>}
    </div>
  );
}