import Image from 'next/image';

export function PortraitAd() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      <Image
        src="/Advertise with vibestale.png"
        alt="Advertise with VibeStale"
        width={256}
        height={600}
        className="w-full h-[600px] object-cover"
        loading="lazy"
      />
    </div>
  );
}

export function SmallAd() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-[var(--border)]">
      <Image
        src="/advert design.png"
        alt="Advertisement"
        width={320}
        height={100}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </div>
  );
}