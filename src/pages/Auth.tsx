import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { LoadingScreen } from '../components/LoadingScreen';
import { connectParticleWallet } from '../lib/particle';
import { loginUser } from '../lib/api';

export function Auth() {
  const navigate = useNavigate();
  const { user, isLoading, setUser } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (isInitializing || isLoading) {
    return <LoadingScreen />;
  }

  const handleConnectWallet = async () => {
    try {
      const result = await connectParticleWallet('google');
      if (result?.address) {
        // Fetch user profile or create new user
        const userData = await loginUser(result.address);
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <Music className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to AudioWave</h1>
          <p className="text-lg text-white/60">Connect your wallet to get started</p>
        </div>

        <button
          onClick={handleConnectWallet}
          className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-3 wallet-button"
        >
          Connect Wallet
        </button>

        <p className="mt-8 text-center text-white/40 text-sm">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
