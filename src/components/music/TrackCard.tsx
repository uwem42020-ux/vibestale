'use client';

import { useState, useRef } from 'react';

type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
  primaryGenreName?: string;
};

export default function TrackCard({ track }: { track: Track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const coverImage = track.artworkUrl100?.replace('100x100', '600x600') || '/placeholder.png';

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col">
      {/* Cover image + overlay play button */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={coverImage}
          alt={track.trackName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {track.previewUrl && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition"
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
          >
            <span
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition ${
                isPlaying ? 'bg-white text-black scale-110' : 'bg-green-600 text-white scale-0 group-hover:scale-100'
              }`}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </span>
          </button>
        )}
      </div>

      {/* Hidden audio element for preview */}
      {track.previewUrl && (
        <audio
          ref={audioRef}
          src={track.previewUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Track info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
          {track.trackName}
        </h3>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
          {track.artistName}
        </p>
        {track.collectionName && (
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
            {track.collectionName}
          </p>
        )}

        {track.primaryGenreName && (
          <span className="mt-2 inline-block bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full self-start">
            {track.primaryGenreName}
          </span>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          <a
            href={track.trackViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 text-xs font-medium hover:underline"
          >
            Open in Music ↗
          </a>
          {track.previewUrl && (
            <span className="text-[10px] text-gray-400">30s preview</span>
          )}
        </div>
      </div>
    </article>
  );
}