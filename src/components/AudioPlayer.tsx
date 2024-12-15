import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useAudioStore } from '../store/useAudioStore';
import { useGemStore } from '../store/useGemStore';
import { useUpvoteStore } from '../store/useUpvoteStore';
import { Play, Pause, Volume2, Gem, ThumbsUp, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface AudioPlayerProps {
  id: number;
  url: string;
  title: string;
  artist?: string;
  artistId?: string;
  artistImage?: string;
  price?: {
    buy: number;
    lease: number;
  };
  stats?: {
    gems: number;
    streams: number;
    upvotes: number;
    popularity: number;
  };
  onPlay?: (track: { id: number; title: string; artist?: string; url: string }) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function AudioPlayer({ 
  id,
  url, 
  title, 
  artist,
  artistId,
  artistImage,
  price,
  stats,
  onPlay
}: AudioPlayerProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, volume, setVolume } = useAudioStore();
  const { userGems, trackGems, incrementTrackGems } = useGemStore();
  const { trackUpvotes, toggleUpvote } = useUpvoteStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  const isCurrentTrack = currentTrack?.id === id;
  const hasGivenGem = trackGems[id] || false;
  const currentGems = (stats?.gems || 0) + (hasGivenGem ? 1 : 0);
  const isUpvoted = trackUpvotes[id] || false;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isCurrentTrack && isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isCurrentTrack, isPlaying]);

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (artistId) {
      navigate(`/dashboard/${artistId}`);
    } else if (artist) {
      navigate(`/dashboard/${artist.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  const handleTrackClick = () => {
    navigate(`/track/${id}`);
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent track navigation when clicking play/pause
    if (!isCurrentTrack) {
      setCurrentTrack({ id, title, artist, url });
      setIsPlaying(true);
      onPlay?.({ id, title, artist, url });
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleGem = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent track navigation when giving gem
    if (!user) {
      toast.error('Please connect your wallet to give gems');
      return;
    }
    
    if (hasGivenGem) {
      toast.error('You have already given a gem to this track');
      return;
    }
    
    if (userGems > 0) {
      incrementTrackGems(id);
      toast.success('Gem given successfully!');
    } else {
      toast.error('You have no gems remaining');
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent track navigation when upvoting
    if (!user) {
      toast.error('Please connect your wallet to upvote');
      return;
    }
    toggleUpvote(id, stats?.upvotes || 0);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent track navigation when clicking message
    if (!user) {
      toast.error('Please connect your wallet to send messages');
      return;
    }
    toast.success('Message feature coming soon!');
  };

  return (
    <div className="p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={handleTrackClick}>
      {/* Top Row: Play Button, Title, Artist, and Volume */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlayPause}
          className="p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors"
        >
          {isCurrentTrack && isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-white truncate">{title}</h3>
          {artist && (
            <div className="flex items-center gap-2">
              {artistImage && (
                <img 
                  src={artistImage} 
                  alt={artist}
                  className="w-5 h-5 rounded-full cursor-pointer"
                  onClick={handleArtistClick}
                />
              )}
              <button
                onClick={handleArtistClick}
                className="text-sm text-white/60 hover:text-white truncate"
              >
                {artist}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="text-white/60" size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onClick={(e) => e.stopPropagation()} // Prevent track navigation when adjusting volume
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-primary"
          />
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    'w-1.5 h-4 rounded-full transition-colors',
                    i < Math.ceil((stats.popularity / 100) * 5)
                      ? 'bg-primary'
                      : 'bg-white/20'
                  )}
                />
              ))}
            </div>
            
            <span className="text-xs text-white/60">
              {formatNumber(stats.streams)} streams
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUpvote}
              className={clsx(
                'flex items-center gap-1 px-2 py-1 rounded-lg transition-colors',
                isUpvoted
                  ? 'text-primary bg-primary/20'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <ThumbsUp size={16} className={isUpvoted ? 'fill-primary' : ''} />
              <span className="text-xs">{formatNumber(stats.upvotes)}</span>
            </button>

            <button
              onClick={handleGem}
              className={clsx(
                'flex items-center gap-1 px-2 py-1 rounded-lg transition-colors',
                hasGivenGem
                  ? 'text-primary bg-primary/20'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Gem size={16} className={hasGivenGem ? 'fill-primary' : ''} />
              <span className="text-xs">{formatNumber(currentGems)}</span>
            </button>

            <button
              onClick={handleMessage}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MessageCircle size={16} />
            </button>
          </div>
        </div>
      )}

      <audio 
        ref={audioRef} 
        src={url} 
        className="hidden"
      />
    </div>
  );
}
