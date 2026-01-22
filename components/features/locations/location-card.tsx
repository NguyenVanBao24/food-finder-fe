import Link from 'next/link';
import { MapPin, Star, Heart } from 'lucide-react';
import { Location } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { useAuthStore } from '@/lib/store/auth-store';

interface LocationCardProps {
    location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { user } = useAuthStore();
    const favorited = isFavorite(location.id);

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(location.id);
    };

    return (
        <div className="group relative">
            {user && (
                <button
                    onClick={handleFavorite}
                    className={cn(
                        "absolute top-5 right-5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300",
                        favorited
                            ? "bg-red-500 text-white"
                            : "bg-white/80 text-gray-400 hover:text-red-500 shadow-sm"
                    )}
                >
                    <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
                </button>
            )}

            <Link href={`/locations/${location.id}`}>
                <div
                    className="group p-3 rounded-xl border border-gray-100 bg-white hover:border-primary-200 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
                >
                    <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                            {/* Placeholder for image - use real image if available */}
                            {location.photos?.[0] ? (
                                <img
                                    src={location.photos[0].url}
                                    alt={location.name_vi}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center p-1">
                                    No Image
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 group-hover:text-primary truncate text-base">
                                {location.name_vi}
                            </h3>

                            <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {location.address_vi}
                            </p>

                            <div className="flex items-center flex-wrap gap-2 mt-2.5">
                                <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                    <Star className="h-3 w-3 fill-current" />
                                    4.5
                                </span>

                                <span className="text-xs text-gray-300">|</span>

                                <span className="text-xs text-gray-500 capitalize">
                                    {location.category}
                                </span>

                                <span className="text-xs text-gray-300">|</span>

                                <span className="text-xs font-bold text-orange-600">
                                    {location.price_range}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
