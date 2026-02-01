import { Button } from '@/components/ui/button';
import { LocationFilters } from '@/lib/types';

interface Tag {
    id: string;
    name_vi: string;
    icon?: string;
}

interface TagsFilterProps {
    tags: Tag[];
    tagsLoading: boolean;
    tempFilters: Partial<LocationFilters>;
    toggleTag: (tagId: string) => void;
    onShowMore: () => void;
}

export function TagsFilter({ tags, tagsLoading, tempFilters, toggleTag, onShowMore }: TagsFilterProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Đánh giá & Đặc điểm</h3>
            {tagsLoading ? (
                <div className="text-xs text-gray-400">Đang tải...</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {(tags || []).slice(0, (tags || []).length > 14 ? 13 : (tags || []).length).map((tag) => (
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
                    {(tags || []).length > 14 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs text-primary border-primary"
                            onClick={onShowMore}
                        >
                            Xem thêm...
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
