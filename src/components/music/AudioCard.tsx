'use client';

import { useAudio } from './AudioProvider';
import { Play, Pause, Music, Heart, Share2, Clock } from 'lucide-react';
import { useState } from 'react';

type Track = {
  id: string;
  title: string;
  artist: string | null;
  youtube_video_id: string;
  thumbnail_url?: string | null;
  duration?: number;
  plays?: number;
  likes?: number;
};

export default function AudioCard({ track, index }: { track: Track; index?: number }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [liked, setLiked] = useState(false);
  
  const isCurrent = currentTrack?.id === track.id;
  const thumbnailUrl = track.thumbnail_url || `https://img.youtube.com/vi/${track.youtube_video_id}/hqdefault.jpg`;

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div className={`group bg-[var(--surface)] rounded-xl border transition-all ${
      isCurrent 
        ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10' 
        : 'border-[var(--border)] hover:border-[var(--accent)]/30 hover:shadow-md'
    }`}>
      <div className="flex items-center gap-4 p-3">
        {/* Number/Play Button */}
        <div className="flex-shrink-0 w-8 text-center">
          {isCurrent && isPlaying ? (
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-1 bg-[var(--accent)] animate-pulse" style={{ height: '100%' }} />
              <span className="w-1 bg-[var(--accent)] animate-pulse" style={{ height: '60%', animationDelay: '0.2s' }} />
              <span className="w-1 bg-[var(--accent)] animate-pulse" style={{ height: '80%', animationDelay: '0.4s' }} />
            </div>
          ) : (
            <span className={`text-sm font-bold ${isCurrent ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`}>
              {index !== undefined ? index + 1 : <Music className="w-4 h-4" />}
            </span>
          )}
        </div>

        {/* Thumbnail */}
        <div className="flex-shrink-0 relative">
          <img
            src={thumbnailUrl}
            alt={track.title}
            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
            loading="lazy"
          />
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            aria-label={isCurrent && isPlaying ? 'Pause' : 'Play'}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${
            isCurrent ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
          }`}>
            {track.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {track.artist || 'Unknown Artist'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-lg transition-colors ${
              liked 
                ? 'text-[var(--accent)] bg-[var(--accent)]/10' 
                : 'text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--surface-hover)]'
            }`}
            aria-label="Like track"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}