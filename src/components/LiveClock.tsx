'use client';

import { useEffect, useState } from 'react';

interface LiveClockProps {
  initialTime?: string | null;
}

export default function LiveClock({ initialTime }: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(
    initialTime ? new Date(initialTime) : null
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!now) {
      // If no initialTime, fetch from reliable server
      async function fetchTime() {
        try {
          const response = await fetch(
            'https://timeapi.io/api/Time/current/zone?timeZone=Africa/Lagos'
          );
          if (!response.ok) throw new Error('Failed to fetch time');
          const data = {
            year: response.headers.get('x-year'),
            month: response.headers.get('x-month'),
            day: response.headers.get('x-day'),
            hour: response.headers.get('x-hour'),
            minute: response.headers.get('x-minute'),
            seconds: response.headers.get('x-seconds'),
          };
          // Fallback: parse JSON if headers not available
          if (!data.year) {
            const json = await response.json();
            setNow(new Date(
              json.year,
              json.month - 1,
              json.day,
              json.hour,
              json.minute,
              json.seconds
            ));
          } else {
            setNow(new Date(
              Number(data.year),
              Number(data.month) - 1,
              Number(data.day),
              Number(data.hour),
              Number(data.minute),
              Number(data.seconds)
            ));
          }
        } catch (error) {
          console.error('Failed to fetch server time:', error);
          setNow(new Date()); // fallback to device time
        }
      }
      fetchTime();
    }

    interval = setInterval(() => {
      setNow((prev) => {
        if (!prev) return prev;
        return new Date(prev.getTime() + 1000);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return null; // show nothing if no time yet
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
    </div>
  );
}