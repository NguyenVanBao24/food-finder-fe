import { LocationFilters } from '@/lib/types';

interface DistanceFilterProps {
    tempFilters: Partial<LocationFilters>;
    setTempFilters: (filters: Partial<LocationFilters>) => void;
}

export function DistanceFilter({ tempFilters, setTempFilters }: DistanceFilterProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Khoảng cách</h3>
            <div className="space-y-2">
                <div className="text-xs text-primary text-center font-medium">
                    Trong vòng {tempFilters.max_distance || 10} km
                </div>
                <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={tempFilters.max_distance || 10}
                    onChange={(e) => setTempFilters({ ...tempFilters, max_distance: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>1km</span>
                    <span>50km</span>
                </div>
            </div>
        </div>
    );
}
