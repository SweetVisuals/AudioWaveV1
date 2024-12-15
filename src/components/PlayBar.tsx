import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import { useAudioStore } from '../store/useAudioStore';

interface PlayBarProps {
  isExpanded?: boolean;
}

export function PlayBar({ isExpanded = false }: PlayBarProps) {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  const { currentTrack, isPlaying, volume, setIsPlaying, setVolume } = useAudioStore();

  // Auto-expand when a track is playing
  useEffect(() => {
    if (currentTrack) {
      setLocalExpanded(true);
    }
  }, [currentTrack]);

  const playBarAnimation = useSpring({
    from: { transform: 'translateY(100%)' },
    to: {
      transform: localExpanded || isExpanded ? 'translateY(0%)' : 'translateY(100%)',
    },
    config: { tension: 280, friction: 24 }
  });

  const buttonAnimation = useSpring({
    transform: localExpanded || isExpanded ? 'translateY(100%)' : 'translateY(0%)',
    opacity: localExpanded || isExpanded ? 0 : 1,
    config: { tension: 280, friction: 24 }
  });

  const arrowAnimation = useSpring({
    transform: localExpanded || isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    config: { tension: 280, friction: 24 }
  });

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Floating Action Button */}
      {currentTrack && (
        <animated.button
          style={buttonAnimation}
          onClick={() => setLocalExpanded(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg z-50 group"
        >
          <ChevronUp size={24} />
        </animated.button>
      )}

      {/* Play Bar */}
      {currentTrack && (
        <animated.div
          style={playBarAnimation}
          className="fixed bottom-0 left-0 right-0 bg-dark-light/95 backdrop-blur-lg border-t border-white/10 p-4 z-40"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">{currentTrack.title}</h4>
                {currentTrack.artist && (
                  <p className="text-xs text-white/60">{currentTrack.artist}</p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <button className="text-white/80 hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="text-white/80 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
            </div>

            {/* Volume & Minimize */}
            <div className="flex items-center gap-4">
              <Volume2 size={20} className="text-white/80" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-primary"
              />
              <button
                onClick={() => setLocalExpanded(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <animated.div style={arrowAnimation}>
                  <ChevronUp size={20} />
                </animated.div>
              </button>
            </div>
          </div>
        </animated.div>
      )}
    </>
  );
}