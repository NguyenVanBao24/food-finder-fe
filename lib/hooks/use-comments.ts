import useSWR from 'swr';
import { fetchWithMeta } from '@/lib/api/client';
import { ApiResponse, Comment } from '@/lib/types';

export function useComments(locationId: string) {
    const { data, error, isLoading, mutate } = useSWR<ApiResponse<Comment[]>>(
        locationId ? `/locations/${locationId}/comments` : null,
        fetchWithMeta
    );

    return {
        comments: data?.data || [],
        isLoading,
        isError: error,
        mutate,
    };
}
