'use client';

import { useRef, useState } from 'react';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const coverImage = track.artworkUrl100?.replace('100x100', '400x400') || '/placeholder.png';

  const togglePlay = () => {
    if (!audioRef.current || !track.previewUrl) return;
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
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col w-36 sm:w-44">
      {/* Cover image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={coverImage}
          alt={track.trackName}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {track.previewUrl && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg">
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </span>
          </button>
        )}
      </div>

      {/* Hidden audio for preview */}
      {track.previewUrl && (
        <audio
          ref={audioRef}
          src={track.previewUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Info */}
      <div className="p-2.5 flex flex-col flex-1">
        <h3 className="text-xs font-semibold text-gray-900 line-clamp-1">{track.trackName}</h3>
        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">{track.artistName}</p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <a
            href={track.trackViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 text-[10px] font-medium hover:underline"
          >
            Open ↗
          </a>
          {track.primaryGenreName && (
            <span className="text-[9px] text-gray-400 truncate max-w-[70px]">
              {track.primaryGenreName}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}