import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { LocationFilters } from '@/lib/types';

interface CategoryFilterProps {
    categories: any[];
    tempFilters: Partial<LocationFilters>;
    setTempFilters: (filters: Partial<LocationFilters>) => void;
    onShowMore: () => void;
}

export function CategoryFilter({ categories, tempFilters, setTempFilters, onShowMore }: CategoryFilterProps) {
    // Sort: selected category first, then others
    const sortedCategories = [...categories].sort((a, b) => {
        if (a.id === tempFilters.category_id) return -1;
        if (b.id === tempFilters.category_id) return 1;
        return 0;
    });

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Danh mục</h3>
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={!tempFilters.category_id ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-full whitespace-nowrap text-xs"
                    onClick={() => setTempFilters({ ...tempFilters, category_id: undefined })}
                >
                    Tất cả
                </Button>
                {sortedCategories.slice(0, sortedCategories.length > 11 ? 10 : sortedCategories.length).map((cat) => {
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
                {categories.length > 11 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full whitespace-nowrap text-xs text-primary border-primary"
                        onClick={onShowMore}
                    >
                        Xem thêm...
                    </Button>
                )}
            </div>
        </div>
    );
}
