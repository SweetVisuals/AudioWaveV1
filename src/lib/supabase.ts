import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWsIo0U_Wcd02beXf--rr4Enlfw2qYWu8",
  authDomain: "audiowave-df0ac.firebaseapp.com",
  projectId: "audiowave-df0ac",
  storageBucket: "audiowave-df0ac.firebasestorage.app",
  messagingSenderId: "50848175946",
  appId: "1:50848175946:web:9bdf0cfaa3c4dec1af93b3",
  measurementId: "G-FXHQS51QZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Firestore user profile type
export interface UserProfile {
  id: string;
  username: string;
  profilePicture?: string | null;
  bannerUrl?: string | null;
  followers?: number;
  streams?: number;
  gems?: number;
  walletAddress?: string;
  createdAt: string;
  bio?: string | null;
}

// Function to create or update user profile
export const createUserProfile = async (userId: string, username: string, profilePicture?: string | null, bannerUrl?: string | null, followers?: number, streams?: number, gems?: number, walletAddress?: string) => {
  try {
    const userRef = doc(collection(db, 'users'), userId);
    await setDoc(userRef, {
      id: userId,
      username,
      profilePicture: profilePicture || null,
      bannerUrl: bannerUrl || null,
      followers: followers || 0,
      streams: streams || 0,
      gems: gems || 0,
      walletAddress: walletAddress || null,
      createdAt: new Date().toISOString(),
    });
    console.log('User profile created/updated successfully');
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    throw error;
  }
};

// Function to get user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Function to get user profile by username
export const getUserProfileByUsername = async (username: string): Promise<UserProfile | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile by username:', error);
    throw error;
  }
};

// Function to upload audio file to Firebase Storage
export const uploadAudioFile = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const storageRef = ref(storage, `audio/${fileName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading audio file:', error);
    throw error;
  }
};

// Function to add track metadata to Firestore
export const addTrackMetadata = async (title: string, audioUrl: string) => {
    try {
      await addDoc(collection(db, 'tracks'), {
        title,
        audioUrl,
      });
      console.log('Track metadata added successfully');
    } catch (error) {
      console.error('Error adding track metadata:', error);
      throw error;
    }
  };


export { db };
