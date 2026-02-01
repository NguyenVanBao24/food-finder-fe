import { Button } from '@/components/ui/button';
import { LocationFilters } from '@/lib/types';

interface PriceFilterProps {
    priceRanges: Array<{ label: string; min: number; max: number }>;
    tempFilters: Partial<LocationFilters>;
    setTempFilters: (filters: Partial<LocationFilters>) => void;
    onShowMore: () => void;
}

export function PriceFilter({ priceRanges, tempFilters, setTempFilters, onShowMore }: PriceFilterProps) {
    // Sort: selected price first, then others
    const sortedRanges = [...priceRanges].sort((a, b) => {
        const aSelected = tempFilters.min_price === a.min && tempFilters.max_price === a.max;
        const bSelected = tempFilters.min_price === b.min && tempFilters.max_price === b.max;
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
    });

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Mức giá</h3>
            <div className="grid grid-cols-4 gap-2">
                {sortedRanges.slice(0, sortedRanges.length >= 11 ? 11 : sortedRanges.length).map((range) => (
                    <Button
                        key={range.label}
                        variant={
                            tempFilters.min_price === range.min && tempFilters.max_price === range.max
                                ? 'default'
                                : 'outline'
                        }
                        size="sm"
                        className="rounded-lg text-xs font-medium"
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
                {priceRanges.length > 12 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs text-primary border-primary font-medium"
                        onClick={onShowMore}
                    >
                        ...
                    </Button>
                )}
            </div>
        </div>
    );
}
