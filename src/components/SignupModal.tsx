import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export function SignupModal() {
  const navigate = useNavigate();
  const { showSignupModal, setShowSignupModal, registerNewUser, isLoading } = useAuthStore();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Clear any existing errors when modal opens
    if (showSignupModal) {
      setError('');
    }
  }, [showSignupModal]);

  if (!showSignupModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const walletAddress = localStorage.getItem('pendingWallet');
      
      if (!walletAddress) {
        setError('No wallet connected');
        return;
      }

      await registerNewUser(username, walletAddress);
      localStorage.removeItem('pendingWallet');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Create Your Account</h2>
          <button 
            onClick={() => setShowSignupModal(false)}
            className="text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-100 p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Choose a Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Enter your username"
              required
            />
            <p className="mt-1 text-xs text-white/60">
              This username will be permanently linked to your wallet address
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