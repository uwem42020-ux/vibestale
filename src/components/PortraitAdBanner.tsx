// src/components/PortraitAdBanner.tsx

export default function PortraitAdBanner() {
    return (
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          {/* Actual advert image */}
          <img
            src="/Advertise%20with%20vibestale.png"
            alt="Advertise with VibeStale"
            className="w-full h-[600px] object-cover rounded-xl border border-[var(--border)]"
          />
        </div>
      </aside>
    );
  }