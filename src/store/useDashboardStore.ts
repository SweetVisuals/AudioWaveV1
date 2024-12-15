import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DashboardSection {
  id: string;
  title: string;
  type: 'tracks' | 'playlists' | 'activity' | 'stats';
  order: number;
  visible: boolean;
}

interface DashboardState {
  sections: Record<string, DashboardSection>;
  isEditMode: boolean;
  setEditMode: (isEdit: boolean) => void;
  updateSection: (sectionId: string, updates: Partial<DashboardSection>) => void;
  reorderSections: (orderedIds: string[]) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      sections: {
        tracks: {
          id: 'tracks',
          title: 'Popular Tracks',
          type: 'tracks',
          order: 0,
          visible: true,
        },
        playlists: {
          id: 'playlists',
          title: 'Your Playlists',
          type: 'playlists',
          order: 1,
          visible: true,
        },
        activity: {
          id: 'activity',
          title: 'Recent Activity',
          type: 'activity',
          order: 2,
          visible: true,
        },
        stats: {
          id: 'stats',
          title: 'Statistics',
          type: 'stats',
          order: 3,
          visible: true,
        },
      },
      isEditMode: false,

      setEditMode: (isEdit) => set({ isEditMode: isEdit }),

      updateSection: (sectionId, updates) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [sectionId]: {
              ...state.sections[sectionId],
              ...updates,
            },
          },
        })),

      reorderSections: (orderedIds) =>
        set((state) => ({
          sections: {
            ...state.sections,
            ...orderedIds.reduce((acc, id, index) => ({
              ...acc,
              [id]: {
                ...state.sections[id],
                order: index,
              },
            }), {}),
          },
        })),
    }),
    {
      name: 'dashboard-layout',
      partialize: (state) => ({ sections: state.sections }),
    }
  )
);