import { create } from 'zustand';

interface UpvoteState {
  trackUpvotes: Record<number, boolean>;
  upvoteCounts: Record<number, number>;
  toggleUpvote: (trackId: number, initialCount: number) => void;
}

export const useUpvoteStore = create<UpvoteState>((set) => ({
  trackUpvotes: {},
  upvoteCounts: {},
  
  toggleUpvote: (trackId: number, initialCount: number) =>
    set((state) => {
      // Initialize upvote count if not exists
      if (!(trackId in state.upvoteCounts)) {
        state.upvoteCounts[trackId] = initialCount;
      }

      const isUpvoted = state.trackUpvotes[trackId];
      return {
        trackUpvotes: {
          ...state.trackUpvotes,
          [trackId]: !isUpvoted
        },
        upvoteCounts: {
          ...state.upvoteCounts,
          [trackId]: state.upvoteCounts[trackId] + (isUpvoted ? -1 : 1)
        }
      };
    })
}));