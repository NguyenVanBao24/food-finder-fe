import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    initialize: () => Promise<void>;
    listFavorites: () => Promise<void>; // Will implement later
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    initialize: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            set({
                session,
                user: session?.user || null,
                isLoading: false
            });

            // Listen for changes
            supabase.auth.onAuthStateChange((_event, session) => {
                set({
                    session,
                    user: session?.user || null,
                    isLoading: false
                });
            });
        } catch (error) {
            console.error('Failed to init auth', error);
            set({ isLoading: false });
        }
    },
    listFavorites: async () => { }, // Placeholder
}));
