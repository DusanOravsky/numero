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
  birthPlace?: string;
  birthLatitude?: number;
  birthLongitude?: number;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  birthHour?: number;
  birthMinute?: number;
  birthPlace?: string;
  birthLatitude?: number;
  birthLongitude?: number;
  partnerId?: string;
  childrenIds?: string[];
  notes?: string;
  createdAt: string;
}

export interface SavedReport {
  id: string;
  profileId: string;
  clientId?: string;
  type: string;
  title: string;
  data: unknown;
  createdAt: string;
}

interface AppState {
  profiles: UserProfile[];
  activeProfileId: string | null;
  clients: Client[];
  reports: SavedReport[];
  favorites: string[];
  theme: 'dark';
  language: 'sk';

  addProfile: (profile: UserProfile) => void;
  updateProfile: (id: string, data: Partial<UserProfile>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string | null) => void;

  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addReport: (report: SavedReport) => void;
  deleteReport: (id: string) => void;

  toggleFavorite: (section: string) => void;
}

const STORE_VERSION = 2;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      profiles: [],
      activeProfileId: null,
      clients: [],
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

      addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, data) => set((state) => ({
        clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c),
      })),
      deleteClient: (id) => set((state) => ({
        clients: state.clients.filter(c => c.id !== id),
        reports: state.reports.filter(r => r.clientId !== id),
      })),

      addReport: (report) => set((state) => ({ reports: [report, ...state.reports].slice(0, 200) })),
      deleteReport: (id) => set((state) => ({ reports: state.reports.filter(r => r.id !== id) })),

      toggleFavorite: (section) => set((state) => ({
        favorites: state.favorites.includes(section)
          ? state.favorites.filter(f => f !== section)
          : [...state.favorites, section],
      })),
    }),
    {
      name: 'numero-store',
      version: STORE_VERSION,
      migrate: (persistedState, version) => {
        const state = persistedState as Record<string, unknown>;
        if (version < 1) {
          state.reports = state.reports || [];
          state.favorites = state.favorites || [];
        }
        if (version < 2) {
          state.clients = state.clients || [];
        }
        return state as AppState;
      },
    }
  )
);
