'use client';

import Image from 'next/image';
import LiveClock from './LiveClock';

interface PortraitAdBannerProps {
  initialTime?: string | null;
}

export default function PortraitAdBanner({ initialTime }: PortraitAdBannerProps) {
  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-4">
        {/* Live Date/Time card */}
        <div className="bg-[var(--surface)] rounded-xl p-4 shadow-sm border border-[var(--border)]">
          <LiveClock initialTime={initialTime} />
        </div>

        {/* Portrait ad image (optimized with Next.js Image) */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)]">
          <Image
            src="/Advertise with vibestale.png"
            alt="Advertise with Vibestale"
            width={256}
            height={600}
            className="w-full h-[600px] object-cover"
            loading="lazy"
            priority={false}
          />
        </div>
      </div>
    </aside>
  );
}