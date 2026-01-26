import useSWR from 'swr';
import { fetchWithMeta } from '@/lib/api/client';
import { ApiResponse, Location } from '@/lib/types';

export function useLocation(id: string | null) {
    const { data, error, isLoading, mutate } = useSWR<ApiResponse<Location>>(
        id ? `/locations/${id}` : null,
        fetchWithMeta
    );

    return {
        location: data?.data,
        isLoading,
        isError: error,
        mutate,
    };
}
