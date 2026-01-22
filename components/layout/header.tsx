'use client';

import Link from 'next/link';
import { Menu, Search, Map as MapIcon, Heart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store/ui-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { supabase } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
    const { toggleSidebar } = useUIStore();
    const { user, session } = useAuthStore();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className="sticky top-0 z-50 w-full h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="flex h-full items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="hidden lg:flex"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary rounded-lg p-1.5">
                            <MapIcon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight text-gray-900">
                            Food<span className="text-primary">Finder</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                        <Search className="h-5 w-5 lg:hidden" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                        <Heart className="h-5 w-5" />
                    </Button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-gray-200">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                    {user.email?.[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-red-500"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="default" size="sm" className="hidden sm:flex">
                                    Đăng nhập
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="ghost" size="icon" className="sm:hidden">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
