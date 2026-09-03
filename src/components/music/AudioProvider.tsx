'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

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

type AudioContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  queue: Track[];
  playTrack: (track: Track, trackList?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (vol: number) => void;
};

const AudioContext = createContext<AudioContextType>({
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1,
  queue: [],
  playTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  seekTo: () => {},
  setVolume: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [queue, setQueue] = useState<Track[]>([]);
  
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupPlayer = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.error('Error destroying player:', e);
      }
      playerRef.current = null;
    }
  }, []);

  const loadYouTubeAPI = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      const previousCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) {
          previousCallback();
        }
        resolve();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    });
  }, []);

  useEffect(() => {
    if (!currentTrack) {
      cleanupPlayer();
      return;
    }

    let isMounted = true;

    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI();
        
        if (!isMounted) return;
        
        cleanupPlayer();

        const playerInstance = new window.YT.Player(
          `youtube-player-${currentTrack.id}`,
          {
            videoId: currentTrack.youtube_video_id,
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              playsinline: 1,
            },
            events: {
              onReady: (event: any) => {
                if (!isMounted) return;
                playerRef.current = playerInstance;
                const videoDuration = event.target.getDuration();
                setDuration(videoDuration || 0);
                event.target.setVolume(volume * 100);
                event.target.playVideo();
                setIsPlaying(true);
              },
              onStateChange: (event: any) => {
                if (!isMounted) return;
                
                switch (event.data) {
                  case window.YT.PlayerState.PLAYING:
                    setIsPlaying(true);
                    break;
                  case window.YT.PlayerState.PAUSED:
                    setIsPlaying(false);
                    break;
                  case window.YT.PlayerState.ENDED:
                    setIsPlaying(false);
                    nextTrack();
                    break;
                  default:
                    break;
                }
              },
              onError: (error: any) => {
                console.error('YouTube player error:', error);
                setIsPlaying(false);
              },
            },
          }
        );
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
        setIsPlaying(false);
      }
    };

    initializePlayer();

    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        setProgress(currentTime || 0);
      }
    }, 500);

    return () => {
      isMounted = false;
      cleanupPlayer();
    };
  }, [currentTrack?.id]);

  const playTrack = (track: Track, trackList?: Track[]) => {
    setCurrentTrack(track);
    setProgress(0);
    setDuration(0);
    
    if (trackList && trackList.length > 0) {
      setQueue(trackList);
    } else if (queue.length === 0) {
      setQueue([track]);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play:', error);
    }
  };

  const nextTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % queue.length;
    const nextTrackItem = queue[nextIndex];
    
    setCurrentTrack(nextTrackItem);
    setProgress(0);
    setDuration(0);
    setIsPlaying(true);
  }, [currentTrack, queue]);

  const prevTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prevTrackItem = queue[prevIndex];
    
    setCurrentTrack(prevTrackItem);
    setProgress(0);
    setDuration(0);
    setIsPlaying(true);
  }, [currentTrack, queue]);

  const seekTo = (time: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(time, true);
        setProgress(time);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  const handleVolumeChange = (vol: number) => {
    const clampedVolume = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVolume);
    
    if (playerRef.current && playerRef.current.setVolume) {
      try {
        playerRef.current.setVolume(clampedVolume * 100);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      cleanupPlayer();
    };
  }, [cleanupPlayer]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume: handleVolumeChange,
      }}
    >
      {children}
      
      {currentTrack && (
        <div 
          id={`youtube-player-${currentTrack.id}`} 
          className="hidden"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        />
      )}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};