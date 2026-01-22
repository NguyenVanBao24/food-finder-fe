'use client';

import { useLocation } from '@/lib/hooks/use-location';
import { LocationHero } from '@/components/features/locations/detail/location-hero';
import { LocationInfo } from '@/components/features/locations/detail/location-info';
import { CommentsList } from '@/components/features/comments/comments-list';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LocationDetailClientPage({ id }: { id: string }) {
    const router = useRouter();
    const { location, isLoading, isError } = useLocation(id);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !location) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Không tìm thấy địa điểm</h2>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Absolute Back Button */}
            <Button
                variant="secondary"
                size="icon"
                className="fixed top-4 left-4 z-50 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-5 w-5 text-gray-900" />
            </Button>

            <LocationHero location={location} />

            <div className="container mx-auto max-w-5xl px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery Placeholder - To Implement */}

                        {/* Comments Section */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                            <CommentsList locationId={location.id} />
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <LocationInfo location={location} />

                        {/* Map Placeholder */}
                        <div className="bg-gray-200 rounded-xl h-64 w-full flex items-center justify-center text-gray-400">
                            Mini Map
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
