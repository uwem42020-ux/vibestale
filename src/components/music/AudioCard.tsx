'use client';

import { useState } from 'react';

type AudioTrack = {
  id: string;
  title: string;
  artist: string | null;
  youtube_video_id: string;
  thumbnail_url: string | null;
};

export default function AudioCard({ track }: { track: AudioTrack }) {
  const [playing, setPlaying] = useState(false);

  return (
    <article className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        {/* Thumbnail */}
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
          {track.thumbnail_url ? (
            <img src={track.thumbnail_url} alt={track.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl text-gray-500">🎵</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white line-clamp-1">{track.title}</h3>
          {track.artist && <p className="text-xs text-gray-400 mt-0.5">{track.artist}</p>}
        </div>

        {/* Play button */}
        <button
          onClick={() => setPlaying((prev) => !prev)}
          className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center"
        >
          {playing ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Audio player */}
      {playing && (
        <div className="px-3 pb-3">
          <iframe
            width="100%"
            height="60"
            src={`https://www.youtube-nocookie.com/embed/${track.youtube_video_id}?autoplay=1&rel=0`}
            title={track.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </article>
  );
}