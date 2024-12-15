import { create } from 'zustand';

interface AudioState {
  currentTrack: {
    id: number;
    title: string;
    artist?: string;
    url: string;
  } | null;
  isPlaying: boolean;
  volume: number;
  setCurrentTrack: (track: { id: number; title: string; artist?: string; url: string } | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  
  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: !!track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume })
}));