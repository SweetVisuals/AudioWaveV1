import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, ListMusic, Clock, Heart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AudioPlayer } from '../components/AudioPlayer';
import clsx from 'clsx';

type LibrarySection = 'tracks' | 'playlists' | 'history' | 'liked';

const MOCK_LIBRARY_TRACKS = [
  {
    id: 1,
    title: "Summer Vibes",
    artist: "DJ Wave",
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
  }
];

export function Library() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<LibrarySection>('tracks');

  if (!user) {
    navigate('/');
    return null;
  }

  const sections: { id: LibrarySection; label: string; icon: React.ReactNode }[] = [
    { id: 'tracks', label: 'Your Tracks', icon: <Music size={20} /> },
    { id: 'playlists', label: 'Playlists', icon: <ListMusic size={20} /> },
    { id: 'history', label: 'History', icon: <Clock size={20} /> },
    { id: 'liked', label: 'Liked', icon: <Heart size={20} /> },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Your Library</h1>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors',
                activeSection === id
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeSection === 'tracks' && MOCK_LIBRARY_TRACKS.map((track) => (
            <div key={track.id} className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
              <AudioPlayer
                id={track.id}
                url={track.audio_url}
                title={track.title}
                artist={track.artist}
                artistId={track.artist.toLowerCase().replace(/\s+/g, '-')}
                artistImage={track.artistImage}
                price={track.price}
                stats={track.stats}
              />
            </div>
          ))}

          {activeSection === 'playlists' && (
            <div className="col-span-full text-center py-12">
              <ListMusic className="mx-auto h-12 w-12 text-white/20 mb-4" />
              <p className="text-white/60">No playlists created yet</p>
            </div>
          )}

          {activeSection === 'history' && (
            <div className="col-span-full text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-white/20 mb-4" />
              <p className="text-white/60">No listening history yet</p>
            </div>
          )}

          {activeSection === 'liked' && (
            <div className="col-span-full text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-white/20 mb-4" />
              <p className="text-white/60">No liked tracks yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}