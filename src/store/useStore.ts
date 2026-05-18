import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour?: number;
  birthMinute?: number;
  birthLatitude?: number;
  birthLongitude?: number;
  createdAt: string;
}

export interface SavedReport {
  id: string;
  profileId: string;
  type: string;
  title: string;
  data: unknown;
  createdAt: string;
}

interface AppState {
  profiles: UserProfile[];
  activeProfileId: string | null;
  reports: SavedReport[];
  favorites: string[];
  theme: 'dark';
  language: 'sk';

  addProfile: (profile: UserProfile) => void;
  updateProfile: (id: string, data: Partial<UserProfile>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string | null) => void;
  getActiveProfile: () => UserProfile | null;

  addReport: (report: SavedReport) => void;
  deleteReport: (id: string) => void;

  toggleFavorite: (section: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      reports: [],
      favorites: [],
      theme: 'dark',
      language: 'sk',

      addProfile: (profile) => set((state) => ({ profiles: [...state.profiles, profile] })),
      updateProfile: (id, data) => set((state) => ({
        profiles: state.profiles.map(p => p.id === id ? { ...p, ...data } : p),
      })),
      deleteProfile: (id) => set((state) => ({
        profiles: state.profiles.filter(p => p.id !== id),
        activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
      })),
      setActiveProfile: (id) => set({ activeProfileId: id }),
      getActiveProfile: () => {
        const state = get();
        return state.profiles.find(p => p.id === state.activeProfileId) || null;
      },

      addReport: (report) => set((state) => ({ reports: [report, ...state.reports].slice(0, 50) })),
      deleteReport: (id) => set((state) => ({ reports: state.reports.filter(r => r.id !== id) })),

      toggleFavorite: (section) => set((state) => ({
        favorites: state.favorites.includes(section)
          ? state.favorites.filter(f => f !== section)
          : [...state.favorites, section],
      })),
    }),
    { name: 'numero-store' }
  )
);
