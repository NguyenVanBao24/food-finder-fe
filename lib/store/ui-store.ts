import { create } from 'zustand';
import { LocationFilters } from '@/lib/types';

interface UIState {
    sidebarOpen: boolean;
    filters: LocationFilters;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setFilters: (filters: Partial<LocationFilters>) => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    filters: {
        page: 1,
        limit: 20
    },
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),
}));
