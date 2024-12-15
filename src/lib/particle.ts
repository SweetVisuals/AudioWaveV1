import { ParticleNetwork } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';
import { Ethereum } from '@particle-network/chains';
import { ConnectConfig, Wallet, ParticleConnect } from '@particle-network/connect';

const projectId = import.meta.env.VITE_PARTICLE_PROJECT_ID;
const clientKey = import.meta.env.VITE_PARTICLE_CLIENT_KEY;
const appId = import.meta.env.VITE_PARTICLE_APP_ID;

if (!projectId || !clientKey || !appId) {
  throw new Error('Missing Particle Network configuration');
}

export const config: ConnectConfig = {
  projectId,
  clientKey,
  appId,
  chains: [Ethereum],
  wallets: [
    {
      name: 'Particle',
      id: 'particle',
      iconUrl: '/particle-icon.png',
      createConnector: () => ({ connector: new ParticleConnect() })
    }
  ],
};

export const particleNetwork = new ParticleNetwork(config);
export const provider = new ParticleProvider(particleNetwork.auth);

export type SocialLoginType = 'google' | 'twitter' | 'github';

export interface ParticleUserInfo {
  uuid: string;
  token: string;
  wallets: Array<{
    chain_name: string;
    public_address: string;
  }>;
}

export async function connectParticleWallet(loginType: SocialLoginType) {
  try {
    const userInfo = await particleNetwork.auth.login({
      preferredAuthType: loginType,
      socialLoginPrompt: 'consent',
    });

    if (!userInfo || !userInfo.wallets?.length) {
      throw new Error('Login failed - no wallet information received');
    }

    // Get the first Ethereum wallet address
    const ethWallet = userInfo.wallets.find(w => w.chain_name.toLowerCase() === 'ethereum') || userInfo.wallets[0];
    if (!ethWallet?.public_address) {
      throw new Error('No wallet address found');
    }

    return {
      address: ethWallet.public_address,
      userInfo
    };
  } catch (error: any) {
    console.error('Particle wallet connection error:', error);
    if (error.message?.includes('User closed') || 
        error.message?.includes('User rejected') ||
        error.message?.includes('User canceled')) {
      return null;
    }
    throw error;
  }
}

export async function disconnectParticleWallet() {
  try {
    await particleNetwork.auth.logout();
    return true;
  } catch (error) {
    console.error('Particle wallet disconnect error:', error);
    throw error;
  }
}

export async function checkWalletConnection() {
  try {
    const loggedIn = await particleNetwork.auth.isLogin();
    if (!loggedIn) {
      return null;
    }

    try {
      const userInfo = await particleNetwork.auth.getUserInfo();
      if (!userInfo || !userInfo.wallets?.length) {
        await disconnectParticleWallet();
        return null;
      }

      const ethWallet = userInfo.wallets.find(w => w.chain_name.toLowerCase() === 'ethereum') || userInfo.wallets[0];
      if (!ethWallet?.public_address) {
        await disconnectParticleWallet();
        return null;
      }

      return ethWallet.public_address;
    } catch (error) {
      console.error('Failed to get wallet address:', error);
      await disconnectParticleWallet();
      return null;
    }
  } catch (error) {
    console.error('Check wallet connection error:', error);
    try {
      await disconnectParticleWallet();
    } catch {}
    return null;
  }
}
