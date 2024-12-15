import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Music, Camera, ImageIcon, Edit2, X, Check, Users, Gem } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useDashboardStore } from '../store/useDashboardStore';
import { DashboardSection } from '../components/DashboardSection';
import { AudioPlayer } from '../components/AudioPlayer';
import { getUserProfile } from '../lib/api';
import toast from 'react-hot-toast';
import { UserProfile } from '../lib/supabase';

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function Dashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const { sections, isEditMode, setEditMode } = useDashboardStore();
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTracks, setUserTracks] = useState<any[]>([]);

  useEffect(() => {
    // Function to load user profile data
    async function loadProfile() {
      try {
        setIsLoading(true);
        // If an ID is provided, fetch the profile for that user
        if (id) {
          const profile = await getUserProfile(id);
          setProfileUser(profile);
          setUserTracks([]); // Initialize with empty array until we implement track fetching
        } 
        // If no ID is provided, but a user is logged in, fetch the profile
        else if (user && user.username) {
          const profile = await getUserProfile(user.username.toLowerCase().replace(/\s+/g, '-'));
          setProfileUser(profile);
        } 
        // If no user is logged in, navigate to the home page
        else {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [id, user, navigate]);

  useEffect(() => {
    if (profileUser && user && user.username) {
      navigate(`/dashboard/${user.username.toLowerCase().replace(/\s+/g, '-')}`);
    }
  }, [profileUser, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Determine which user to display (either the profile user or the logged-in user)
  const displayUser = profileUser || user;
  if (!displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">User not found</div>
      </div>
    );
  }

  // Check if the current user is viewing their own profile
  const isOwnProfile = user && (!id || id === user.username.toLowerCase().replace(/\s+/g, '-'));

  // Order the dashboard sections based on their order property
  const orderedSections = Object.values(sections)
    .filter(section => section.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 md:h-56 group bg-gray-800">
        {/* Display banner image if available */}
        {displayUser.bannerUrl && (
          <div 
            className="absolute inset-0 bg-center bg-cover transition-all duration-200"
            style={{ backgroundImage: `url(${displayUser.bannerUrl})` }}
          />
        )}
        {/* Show banner edit options if it's the user's own profile */}
        {isOwnProfile && (
          <>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
            <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setBannerImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-lg text-white">
                <ImageIcon size={20} />
                <span className="text-sm">Change Banner</span>
              </div>
            </label>
          </>
        )}
        {/* Stats */}
        <div className="absolute bottom-4 right-[200px] flex gap-4 items-end pr-4 pb-4">
          <div className="text-center">
            <div className="flex items-center gap-1 text-white">
              <Users size={16} />
              <span className="font-bold">{displayUser.followers ? formatNumber(displayUser.followers) : '0'}</span>
            </div>
            <div className="text-sm text-white/60">Followers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-white">
              <Users size={16} />
              <span className="font-bold">{displayUser.streams ? formatNumber(displayUser.streams) : '0'}</span>
            </div>
            <div className="text-sm text-white/60">Streams</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-white">
              <Gem size={16} />
              <span className="font-bold">{displayUser.gems ? formatNumber(displayUser.gems) : '0'}</span>
            </div>
            <div className="text-sm text-white/60">Gems</div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between -mt-16 md:-mt-20 mb-8 relative z-10">
          {/* Profile Picture and Info */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-700 flex items-center justify-center">
                {/* Display user profile picture or placeholder */}
                {displayUser.profilePicture ? (
                  <img
                    src={displayUser.profilePicture}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/src/images/user.png"
                    alt="Placeholder Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {/* Show profile picture edit options if it's the user's own profile */}
              {isOwnProfile && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <label className="w-20 h-20 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAvatarImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <Camera size={16} className="text-white" />
                  </label>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2">
              <h1 className="text-lg font-bold text-white">{displayUser.username}</h1>
              <p className="text-sm text-white/60">
                {displayUser.walletAddress?.slice(0, 6)}...{displayUser.walletAddress?.slice(-4)}
              </p>
            </div>
          </div>

          {/* Edit Mode Toggle */}
          {isOwnProfile && (
            <div className="flex items-center gap-4">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    <Check size={20} />
                    <span>Save Layout</span>
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    <X size={20} />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                  <span>Edit Layout</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dashboard Sections */}
        <div className="space-y-8">
          {orderedSections.map((section) => (
            <DashboardSection
              key={section.id}
              section={section}
            >
              {section.type === 'tracks' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {userTracks.length > 0 ? (
                    userTracks.map((track) => (
                      <div key={track.id} className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                        <AudioPlayer
                          id={track.id}
                          url={track.audio_url}
                          title={track.title}
                          artist={track.artist}
                          artistId={track.artist?.toLowerCase().replace(/\s+/g, '-')}
                          artistImage={track.artistImage}
                          price={track.price}
                          stats={track.stats}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Music className="mx-auto h-12 w-12 text-white/20 mb-4" />
                      <p className="text-white/60">No tracks uploaded yet</p>
                    </div>
                  )}
                </div>
              )}
            </DashboardSection>
          ))}
        </div>
      </div>
    </div>
  );
}
