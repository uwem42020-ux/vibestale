'use client';

import { useAudio } from './AudioProvider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PlayerBar() {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    duration, 
    volume,
    togglePlay, 
    nextTrack, 
    prevTrack, 
    seekTo,
    setVolume 
  } = useAudio();
  
  const [isVisible, setIsVisible] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      setIsVisible(true);
    }
  }, [currentTrack]);

  if (!currentTrack || !isVisible) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const thumbnailUrl = currentTrack.thumbnail_url || `https://img.youtube.com/vi/${currentTrack.youtube_video_id}/hqdefault.jpg`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)] border-t border-[var(--border)] shadow-2xl">
      {/* Progress Bar */}
      <div 
        className="relative h-1 bg-[var(--surface-hover)] cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percent = x / rect.width;
          seekTo(percent * duration);
        }}
      >
        <div 
          className="absolute left-0 top-0 h-full bg-[var(--accent)] transition-all"
          style={{ width: `${(progress / duration) * 100 || 0}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={thumbnailUrl}
              alt={currentTrack.title}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {currentTrack.title}
              </p>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevTrack}
              className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors shadow-lg"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Time & Volume */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className="text-xs text-[var(--text-tertiary)] hidden sm:block">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
            
            <div className="relative">
              <button
                onClick={() => setShowVolume(!showVolume)}
                className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                aria-label="Volume"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              
              {showVolume && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 accent-[var(--accent)]"
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              aria-label="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}