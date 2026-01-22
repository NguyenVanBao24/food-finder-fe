'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useLocations } from '@/lib/hooks/use-locations';
import { LocationCard } from '@/components/features/locations/location-card';
import { useUIStore } from '@/lib/store/ui-store';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { filters, setFilters } = useUIStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  const { locations, isLoading, isError } = useLocations();

  return (
    <MainLayout>
      <div className="space-y-6 pb-20">
        <div className="sticky top-0 bg-white z-10 pb-4 pt-1">
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            Khám phá
          </h1>
          <div className="flex gap-2">
            <Input
              placeholder="Tìm quán ăn, cafe, món ngon..."
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['Tất cả', 'food', 'cafe', 'bar'].map((cat) => (
            <Button
              key={cat}
              variant={filters.category === cat || (cat === 'Tất cả' && !filters.category) ? 'default' : 'outline'}
              size="sm"
              className="rounded-full whitespace-nowrap capitalize"
              onClick={() => setFilters({ category: cat === 'Tất cả' ? undefined : cat })}
            >
              {cat === 'food' ? 'Quán ăn' : cat}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {isError && (
            <div className="text-center py-10 text-red-500">
              Có lỗi xảy ra khi tải dữ liệu.
            </div>
          )}

          {!isLoading && !isError && locations.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Không tìm thấy địa điểm nào.
            </div>
          )}

          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
