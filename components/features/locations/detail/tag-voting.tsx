'use client';

import { useLocationTags, TagStat } from '@/lib/hooks/use-location-tags';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Plus } from 'lucide-react';

interface TagVotingProps {
    locationId: string;
}

export function TagVoting({ locationId }: TagVotingProps) {
    const { tags, isLoading, toggleVote } = useLocationTags(locationId);
    const { user } = useAuthStore();

    if (isLoading) return <div className="flex gap-2 py-2"><Loader2 className="h-4 w-4 animate-spin text-gray-400" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <button
                        key={tag.tagId}
                        onClick={() => toggleVote(tag.tagId)}
                        disabled={!user}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                            tag.userVoted
                                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                        )}
                    >
                        {tag.name}
                        <span className={cn(
                            "text-xs font-bold px-1.5 py-0.5 rounded-full",
                            tag.userVoted ? "bg-white/20" : "bg-gray-100 text-gray-500"
                        )}>
                            {tag.voteCount}
                        </span>
                    </button>
                ))}

                {user && (
                    <Button variant="outline" size="sm" className="rounded-full border-dashed h-[34px]">
                        <Plus className="h-4 w-4 mr-1" /> Thêm tag
                    </Button>
                )}
            </div>

            {!user && (
                <p className="text-xs text-gray-400 italic">Đăng nhập để bình chọn ưu điểm của quán</p>
            )}
        </div>
    );
}
