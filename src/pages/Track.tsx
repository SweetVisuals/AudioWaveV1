import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useAudioStore } from '../store/useAudioStore';
import { useGemStore } from '../store/useGemStore';
import { useUpvoteStore } from '../store/useUpvoteStore';
import { Play, Pause, Volume2, ThumbsUp, Gem, Share2, MessageCircle, User } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// Mock data for demonstration
const MOCK_TRACK = {
  id: 1,
  title: "Summer Vibes",
  artist: "DJ Wave",
  artistId: "dj-wave",
  description: "A chill summer beat perfect for your next project",
  artistImage: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop&q=80",
  stats: {
    gems: 156,
    streams: 125000,
    upvotes: 3200,
    popularity: 85,
    comments: 42
  },
  price: {
    buy: 29.99,
    lease: 9.99
  },
  audio_url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
  artist_stats: {
    followers: 12500,
    following: 450,
    tracks: 24,
    gems_received: 2800
  }
};

const MOCK_COMMENTS = [
  {
    id: 1,
    user: {
      name: "Producer X",
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=50&h=50&fit=crop&q=80"
    },
    text: "This beat is fire! 🔥",
    timestamp: "2 hours ago",
    likes: 12
  },
  {
    id: 2,
    user: {
      name: "Beat Maker",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=50&h=50&fit=crop&q=80"
    },
    text: "The mix on this is so clean",
    timestamp: "5 hours ago",
    likes: 8
  }
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function Track() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { isPlaying, setIsPlaying, volume, setVolume } = useAudioStore();
  const { userGems, trackGems, incrementTrackGems } = useGemStore();
  const { trackUpvotes, toggleUpvote } = useUpvoteStore();
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const track = MOCK_TRACK; // In real app, fetch track by id
  const hasGivenGem = trackGems[track.id] || false;
  const isUpvoted = trackUpvotes[track.id] || false;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'rgba(255, 255, 255, 0.3)',
        progressColor: '#0284C7',
        cursorColor: '#0284C7',
        barWidth: 3,
        barGap: 2,
        height: 200,
        barRadius: 3,
        normalize: true,
        backend: 'WebAudio'
      });

      wavesurferRef.current.load(track.audio_url);

      wavesurferRef.current.on('ready', () => {
        setIsLoading(false);
        if (wavesurferRef.current) {
          setDuration(formatTime(wavesurferRef.current.getDuration()));
        }
      });

      wavesurferRef.current.on('audioprocess', () => {
        if (wavesurferRef.current) {
          setCurrentTime(formatTime(wavesurferRef.current.getCurrentTime()));
        }
      });

      wavesurferRef.current.on('play', () => setIsPlaying(true));
      wavesurferRef.current.on('pause', () => setIsPlaying(false));
      wavesurferRef.current.on('finish', () => setIsPlaying(false));
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [track.audio_url, setIsPlaying]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume);
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  };

  const handleGem = () => {
    if (!user) {
      toast.error('Please connect your wallet to give gems');
      return;
    }
    
    if (hasGivenGem) {
      toast.error('You have already given a gem to this track');
      return;
    }
    
    if (userGems > 0) {
      incrementTrackGems(track.id);
      toast.success('Gem given successfully!');
    } else {
      toast.error('You have no gems remaining');
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please connect your wallet to comment');
      return;
    }
    if (comment.trim()) {
      toast.success('Comment added successfully!');
      setComment('');
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Track Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg overflow-hidden mb-8">
          {/* Track Info and Controls */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayPause}
                  disabled={isLoading}
                  className="w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{track.title}</h1>
                  <Link 
                    to={`/dashboard/${track.artistId}`}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {track.artist}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Volume2 size={20} className="text-white/60" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Waveform */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <div ref={waveformRef} />
              <div className="flex justify-between mt-2 text-sm text-white/60">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* Track Stats */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleUpvote(track.id, track.stats.upvotes)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                    isUpvoted
                      ? 'text-primary bg-primary/20'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  )}
                >
                  <ThumbsUp size={20} className={isUpvoted ? 'fill-primary' : ''} />
                  <span>{formatNumber(track.stats.upvotes)}</span>
                </button>

                <button
                  onClick={handleGem}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
                    hasGivenGem
                      ? 'text-primary bg-primary/20'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Gem size={20} className={hasGivenGem ? 'fill-primary' : ''} />
                  <span>{formatNumber(track.stats.gems)}</span>
                </button>

                <button
                  onClick={() => toast.success('Share URL copied!')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>

              <div className="text-sm text-white/60">
                {formatNumber(track.stats.streams)} streams
              </div>
            </div>
          </div>
        </div>

        {/* Artist and Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Comments Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Comments</h2>

              {/* Comment Form */}
              <form onSubmit={handleComment} className="mb-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={20} className="text-white/60" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {MOCK_COMMENTS.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <img
                      src={comment.user.image}
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">
                          {comment.user.name}
                        </span>
                        <span className="text-sm text-white/40">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-white/80">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="text-sm text-white/40 hover:text-white transition-colors">
                          Like ({comment.likes})
                        </button>
                        <button className="text-sm text-white/40 hover:text-white transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Artist Info */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={track.artistImage}
                  alt={track.artist}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <Link
                    to={`/dashboard/${track.artistId}`}
                    className="text-lg font-medium text-white hover:text-primary transition-colors"
                  >
                    {track.artist}
                  </Link>
                  <div className="text-sm text-white/60">
                    {formatNumber(track.artist_stats.followers)} followers
                  </div>
                </div>
              </div>

              <p className="text-white/80 mb-6">{track.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(track.artist_stats.tracks)}
                  </div>
                  <div className="text-sm text-white/60">Tracks</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatNumber(track.artist_stats.gems_received)}
                  </div>
                  <div className="text-sm text-white/60">Gems</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}