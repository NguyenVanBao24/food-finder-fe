import { Location } from '@/lib/types';
import { MapPin, Star, Share2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/lib/hooks/use-favorites';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';

interface LocationHeroProps {
    location: Location;
}

export function LocationHero({ location }: LocationHeroProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { user } = useAuthStore();
    const favorited = isFavorite(location.id);

    return (
        <div className="relative h-[300px] md:h-[400px] w-full rounded-b-3xl overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                {location.photos?.[0] ? (
                    <img
                        src={location.photos[0].url}
                        alt={location.name_vi}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                <div className="container mx-auto max-w-5xl">
                    <Badge className="mb-3 bg-primary/90 hover:bg-primary text-white border-none capitalize">
                        {location.category}
                    </Badge>

                    <h1 className="text-3xl md:text-5xl font-heading font-bold mb-2">
                        {location.name_vi}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200 mb-6">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary-light" />
                            {location.address_vi}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span className="flex items-center gap-1.5 font-medium text-yellow-400">
                            <Star className="h-4 w-4 fill-current" />
                            4.5 (128 reviews)
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span className="text-green-300 font-bold">
                            {location.price_range}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <Button size="lg" className="rounded-full font-bold">
                            <MapPin className="mr-2 h-4 w-4" />
                            Chỉ đường
                        </Button>

                        {user && (
                            <Button
                                variant="secondary"
                                size="lg"
                                className={cn(
                                    "rounded-full backdrop-blur-sm border-none transition-all",
                                    favorited
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-white/10 hover:bg-white/20 text-white"
                                )}
                                onClick={() => toggleFavorite(location.id)}
                            >
                                <Heart className={cn("mr-2 h-4 w-4", favorited && "fill-current")} />
                                {favorited ? 'Đã lưu' : 'Lưu'}
                            </Button>
                        )}

                        <Button variant="secondary" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-none">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
