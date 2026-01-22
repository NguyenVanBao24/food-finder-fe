import { ApiResponse } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchWithMeta<T>(url: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE_URL}${url}`);
    if (!res.ok) {
        throw new Error(`API call failed: ${res.status}`);
    }
    return res.json();
}
