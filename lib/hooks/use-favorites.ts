import useSWR from 'swr';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { ApiResponse, Location } from '@/lib/types';

const fetcherWithAuth = async (url: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${url}`, {
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to fetch favorites');
    const json = await res.json();
    return json.data;
};

export function useFavorites() {
    const { user } = useAuthStore();
    const { data: favorites, error, mutate, isLoading } = useSWR<Location[]>(
        user ? '/favorites' : null,
        fetcherWithAuth
    );

    const toggleFavorite = async (locationId: string) => {
        if (!user) return;

        const isFavorite = favorites?.some((f) => f.id === locationId);

        // Optimistic update
        const updatedFavorites = isFavorite
            ? favorites?.filter((f) => f.id !== locationId)
            : [...(favorites || [])]; // We don't have the full location object here easily, but for UI feedback we can manage

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/locations/${locationId}/favorite`, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
            });

            if (!res.ok) throw new Error('Action failed');
            mutate();
        } catch (err) {
            console.error('Favorite action failed', err);
        }
    };

    return {
        favorites,
        isLoading,
        toggleFavorite,
        isFavorite: (id: string) => favorites?.some((f) => f.id === id) || false,
    };
}
