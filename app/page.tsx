'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocations } from '@/lib/hooks/use-locations';
import { LocationCard } from '@/components/features/locations/location-card';
import { useUIStore } from '@/lib/store/ui-store';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useEffect, useState } from 'react';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTags } from '@/lib/hooks/use-tags';
import { LocationFilters } from '@/lib/types';
import * as Icons from 'lucide-react';
import { CategoryFilter } from '@/components/features/filters/category-filter';
import { PriceFilter } from '@/components/features/filters/price-filter';
import { TagsFilter } from '@/components/features/filters/tags-filter';
import { DistanceFilter } from '@/components/features/filters/distance-filter';
import { PopularFilter } from '@/components/features/filters/popular-filter';
import { FilterModal } from '@/components/features/filters/filter-modal';

export default function HomePage() {
  const { filters, setFilters, resetFilters } = useUIStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [filterMode, setFilterMode] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [tempFilters, setTempFilters] = useState<Partial<LocationFilters>>({});

  const [expandedSection, setExpandedSection] = useState<'category' | 'price' | 'tags' | null>(null);

  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

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
  const { tags, isLoading: tagsLoading } = useTags();

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

  const toggleTag = (tagId: string, isGlobal = false) => {
    const targetFilters = isGlobal ? filters : tempFilters;
    const currentTags = targetFilters.tag_ids || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];

    if (isGlobal) {
      setFilters({ tag_ids: newTags });
    } else {
      setTempFilters({ ...tempFilters, tag_ids: newTags });
    }
  };

  const priceRanges = [
    { label: 'Tất cả', min: 0, max: 1000000 },
    { label: 'Dưới 40k', min: 0, max: 40000 },
    { label: '40k - 150k', min: 40000, max: 150000 },
    { label: '150k - 450k', min: 150000, max: 450000 },
    { label: '450k - 1tr', min: 450000, max: 1000000 },
    { label: 'Trên 1tr', min: 1000000, max: 1000000 },
    { label: 'Tùy chọn', min: 0, max: 0 }
  ];


  return (
    <MainLayout>
      <div className="space-y-6 pb-20">
        {/* Search Bar */}
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
            <CategoryFilter
              categories={categories}
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              onShowMore={() => setExpandedSection('category')}
            />

            <PriceFilter
              priceRanges={priceRanges}
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
              onShowMore={() => setExpandedSection('price')}
            />

            <TagsFilter
              tags={tags || []}
              tagsLoading={tagsLoading}
              tempFilters={tempFilters}
              toggleTag={toggleTag}
              onShowMore={() => setExpandedSection('tags')}
            />

            <DistanceFilter
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
            />

            <PopularFilter
              tempFilters={tempFilters}
              setTempFilters={setTempFilters}
            />

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

        {/* Active Filters Badges */}
        {!filterMode && (
          <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
            {filters.search && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg">
                Tìm: {filters.search}
                <button onClick={() => setFilters({ search: undefined })} className="hover:bg-slate-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.category_id && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg">
                Danh mục: {categories.find(c => c.id === filters.category_id)?.name_vi || filters.category_id}
                <button onClick={() => setFilters({ category_id: undefined })} className="hover:bg-slate-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.tag_ids && filters.tag_ids.length > 0 && filters.tag_ids.map(tagId => (
              <Badge key={tagId} variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg">
                {tags?.find(t => t.id === tagId)?.name_vi || tagId}
                <button onClick={() => toggleTag(tagId, true)} className="hover:bg-slate-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {((filters.min_price !== undefined && filters.min_price > 0) || (filters.max_price !== undefined && filters.max_price < 500000)) && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg">
                Giá: {filters.min_price?.toLocaleString()} - {filters.max_price?.toLocaleString()}
                <button onClick={() => setFilters({ min_price: 0, max_price: 500000 })} className="hover:bg-slate-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.max_distance && filters.max_distance !== 10 && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg">
                Dưới {filters.max_distance}km
                <button onClick={() => setFilters({ max_distance: 10 })} className="hover:bg-slate-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.is_popular && (
              <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-lg">
                Phổ biến
                <button onClick={() => setFilters({ is_popular: false })} className="hover:bg-slate-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {/* Clear All Button */}
            {(filters.search || filters.category_id || (filters.tag_ids && filters.tag_ids.length > 0) || (filters.min_price && filters.min_price > 0) || (filters.max_price && filters.max_price < 500000) || filters.is_popular || (filters.max_distance && filters.max_distance !== 10)) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                onClick={() => resetFilters()}
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        )}

        {/* Location List - ALWAYS VISIBLE */}
        {!filterMode && <div className="space-y-4">
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
        </div>}
      </div>

      <FilterModal
        expandedSection={expandedSection}
        onClose={() => setExpandedSection(null)}
        categories={categories}
        priceRanges={priceRanges}
        tags={tags || []}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        toggleTag={toggleTag}
      />
    </MainLayout>
  );
}
