'use client';

import { useState, useEffect } from 'react';

type LiveTVChannel = {
  name: string;
  videoId: string;
  logo?: string;
  description?: string;
};

export default function LiveTVCard({ channel }: { channel: LiveTVChannel }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  // Stop playback if another video starts
  useEffect(() => {
    const stopVideo = () => setPlaying(false);
    const handleVideoPlay = (e: Event) => {
      const custom = e as CustomEvent<{ id: string }>;
      if (custom.detail?.id !== channel.videoId) {
        setPlaying(false);
      }
    };

    window.addEventListener('vibestale:live-tv-play', handleVideoPlay as EventListener);
    return () => window.removeEventListener('vibestale:live-tv-play', handleVideoPlay as EventListener);
  }, [channel.videoId]);

  const handlePlay = () => {
    // Notify other cards to stop
    window.dispatchEvent(
      new CustomEvent('vibestale:live-tv-play', { detail: { id: channel.videoId } })
    );
    setLoading(true);
    setPlaying(true);
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
      {playing ? (
        <div className="aspect-video relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-sm font-medium">
              <span className="animate-pulse">Loading LIVE news…</span>
            </div>
          )}
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube-nocookie.com/embed/${channel.videoId}?autoplay=1&rel=0`}
            title={channel.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setLoading(false)}
          />
        </div>
      ) : (
        <button
          onClick={handlePlay}
          className="relative block w-full aspect-video bg-black"
        >
          {channel.logo ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-full h-full object-cover opacity-80"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl font-bold text-white">{channel.name.charAt(0)}</span>
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </span>
          </span>
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            LIVE
          </span>
        </button>
      )}

      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-1">{channel.name}</h3>
        {channel.description && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{channel.description}</p>
        )}
        <a
          href={`https://www.youtube.com/watch?v=${channel.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-green-500 text-xs font-medium hover:underline"
        >
          Watch on YouTube ↗
        </a>
      </div>
    </div>
  );
}