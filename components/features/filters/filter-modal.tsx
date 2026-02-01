import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { LocationFilters } from '@/lib/types';
import * as Icons from 'lucide-react';

interface FilterModalProps {
    expandedSection: 'category' | 'price' | 'tags' | null;
    onClose: () => void;
    categories: any[];
    priceRanges: Array<{ label: string; min: number; max: number }>;
    tags: any[];
    tempFilters: Partial<LocationFilters>;
    setTempFilters: (filters: Partial<LocationFilters>) => void;
    toggleTag: (tagId: string) => void;
}

export function FilterModal({
    expandedSection,
    onClose,
    categories,
    priceRanges,
    tags,
    tempFilters,
    setTempFilters,
    toggleTag
}: FilterModalProps) {
    if (!expandedSection) return null;

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                <h2 className="text-lg font-semibold">
                    {expandedSection === 'category' && 'Chọn danh mục'}
                    {expandedSection === 'price' && 'Chọn mức giá'}
                    {expandedSection === 'tags' && 'Chọn đánh giá & đặc điểm'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {expandedSection === 'category' && (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={!tempFilters.category_id ? 'default' : 'outline'}
                            size="sm"
                            className="rounded-full whitespace-nowrap"
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
                                    className="rounded-full whitespace-nowrap flex items-center gap-2"
                                    onClick={() => setTempFilters({ ...tempFilters, category_id: cat.id })}
                                >
                                    <IconComponent className="h-3.5 w-3.5" />
                                    {cat.name_vi}
                                </Button>
                            );
                        })}
                    </div>
                )}

                {expandedSection === 'price' && (
                    <div className="grid grid-cols-4 gap-2">
                        {priceRanges.map((range) => (
                            <Button
                                key={range.label}
                                variant={
                                    tempFilters.min_price === range.min && tempFilters.max_price === range.max
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                className="rounded-lg font-medium"
                                onClick={() =>
                                    setTempFilters({
                                        ...tempFilters,
                                        min_price: range.min,
                                        max_price: range.max
                                    })
                                }
                            >
                                {range.label}
                            </Button>
                        ))}
                    </div>
                )}

                {expandedSection === 'tags' && (
                    <div className="flex flex-wrap gap-2">
                        {(tags || []).map((tag) => (
                            <Button
                                key={tag.id}
                                variant={(tempFilters.tag_ids || []).includes(tag.id) ? 'default' : 'outline'}
                                size="sm"
                                className="rounded-full"
                                onClick={() => toggleTag(tag.id)}
                            >
                                {tag.icon && <span className="mr-1">{tag.icon}</span>}
                                {tag.name_vi}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 border-t sticky bottom-0 bg-white">
                <Button variant="default" size="sm" className="w-full rounded-xl" onClick={onClose}>
                    Xong
                </Button>
            </div>
        </div>
    );
}
