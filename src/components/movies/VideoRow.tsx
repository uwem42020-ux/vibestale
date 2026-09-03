'use client';

import { useState, useEffect } from 'react';

type Video = {
  videoId: string;
  title: string;
  thumbnail: string;
};

export default function VideoRow({ title, videos }: { title: string; videos: Video[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Stop other videos when a new one starts
  useEffect(() => {
    const handleVideoPlay = (e: Event) => {
      const custom = e as CustomEvent<{ id: string }>;
      if (custom.detail?.id !== playingId) setPlayingId(null);
    };
    window.addEventListener('vibestale:movie-play', handleVideoPlay as EventListener);
    return () => window.removeEventListener('vibestale:movie-play', handleVideoPlay as EventListener);
  }, [playingId]);

  if (videos.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x no-scrollbar">
        {videos.map((video) => (
          <div key={video.videoId} className="snap-start flex-shrink-0 w-40 sm:w-48">
            {playingId === video.videoId ? (
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('vibestale:movie-play', { detail: { id: video.videoId } }));
                  setPlayingId(video.videoId);
                }}
                className="relative block w-full aspect-video bg-gray-800 rounded-xl overflow-hidden"
              >
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </span>
                </span>
              </button>
            )}
            <h3 className="text-xs font-semibold text-white line-clamp-2 mt-2">{video.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}