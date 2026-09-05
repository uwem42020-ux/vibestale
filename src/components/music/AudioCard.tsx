'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Heart, AlertCircle, Download } from 'lucide-react';

type Track = {
  id: string;
  title: string;
  artist: string | null;
  youtube_video_id: string;
  thumbnail_url?: string | null;
  audio_url?: string | null; // optional pre-stored URL
};

export default function AudioCard({ track }: { track: Track }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(track.audio_url || null);
  const [expiryMessage, setExpiryMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const thumbnailUrl =
    track.thumbnail_url || `https://img.youtube.com/vi/${track.youtube_video_id}/hqdefault.jpg`;

  useEffect(() => {
    if (track.audio_url) return;

    let isMounted = true;
    const fetchAudio = async () => {
      try {
        const res = await fetch(`/api/audio/${track.youtube_video_id}`);
        if (!res.ok) throw new Error('Failed to fetch audio');
        const data = await res.json();
        if (!isMounted) return;

        setAudioSrc(data.audioUrl);

        if (data.expiresAt) {
          const expiresAt = new Date(data.expiresAt).getTime();
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;

          if (timeUntilExpiry > 0) {
            const warningTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0);
            expiryTimerRef.current = setTimeout(() => {
              if (isMounted) setExpiryMessage('Audio URL will expire soon. Please restart playback.');
            }, warningTime);

            setTimeout(() => {
              if (isMounted) setExpiryMessage(null);
            }, warningTime + 10 * 60 * 1000);
          } else {
            setExpiryMessage('Audio URL has expired. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error fetching audio URL:', error);
        if (isMounted) setExpiryMessage('Failed to load audio. Please try again.');
      }
    };

    fetchAudio();

    return () => {
      isMounted = false;
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    };
  }, [track.youtube_video_id, track.audio_url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error('Playback failed:', err);
        setExpiryMessage('Playback failed. The audio URL may be expired. Please try again.');
        setPlaying(false);
      });
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors">
      <div className="flex items-center gap-4 p-3">
        <button
          onClick={togglePlay}
          disabled={!audioSrc}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <img
          src={thumbnailUrl}
          alt={track.title}
          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg flex-shrink-0"
          loading="lazy"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {track.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                {track.artist || 'Unknown Artist'}
              </p>
            </div>
            <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>

          <div className="mt-2 h-1 bg-[var(--surface-hover)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all"
              style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
            />
          </div>

          {expiryMessage && (
            <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
              <AlertCircle className="w-3 h-3" />
              {expiryMessage}
            </div>
          )}
        </div>

        <a
          href={`/api/audio/${track.youtube_video_id}/download`}
          download
          className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--surface-hover)] transition-colors"
          aria-label="Download track"
        >
          <Download className="w-4 h-4" />
        </a>

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

      <audio ref={audioRef} src={audioSrc || undefined} preload="metadata" />
    </div>
  );
}