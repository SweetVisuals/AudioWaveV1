import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useParticleConnect } from '@particle-network/connect-react';
import { Music, Menu, ChevronLeft, Home, Upload, User, Settings, LogOut } from 'lucide-react';
import { Navbar } from './Navbar';
import { useSpring, animated } from '@react-spring/web';
import { useAuthStore } from '../store/useAuthStore';

export function Layout() {
  const navigate = useNavigate();
  const { connect, disconnect, account } = useParticleConnect();
  const { user, loginDemo, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarAnimation = useSpring({
    transform: isSidebarOpen ? 'translateX(0%)' : 'translateX(-100%)',
    config: { tension: 280, friction: 26 }
  });

  const mainContentAnimation = useSpring({
    marginLeft: isSidebarOpen ? '256px' : '0px',
    config: { tension: 280, friction: 26 }
  });

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleDemoLogin = async () => {
    await loginDemo();
    setIsSidebarOpen(false);
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setIsSidebarOpen(false);
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <animated.div
        style={sidebarAnimation}
        className="fixed top-0 left-0 w-64 h-full bg-white/10 backdrop-blur-lg z-40"
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Music className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">AudioWave</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link
              to="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Home size={20} />
              Home
            </Link>
            
            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <User size={20} />
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Upload size={20} />
                  Upload
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings size={20} />
                  Settings
                </Link>
              </>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-4">
            {!user && (
              <button
                onClick={handleDemoLogin}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Try Demo Account
              </button>
            )}
            
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
                onClick={handleConnect}
                className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </animated.div>

      {/* Main Content */}
      <animated.div 
        style={mainContentAnimation}
        className="flex-1 flex flex-col min-h-screen overflow-x-hidden"
      >
        <Navbar isSidebarOpen={isSidebarOpen} onSidebarToggle={toggleSidebar} />
        <main className="flex-1">
          <Outlet />
        </main>
      </animated.div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}