'use client';

import { useState, useEffect } from 'react';

type MemeVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
};

export default function MemeCard({ video }: { video: MemeVideo }) {
  const [playing, setPlaying] = useState(false);

  // Stop playback when another meme starts
  useEffect(() => {
    const handlePlay = (e: Event) => {
      const custom = e as CustomEvent<{ id: string }>;
      if (custom.detail?.id !== video.videoId) setPlaying(false);
    };
    window.addEventListener('vibestale:meme-play', handlePlay as EventListener);
    return () => window.removeEventListener('vibestale:meme-play', handlePlay as EventListener);
  }, [video.videoId]);

  const handlePlayClick = () => {
    window.dispatchEvent(new CustomEvent('vibestale:meme-play', { detail: { id: video.videoId } }));
    setPlaying(true);
  };

  return (
    <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden w-40 sm:w-48 flex-shrink-0">
      {playing ? (
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
          onClick={handlePlayClick}
          className="relative block w-full aspect-video bg-black"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </span>
          </span>
        </button>
      )}

      <div className="p-2">
        <h3 className="text-xs font-semibold text-white line-clamp-2">{video.title}</h3>
      </div>
    </div>
  );
}