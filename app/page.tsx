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

import { useCategories } from '@/lib/hooks/use-categories';
import * as Icons from 'lucide-react';

export default function HomePage() {
  const { filters, setFilters } = useUIStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  const { locations, isLoading, isError } = useLocations();
  const { categories } = useCategories();

  return (
    <MainLayout>
      <div className="space-y-6 pb-20">
        {/* ... search section ... */}

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant={!filters.category_id ? 'default' : 'outline'}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => setFilters({ category_id: undefined })}
          >
            Tất cả
          </Button>

          {categories.map((cat) => {
            const IconComponent = (Icons as any)[cat.icon || 'Utensils'] || Icons.Utensils;
            return (
              <Button
                key={cat.id}
                variant={filters.category_id === cat.id ? 'default' : 'outline'}
                size="sm"
                className="rounded-full whitespace-nowrap flex items-center gap-2"
                onClick={() => setFilters({ category_id: cat.id })}
              >
                <IconComponent className="h-3.5 w-3.5" />
                {cat.name_vi}
              </Button>
            );
          })}
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
