import { create } from 'zustand';

interface GemState {
  userGems: number;
  trackGems: Record<number, boolean>;
  gemCounts: Record<number, number>;
  decrementUserGems: () => void;
  incrementTrackGems: (trackId: number) => void;
  setUserGems: (gems: number) => void;
}

export const useGemStore = create<GemState>((set) => ({
  userGems: 16, // Initial user gems
  trackGems: {},
  gemCounts: {},
  
  decrementUserGems: () => 
    set((state) => ({
      userGems: Math.max(0, state.userGems - 1)
    })),
    
  incrementTrackGems: (trackId: number) =>
    set((state) => ({
      trackGems: {
        ...state.trackGems,
        [trackId]: true
      },
      gemCounts: {
        ...state.gemCounts,
        [trackId]: (state.gemCounts[trackId] || 0) + 1
      }
    })),
    
  setUserGems: (gems: number) => 
    set({ userGems: gems })
}));