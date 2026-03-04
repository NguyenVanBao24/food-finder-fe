import useSWR from 'swr';
import { fetchWithMeta } from '@/lib/api/client';
import { ApiResponse, Location, LocationFilters } from '@/lib/types';
import { useUIStore } from '@/lib/store/ui-store';

export function useLocations() {
    const { filters } = useUIStore();

    const queryString = new URLSearchParams();
    if (filters.search) queryString.append('search', filters.search);
    if (filters.category) queryString.append('category', filters.category);
    if (filters.category_id) queryString.append('category_id', filters.category_id);

    const { data, error, isLoading } = useSWR<ApiResponse<Location[]>>(
        `/locations?${queryString.toString()}`,
        fetchWithMeta
    );

    return {
        locations: data?.data || [],
        meta: data?.meta,
        isLoading,
        isError: error,
    };
}
