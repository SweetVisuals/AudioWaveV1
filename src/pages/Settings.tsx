import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Bell, Shield, Wallet, User, Globe, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

type SettingsSection = 'profile' | 'notifications' | 'privacy' | 'wallet' | 'audio' | 'language';

export function Settings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [language, setLanguage] = useState('en');

  if (!user) {
    navigate('/');
    return null;
  }

  const sections: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={20} /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} /> },
    { id: 'audio', label: 'Audio', icon: <Volume2 size={20} /> },
    { id: 'language', label: 'Language', icon: <Globe size={20} /> },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {sections.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === id
                    ? 'bg-primary text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="md:col-span-3 bg-white/5 backdrop-blur-lg rounded-lg p-6">
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user.username || ''}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Bio
                  </label>
                  <textarea
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    rows={4}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Enable notifications</span>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationsEnabled ? 'bg-primary' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Private profile</span>
                  <button
                    onClick={() => setPrivateProfile(!privateProfile)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      privateProfile ? 'bg-primary' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        privateProfile ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'wallet' && (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white mb-2">Connected Wallet</h3>
                  <p className="text-white/60 break-all">{user.wallet}</p>
                </div>
              </div>
            )}

            {activeSection === 'audio' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Autoplay</span>
                  <button
                    onClick={() => setAutoplay(!autoplay)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      autoplay ? 'bg-primary' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        autoplay ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'language' && (
              <div className="space-y-4">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}