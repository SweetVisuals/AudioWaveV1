import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useParticleAuth } from '../hooks/useParticleAuth';
import { AuthModal } from './AuthModal';
import {
  Menu,
  Music,
  Search,
  Upload,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { disconnectWallet } = useParticleAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleUploadClick = () => {
    if (user) {
      navigate('/upload');
    } else {
      setShowAuthModal(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await disconnectWallet();
      logout();
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToProfile = () => {
    if (user?.username) {
      navigate(`/dashboard/${user.username.toLowerCase().replace(/\s+/g, '-')}`);
      setIsProfileOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-dark-light/80 backdrop-blur-lg z-40">
        <div className="h-full px-4 flex items-center justify-between gap-4">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-primary/10 text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-white hidden sm:block">
                AudioWave
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, artists..."
                className="w-full bg-dark-lighter/50 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {!user ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-full text-sm transition-colors transform scale-90 origin-right font-bold"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={navigateToProfile}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-full text-sm transition-colors transform scale-90 origin-right font-bold"
              >
                {user.username || 'Complete Profile'}
              </button>
            )}
            
            <button 
              onClick={handleUploadClick}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-full text-sm transition-colors transform scale-90 origin-right"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Upload</span>
            </button>
            
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center text-white transition-colors"
                >
                  <User size={20} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-light/95 backdrop-blur-lg rounded-lg shadow-lg py-1 z-50">
                    <div className="px-4 py-2 mb-1 bg-dark-divider">
                      <p className="text-sm font-medium text-white truncate">
                        {user.username || 'Complete Profile'}
                      </p>
                    </div>
                    <button
                      onClick={navigateToProfile}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                    >
                      <User size={16} />
                      Dashboard
                    </button>
                    <Link
                      to="/library"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Music size={16} />
                      Library
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}