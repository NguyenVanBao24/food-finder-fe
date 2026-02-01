import { Button } from '@/components/ui/button';
import { LocationFilters } from '@/lib/types';

interface PopularFilterProps {
    tempFilters: Partial<LocationFilters>;
    setTempFilters: (filters: Partial<LocationFilters>) => void;
}

export function PopularFilter({ tempFilters, setTempFilters }: PopularFilterProps) {
    return (
        <div className="space-y-2">
            <Button
                variant="outline"
                size="sm"
                className="w-full rounded-lg text-xs justify-between"
                onClick={() => setTempFilters({ ...tempFilters, is_popular: !tempFilters.is_popular })}
            >
                <span>Chỉ hiện thị địa điểm phổ biến</span>
                <span className="text-gray-400">›</span>
            </Button>
        </div>
    );
}
