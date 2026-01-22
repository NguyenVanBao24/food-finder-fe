'use client';

import dynamic from 'next/dynamic';
import { useUIStore } from '@/lib/store/ui-store';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import('@/components/features/map/leaflet-map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
    ),
});

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex flex-col h-screen">
            <Header />

            <main className="flex-1 flex overflow-hidden relative">
                <Sidebar>{children}</Sidebar>

                <div className="flex-1 relative h-full">
                    <Map />

                    {/* Mobile Bottom Sheet Placeholder */}
                    {/* Will implement Sheet/Drawer here later for mobile */}
                </div>
            </main>
        </div>
    );
}
