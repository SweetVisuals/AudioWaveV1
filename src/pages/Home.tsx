import React, { useState } from 'react';
import { Music, Flame, TrendingUp, ThumbsUp, Gem, PlayCircle } from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';
import clsx from 'clsx';

interface HomeProps {
  onTrackPlay: (track: { id: number; title: string; artist?: string; url: string }) => void;
}

const CATEGORIES = [
  'All',
  'Hip Hop',
  'R&B',
  'Alternative',
  'Blues',
  'Jazz',
  'Electronic',
  'Rock',
  'Pop'
] as const;

type Category = typeof CATEGORIES[number];

const RECOMMENDED_TRACKS = [
  {
    id: 1,
    title: "Summer Vibes",
    artist: "DJ Wave",
    category: "Electronic",
    artistImage: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop&q=80",
    stats: {
      gems: 156,
      streams: 125000,
      upvotes: 3200,
      popularity: 85
    },
    price: {
      buy: 29.99,
      lease: 9.99
    },
    audio_url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
  },
  {
    id: 2,
    title: "Midnight Dreams",
    artist: "Luna Beats",
    category: "R&B",
    artistImage: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=100&h=100&fit=crop&q=80",
    stats: {
      gems: 98,
      streams: 98000,
      upvotes: 2800,
      popularity: 75
    },
    price: {
      buy: 24.99,
      lease: 7.99
    },
    audio_url: "https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg"
  },
  {
    id: 3,
    title: "Urban Flow",
    artist: "Metro Sounds",
    category: "Hip Hop",
    artistImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop&q=80",
    stats: {
      gems: 204,
      streams: 156000,
      upvotes: 4100,
      popularity: 92
    },
    price: {
      buy: 34.99,
      lease: 11.99
    },
    audio_url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"
  },
  {
    id: 4,
    title: "Neon Lights",
    artist: "Synth Master",
    category: "Electronic",
    artistImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop&q=80",
    stats: {
      gems: 167,
      streams: 112000,
      upvotes: 3500,
      popularity: 88
    },
    price: {
      buy: 29.99,
      lease: 9.99
    },
    audio_url: "https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg"
  }
];

export function Home({ onTrackPlay }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const filteredTracks = RECOMMENDED_TRACKS.filter(
    track => selectedCategory === 'All' || track.category === selectedCategory
  );

  return (
    <>
      {/* Banner */}
      <div className="bg-gray-800/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Discover New Music
          </h1>
          <p className="text-lg text-white/80">
            Stream and support independent artists
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={clsx(
                'px-4 py-2 rounded-full whitespace-nowrap transition-colors',
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Top Charts */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Top Charts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTracks.map((track) => (
              <div key={track.id} className="bg-gray-900/50 backdrop-blur-lg rounded-lg border border-primary/20">
                <AudioPlayer
                  id={track.id}
                  url={track.audio_url}
                  title={track.title}
                  artist={track.artist}
                  artistId={track.artist.toLowerCase().replace(/\s+/g, '-')}
                  artistImage={track.artistImage}
                  price={track.price}
                  stats={track.stats}
                  onPlay={onTrackPlay}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Most Upvoted */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <ThumbsUp className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Most Upvoted</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTracks.map((track) => (
              <div key={track.id} className="bg-gray-900/50 backdrop-blur-lg rounded-lg border border-primary/20">
                <AudioPlayer
                  id={track.id}
                  url={track.audio_url}
                  title={track.title}
                  artist={track.artist}
                  artistId={track.artist.toLowerCase().replace(/\s+/g, '-')}
                  artistImage={track.artistImage}
                  price={track.price}
                  stats={track.stats}
                  onPlay={onTrackPlay}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}