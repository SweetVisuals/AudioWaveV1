import React, { useState } from 'react';
import { X, Github, Twitter } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useParticleAuth } from '../hooks/useParticleAuth';
import type { SocialLoginType } from '../lib/particle';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginDemo } = useAuthStore();
  const { connectWallet, isLoading } = useParticleAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (type: SocialLoginType) => {
    try {
      setError(null);
      const result = await connectWallet(type);
      
      // Only close if login was successful
      if (result) {
        onClose();
      }
    } catch (error: any) {
      console.error('Connect error:', error);
      setError(error.message || 'Failed to connect');
    }
  };

  const handleDemoLogin = async () => {
    try {
      setError(null);
      await loginDemo();
      onClose();
    } catch (error: any) {
      console.error('Demo login error:', error);
      setError(error.message || 'Failed to login to demo account');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-light/95 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Connect Wallet</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            {isLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <button
            onClick={() => handleSocialLogin('twitter')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Twitter size={20} />
            {isLoading ? 'Connecting...' : 'Continue with Twitter'}
          </button>

          <button
            onClick={() => handleSocialLogin('github')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#1b1f23] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Github size={20} />
            {isLoading ? 'Connecting...' : 'Continue with GitHub'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-light/95 text-white/60">Or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Try Demo Account
          </button>
        </div>

        <p className="mt-6 text-sm text-white/60 text-center">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}