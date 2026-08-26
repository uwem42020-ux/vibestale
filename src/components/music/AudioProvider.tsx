'use client';

import { createContext, useContext, useRef, useState, ReactNode } from 'react';

type Track = {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string | null;
  trackViewUrl: string;
  collectionName?: string;
  primaryGenreName?: string;
};

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: Track) => {
    if (!track.previewUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.previewUrl;
      audioRef.current.load();
    } else {
      audioRef.current = new Audio(track.previewUrl);
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
    }

    setCurrentTrack(track);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  };

  return (
    <AudioContext.Provider
      value={{ currentTrack, isPlaying, progress, duration, playTrack, togglePlay, closePlayer }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}