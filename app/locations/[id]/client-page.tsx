'use client';

import { useLocation } from '@/lib/hooks/use-location';
import { LocationHero } from '@/components/features/locations/detail/location-hero';
import { LocationInfo } from '@/components/features/locations/detail/location-info';
import { CommentsList } from '@/components/features/comments/comments-list';
import { TagVoting } from '@/components/features/locations/detail/tag-voting';
import { PhotoGallery } from '@/components/features/locations/detail/photo-gallery';
import { Loader2 } from 'lucide-react';

interface LocationClientPageProps {
    id: string;
}

export default function LocationDetailClientPage({ id }: { id: string }) {
    const { location, isLoading, isError, mutate } = useLocation(id);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !location) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-red-500">Đã có lỗi xảy ra khi tải thông tin địa điểm.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <LocationHero location={location} />

            <div className="container mx-auto max-w-5xl px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tags & Voting Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-4">Ưu điểm nổi bật</h3>
                            <TagVoting locationId={location.id} />
                        </div>

                        {/* Photos Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <PhotoGallery
                                photos={location.photos || []}
                                locationId={location.id}
                                onRefresh={() => mutate()}
                            />
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <CommentsList locationId={location.id} />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <LocationInfo location={location} />
                    </div>
                </div>
            </div>
        </div>
    );
}
