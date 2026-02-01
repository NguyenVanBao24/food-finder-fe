import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { LocationFilters } from '@/lib/types';
import * as Icons from 'lucide-react';
import { useState, useEffect } from 'react';

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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (expandedSection) {
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [expandedSection]);

    if (!expandedSection) return null;

    return (
        <>
            {/* Overlay with fade animation */}
            <div
                className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className={`bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col pointer-events-auto overflow-hidden transition-all duration-300 ${isVisible
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                        }`}
                >
                    {/* Header with subtle bottom shadow */}
                    <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-b from-white to-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900">
                            {expandedSection === 'category' && 'Chọn danh mục'}
                            {expandedSection === 'price' && 'Chọn mức giá'}
                            {expandedSection === 'tags' && 'Chọn đánh giá'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Content with subtle padding */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
                        {/* Categories */}
                        {expandedSection === 'category' && (
                            <div className="flex flex-wrap gap-2.5 justify-center">
                                <Button
                                    variant={!tempFilters.category_id ? 'default' : 'outline'}
                                    size="sm"
                                    className={`rounded-full whitespace-nowrap transition-all duration-200 hover:scale-105 ${isVisible ? 'animate-in fade-in slide-in-from-bottom-2' : ''
                                        }`}
                                    style={{ animationDelay: '0ms' }}
                                    onClick={() => setTempFilters({ ...tempFilters, category_id: undefined })}
                                >
                                    Tất cả
                                </Button>
                                {categories.map((cat, idx) => {
                                    const IconComponent = (Icons as any)[cat.icon || 'Utensils'] || Icons.Utensils;
                                    return (
                                        <Button
                                            key={cat.id}
                                            variant={tempFilters.category_id === cat.id ? 'default' : 'outline'}
                                            size="sm"
                                            className={`rounded-full whitespace-nowrap flex items-center gap-2 transition-all duration-200 hover:scale-105 ${isVisible ? 'animate-in fade-in slide-in-from-bottom-2' : ''
                                                }`}
                                            style={{ animationDelay: `${(idx + 1) * 30}ms` }}
                                            onClick={() => setTempFilters({ ...tempFilters, category_id: cat.id })}
                                        >
                                            <IconComponent className="h-4 w-4" />
                                            {cat.name_vi}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Price */}
                        {expandedSection === 'price' && (
                            <div className="grid grid-cols-2 gap-3">
                                {priceRanges.map((range, idx) => (
                                    <Button
                                        key={range.label}
                                        variant={
                                            tempFilters.min_price === range.min && tempFilters.max_price === range.max
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="lg"
                                        className={`rounded-2xl font-medium h-14 transition-all duration-200 hover:scale-105 ${isVisible ? 'animate-in fade-in slide-in-from-bottom-2' : ''
                                            }`}
                                        style={{ animationDelay: `${idx * 40}ms` }}
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

                        {/* Tags */}
                        {expandedSection === 'tags' && (
                            <div className="flex flex-wrap gap-2.5 justify-center">
                                {(tags || []).map((tag, idx) => (
                                    <Button
                                        key={tag.id}
                                        variant={(tempFilters.tag_ids || []).includes(tag.id) ? 'default' : 'outline'}
                                        size="sm"
                                        className={`rounded-full transition-all duration-200 hover:scale-105 ${isVisible ? 'animate-in fade-in slide-in-from-bottom-2' : ''
                                            }`}
                                        style={{ animationDelay: `${idx * 30}ms` }}
                                        onClick={() => toggleTag(tag.id)}
                                    >
                                        {tag.icon && <span className="mr-1.5">{tag.icon}</span>}
                                        {tag.name_vi}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer with subtle top shadow */}
                    <div className="px-6 py-5 bg-gradient-to-t from-white to-gray-50/30">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full rounded-xl h-12 font-semibold transition-all hover:scale-[1.02]"
                            onClick={onClose}
                        >
                            Xong
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
