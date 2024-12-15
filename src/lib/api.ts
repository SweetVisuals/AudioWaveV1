import toast from 'react-hot-toast';
import { db } from './supabase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Error types
class NetworkError extends Error {
  constructor(message = 'Network error. Please check your connection') {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function registerUser(data: {
  username: string;
  walletAddress: string;
  profilePicture?: string | null;
  bannerUrl?: string | null;
}) {
  try {
    // Check if username already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', data.username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new ApiError(400, 'Username already exists. Please choose another one.');
    }
    
    const newUserRef = collection(db, 'users');
    await addDoc(newUserRef, {
        username: data.username,
        walletAddress: data.walletAddress,
        profilePicture: data.profilePicture || null,
        bannerUrl: data.bannerUrl || null,
        followers: 0,
        streams: 0,
        gems: 0,
        createdAt: new Date().toISOString(),
    });

    return { user: { id: data.walletAddress, username: data.username, walletAddress: data.walletAddress } };
  } catch (error: any) {
    console.error('Registration error:', error);
     if (error instanceof NetworkError) {
      toast.error(error.message);
    } else if (error instanceof ApiError) {
      toast.error(error.message);
    } else {
      toast.error('Failed to register. Please try again.');
    }
    throw error;
  }
}

export async function loginUser(walletAddress: string) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('walletAddress', '==', walletAddress));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // If user not found by wallet address, try to find by username
        const q2 = query(usersRef, where('username', '==', walletAddress));
        const querySnapshot2 = await getDocs(q2);
        if (querySnapshot2.empty) {
            throw new ApiError(404, 'USER_NOT_FOUND');
        }
        const userDoc2 = querySnapshot2.docs[0];
        const userData2 = userDoc2.data();
        return {
            user: {
                id: userDoc2.id,
                username: userData2.username,
                wallet: userData2.walletAddress,
                walletAddress: userData2.walletAddress,
                profilePicture: userData2.profilePicture || null,
                bannerUrl: userData2.bannerUrl || null,
                followers: userData2.followers || 0,
                streams: userData2.streams || 0,
                gems: userData2.gems || 0,
                bio: userData2.bio || null,
                createdAt: userData2.createdAt,
            }
        };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
        user: {
            id: userDoc.id,
            username: userData.username,
            wallet: userData.walletAddress,
            walletAddress: userData.walletAddress,
            profilePicture: userData.profilePicture || null,
            bannerUrl: userData.bannerUrl || null,
            followers: userData.followers || 0,
            streams: userData.streams || 0,
            gems: userData.gems || 0,
            bio: userData.bio || null,
            createdAt: userData.createdAt,
        }
    };
  } catch (error: any) {
    console.error('Login error:', error);
    if (error instanceof NetworkError) {
      toast.error(error.message);
    } else if (error instanceof ApiError && error.status === 404) {
      error.message = 'USER_NOT_FOUND';
      throw error;
    } else {
      toast.error('Failed to login. Please try again.');
    }
    throw error;
  }
}

export async function getUserProfile(id: string): Promise<any> {
  try {
    const usersRef = collection(db, 'users');
    
    let q = query(usersRef, where('username', '==', id));
    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        q = query(usersRef, where('walletAddress', '==', id));
        querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new ApiError(404, 'USER_NOT_FOUND');
        }
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      id: userDoc.id,
      username: userData.username,
      walletAddress: userData.walletAddress,
      profilePicture: userData.profilePicture || null,
      bannerUrl: userData.bannerUrl || null,
      followers: userData.followers || 0,
      streams: userData.streams || 0,
      gems: userData.gems || 0,
      bio: userData.bio || null,
      createdAt: userData.createdAt,
    };
  } catch (error: any) {
    console.error('Get profile error:', error);
    if (error instanceof NetworkError) {
      toast.error(error.message);
    } else {
      toast.error('Failed to load profile. Please try again.');
    }
    throw error;
  }
}
