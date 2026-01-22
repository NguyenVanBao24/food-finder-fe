'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return <>{children}</>;
}
