import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkWalletConnection, particleNetwork } from '../lib/particle';
import { useAuthStore } from '../store/useAuthStore';
import { LoadingScreen } from '../components/LoadingScreen';
import { loginUser } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ParticleContextType {
  isInitialized: boolean;
  isLoading: boolean;
}

const ParticleContext = createContext<ParticleContextType>({
  isInitialized: false,
  isLoading: true
});

export const useParticle = () => useContext(ParticleContext);

interface ParticleProviderProps {
  children: React.ReactNode;
}

export function ParticleProvider({ children }: ParticleProviderProps) {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const initParticle = async () => {
      try {
        // Verify Particle Network initialization
        if (!particleNetwork?.auth) {
          throw new Error('Failed to initialize Particle Network');
        }

        // Check existing connection
        const address = await checkWalletConnection();
        
        if (address && mounted) {
          try {
            const userData = await loginUser(address);
            setUser(userData);
          } catch (error: any) {
            if (error.message === 'USER_NOT_FOUND') {
              // Clean up on error
              try {
                await particleNetwork.auth.logout();
              } catch {}
              localStorage.setItem('pendingWallet', address);
              navigate('/signup');
            } else {
              console.error('Login error:', error);
              toast.error('Failed to restore session');
            }
          }
        }

        if (mounted) {
          setIsInitialized(true);
        }
      } catch (error: any) {
        console.error('Failed to initialize Particle:', error);
        if (mounted) {
          toast.error('Failed to initialize wallet connection');
          setIsInitialized(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initParticle();

    return () => {
      mounted = false;
    };
  }, [setUser, navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ParticleContext.Provider value={{ isInitialized, isLoading }}>
      {children}
    </ParticleContext.Provider>
  );
}