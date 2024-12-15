import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export function Signup() {
  const navigate = useNavigate();
  const { user, registerNewUser, isLoading } = useAuthStore();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const pendingWallet = localStorage.getItem('pendingWallet');
    const currentWallet = user?.wallet || pendingWallet;

    // If no wallet is connected, redirect to home
    if (!currentWallet) {
      navigate('/');
      return;
    }

    // If user already has a username, redirect to dashboard
    if (user?.username) {
      navigate(`/dashboard/${user.username.toLowerCase().replace(/\s+/g, '-')}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const walletAddress = user?.wallet || localStorage.getItem('pendingWallet');
      if (!walletAddress) {
        toast.error('No wallet connected');
        return;
      }

      await registerNewUser(username, walletAddress);
      localStorage.removeItem('pendingWallet'); // Clean up after successful registration
      toast.success('Account created successfully!');
      navigate(`/dashboard/${username.toLowerCase().replace(/\s+/g, '-')}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to create account');
      toast.error(error.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Music className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="text-white/60 text-center mt-2">
            Choose a username to complete your registration
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40"
                placeholder="Choose your username"
                required
                minLength={3}
                maxLength={20}
                pattern="^[a-zA-Z0-9_]+$"
                title="Username can only contain letters, numbers, and underscores"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            </div>
            <p className="mt-2 text-sm text-white/60">
              This username will be permanently linked to your wallet address
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-2">Connected Wallet</h3>
            <p className="text-sm text-white/60">
              {user?.wallet || localStorage.getItem('pendingWallet')}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !username}
            className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}