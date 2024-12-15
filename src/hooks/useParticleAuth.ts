import { useCallback, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { connectParticleWallet, disconnectParticleWallet, type SocialLoginType } from '../lib/particle';
import { loginUser } from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function useParticleAuth() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = useCallback(async (loginType: SocialLoginType) => {
    if (isLoading) return null;
    
    try {
      setIsLoading(true);
      const result = await connectParticleWallet(loginType);
      
      if (!result) {
        toast.error('Connection cancelled');
        return null;
      }

      const { address } = result;

      try {
        // Try to login with existing wallet
        const userData = await loginUser(address);
        setUser(userData);
        toast.success('Welcome back!');
        navigate('/dashboard');
        return address;
      } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
          // Store wallet address for signup
          localStorage.setItem('pendingWallet', address);
          toast.success('Complete your profile to continue');
          navigate('/signup');
          return address;
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast.error(error.message || 'Failed to connect wallet');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, navigate, isLoading]);

  const disconnectWallet = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await disconnectParticleWallet();
      setUser(null);
      localStorage.removeItem('pendingWallet');
      toast.success('Disconnected successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [setUser, navigate, isLoading]);

  return {
    connectWallet,
    disconnectWallet,
    isLoading
  };
}