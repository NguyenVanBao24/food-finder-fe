import useSWR from 'swr';
import { fetchWithMeta } from '@/lib/api/client';
import { ApiResponse } from '@/lib/types';

export interface Category {
    id: string;
    name_vi: string;
    name_en?: string;
    slug: string;
    icon?: string;
    order: number;
}

export function useCategories() {
    const { data, error, isLoading } = useSWR<ApiResponse<Category[]>>(
        '/categories',
        fetchWithMeta
    );

    return {
        categories: data?.data || [],
        isLoading,
        isError: error,
    };
}
