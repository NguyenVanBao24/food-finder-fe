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
    // Sort: selected tags first, then others
    const sortedTags = [...(tags || [])].sort((a, b) => {
        const aSelected = (tempFilters.tag_ids || []).includes(a.id);
        const bSelected = (tempFilters.tag_ids || []).includes(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
    });

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Đánh giá & Đặc điểm</h3>
            {tagsLoading ? (
                <div className="text-xs text-gray-400">Đang tải...</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {sortedTags.slice(0, sortedTags.length > 14 ? 13 : sortedTags.length).map((tag) => (
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
