import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Home, 
  TrendingUp, 
  Star, 
  Gem, 
  LogOut,
  Settings,
  Library,
  LayoutDashboard,
  Coins,
  ChevronLeft,
  LogIn
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthModal } from './AuthModal';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-white/10 backdrop-blur-lg transform transition-transform duration-300 ease-out z-50',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Music className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">AudioWave</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {/* Common Links */}
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Home size={20} />
              Home
            </Link>

            <Link
              to="/trending"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <TrendingUp size={20} />
              Trending
            </Link>

            <Link
              to="/rising"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Star size={20} />
              Rising Stars
            </Link>

            <Link
              to="/gems"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Gem size={20} />
              Top Gems
            </Link>

            {/* Authenticated Links */}
            {user && (
              <>
                <div className="pt-4 mt-4 border-t border-white/10">
                  <div className="px-4 py-2 mb-2">
                    <div className="flex items-center gap-2 text-white/60">
                      <Coins size={16} />
                      <span className="text-sm">STREAMS</span>
                    </div>
                    <div className="text-xl font-bold text-white">0</div>
                  </div>
                </div>

                <Link
                  to="/library"
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Library size={20} />
                  Library
                </Link>

                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>

                <Link
                  to="/settings"
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings size={20} />
                  Settings
                </Link>
              </>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/10">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-white/80 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <LogOut size={20} />
                Log Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <LogIn size={20} />
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}