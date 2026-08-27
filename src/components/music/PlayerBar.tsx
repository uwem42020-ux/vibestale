'use client';

import { useAudio } from './AudioProvider';

export default function PlayerBar() {
  const { currentTrack, isPlaying, progress, duration, togglePlay, closePlayer } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-40 px-4 py-2">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <img
          src={currentTrack.artworkUrl100?.replace('100x100', '200x200') || '/placeholder.png'}
          alt={currentTrack.trackName}
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{currentTrack.trackName}</p>
          <p className="text-xs text-gray-400 truncate">{currentTrack.artistName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-gray-500 tabular-nums">{formatTime(progress)}</span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-[10px] text-gray-500 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button onClick={closePlayer} className="text-gray-400 hover:text-gray-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}