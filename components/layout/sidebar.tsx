'use client';

import { useUIStore } from '@/lib/store/ui-store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar({ children }: { children: React.ReactNode }) {
    const { sidebarOpen } = useUIStore();

    return (
        <AnimatePresence mode="wait">
            {sidebarOpen && (
                <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 400, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className={cn(
                        'flex-shrink-0 bg-white border-r border-gray-200 h-[calc(100vh-64px)] overflow-hidden hidden lg:block'
                    )}
                >
                    <div className="w-[400px] h-full overflow-y-auto p-4">
                        {children}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
