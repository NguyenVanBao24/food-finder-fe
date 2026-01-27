'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Loader2, X } from 'lucide-react';
import { useLocations } from '@/lib/hooks/use-locations';
import { LocationCard } from '@/components/features/locations/location-card';
import { useUIStore } from '@/lib/store/ui-store';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useEffect, useState } from 'react';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTags } from '@/lib/hooks/use-tags';
import { LocationFilters } from '@/lib/types';
import * as Icons from 'lucide-react';

export default function HomePage() {
  const { filters, setFilters } = useUIStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [filterMode, setFilterMode] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Temporary filter state (not applied until user clicks "Áp dụng")
  const [tempFilters, setTempFilters] = useState<Partial<LocationFilters>>({});

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  // Reset temp filters when entering filter mode
  useEffect(() => {
    if (filterMode) {
      setTempFilters({
        category_id: filters.category_id,
        min_price: filters.min_price || 0,
        max_price: filters.max_price || 500000,
        tag_ids: filters.tag_ids || [],
        max_distance: filters.max_distance || 10,
        is_popular: filters.is_popular || false,
      });
    }
  }, [filterMode]);

  const { locations, isLoading, isError } = useLocations();
  const { categories } = useCategories();
  const { allTags, isLoading: tagsLoading } = useTags();

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setFilterMode(false);
  };

  const handleResetFilters = () => {
    setTempFilters({
      category_id: undefined,
      min_price: 0,
      max_price: 500000,
      tag_ids: [],
      max_distance: 10,
      is_popular: false,
    });
  };

  const toggleTag = (tagId: string) => {
    const currentTags = tempFilters.tag_ids || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    setTempFilters({ ...tempFilters, tag_ids: newTags });
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-20">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm món ăn, địa điểm..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-5 w-5" />}
          />
          <Button
            variant={filterMode ? 'default' : 'outline'}
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl transition-all duration-200"
            onClick={() => setFilterMode(!filterMode)}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Category Bar - Visible when filter mode is OFF */}
        {!filterMode && (
          <div className="relative">
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-2 overflow-x-auto pb-2 beauty-scrollbar scroll-smooth">
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
          </div>
        )}

        {/* Comprehensive Filter Panel - Shown when filter mode is ON */}
        {filterMode && (
          <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Danh mục</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 beauty-scrollbar">
                <Button
                  variant={!tempFilters.category_id ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full whitespace-nowrap text-xs"
                  onClick={() => setTempFilters({ ...tempFilters, category_id: undefined })}
                >
                  Tất cả
                </Button>
                {categories.map((cat) => {
                  const IconComponent = (Icons as any)[cat.icon || 'Utensils'] || Icons.Utensils;
                  return (
                    <Button
                      key={cat.id}
                      variant={tempFilters.category_id === cat.id ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full whitespace-nowrap flex items-center gap-1.5 text-xs"
                      onClick={() => setTempFilters({ ...tempFilters, category_id: cat.id })}
                    >
                      <IconComponent className="h-3 w-3" />
                      {cat.name_vi}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Mức giá</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>₫{(tempFilters.min_price || 0).toLocaleString()}</span>
                  <span>₫{(tempFilters.max_price || 500000).toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={tempFilters.min_price || 0}
                    onChange={(e) => setTempFilters({ ...tempFilters, min_price: Number(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={tempFilters.max_price || 500000}
                    onChange={(e) => setTempFilters({ ...tempFilters, max_price: Number(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Tags (Rating/Features) */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Đánh giá & Đặc điểm</h3>
              {tagsLoading ? (
                <div className="text-xs text-gray-400">Đang tải...</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={(tempFilters.tag_ids || []).includes(tag.id) ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full text-xs"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.icon && <span className="mr-1">{tag.icon}</span>}
                      {tag.name_vi}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Distance Slider */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Khoảng cách</h3>
              <div className="space-y-2">
                <div className="text-xs text-gray-600 text-center">
                  Trong vòng {tempFilters.max_distance || 10} km
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={tempFilters.max_distance || 10}
                  onChange={(e) => setTempFilters({ ...tempFilters, max_distance: Number(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1km</span>
                  <span>50km</span>
                </div>
              </div>
            </div>

            {/* Popular Toggle */}
            <div className="space-y-2">
              <Button
                variant={tempFilters.is_popular ? 'default' : 'outline'}
                size="sm"
                className="rounded-xl w-full text-xs"
                onClick={() => setTempFilters({ ...tempFilters, is_popular: !tempFilters.is_popular })}
              >
                {tempFilters.is_popular ? '✓ ' : ''}Chỉ hiển thị địa điểm phổ biến
              </Button>
            </div>

            {/* Apply and Reset Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl"
                onClick={handleResetFilters}
              >
                Đặt lại
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1 rounded-xl"
                onClick={handleApplyFilters}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        )}

        {/* Location List - ALWAYS VISIBLE */}
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
