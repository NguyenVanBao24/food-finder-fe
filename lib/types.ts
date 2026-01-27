export interface Location {
    id: string;
    name_vi: string;
    name_en: string;
    slug_vi: string;
    latitude: number;
    longitude: number;
    address_vi: string;
    district_vi: string;
    cuisine_vi: string;
    category: 'food' | 'cafe' | 'bar';
    phone?: string;
    website?: string;
    hours_open?: string;
    hours_close?: string;
    price_range: string;
    description_vi?: string;
    status: string;
    photos?: {
        id: string;
        url: string;
        is_primary: boolean;
    }[];
    rating?: number; // Optional until backend aggregates reviews
    review_count?: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: {
        timestamp: string;
        pagination?: PaginationMeta;
    };
}

export interface LocationFilters {
    search?: string;
    cuisine?: string;
    district?: string;
    min_price?: number;
    max_price?: number;
    category?: string;
    category_id?: string;
    tag_ids?: string[];
    max_distance?: number;
    is_popular?: boolean;
    sort_by?: 'distance' | 'rating' | 'price' | 'popular';
    page?: number;
    limit?: number;
}

export interface Comment {
    id: string;
    content: string;
    user_id: string;
    location_id: string;
    created_at: string;
    parent_id?: string;
    user?: {
        id: string;
        email: string;
        full_name?: string;
        avatar_url?: string;
    };
    replies?: Comment[];
}
