import useSWR from 'swr';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';

export interface TagStat {
    tagId: string;
    name: string;
    voteCount: number;
    userVoted: boolean;
}

const fetcherWithAuth = async (url: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${url}`, {
        headers: {
            ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
    });

    if (!res.ok) throw new Error('Failed to fetch tag stats');
    return res.json();
};

export function useLocationTags(locationId: string) {
    const { user } = useAuthStore();
    const { data: tags, error, mutate, isLoading } = useSWR<TagStat[]>(
        `/locations/${locationId}/tags`,
        fetcherWithAuth
    );

    const toggleVote = async (tagId: string) => {
        if (!user) return;

        const tag = tags?.find(t => t.tagId === tagId);
        const isVoted = tag?.userVoted;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/locations/${locationId}/tags/${tagId}/vote`, {
                method: isVoted ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`,
                },
            });

            if (!res.ok) throw new Error('Action failed');
            mutate();
        } catch (err) {
            console.error('Vote action failed', err);
        }
    };

    return {
        tags: tags || [],
        isLoading,
        isError: error,
        toggleVote,
    };
}
